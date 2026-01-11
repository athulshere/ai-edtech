const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Grade is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['Mathematics', 'Science', 'English', 'Social Studies', 'General Knowledge', 'EVS', 'Hindi', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Political Science', 'Economics']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeLimit: {
    type: Number,
    default: 180, // 3 minutes in seconds
    required: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number, // Index of correct option (0-3)
      required: true,
      min: 0,
      max: 3
    },
    points: {
      type: Number,
      default: 10
    },
    explanation: String
  }],
  totalPoints: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // CBSE Syllabus Mapping
  syllabusMapping: {
    cbseGrade: String,
    cbseSubject: String,
    cbseUnit: String,
    cbseChapter: String,
    cbseTopic: String,
    learningOutcomes: [String],
    competencyLevel: {
      type: String,
      enum: ['knowledge', 'understanding', 'application', 'analysis', 'synthesis', 'evaluation']
    }
  }
}, {
  timestamps: true
});

// Indexes
quizSchema.index({ grade: 1, subject: 1, isActive: 1 });
quizSchema.index({ difficulty: 1 });

// Calculate total points before saving
quizSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 10), 0);
  }
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);
