const express = require('express');
const {
  getSalesReport,
  getPopularItems,
  getRevenueReport,
  getCustomerStats,
  getInventoryReport,
  getOrderAnalytics
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/sales', [protect, authorize('admin')], getSalesReport);
router.get('/popular-items', [protect, authorize('admin')], getPopularItems);
router.get('/revenue', [protect, authorize('admin')], getRevenueReport);
router.get('/customer-stats', [protect, authorize('admin')], getCustomerStats);
router.get('/inventory', [protect, authorize('admin')], getInventoryReport);
router.get('/order-analytics', [protect, authorize('admin')], getOrderAnalytics);

module.exports = router;