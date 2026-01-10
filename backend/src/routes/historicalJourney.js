const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getJourneysByGrade,
  getJourney,
  startJourney,
  recordDecision,
  submitChallenge,
  recordDiscovery,
  updateChapterProgress,
  completeJourney,
  getStudentJourneyAttempts,
  getJourneyAttemptDetails
} = require('../controllers/historicalJourneyController');

// All routes require authentication
router.use(protect);

// Get journeys by grade
router.get('/grade/:grade', authorize(['parent', 'teacher', 'admin']), getJourneysByGrade);

// Start a journey
router.post('/start', authorize(['parent', 'teacher', 'admin']), startJourney);

// Record a decision
router.post('/decision/:attemptId', authorize(['parent', 'teacher', 'admin']), recordDecision);

// Submit challenge result
router.post('/challenge/:attemptId', authorize(['parent', 'teacher', 'admin']), submitChallenge);

// Record discovery
router.post('/discovery/:attemptId', authorize(['parent', 'teacher', 'admin']), recordDiscovery);

// Update chapter progress
router.post('/progress/:attemptId', authorize(['parent', 'teacher', 'admin']), updateChapterProgress);

// Complete journey
router.post('/complete/:attemptId', authorize(['parent', 'teacher', 'admin']), completeJourney);

// Get student's journey attempts
router.get('/student/:studentId/attempts', authorize(['parent', 'teacher', 'admin']), getStudentJourneyAttempts);

// Get journey attempt details
router.get('/attempt/:attemptId', authorize(['parent', 'teacher', 'admin']), getJourneyAttemptDetails);

// Get specific journey (must be last to avoid conflicts)
router.get('/:journeyId', authorize(['parent', 'teacher', 'admin']), getJourney);

module.exports = router;
