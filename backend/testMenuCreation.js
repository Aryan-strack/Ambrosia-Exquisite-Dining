const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

// Test configuration
const MONGODB_URI = 'mongodb://localhost:27017/restaurant_db';
const JWT_SECRET = 'your_super_secret_jwt_key_here_change_this_in_production';

const testMenuCreation = async () => {
  try {
    console.log('🔍 Testing Menu Creation System...\n');
    
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database');
    
    // Check if admin user exists
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No admin user found. Please run: node createAdmin.js');
      process.exit(1);
    }
    console.log('✅ Admin user found:', adminUser.email);
    
    // Generate JWT token for admin
    const token = jwt.sign({ id: adminUser._id }, JWT_SECRET, { expiresIn: '30d' });
    console.log('✅ JWT token generated');
    
    // Test menu item data
    const testMenuItem = {
      name: 'Test Burger',
      category: 'main-course',
      description: 'Delicious test burger with fresh ingredients',
      price: 15.99,
      preparationTime: 20,
      ingredients: [
        { name: 'Beef Patty', quantity: '1 piece' },
        { name: 'Lettuce', quantity: '2 leaves' },
        { name: 'Tomato', quantity: '2 slices' }
      ],
      nutritionalInfo: {
        calories: 450,
        protein: 25,
        carbs: 35,
        fat: 20
      }
    };
    
    // Test creating menu item directly
    console.log('\n🧪 Testing direct menu creation...');
    const createdMenuItem = await Menu.create(testMenuItem);
    console.log('✅ Menu item created successfully:', createdMenuItem.name);
    
    // Clean up test data
    await Menu.findByIdAndDelete(createdMenuItem._id);
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 Menu creation system is working correctly!');
    console.log('\n📋 To create menu items via API:');
    console.log('1. Login as admin: POST /api/auth/login');
    console.log('2. Use the token in Authorization header: Bearer <token>');
    console.log('3. Create menu: POST /api/menu/');
    console.log('\n📝 Required fields: name, category, description, price, preparationTime');
    console.log('📝 Valid categories: starters, main-course, desserts, drinks, sides');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing menu creation:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', Object.values(error.errors).map(e => e.message));
    }
    process.exit(1);
  }
};

testMenuCreation();
