const express = require('express');
const { body } = require('express-validator');
const {
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
  cancelReservation,
  getAvailableTimeSlots
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.get('/', protect, getReservations);
router.get('/available-slots', getAvailableTimeSlots);
router.get('/:id', protect, getReservation);

router.post('/', [
  protect,
  body('reservationDate').isISO8601().withMessage('Valid reservation date is required'),
  body('partySize').isInt({ min: 1, max: 20 }).withMessage('Party size must be between 1 and 20'),
  body('tableNumber').isInt({ min: 1 }).withMessage('Table number is required'),
  body('contactPhone').notEmpty().withMessage('Contact phone is required')
], handleValidationErrors, createReservation);

router.put('/:id', [
  protect,
  authorize('admin', 'staff')
], updateReservation);

router.put('/:id/cancel', protect, cancelReservation);

module.exports = router;