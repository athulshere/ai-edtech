const express = require('express');
const {
  uploadAndAnalyze,
  getAssessment,
  getStudentAssessments,
  generatePersonalizedTest
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');
const { upload, errorHandler } = require('../middleware/upload');

const router = express.Router();

router.post('/upload', protect, upload.single('image'), uploadAndAnalyze);
router.get('/:id', protect, getAssessment);
router.get('/student/:studentId', protect, getStudentAssessments);
router.post('/personalized-test', protect, generatePersonalizedTest);

router.use(errorHandler);

module.exports = router;
