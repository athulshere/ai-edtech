const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  analyzeStudent,
  getStudentAlerts,
  getTeacherAlerts,
  acknowledgeAlert,
  resolveAlert,
  dismissAlert,
  bulkAnalyze
} = require('../controllers/alertController');

// All alert routes require authentication
router.use(protect);

// Teacher/Admin routes
router.get('/teacher', authorize(['teacher', 'admin']), getTeacherAlerts);
router.post('/bulk-analyze', authorize(['teacher', 'admin']), bulkAnalyze);

// Student-specific alerts
router.post('/analyze/:studentId', authorize(['parent', 'admin']), analyzeStudent);
router.get('/student/:studentId', authorize(['parent', 'admin']), getStudentAlerts);

// Alert actions
router.patch('/:alertId/acknowledge', authorize(['parent', 'admin']), acknowledgeAlert);
router.patch('/:alertId/resolve', authorize(['parent', 'admin']), resolveAlert);
router.patch('/:alertId/dismiss', authorize(['parent', 'admin']), dismissAlert);

module.exports = router;
