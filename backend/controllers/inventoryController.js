//controllers/inventoryController.js
const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res, next) => {
  try {
    const { category, lowStock, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (lowStock === 'true') query.isLowStock = true;

    const inventory = await Inventory.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ isLowStock: -1, currentStock: 1 });

    const total = await Inventory.countDocuments(query);

    res.json({
      success: true,
      count: inventory.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

exports.getInventoryItem = async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id);

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      data: inventoryItem
    });
  } catch (error) {
    next(error);
  }
};

exports.createInventoryItem = async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.create(req.body);

    res.status(201).json({
      success: true,
      data: inventoryItem
    });
  } catch (error) {
    next(error);
  }
};

exports.updateInventoryItem = async (req, res, next) => {
  try {
    let inventoryItem = await Inventory.findById(req.params.id);

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    inventoryItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: inventoryItem
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteInventoryItem = async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id);

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    await Inventory.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getLowStockItems = async (req, res, next) => {
  try {
    const lowStockItems = await Inventory.find({ isLowStock: true });

    res.json({
      success: true,
      count: lowStockItems.length,
      data: lowStockItems
    });
  } catch (error) {
    next(error);
  }
};

exports.restockInventory = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    
    const inventoryItem = await Inventory.findById(req.params.id);

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    inventoryItem.currentStock += parseInt(quantity);
    inventoryItem.lastRestocked = new Date();
    await inventoryItem.save();

    res.json({
      success: true,
      data: inventoryItem
    });
  } catch (error) {
    next(error);
  }
};