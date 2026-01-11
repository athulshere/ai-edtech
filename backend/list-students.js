const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Student = require('./src/models/Student');
const User = require('./src/models/User');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('\n=== ALL STUDENTS ===\n');

  const students = await Student.find();

  if (students.length === 0) {
    console.log('No students found');
  } else {
    for (const student of students) {
      console.log(`Student: ${student.firstName} ${student.lastName}`);
      console.log(`  ID: ${student._id}`);
      console.log(`  Grade: ${student.grade}`);
      console.log(`  Parent IDs: ${student.parentIds.join(', ')}`);
      console.log('');
    }
  }

  console.log('=== ALL PARENTS ===\n');

  const parents = await User.find({ role: 'parent' });

  if (parents.length === 0) {
    console.log('No parents found');
  } else {
    for (const parent of parents) {
      console.log(`Parent: ${parent.firstName} ${parent.lastName}`);
      console.log(`  ID: ${parent._id}`);
      console.log(`  Email: ${parent.email}`);
      console.log(`  Children: ${parent.parentData?.children?.length || 0}`);
      console.log('');
    }
  }

  await mongoose.disconnect();
  process.exit(0);
})();
