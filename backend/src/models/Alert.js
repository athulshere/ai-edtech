const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  alertType: {
    type: String,
    enum: [
      'performance_decline',      // Scores dropping
      'low_quiz_scores',         // Consistently low quiz performance
      'streak_broken',           // Lost activity streak
      'no_activity',            // No recent submissions
      'concept_weakness',       // Struggling with specific concepts
      'completion_rate_low'     // Low assignment completion
    ],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  metrics: {
    // Supporting data for the alert
    currentScore: Number,
    previousScore: Number,
    averageScore: Number,
    daysInactive: Number,
    completionRate: Number,
    failedConcepts: [String],
    quizzesFailed: Number,
    totalQuizzes: Number
  },
  recommendations: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
    default: 'active'
  },
  acknowledgedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userRole: String,
    acknowledgedAt: Date,
    notes: String
  },
  resolvedAt: Date,
  expiresAt: {
    type: Date,
    // Auto-expire alerts after 30 days if not resolved
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
alertSchema.index({ studentId: 1, status: 1 });
alertSchema.index({ alertType: 1, severity: 1 });
alertSchema.index({ createdAt: -1 });
alertSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Alert', alertSchema);
