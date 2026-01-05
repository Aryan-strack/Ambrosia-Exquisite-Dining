require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const users = [
  {
    name: 'Super Admin',
    email: 'superadmin@restaurant.com',
    password: 'admin123',
    role: 'admin',
    phone: '9876543210',
    isActive: true,
  },
  {
    name: 'Staff User',
    email: 'staff@restaurant.com',
    password: 'staff123',
    role: 'staff',
    phone: '1112223333',
    isActive: true,
  },
  {
    name: 'Chef User',
    email: 'chef@restaurant.com',
    password: 'chef123',
    role: 'chef',
    phone: '4445556666',
    isActive: true,
  },
  {
    name: 'Customer User',
    email: 'customer@restaurant.com',
    password: 'customer123',
    role: 'customer',
    phone: '1112223333',
    isActive: true,
  }
];

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_db';
  console.log('Connecting to', uri);
  await mongoose.connect(uri);
  console.log('Connected');

  try {
    for (const u of users) {
      await User.deleteOne({ email: u.email });
      const created = await new User(u).save();
      console.log(`Seeded ${u.role}: ${created.email}`);
    }

    console.log('\nLogin Credentials:');
    console.log('Admin -> superadmin@restaurant.com / admin123');
    console.log('Staff -> staff@restaurant.com / staff123');
    console.log('Chef  -> chef@restaurant.com / chef123');
  } catch (err) {
    console.error('Seeding error', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run();
