const mongoose = require('mongoose');

const historicalJourneyAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  journeyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HistoricalJourney',
    required: true,
    index: true
  },

  // Progress tracking
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },

  currentChapter: {
    type: Number,
    default: 0
  },

  // Track all chapters visited (for branching paths)
  chaptersVisited: [{
    chapterNumber: Number,
    visitedAt: Date,
    timeSpent: Number // seconds
  }],

  // Decisions made throughout the journey
  decisionsRecord: [{
    chapterNumber: Number,
    decisionIndex: Number,
    optionChosen: Number,
    wasHistoricallyAccurate: Boolean,
    pointsEarned: Number,
    timestamp: Date
  }],

  // Challenge results
  challengeResults: [{
    chapterNumber: Number,
    challengeIndex: Number,
    challengeType: String,
    success: Boolean,
    attempts: Number,
    pointsEarned: Number,
    timeSpent: Number
  }],

  // Discoveries collected
  discoveriesCollected: [{
    chapterNumber: { type: Number },
    discoveryIndex: { type: Number },
    discoveredAt: { type: Date },
    type: { type: String },
    name: { type: String }
  }],

  // Learning assessment
  knowledgeAcquired: [{
    concept: String,
    chapterNumber: Number,
    confidence: {
      type: String,
      enum: ['introduced', 'reinforced', 'mastered'],
      default: 'introduced'
    }
  }],

  // Scoring
  totalPoints: {
    type: Number,
    default: 0
  },

  breakdown: {
    decisionPoints: { type: Number, default: 0 },
    challengePoints: { type: Number, default: 0 },
    completionBonus: { type: Number, default: 0 },
    accuracyBonus: { type: Number, default: 0 }
  },

  // Metrics
  totalTimeTaken: {
    type: Number, // seconds
    default: 0
  },

  startedAt: {
    type: Date,
    default: Date.now
  },

  completedAt: Date,

  // Path taken (for branching narrative analysis)
  narrativePath: [Number], // Array of chapter numbers in order

  // Gamification rewards
  gamificationRewards: {
    pointsAwarded: { type: Number, default: 0 },
    badgesEarned: [{
      badgeId: String,
      name: String,
      earnedAt: Date
    }],
    achievementsUnlocked: [{
      achievementId: String,
      name: String,
      unlockedAt: Date
    }],
    levelProgression: {
      startLevel: Number,
      endLevel: Number,
      levelsGained: Number
    }
  },

  // Historical accuracy score
  historicalAccuracyRate: {
    type: Number, // percentage
    default: 0
  },

  // Engagement metrics
  engagementScore: {
    type: Number, // 0-100
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
historicalJourneyAttemptSchema.index({ studentId: 1, journeyId: 1 });
historicalJourneyAttemptSchema.index({ status: 1 });
historicalJourneyAttemptSchema.index({ completedAt: 1 });

// Method to calculate historical accuracy
historicalJourneyAttemptSchema.methods.calculateHistoricalAccuracy = function() {
  const accurateDecisions = this.decisionsRecord.filter(d => d.wasHistoricallyAccurate).length;
  const totalDecisions = this.decisionsRecord.length;
  return totalDecisions > 0 ? (accurateDecisions / totalDecisions) * 100 : 0;
};

// Method to calculate engagement score
historicalJourneyAttemptSchema.methods.calculateEngagementScore = function() {
  let score = 0;

  // Chapters completion (40 points)
  score += (this.chaptersVisited.length / 10) * 40;

  // Challenges attempted (30 points)
  const successfulChallenges = this.challengeResults.filter(c => c.success).length;
  score += (successfulChallenges / 5) * 30;

  // Discoveries collected (20 points)
  score += (this.discoveriesCollected.length / 5) * 20;

  // Completion (10 points)
  if (this.status === 'completed') score += 10;

  return Math.min(100, Math.round(score));
};

module.exports = mongoose.model('HistoricalJourneyAttempt', historicalJourneyAttemptSchema);
