const express = require('express');
const router = express.Router();
const {
  getMyChildren,
  getChildById,
  getChildAssessments,
  getDashboardSummary
} = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and parent-only
router.use(protect);
router.use(authorize('parent'));

// Parent routes
router.get('/dashboard', getDashboardSummary);
router.get('/children', getMyChildren);
router.get('/children/:id', getChildById);
router.get('/children/:id/assessments', getChildAssessments);

module.exports = router;
