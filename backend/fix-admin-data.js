require('dotenv').config();
const mongoose = require('mongoose');

const fixAdminData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edtech-assessment');
    console.log('Connected to MongoDB');

    const User = mongoose.connection.collection('users');

    // Fix the admin user's teacherData field
    const result = await User.updateOne(
      { email: 'admin@test.com' },
      {
        $unset: {
          teacherData: ""
        }
      }
    );

    console.log('✅ Admin user data fixed!');
    console.log('Modified:', result.modifiedCount);

    // Verify the fix
    const admin = await User.findOne({ email: 'admin@test.com' });
    console.log('\nAdmin user details:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Active:', admin.isActive);
    console.log('\n📧 You can now login with:');
    console.log('   Email: admin@test.com');
    console.log('   Password: admin123\n');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

fixAdminData();
