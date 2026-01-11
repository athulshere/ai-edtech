/**
 * Create Test Parent Account
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Student = require('./src/models/Student');
const bcrypt = require('bcryptjs');

const createTestParent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete existing test user and students if exists
    const existingParent = await User.findOne({ email: 'test@parent.com' });
    if (existingParent) {
      await Student.deleteMany({ parentIds: existingParent._id });
      await User.deleteOne({ email: 'test@parent.com' });
      console.log('Cleaned up existing test account and students...');
    } else {
      // Also clean up any orphaned test students
      await Student.deleteMany({ registerNumber: 'TEST001' });
      console.log('Cleaned up any orphaned test students...');
    }

    // Create new parent user (password will be auto-hashed by model)
    const parent = await User.create({
      firstName: 'Test',
      lastName: 'Parent',
      email: 'test@parent.com',
      password: 'test123', // Will be hashed by pre-save hook
      role: 'parent',
      schoolId: new mongoose.Types.ObjectId() // Dummy school ID
    });

    console.log('✅ Created parent user');

    // Create student for this parent
    const student = await Student.create({
      firstName: 'Test',
      lastName: 'Student',
      dateOfBirth: new Date('2018-01-01'),
      grade: '1',
      registerNumber: 'TEST001',
      parentIds: [parent._id], // Array of parent IDs
      schoolId: parent.schoolId,
      classId: new mongoose.Types.ObjectId(),
      sectionId: new mongoose.Types.ObjectId(),
      assessmentLevel: 'beginner',
      learningProfile: {
        strengths: [],
        weaknesses: [],
        recommendedTopics: []
      },
      gamification: {
        points: 0,
        level: 1,
        badges: [],
        streak: { current: 0, longest: 0, lastActive: new Date() }
      },
      isActive: true
    });

    console.log('✅ Created student for parent');

    // Link student to parent
    parent.parentData = {
      children: [student._id]
    };
    await parent.save();
    console.log('✅ Linked student to parent\n');

    // Verify password works
    const isMatch = await bcrypt.compare('test123', parent.password);

    console.log('═'.repeat(50));
    console.log('     ✅ TEST ACCOUNT READY');
    console.log('═'.repeat(50));
    console.log('\n📧 Email:    test@parent.com');
    console.log('🔑 Password: test123');
    console.log('👤 Name:     ' + parent.firstName + ' ' + parent.lastName);
    console.log('🎭 Role:     ' + parent.role);
    console.log('👶 Student:  ' + student.firstName + ' ' + student.lastName + ' (Grade ' + student.grade + ')');
    console.log('🔐 Verified: ' + (isMatch ? '✅ Password works!' : '❌ Password failed'));
    console.log('\n🌐 Login at: http://localhost:3000');
    console.log('\n📚 Grade 1 has 13 available quizzes including:');
    console.log('   • Numbers 1-9 (CBSE-aligned)');
    console.log('   • Shapes and Space (CBSE-aligned)');
    console.log('   • Alphabets and Sounds (CBSE-aligned)');
    console.log('   • Basic Addition, Subtraction');
    console.log('   • Animal Friends, Our Body Parts');
    console.log('   • And more...');
    console.log('\n' + '═'.repeat(50));

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createTestParent();
