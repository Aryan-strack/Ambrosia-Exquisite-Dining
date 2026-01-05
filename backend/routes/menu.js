// routes/menu.js
const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuCategories
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const upload = require('../utils/upload');

const router = express.Router();

router.get('/', getMenuItems);
router.get('/categories', getMenuCategories);
router.get('/:id', getMenuItem);

// Admin-only menu creation with proper validation
router.post('/', [
  protect,
  authorize('admin'),
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'File too large. Maximum size is 5MB'
            });
          }
          return res.status(400).json({
            success: false,
            message: err.message || 'File upload error'
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error'
        });
      }
      next();
    });
  },
  (req, res, next) => {
    // Debug: Log received data
    console.log('Received body:', req.body);
    console.log('Received file:', req.file);
    
    // ALWAYS remove image field from body - we'll handle it separately based on req.file
    // FormData can send image as empty object {}, empty string, or other invalid values
    // Use safer check instead of hasOwnProperty
    if (req.body && 'image' in req.body) {
      delete req.body.image;
    }
    
    // Convert FormData string fields to proper types for validation
    if (req.body.price) {
      const price = parseFloat(req.body.price);
      if (isNaN(price)) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid number'
        });
      }
      req.body.price = price;
    }
    if (req.body.preparationTime) {
      const prepTime = parseInt(req.body.preparationTime);
      if (isNaN(prepTime)) {
        return res.status(400).json({
          success: false,
          message: 'Preparation time must be a valid number'
        });
      }
      req.body.preparationTime = prepTime;
    }
    next();
  },
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').isIn(['starters', 'main-course', 'desserts', 'drinks', 'sides']).withMessage('Invalid category'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('preparationTime').isInt({ min: 1 }).withMessage('Preparation time must be at least 1 minute')
], handleValidationErrors, createMenuItem);

router.put('/:id', [
  protect,
  authorize('admin'),
  upload.single('image')
], updateMenuItem);

router.delete('/:id', [
  protect,
  authorize('admin')
], deleteMenuItem);

module.exports = router;