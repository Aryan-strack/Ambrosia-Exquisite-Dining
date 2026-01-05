// routes/inventory.js
const express = require('express');
const { body } = require('express-validator');
const {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  restockInventory
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.get('/', protect, getInventory);
router.get('/low-stock', protect, getLowStockItems);
router.get('/:id', protect, getInventoryItem);

router.post('/', [
  protect,
  authorize('admin'),
  body('name').notEmpty().withMessage('Name is required'),
  body('category').isIn(['vegetables', 'meat', 'dairy', 'spices', 'beverages', 'grains', 'others']).withMessage('Invalid category'),
  body('currentStock').isFloat({ min: 0 }).withMessage('Current stock cannot be negative'),
  body('minStockLevel').isFloat({ min: 0 }).withMessage('Minimum stock level cannot be negative'),
  body('costPerUnit').isFloat({ min: 0 }).withMessage('Cost per unit cannot be negative')
], handleValidationErrors, createInventoryItem);

router.put('/:id', [
  protect,
  authorize('admin')
], updateInventoryItem);

router.put('/:id/restock', [
  protect,
  authorize('admin'),
  body('quantity').isFloat({ min: 0.1 }).withMessage('Quantity must be a positive number')
], handleValidationErrors, restockInventory);

router.delete('/:id', [
  protect,
  authorize('admin')
], deleteInventoryItem);

module.exports = router;