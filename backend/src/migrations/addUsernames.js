const mongoose = require('mongoose');
const User = require('../models/User');
const { generateUsername } = require('../utils/credentialsGenerator');

/**
 * Migration script to add usernames to existing users
 * Run this once after deploying the username field changes
 *
 * Usage: node backend/src/migrations/addUsernames.js
 */

const addUsernamesToExistingUsers = async () => {
  try {
    // Load environment variables
    require('dotenv').config();

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edtech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find all users without username
    const usersWithoutUsername = await User.find({
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: '' }
      ]
    });

    console.log(`Found ${usersWithoutUsername.length} users without usernames`);

    if (usersWithoutUsername.length === 0) {
      console.log('All users already have usernames. Migration not needed.');
      await mongoose.connection.close();
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutUsername) {
      try {
        // Determine grade for students
        let grade = null;
        if (user.role === 'student' && user.studentData) {
          // Try to get grade from student profile if available
          if (user.studentData.studentProfile) {
            const Student = require('../models/Student');
            const studentProfile = await Student.findById(user.studentData.studentProfile);
            if (studentProfile && studentProfile.grade) {
              grade = studentProfile.grade;
            }
          }

          // If still no grade, use a default or skip
          if (!grade) {
            console.warn(`No grade found for student ${user._id}, using default 'K'`);
            grade = 'K';
          }
        }

        // Generate username
        const username = await generateUsername(
          user.firstName,
          user.lastName,
          user.role,
          grade
        );

        // Update user
        user.username = username;
        await user.save();

        console.log(`✓ Added username '${username}' for ${user.role} ${user.firstName} ${user.lastName}`);
        successCount++;
      } catch (error) {
        console.error(`✗ Error adding username for user ${user._id}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Successfully updated: ${successCount} users`);
    console.log(`Errors: ${errorCount} users`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Migration Error:', error);
    process.exit(1);
  }
};

// Run migration if executed directly
if (require.main === module) {
  addUsernamesToExistingUsers();
}

module.exports = addUsernamesToExistingUsers;
