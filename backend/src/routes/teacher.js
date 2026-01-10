const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getMyStudents,
  getStudentProfile,
  getClassAnalytics
} = require('../controllers/teacherController');

// All teacher routes require authentication and teacher role
router.use(protect);
router.use(authorize(['teacher', 'admin']));

// Dashboard
router.get('/dashboard', getDashboard);

// Students
router.get('/students', getMyStudents);
router.get('/students/:studentId', getStudentProfile);

// Analytics
router.get('/analytics/class/:classId', getClassAnalytics);

module.exports = router;
