const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getQuizzesByGrade,
  getQuiz,
  startQuiz,
  submitQuiz,
  getStudentQuizAttempts,
  getQuizAttemptDetails
} = require('../controllers/quizController');

// All quiz routes require authentication
router.use(protect);

// Get quizzes by grade (allow parent and admin)
router.get('/grade/:grade', authorize(['parent', 'admin']), getQuizzesByGrade);

// Start a quiz
router.post('/start', authorize(['parent', 'admin']), startQuiz);

// Submit quiz answers
router.post('/submit/:attemptId', authorize(['parent', 'admin']), submitQuiz);

// Get student's quiz attempts
router.get('/student/:studentId/attempts', authorize(['parent', 'admin']), getStudentQuizAttempts);

// Get quiz attempt details
router.get('/attempt/:attemptId', authorize(['parent', 'admin']), getQuizAttemptDetails);

// Get specific quiz (must be last to avoid conflicts)
router.get('/:quizId', authorize(['parent', 'admin']), getQuiz);

module.exports = router;
