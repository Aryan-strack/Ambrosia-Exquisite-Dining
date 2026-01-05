// routes/orders.js
const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);

router.post('/', [
  protect,
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('orderType').isIn(['dine-in', 'delivery', 'takeaway']).withMessage('Invalid order type'),
  body('paymentMethod').isIn(['card', 'cash', 'online']).withMessage('Invalid payment method'),
  body('tableNumber').optional().isInt({ min: 1 }).withMessage('Table number must be a positive integer'),
  body('partySize').optional().isInt({ min: 1 }).withMessage('Party size must be at least 1')
], handleValidationErrors, createOrder);

router.put('/:id/status', [
  protect,
  authorize('admin', 'chef', 'staff'),
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']).withMessage('Invalid status')
], handleValidationErrors, updateOrderStatus);

router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;