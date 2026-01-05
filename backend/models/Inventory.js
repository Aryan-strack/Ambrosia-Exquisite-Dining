//models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Inventory item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['vegetables', 'meat', 'dairy', 'spices', 'beverages', 'grains', 'others']
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'l', 'ml', 'pieces']
  },
  minStockLevel: {
    type: Number,
    required: true,
    min: 0
  },
  costPerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    name: String,
    contact: String
  },
  lastRestocked: Date,
  isLowStock: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

inventorySchema.pre('save', function(next) {
  this.isLowStock = this.currentStock <= this.minStockLevel;
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);