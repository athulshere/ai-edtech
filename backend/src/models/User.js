const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Username for login (used by students, optional for others)
  username: {
    type: String,
    unique: true,
    sparse: true,  // Allows null, unique only if present
    lowercase: true,
    trim: true,
    index: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  // Email optional for students (required for teachers/parents/admin)
  email: {
    type: String,
    sparse: true,  // Allows null, unique only if present
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['parent', 'teacher', 'admin'],
    required: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  alternatePhone: String,

  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },

  profileImage: {
    type: String
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },

  // School Association
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },

  // Role-Specific Data
  parentData: {
    occupation: String,
    children: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }],
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    }
  },

  teacherData: {
    employeeId: String,
    subjects: [String],
    classes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }],
    sections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section'
    }],
    qualification: String,
    experience: Number, // Years of experience
    specialization: String,
    joinedDate: Date
  },

  // Preferences
  preferences: {
    language: { type: String, default: 'en' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },

  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  mustChangePassword: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  loginHistory: [{
    timestamp: Date,
    ipAddress: String,
    device: String
  }],

  // Import tracking
  importBatch: {
    batchId: String,           // UUID for bulk import batch
    importedAt: Date,          // When this user was imported
    importedBy: {              // Admin who did the import
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes (email already indexed in schema definition)
userSchema.index({ role: 1, schoolId: 1 });
userSchema.index({ 'parentData.children': 1 });
userSchema.index({ 'importBatch.batchId': 1 });

module.exports = mongoose.model('User', userSchema);
