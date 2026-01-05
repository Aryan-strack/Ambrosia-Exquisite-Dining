require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');

const createNewAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_db');
    console.log('✅ Connected to database');

    // Delete any existing admin with this email
    await User.deleteOne({ email: 'superadmin@restaurant.com' });
    console.log('✅ Cleared existing admin');

    // Create new admin user
    const adminUser = new User({
      name: 'Super Admin',
      email: 'superadmin@restaurant.com',
      password: 'admin123', // This will be hashed automatically by the model
      role: 'admin',
      phone: '9876543210',
      isActive: true
    });

    await adminUser.save();
    console.log('✅ New admin user created successfully!');
    
    console.log('\n📋 Admin Credentials:');
    console.log('📧 Email: superadmin@restaurant.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    
    // Verify the user was created
    const verifyUser = await User.findOne({ email: 'superadmin@restaurant.com' });
    console.log('\n✅ Verification - User in database:');
    console.log('ID:', verifyUser._id);
    console.log('Email:', verifyUser.email);
    console.log('Role:', verifyUser.role);
    console.log('isActive:', verifyUser.isActive);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createNewAdmin();