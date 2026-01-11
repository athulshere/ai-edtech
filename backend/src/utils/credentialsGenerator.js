const User = require('../models/User');

/**
 * Generate a unique username based on user details
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} role - User's role (parent, teacher, admin, etc.)
 * @param {string} schoolId - School ID (optional)
 * @returns {Promise<string>} Generated unique username
 */
const generateUsername = async (firstName, lastName, role, schoolId) => {
  const firstNameClean = firstName.toLowerCase().replace(/\s+/g, '');
  const lastNameClean = lastName.toLowerCase().replace(/\s+/g, '');

  let baseUsername = `${firstNameClean}.${lastNameClean}`;
  let username = baseUsername;
  let counter = 1;

  // Check if username exists and increment until unique
  while (true) {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      break;
    }
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
};

/**
 * Generate a temporary password for a new user
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} role - User's role
 * @param {string} schoolId - School ID (optional)
 * @returns {string} Generated password
 */
const generatePassword = (firstName, lastName, role, schoolId) => {
  const firstNameClean = firstName.replace(/\s+/g, '');
  const lastNameClean = lastName.replace(/\s+/g, '');

  // Generate a simple but secure temporary password
  // Format: FirstName@LastInitial123
  const password = `${firstNameClean}@${lastNameClean.charAt(0).toUpperCase()}123`;

  return password;
};

module.exports = {
  generateUsername,
  generatePassword
};
