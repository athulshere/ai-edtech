const User = require('../models/User');
const Student = require('../models/Student');
const School = require('../models/School');
const { generateToken } = require('../middleware/auth');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phoneNumber } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Get default school (first school in database)
    let defaultSchool = await School.findOne({ isActive: true });

    // If no school exists, create a default one
    if (!defaultSchool) {
      defaultSchool = await School.create({
        name: 'Default School',
        code: 'SCH0001',
        type: 'K-12',
        email: 'admin@school.com',
        phone: '0000000000',
        address: {
          street: 'TBD',
          city: 'TBD',
          state: 'TBD',
          pincode: '000000',
          country: 'India'
        },
        settings: {
          academicYearStart: 4,
          academicYearEnd: 3,
          workingDays: [1, 2, 3, 4, 5], // Mon-Fri (1=Monday, 5=Friday)
          attendance: {
            markingTime: '09:00',
            lateThreshold: 15,
            autoNotifyParents: true
          },
          fees: {
            lateFeeEnabled: true,
            lateFeePercentage: 5,
            gracePeriodDays: 7
          },
          homework: {
            maxFileSizeMB: 10,
            allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
            autoGradingEnabled: true
          }
        }
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'parent',
      phoneNumber,
      schoolId: defaultSchool._id
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt - Email:', email, 'Password length:', password?.length);

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive. Please contact support.' });
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      mustChangePassword: user.mustChangePassword || false,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.profileImage = req.body.profileImage || user.profileImage;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        profileImage: updatedUser.profileImage,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For users who must change password (first login), allow without current password check
    if (!user.mustChangePassword) {
      const isPasswordMatch = await user.matchPassword(currentPassword);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    res.json({
      message: 'Password changed successfully',
      mustChangePassword: false
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
