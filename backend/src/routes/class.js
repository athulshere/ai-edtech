const express = require('express');
const router = express.Router();
const {
  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass
} = require('../controllers/classController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');

// Routes
router.route('/')
  .post(protect, adminOnly, createClass)
  .get(protect, getClasses);

router.route('/:id')
  .get(protect, getClass)
  .put(protect, adminOnly, updateClass)
  .delete(protect, adminOnly, deleteClass);

module.exports = router;
