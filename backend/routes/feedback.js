const express = require('express');
const { body } = require('express-validator');
const {
  createFeedback,
  getFeedback,
  getOrderFeedback,
  updateFeedback,
  deleteFeedback,
  getApprovedFeedback,
  getAllFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Admin route to get ALL feedback (approved + pending)
router.get('/admin', protect, authorize('admin'), getAllFeedback);

// Public route to get only approved feedback
router.get('/', getApprovedFeedback);
router.get('/order/:orderId', protect, getOrderFeedback);
router.get('/:id', getFeedback);

router.post('/', [
  protect,
  body('order').isMongoId().withMessage('Valid order ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters'),
  body('foodQuality').optional().isInt({ min: 1, max: 5 }).withMessage('Food quality rating must be between 1 and 5'),
  body('service').optional().isInt({ min: 1, max: 5 }).withMessage('Service rating must be between 1 and 5'),
  body('ambiance').optional().isInt({ min: 1, max: 5 }).withMessage('Ambiance rating must be between 1 and 5')
], handleValidationErrors, createFeedback);

router.put('/:id', [
  protect,
  authorize('admin')
], updateFeedback);

router.delete('/:id', [
  protect,
  authorize('admin')
], deleteFeedback);

module.exports = router;