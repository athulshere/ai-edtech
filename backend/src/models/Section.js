const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class ID is required']
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: [true, 'School ID is required']
  },

  // Section Info
  name: {
    type: String,
    required: [true, 'Section name is required'],
    trim: true,
    uppercase: true
  },
  code: {
    type: String,
    required: true,
    trim: true
  },

  // Class Teacher
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Capacity
  maxStudents: {
    type: Number,
    default: 40
  },
  currentStudents: {
    type: Number,
    default: 0
  },

  // Room
  roomNumber: String,
  floor: String,

  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Unique section per class
sectionSchema.index({ classId: 1, name: 1 }, { unique: true });
sectionSchema.index({ schoolId: 1, isActive: 1 });
sectionSchema.index({ classTeacher: 1 });

// Auto-generate code (e.g., "G5-A", "G10-B")
sectionSchema.pre('save', async function(next) {
  if (this.isNew && this.classId) {
    try {
      const Class = mongoose.model('Class');
      const classDoc = await Class.findById(this.classId);
      if (classDoc) {
        this.code = `${classDoc.code}-${this.name}`;
      }
    } catch (error) {
      // Code will be set manually if class lookup fails
    }
  }
  next();
});

module.exports = mongoose.model('Section', sectionSchema);
