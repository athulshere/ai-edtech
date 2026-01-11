const mongoose = require('mongoose');

const historicalJourneySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  era: {
    type: String, // e.g., "Ancient India", "Mughal Empire", "British Raj", "Independence Movement"
    required: true
  },
  timePeriod: {
    start: Number, // Year
    end: Number
  },
  grade: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    enum: ['History', 'Social Studies', 'Geography', 'EVS'],
    default: 'History'
  },

  // The immersive story structure - using Mixed type for flexibility
  story: mongoose.Schema.Types.Mixed,

  // Assessment through the journey
  embeddeAssessment: mongoose.Schema.Types.Mixed,

  // Gamification
  rewards: mongoose.Schema.Types.Mixed,

  // Metadata
  estimatedDuration: Number, // minutes
  difficulty: {
    type: String,
    enum: ['easy', 'beginner', 'intermediate', 'medium', 'advanced', 'hard']
  },

  prerequisiteKnowledge: [String],
  relatedJourneys: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HistoricalJourney'
  }],

  // Creator and curriculum alignment
  curriculumAlignment: {
    topics: [String],
    learningObjectives: [String],
    ncertChapters: [String]
  },

  isActive: {
    type: Boolean,
    default: true
  },

  stats: {
    timesPlayed: { type: Number, default: 0 },
    averageCompletionTime: { type: Number, default: 0 },
    averageEngagementScore: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  },

  // CBSE Syllabus Mapping
  syllabusMapping: {
    cbseGrade: String,
    cbseUnit: String,
    cbseChapters: [String],
    historicalPeriod: String,
    geographicalContext: String,
    keyFigures: [String],
    learningObjectives: [String],
    competencyLevel: {
      type: String,
      enum: ['knowledge', 'understanding', 'application', 'analysis', 'synthesis', 'evaluation']
    }
  }
}, {
  timestamps: true
});

// Indexes
historicalJourneySchema.index({ grade: 1, subject: 1 });
historicalJourneySchema.index({ era: 1 });

module.exports = mongoose.model('HistoricalJourney', historicalJourneySchema);
