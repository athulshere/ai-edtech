require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const updateAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edtech-assessment');
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@test.com' });
    if (!admin) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }

    // Hash new password
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    admin.password = hashedPassword;
    admin.isActive = true;
    admin.isEmailVerified = true;
    await admin.save();

    console.log('\n✅ Admin password updated successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('   Email: admin@test.com');
    console.log('   Password: admin123');
    console.log('   Role:', admin.role);
    console.log('\n⚠️  Please change this password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('Error updating admin password:', error.message);
    process.exit(1);
  }
};

updateAdminPassword();
