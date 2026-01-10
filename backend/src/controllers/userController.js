const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateUsername, generatePassword } = require('../utils/credentialsGenerator');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = { schoolId: req.user.schoolId };

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create user (admin only) - for creating teachers, parents, students
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, phoneNumber, parentData, teacherData } = req.body;

    // Validate role
    if (!['teacher', 'parent', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Only teacher, parent, and student can be created.' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Generate username
    const username = await generateUsername(firstName, lastName, role, null);

    // Generate temporary password using our password generation logic
    const tempPassword = generatePassword(firstName, lastName, role, null);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: tempPassword,
      role,
      phoneNumber,
      schoolId: req.user.schoolId,
      parentData: role === 'parent' ? parentData : undefined,
      teacherData: role === 'teacher' ? teacherData : undefined,
      mustChangePassword: true, // Force password change on first login
    });

    // Return user without password but with temp password for admin to share
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      temporaryPassword: tempPassword, // Send this ONLY to admin in response
      instructions: 'Share the temporary password with the user. They will be required to change it on first login.',
    });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow password updates through this endpoint
    delete updates.password;
    delete updates.role; // Don't allow role changes
    delete updates.schoolId; // Don't allow school changes

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure user belongs to same school
    if (user.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'User updated successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Deactivate user (admin only) - soft delete
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure user belongs to same school
    if (user.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Don't allow deactivating yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Deactivate User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reactivate user (admin only)
const reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure user belongs to same school
    if (user.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    user.isActive = true;
    await user.save();

    res.json({ message: 'User reactivated successfully' });
  } catch (error) {
    console.error('Reactivate User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset user password (admin only)
const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure user belongs to same school
    if (user.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Generate new temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex');

    user.password = tempPassword;
    user.mustChangePassword = true;
    await user.save();

    res.json({
      message: 'Password reset successfully',
      temporaryPassword: tempPassword,
      instructions: 'Share the temporary password with the user. They will be required to change it on first login.',
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  resetUserPassword,
};
