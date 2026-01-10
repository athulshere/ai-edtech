const express = require('express');
const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  getStudentProgress
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('parent', 'teacher', 'admin'), createStudent);
router.get('/', protect, getStudents);
router.get('/:id', protect, getStudent);
router.put('/:id', protect, updateStudent);
router.get('/:studentId/progress', protect, getStudentProgress);

module.exports = router;
