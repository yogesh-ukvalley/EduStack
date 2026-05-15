const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Seed default super-admin if none exists
const seedAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      console.log('No admin found. Creating default super-admin...');

      const defaultAdmin = new Admin({
        email: 'admin@edustack.ca',
        password: 'edustack123',
        name: 'Admin',
        role: 'super-admin',
        isActive: true
      });

      await defaultAdmin.save();
      console.log('Default super-admin created successfully');
      console.log('Email: admin@edustack.ca');
      console.log('Password: edustack123');
      console.log('Role: super-admin');
      console.log('IMPORTANT: Change these credentials in production!');
    } else {
      console.log(`Admin count: ${adminCount}`);
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edustack');
    console.log('MongoDB Connected');

    // Seed admin after successful connection
    await seedAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;