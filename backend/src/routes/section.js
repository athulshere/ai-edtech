const express = require('express');
const router = express.Router();
const {
  createSection,
  getSections,
  getSection,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');

// Routes
router.route('/')
  .post(protect, adminOnly, createSection)
  .get(protect, getSections);

router.route('/:id')
  .get(protect, getSection)
  .put(protect, adminOnly, updateSection)
  .delete(protect, adminOnly, deleteSection);

module.exports = router;
