const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number, // Index of selected option
    isCorrect: Boolean,
    pointsEarned: Number
  }],
  score: {
    type: Number,
    required: true,
    default: 0
  },
  totalPoints: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  completedAt: Date,
  gamificationRewards: {
    pointsEarned: Number,
    totalPoints: Number,
    level: Number,
    currentStreak: Number,
    awards: [{
      type: {
        type: String,
        enum: ['badge', 'streak', 'achievement']
      },
      value: mongoose.Schema.Types.Mixed
    }]
  }
}, {
  timestamps: true
});

// Indexes
quizAttemptSchema.index({ studentId: 1, createdAt: -1 });
quizAttemptSchema.index({ quizId: 1, studentId: 1 });
quizAttemptSchema.index({ status: 1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
