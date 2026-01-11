const mongoose = require('mongoose');

const studentProgressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    enum: ['Mathematics', 'Science', 'English', 'Social Studies', 'EVS', 'Hindi', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Political Science', 'Economics'],
    required: true
  },
  grade: {
    type: String,
    required: true
  },

  // Topic-wise mastery tracking
  topicMastery: [{
    topic: {
      type: String,
      required: true
    },
    syllabusReference: String, // CBSE chapter/unit reference
    masteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    lastAssessed: Date,
    totalAttempts: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    averageScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    timeSpentMinutes: {
      type: Number,
      default: 0
    }
  }],

  // Quiz performance
  quizStats: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    bestScore: {
      type: Number,
      default: 0
    },
    topicsStrong: [String],
    topicsWeak: [String],
    improvementTrend: {
      type: String,
      enum: ['improving', 'stable', 'declining', 'insufficient_data'],
      default: 'insufficient_data'
    }
  },

  // Game performance
  gameStats: {
    totalGamesPlayed: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    favoriteGameType: String,
    completionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    timeSpentMinutes: {
      type: Number,
      default: 0
    }
  },

  // Historical journey performance
  journeyStats: {
    totalJourneysStarted: {
      type: Number,
      default: 0
    },
    totalJourneysCompleted: {
      type: Number,
      default: 0
    },
    averageEngagementScore: {
      type: Number,
      default: 0
    },
    historicalPeriodsExplored: [String]
  },

  // Time series data for trends
  performanceTimeline: [{
    date: {
      type: Date,
      default: Date.now
    },
    activityType: {
      type: String,
      enum: ['quiz', 'game', 'journey', 'assessment']
    },
    score: Number,
    percentage: Number,
    topic: String
  }],

  // Predictions and recommendations
  predictions: {
    atRiskTopics: [String],
    recommendedNextTopics: [String],
    estimatedExamReadiness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    lastUpdated: Date
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
studentProgressSchema.index({ studentId: 1, subject: 1, grade: 1 });
studentProgressSchema.index({ 'topicMastery.topic': 1 });
studentProgressSchema.index({ lastUpdated: -1 });
studentProgressSchema.index({ studentId: 1, lastUpdated: -1 });

// Update lastUpdated on save
studentProgressSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Helper method to get topic mastery
studentProgressSchema.methods.getTopicMastery = function(topic) {
  return this.topicMastery.find(tm => tm.topic === topic);
};

// Helper method to update topic mastery
studentProgressSchema.methods.updateTopicMastery = function(topic, score, timeSpent = 0) {
  const existingTopic = this.topicMastery.find(tm => tm.topic === topic);

  if (existingTopic) {
    // Update existing topic
    existingTopic.totalAttempts += 1;
    existingTopic.lastAssessed = new Date();
    existingTopic.timeSpentMinutes += timeSpent;

    // Calculate new average score
    existingTopic.averageScore = ((existingTopic.averageScore * (existingTopic.totalAttempts - 1)) + score) / existingTopic.totalAttempts;

    // Calculate success rate (consider >60% as success)
    const successes = existingTopic.averageScore > 60 ? existingTopic.totalAttempts : Math.floor(existingTopic.totalAttempts * (existingTopic.averageScore / 100));
    existingTopic.successRate = (successes / existingTopic.totalAttempts) * 100;

    // Update mastery level (weighted: 60% average score + 40% success rate)
    existingTopic.masteryLevel = (existingTopic.averageScore * 0.6) + (existingTopic.successRate * 0.4);
  } else {
    // Add new topic
    this.topicMastery.push({
      topic,
      masteryLevel: score * 0.8, // Initial mastery slightly lower than first score
      lastAssessed: new Date(),
      totalAttempts: 1,
      successRate: score > 60 ? 100 : 0,
      averageScore: score,
      timeSpentMinutes: timeSpent
    });
  }
};

// Helper method to add performance timeline entry
studentProgressSchema.methods.addTimelineEntry = function(activityType, score, percentage, topic) {
  this.performanceTimeline.push({
    date: new Date(),
    activityType,
    score,
    percentage,
    topic
  });

  // Keep only last 100 entries
  if (this.performanceTimeline.length > 100) {
    this.performanceTimeline = this.performanceTimeline.slice(-100);
  }
};

module.exports = mongoose.model('StudentProgress', studentProgressSchema);
