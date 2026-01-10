const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
  dateOfBirth: {
    type: Date,
    required: true
  },
  grade: {
    type: String,
    required: true
  },

  // School & Class Association
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },

  // Parents (can have multiple parents)
  parentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // IDs
  studentId: {
    type: String,
    unique: true
  },
  registerNumber: {
    type: String,
    unique: true,
    required: [true, 'Register number is required'],
    trim: true
  },
  admissionNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  rollNumber: String,
  profileImage: {
    type: String
  },
  subjects: [{
    type: String
  }],
  learningProfile: {
    strengths: [String],
    weaknesses: [String],
    learningStyle: String,
    commonMistakePatterns: [{
      subject: String,
      pattern: String,
      frequency: Number,
      lastOccurrence: Date
    }]
  },

  // Gamification
  gamification: {
    totalPoints: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    badges: [{
      id: String,
      name: String,
      description: String,
      icon: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    streaks: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastActivityDate: Date
    },
    achievements: [{
      category: String, // 'assessment', 'improvement', 'consistency', 'mastery'
      title: String,
      description: String,
      pointsAwarded: Number,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate student ID before saving
studentSchema.pre('save', async function(next) {
  if (!this.studentId) {
    const count = await mongoose.model('Student').countDocuments();
    this.studentId = `STU${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Indexes
studentSchema.index({ studentId: 1 });
studentSchema.index({ schoolId: 1, classId: 1, sectionId: 1 });
studentSchema.index({ parentIds: 1 });
studentSchema.index({ registerNumber: 1 });
studentSchema.index({ admissionNumber: 1 });

module.exports = mongoose.model('Student', studentSchema);
