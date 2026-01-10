const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'School name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'School code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Primary', 'Secondary', 'Higher Secondary', 'K-12'],
    required: true
  },

  // Contact
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: String,
  website: String,

  // Address
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },

  // Admin Info
  principal: {
    name: String,
    email: String,
    phone: String
  },

  // Logo & Branding
  logo: String, // S3 URL
  primaryColor: { type: String, default: '#667eea' },
  secondaryColor: { type: String, default: '#764ba2' },

  // Academic
  establishedYear: Number,
  affiliation: String, // "CBSE", "ICSE", "State Board", etc.
  affiliationNumber: String,

  // Configuration
  settings: {
    academicYearStart: { type: Number, default: 4 }, // April = 4
    academicYearEnd: { type: Number, default: 3 }, // March = 3
    weekStartDay: { type: Number, default: 1 }, // 1 = Monday
    workingDays: { type: [Number], default: [1, 2, 3, 4, 5, 6] }, // Mon-Sat

    attendance: {
      markingTime: { type: String, default: '09:30' },
      lateThreshold: { type: Number, default: 15 }, // minutes
      autoNotifyParents: { type: Boolean, default: true }
    },

    fees: {
      lateFeeEnabled: { type: Boolean, default: true },
      lateFeeAmount: { type: Number, default: 500 },
      lateFeePercentage: { type: Number, default: 5 },
      gracePeriodDays: { type: Number, default: 3 }
    },

    homework: {
      maxFileSizeMB: { type: Number, default: 10 },
      allowedFileTypes: {
        type: [String],
        default: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
      },
      autoGradingEnabled: { type: Boolean, default: true }
    }
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  subscription: {
    plan: {
      type: String,
      enum: ['trial', 'basic', 'premium', 'enterprise'],
      default: 'trial'
    },
    validUntil: Date,
    maxStudents: { type: Number, default: 100 },
    maxTeachers: { type: Number, default: 10 }
  }
}, {
  timestamps: true
});

// Auto-generate school code if not provided
schoolSchema.pre('save', async function(next) {
  if (!this.code && this.isNew) {
    const count = await mongoose.model('School').countDocuments();
    this.code = `SCH${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Indexes
schoolSchema.index({ code: 1 });
schoolSchema.index({ isActive: 1 });

module.exports = mongoose.model('School', schoolSchema);
