const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getGamesByGrade,
  getGame,
  startGame,
  submitGame,
  getStudentGameAttempts,
  getGameAttemptDetails,
  getGameLeaderboard
} = require('../controllers/gameController');

// All game routes require authentication
router.use(protect);

// Get games by grade
router.get('/grade/:grade', authorize(['parent', 'teacher', 'admin']), getGamesByGrade);

// Start a game
router.post('/start', authorize(['parent', 'teacher', 'admin']), startGame);

// Submit game
router.post('/submit/:attemptId', authorize(['parent', 'teacher', 'admin']), submitGame);

// Get student's game attempts
router.get('/student/:studentId/attempts', authorize(['parent', 'teacher', 'admin']), getStudentGameAttempts);

// Get game attempt details
router.get('/attempt/:attemptId', authorize(['parent', 'teacher', 'admin']), getGameAttemptDetails);

// Get game leaderboard
router.get('/leaderboard/:gameId', authorize(['parent', 'teacher', 'admin']), getGameLeaderboard);

// Get specific game (must be last to avoid conflicts)
router.get('/:gameId', authorize(['parent', 'teacher', 'admin']), getGame);

module.exports = router;
