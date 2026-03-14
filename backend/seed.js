import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import SiteSettings from './models/SiteSettings.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'sivadharshana1312@gmail.com' });

    if (adminExists) {
      console.log('Admin user already exists');
      
      // Update to admin if not already
      if (!adminExists.isAdmin) {
        adminExists.isAdmin = true;
        await adminExists.save();
        console.log('User updated to admin');
      }
    } else {
      // Create admin user
      const admin = await User.create({
        name: 'Admin',
        email: 'sivadharshana1312@gmail.com',
        password: 'Admin@123',
        isAdmin: true,
        isActive: true
      });

      console.log('Admin user created successfully');
      console.log('Email: sivadharshana1312@gmail.com');
      console.log('Password: Admin@123');
    }

    // Create default site settings if not exist
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
      console.log('Default site settings created');
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

createAdminUser();
