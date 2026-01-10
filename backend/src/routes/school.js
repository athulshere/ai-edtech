const express = require('express');
const router = express.Router();
const {
  createSchool,
  getSchool,
  updateSchool,
  getSchools,
  updateSchoolSettings
} = require('../controllers/schoolController');
const { protect } = require('../middleware/auth');
const { adminOnly, sameSchool } = require('../middleware/roleAuth');

// Routes
router.route('/')
  .post(protect, createSchool)  // For now, any authenticated user can create (demo)
  .get(protect, getSchools);

router.route('/:id')
  .get(protect, getSchool)
  .put(protect, adminOnly, updateSchool);

router.route('/:id/settings')
  .put(protect, adminOnly, updateSchoolSettings);

module.exports = router;
