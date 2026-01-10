const mongoose = require('mongoose');

const gameAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
    index: true
  },

  // Attempt data
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    default: 0
  },

  // Detailed responses
  responses: [{
    questionIndex: Number,
    userAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    pointsEarned: Number,
    timeSpent: Number // seconds spent on this question
  }],

  // Timing
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  timeTaken: Number, // Total time in seconds

  // Status
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },

  // Gamification rewards
  gamificationRewards: {
    pointsEarned: Number,
    badgesEarned: [String],
    totalPoints: Number,
    level: Number,
    currentStreak: Number,
    awards: [{
      type: String,
      value: mongoose.Schema.Types.Mixed
    }]
  },

  // Performance metrics
  metrics: {
    accuracy: Number, // Percentage of correct answers
    speed: Number,    // Questions per minute
    consistency: Number, // How consistent the performance was
    improvement: Number // Compared to previous attempts
  }
}, {
  timestamps: true
});

// Indexes
gameAttemptSchema.index({ studentId: 1, gameId: 1 });
gameAttemptSchema.index({ status: 1 });
gameAttemptSchema.index({ completedAt: -1 });

module.exports = mongoose.model('GameAttempt', gameAttemptSchema);
