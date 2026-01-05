// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['customer', 'staff', 'chef', 'admin']).withMessage('Invalid role')
], handleValidationErrors, register);

router.post('/login', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
], handleValidationErrors, login);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/update-profile', protect, updateProfile);

router.get('/users', [protect, authorize('admin')], getAllUsers);
router.get('/users/:id', [protect, authorize('admin')], getUserById);
router.put('/users/:id/status', [
  protect,
  authorize('admin'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], handleValidationErrors, updateUserStatus);
router.put('/users/:id/role', [
  protect,
  authorize('admin'),
  body('role').isIn(['customer', 'staff', 'chef', 'admin']).withMessage('Invalid role')
], handleValidationErrors, updateUserRole);

module.exports = router;
