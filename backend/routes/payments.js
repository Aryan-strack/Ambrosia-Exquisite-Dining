// routes/payments.js
const express = require('express');
const { body } = require('express-validator');
const {
  processPayment,
  getPaymentDetails,
  refundPayment,
  getPaymentHistory
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.get('/history', protect, getPaymentHistory);
router.get('/:orderId', protect, getPaymentDetails);

router.post('/process', [
  protect,
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('paymentMethod').isIn(['card', 'cash', 'online']).withMessage('Invalid payment method'),
  body('paymentDetails').optional().isObject().withMessage('Payment details must be an object')
], handleValidationErrors, processPayment);

router.post('/:orderId/refund', [
  protect,
  authorize('admin')
], refundPayment);

module.exports = router;