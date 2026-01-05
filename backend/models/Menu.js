//models/Menu.js
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['starters', 'main-course', 'desserts', 'drinks', 'sides']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    default: 'default-food.jpg',
    set: v => (typeof v === 'string' && v.trim() ? v : undefined)
  },
  ingredients: [{
    name: String,
    quantity: String
  }],
  preparationTime: {
    type: Number, // in minutes
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Menu', menuSchema);
