//controllers/menuController.js
const Menu = require('../models/Menu');

exports.getMenuItems = async (req, res, next) => {
  try {
    const { category, available, page = 1, limit = 10 } = req.query;

    let query = {};
    if (category) query.category = category;
    if (available === 'true') {
      query.isAvailable = true;
    }

    const menuItems = await Menu.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Menu.countDocuments(query);

    res.json({
      success: true,
      count: menuItems.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
};

exports.getMenuItem = async (req, res, next) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    // Create clean menuData object - explicitly exclude image field
    const menuData = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      preparationTime: req.body.preparationTime,
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
      ingredients: req.body.ingredients || [],
      nutritionalInfo: req.body.nutritionalInfo || {}
    };

    // Only add image if file was actually uploaded
    if (req.file && req.file.filename) {
      menuData.image = `/uploads/${req.file.filename}`;
    }
    // If no image file, don't set image field - let model use default value

    const menuItem = await Menu.create(menuData);

    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    let menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Create clean updateData object - explicitly exclude image field
    const updateData = {};

    // Only include fields that are being updated
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = req.body.price;
    if (req.body.preparationTime !== undefined) updateData.preparationTime = req.body.preparationTime;
    if (req.body.isAvailable !== undefined) updateData.isAvailable = req.body.isAvailable;
    if (req.body.ingredients !== undefined) updateData.ingredients = req.body.ingredients;
    if (req.body.nutritionalInfo !== undefined) updateData.nutritionalInfo = req.body.nutritionalInfo;

    // Only add image if file was actually uploaded
    if (req.file && req.file.filename) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    // If no new image file, don't modify the image field

    menuItem = await Menu.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    await Menu.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getMenuCategories = async (req, res, next) => {
  try {
    const categories = await Menu.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};