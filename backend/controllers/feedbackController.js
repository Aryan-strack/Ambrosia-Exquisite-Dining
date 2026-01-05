//controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const Order = require('../models/Order');

exports.createFeedback = async (req, res, next) => {
  try {
    const { order, rating, comment, foodQuality, service, ambiance } = req.body;

    // Check if order exists and belongs to the customer
    const orderExists = await Order.findOne({
      _id: order,
      customer: req.user.id
    });

    if (!orderExists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or does not belong to you'
      });
    }

    // Check if feedback already exists for this order
    const existingFeedback = await Feedback.findOne({ order, customer: req.user.id });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already submitted for this order'
      });
    }

    const feedback = await Feedback.create({
      customer: req.user.id,
      order,
      rating,
      comment,
      foodQuality,
      service,
      ambiance,
      isApproved: req.user.role === 'admin' // Auto-approve admin feedback
    });

    await feedback.populate('customer', 'name');
    await feedback.populate('order', 'orderNumber totalAmount');

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

exports.getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('customer', 'name')
      .populate('order', 'orderNumber totalAmount');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findOne({
      order: req.params.orderId,
      customer: req.user.id
    })
      .populate('customer', 'name')
      .populate('order', 'orderNumber totalAmount');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'No feedback found for this order'
      });
    }

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};
// Get all feedback for admin (approved + pending)
exports.getAllFeedback = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;

    const feedback = await Feedback.find({})
      .populate('customer', 'name')
      .populate('order', 'orderNumber totalAmount')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Feedback.countDocuments({});

    res.json({
      success: true,
      count: feedback.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

exports.getApprovedFeedback = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, minRating } = req.query;

    let query = { isApproved: true };
    if (minRating) query.rating = { $gte: parseInt(minRating) };

    const feedback = await Feedback.find(query)
      .populate('customer', 'name')
      .populate('order', 'orderNumber')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Feedback.countDocuments(query);

    // Calculate average ratings
    const averageRatings = await Feedback.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          avgFoodQuality: { $avg: '$foodQuality' },
          avgService: { $avg: '$service' },
          avgAmbiance: { $avg: '$ambiance' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      count: feedback.length,
      total,
      averageRatings: averageRatings[0] || {
        avgRating: 0,
        avgFoodQuality: 0,
        avgService: 0,
        avgAmbiance: 0,
        totalReviews: 0
      },
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

exports.updateFeedback = async (req, res, next) => {
  try {
    const { isApproved, comment } = req.body;

    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    const updateData = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (comment) updateData.comment = comment;

    feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('customer', 'name')
      .populate('order', 'orderNumber');

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};