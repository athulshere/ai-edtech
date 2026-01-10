const mongoose = require('mongoose');

const importBatchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  importedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },

  statistics: {
    studentsCreated: { type: Number, default: 0 },
    studentsSkipped: { type: Number, default: 0 },
    parentsCreated: { type: Number, default: 0 },
    parentsReused: { type: Number, default: 0 },
    teachersCreated: { type: Number, default: 0 },
    classesCreated: { type: Number, default: 0 },
    sectionsCreated: { type: Number, default: 0 },
    errors: { type: Number, default: 0 },
    totalRows: { type: Number, default: 0 }
  },

  credentialsFile: {
    s3Key: String,
    downloadUrl: String,
    expiresAt: Date  // Auto-delete credentials after 7 days for security
  },

  errors: [{
    row: Number,
    field: String,
    message: String,
    data: mongoose.Schema.Types.Mixed
  }],

  warnings: [{
    row: Number,
    message: String,
    data: mongoose.Schema.Types.Mixed
  }],

  status: {
    type: String,
    enum: ['validating', 'processing', 'completed', 'failed'],
    default: 'validating'
  },

  processingTime: Number,  // Time taken in milliseconds

  validationSummary: {
    totalRows: Number,
    validRows: Number,
    invalidRows: Number,
    duplicateParents: Number,  // Parents that will be reused
    newParents: Number,        // Parents that will be created
    newClasses: [String],      // Classes that will be created
    newSections: [String]      // Sections that will be created
  }
}, {
  timestamps: true
});

// Indexes
importBatchSchema.index({ schoolId: 1, createdAt: -1 });
importBatchSchema.index({ importedBy: 1, createdAt: -1 });
importBatchSchema.index({ status: 1 });

// Auto-delete credentials file after expiry
importBatchSchema.index({ 'credentialsFile.expiresAt': 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ImportBatch', importBatchSchema);
