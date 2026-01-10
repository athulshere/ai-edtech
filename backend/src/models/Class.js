const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: [true, 'School ID is required']
  },

  // Class Info
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Class code is required'],
    uppercase: true,
    trim: true
  },
  level: {
    type: Number,
    required: [true, 'Class level is required'],
    min: 1,
    max: 12
  },

  // Academic Year
  academicYear: {
    start: { type: Number, required: true },
    end: { type: Number, required: true }
  },

  // Capacity
  maxStudents: {
    type: Number,
    default: 40
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for uniqueness
classSchema.index(
  { schoolId: 1, code: 1, 'academicYear.start': 1, 'academicYear.end': 1 },
  { unique: true }
);

classSchema.index({ schoolId: 1, isActive: 1 });
classSchema.index({ level: 1 });

module.exports = mongoose.model('Class', classSchema);
