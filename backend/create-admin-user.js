/**
 * Create Admin User Account
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@edtech.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email: admin@edtech.com');
      console.log('Deleting and recreating...\n');
      await User.deleteOne({ email: 'admin@edtech.com' });
    }

    // Create admin user (password will be auto-hashed by model)
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@edtech.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
      schoolId: new mongoose.Types.ObjectId() // Dummy school ID for admin
    });

    console.log('═'.repeat(50));
    console.log('     ✅ ADMIN ACCOUNT CREATED');
    console.log('═'.repeat(50));
    console.log('');
    console.log('📧 Email:    admin@edtech.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Name:     ' + admin.firstName + ' ' + admin.lastName);
    console.log('🎭 Role:     ' + admin.role.toUpperCase());
    console.log('');
    console.log('🌐 Admin Login: http://localhost:3000/admin/login');
    console.log('   (or use main login at http://localhost:3000)');
    console.log('');
    console.log('🔐 Admin Capabilities:');
    console.log('   • Manage all users (teachers, students, parents)');
    console.log('   • View all assessments and analytics');
    console.log('   • Manage content (quizzes, games, journeys)');
    console.log('   • School administration');
    console.log('   • System settings');
    console.log('');
    console.log('═'.repeat(50));

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdminUser();
