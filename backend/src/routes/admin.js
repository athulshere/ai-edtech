const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  bulkUploadStudents,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getAllParents,
  downloadTemplate
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xls, .xlsx) are allowed'));
    }
  }
});

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// Student management routes
router.post('/students/bulk-upload', upload.single('file'), bulkUploadStudents);
router.get('/students/template', downloadTemplate);
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Parent management routes
router.get('/parents', getAllParents);

module.exports = router;
