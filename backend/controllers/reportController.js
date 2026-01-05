const Order = require('../models/Order');
const Menu = require('../models/Menu');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Inventory = require('../models/Inventory');

exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let groupFormat;
    switch (groupBy) {
      case 'hour':
        groupFormat = { hour: { $hour: '$createdAt' } };
        break;
      case 'week':
        groupFormat = { week: { $week: '$createdAt' } };
        break;
      case 'month':
        groupFormat = { month: { $month: '$createdAt' } };
        break;
      default:
        groupFormat = { day: { $dayOfMonth: '$createdAt' }, month: { $month: '$createdAt' }, year: { $year: '$createdAt' } };
    }

    const salesReport = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: groupFormat,
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 }
      }
    ]);

    const totalStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        period: { start, end },
        totalStats: totalStats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
        salesReport
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPopularItems = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const popularItems = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'paid'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orderCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'menus',
          localField: '_id',
          foreignField: '_id',
          as: 'menuItem'
        }
      },
      { $unwind: '$menuItem' },
      {
        $project: {
          name: '$menuItem.name',
          category: '$menuItem.category',
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: 1,
          averagePrice: '$menuItem.price'
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: popularItems
    });
  } catch (error) {
    next(error);
  }
};

exports.getRevenueReport = async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let groupFormat;
    let dateRange;

    switch (period) {
      case 'daily':
        groupFormat = { day: { $dayOfMonth: '$createdAt' }, month: { $month: '$createdAt' }, year: { $year: '$createdAt' } };
        dateRange = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        groupFormat = { week: { $week: '$createdAt' }, year: { $year: '$createdAt' } };
        dateRange = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        groupFormat = { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } };
        dateRange = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    }

    const revenueReport = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          dineInRevenue: {
            $sum: {
              $cond: [{ $eq: ['$orderType', 'dine-in'] }, '$totalAmount', 0]
            }
          },
          deliveryRevenue: {
            $sum: {
              $cond: [{ $eq: ['$orderType', 'delivery'] }, '$totalAmount', 0]
            }
          },
          takeawayRevenue: {
            $sum: {
              $cond: [{ $eq: ['$orderType', 'takeaway'] }, '$totalAmount', 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: revenueReport
    });
  } catch (error) {
    next(error);
  }
};

exports.getCustomerStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const customerStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: '$customer',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $project: {
          customerName: '$customer.name',
          customerEmail: '$customer.email',
          totalSpent: 1,
          orderCount: 1,
          averageOrderValue: { $divide: ['$totalSpent', '$orderCount'] },
          firstOrder: 1,
          lastOrder: 1
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);

    const overallStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $addToSet: '$customer' },
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $project: {
          totalUniqueCustomers: { $size: '$totalCustomers' },
          totalRevenue: 1,
          totalOrders: 1,
          averageRevenuePerCustomer: { $divide: ['$totalRevenue', { $size: '$totalCustomers' }] }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overallStats: overallStats[0] || {
          totalUniqueCustomers: 0,
          totalRevenue: 0,
          totalOrders: 0,
          averageRevenuePerCustomer: 0
        },
        customerStats
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getInventoryReport = async (req, res, next) => {
  try {
    const lowStockItems = await Inventory.find({ isLowStock: true });

    const inventoryValue = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$currentStock', '$costPerUnit'] } },
          totalItems: { $sum: 1 },
          lowStockItems: { $sum: { $cond: ['$isLowStock', 1, 0] } }
        }
      }
    ]);

    const categoryBreakdown = await Inventory.aggregate([
      {
        $group: {
          _id: '$category',
          totalValue: { $sum: { $multiply: ['$currentStock', '$costPerUnit'] } },
          itemCount: { $sum: 1 },
          lowStockCount: { $sum: { $cond: ['$isLowStock', 1, 0] } }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: inventoryValue[0] || { totalValue: 0, totalItems: 0, lowStockItems: 0 },
        lowStockItems,
        categoryBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const orderAnalytics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const orderTypeAnalytics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: '$orderType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          averageAmount: { $avg: '$totalAmount' }
        }
      }
    ]);

    const hourlyDistribution = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        statusDistribution: orderAnalytics,
        orderTypeAnalysis: orderTypeAnalytics,
        hourlyDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};