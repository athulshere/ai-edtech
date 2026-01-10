const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  gameType: {
    type: String,
    enum: [
      'word_puzzle',
      'sentence_builder',
      'molecule_matcher',
      'math_race',
      'map_conquest',
      'timeline_builder',
      'equation_solver',
      'spelling_bee',
      'pattern_finder',
      'memory_match',
      'drag_drop',
      'multiple_choice_race',
      'fill_blanks',
      'sorting_game',
      'matching_pairs'
    ],
    required: true
  },
  subject: {
    type: String,
    enum: ['Mathematics', 'Science', 'English', 'Social Studies', 'General Knowledge', 'Chemistry', 'Physics', 'Biology', 'Geography', 'History'],
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  syllabusTopic: String, // Topic from syllabus this game covers

  // Game Configuration
  gameConfig: {
    // For word puzzles, sentence builders
    words: [String],
    sentences: [String],
    correctOrder: [Number],

    // For matching games (molecules, pairs, etc)
    pairs: [{
      left: String,
      right: String,
      imageUrl: String
    }],

    // For multiple choice
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
      points: { type: Number, default: 10 }
    }],

    // For math/equation games
    equations: [{
      problem: String,
      answer: String,
      steps: [String]
    }],

    // For map/geography games
    mapData: {
      regions: [{
        name: String,
        coordinates: [Number],
        facts: [String]
      }],
      challenges: [String]
    },

    // For timeline/history games
    events: [{
      event: String,
      year: Number,
      description: String,
      imageUrl: String
    }],

    // For sorting/categorization games
    categories: [{
      name: String,
      items: [String]
    }],

    // For fill in the blanks
    passages: [{
      text: String,
      blanks: [{
        position: Number,
        correctAnswer: String,
        options: [String]
      }]
    }],

    // For pattern finding
    patterns: [{
      sequence: [String],
      nextItems: [String],
      correctNext: Number
    }]
  },

  // Scoring and Time
  timeLimit: {
    type: Number, // in seconds
    default: 300 // 5 minutes
  },
  maxScore: {
    type: Number,
    default: 100
  },
  passingScore: {
    type: Number,
    default: 60
  },

  // Gamification
  pointsReward: {
    type: Number,
    default: 20
  },
  badgeReward: String,

  // AI Generation metadata
  generatedFrom: {
    syllabusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Syllabus'
    },
    aiModel: String,
    generatedAt: Date
  },

  // Usage stats
  stats: {
    timesPlayed: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    averageTimeSpent: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
gameSchema.index({ grade: 1, subject: 1 });
gameSchema.index({ gameType: 1 });
gameSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Game', gameSchema);
