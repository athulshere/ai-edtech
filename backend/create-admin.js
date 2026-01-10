require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edtech-assessment');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@test.com');
      console.log('You can reset the password by updating the database directly.');
      process.exit(0);
    }

    // Hash password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
      phoneNumber: '1234567890',
      isActive: true,
      isEmailVerified: true
    });

    await admin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('   Email: admin@test.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change this password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdmin();
