//controllers/paymentController.js
const Order = require('../models/Order');
const User = require('../models/User');

exports.processPayment = async (req, res, next) => {
  try {
    const { orderId, paymentMethod, paymentDetails } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      customer: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot process payment for cancelled order'
      });
    }

    // Mock payment processing
    let paymentSuccess = true;
    let transactionId = 'TXN' + Date.now();
    
    if (paymentMethod === 'card') {
      // Simulate card validation
      paymentSuccess = paymentDetails && 
                      paymentDetails.cardNumber && 
                      paymentDetails.expiryDate && 
                      paymentDetails.cvv;
      
      if (!paymentSuccess) {
        order.paymentStatus = 'failed';
        await order.save();

        return res.status(400).json({
          success: false,
          message: 'Payment failed. Please check your card details.'
        });
      }
    }

    // Update order status
    order.paymentStatus = 'paid';
    order.paymentMethod = paymentMethod;
    order.status = order.status === 'pending' ? 'confirmed' : order.status;
    
    // For online payments, mark as confirmed immediately
    if (paymentMethod === 'card' || paymentMethod === 'online') {
      order.status = 'confirmed';
    }

    await order.save();

    // Populate order details for response
    await order.populate('customer', 'name email');
    await order.populate('items.menuItem', 'name price');

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        order: order,
        transactionId,
        paymentStatus: order.paymentStatus,
        paidAmount: order.totalAmount
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentDetails = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      customer: req.user.id
    })
      .populate('customer', 'name email')
      .populate('items.menuItem', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        orderStatus: order.status,
        items: order.items
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.refundPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund unpaid order'
      });
    }

    if (order.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund completed order'
      });
    }

    // Process refund (mock implementation)
    order.paymentStatus = 'refunded';
    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: {
        orderId: order._id,
        refundAmount: order.totalAmount,
        refundStatus: 'processed',
        transactionId: 'REF' + Date.now()
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, paymentStatus } = req.query;
    
    let query = { customer: req.user.id };
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const payments = await Order.find(query)
      .select('orderNumber totalAmount paymentStatus paymentMethod status createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    const summary = await Order.aggregate([
      { $match: { customer: req.user.id } },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      count: payments.length,
      total,
      summary,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: payments
    });
  } catch (error) {
    next(error);
  }
};