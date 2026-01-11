const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Student = require('./src/models/Student');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('=== ALL STUDENTS ===');
    const allStudents = await Student.find().select('firstName lastName grade parentIds registerNumber');
    console.log('Total students:', allStudents.length);
    allStudents.forEach(s => {
      console.log(`  ${s.firstName} ${s.lastName} - Grade ${s.grade} - ParentIDs: ${s.parentIds} - Reg: ${s.registerNumber}`);
    });

    console.log('\n=== PARENT INFO ===');
    const parent = await User.findOne({ email: 'test@parent.com' });
    if (parent) {
      console.log('Parent ID:', parent._id);
      console.log('Children:', parent.parentData?.children);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
