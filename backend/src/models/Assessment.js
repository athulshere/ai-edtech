const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  assessmentType: {
    type: String,
    enum: ['exam', 'quiz', 'homework', 'practice'],
    default: 'practice'
  },
  originalImage: {
    url: String,
    s3Key: String,
    uploadedAt: Date
  },
  extractedText: {
    type: String
  },
  questions: [{
    questionNumber: Number,
    questionText: String,
    studentAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    score: Number,
    maxScore: Number
  }],
  aiAnalysis: {
    overallScore: Number,
    totalScore: Number,
    mistakes: [{
      questionNumber: Number,
      mistakeType: {
        type: String,
        enum: ['conceptual', 'calculation', 'formatting', 'incomplete', 'misunderstanding', 'other']
      },
      description: String,
      suggestion: String,
      relatedConcepts: [String]
    }],
    strengths: [String],
    areasForImprovement: [String],
    personalizedFeedback: String,
    recommendedTopics: [String],
    difficultyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    }
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingTime: {
    type: Number
  },
  viewedByParent: {
    type: Boolean,
    default: false
  },
  viewedByTeacher: {
    type: Boolean,
    default: false
  },
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

// Index for efficient queries
assessmentSchema.index({ studentId: 1, createdAt: -1 });
assessmentSchema.index({ teacherId: 1, createdAt: -1 });
assessmentSchema.index({ subject: 1, studentId: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
