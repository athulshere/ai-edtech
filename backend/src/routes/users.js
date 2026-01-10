const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  resetUserPassword,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// GET /api/users - Get all users with filtering and pagination
router.get('/', getAllUsers);

// POST /api/users - Create a new user (teacher, parent, student)
router.post('/', createUser);

// PUT /api/users/:id - Update user details
router.put('/:id', updateUser);

// POST /api/users/:id/deactivate - Deactivate user (soft delete)
router.post('/:id/deactivate', deactivateUser);

// POST /api/users/:id/reactivate - Reactivate user
router.post('/:id/reactivate', reactivateUser);

// POST /api/users/:id/reset-password - Reset user password
router.post('/:id/reset-password', resetUserPassword);

module.exports = router;
