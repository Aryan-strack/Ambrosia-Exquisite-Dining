//controllers/orderController.js
const Order = require('../models/Order');
const Menu = require('../models/Menu');
const Inventory = require('../models/Inventory');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, orderType, paymentMethod, deliveryAddress, tableNumber, specialInstructions } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItem);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Menu item ${item.menuItem} is not available`
        });
      }

      totalAmount += menuItem.price * item.quantity;
      orderItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Generate unique order number
    const orderNumber = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    const order = await Order.create({
      orderNumber,
      customer: req.user.id,
      items: orderItems,
      totalAmount,
      orderType,
      paymentMethod,
      deliveryAddress,
      tableNumber,
      specialInstructions,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending'
    });

    // Update inventory (in a real system, you'd want more sophisticated inventory management)
    for (const item of orderItems) {
      const menuItem = await Menu.findById(item.menuItem);
      // Here you would deduct inventory based on ingredients
      // This is a simplified version
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    }

    const { status, orderType, page = 1, limit = 10 } = req.query;

    if (status) query.status = status;
    if (orderType) query.orderType = orderType;

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.menuItem', 'name category price')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    }

    const order = await Order.findOne(query)
      .populate('customer', 'name email phone address')
      .populate('items.menuItem', 'name category price image')
      .populate('assignedChef', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;

    if (status === 'preparing' && req.user.role === 'chef') {
      order.assignedChef = req.user.id;
    }

    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order after it has been confirmed'
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
