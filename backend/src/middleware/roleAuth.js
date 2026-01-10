// Role-based authorization middleware

/**
 * Check if user has one of the allowed roles
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'teacher', 'parent')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

/**
 * Check if user belongs to the same school
 */
const sameSchool = (req, res, next) => {
  const { schoolId } = req.params;

  if (!req.user.schoolId) {
    return res.status(403).json({
      success: false,
      message: 'User is not associated with any school'
    });
  }

  if (schoolId && req.user.schoolId.toString() !== schoolId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this school\'s data'
    });
  }

  next();
};

/**
 * Admin only middleware
 */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'This route is restricted to administrators only'
    });
  }
  next();
};

/**
 * Teacher or admin middleware
 */
const teacherOrAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'teacher'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'This route is restricted to teachers and administrators'
    });
  }
  next();
};

/**
 * Parent access to own children only
 */
const parentAccess = async (req, res, next) => {
  const { studentId } = req.params;

  if (req.user.role === 'admin' || req.user.role === 'teacher') {
    // Admins and teachers have access to all students
    return next();
  }

  if (req.user.role === 'parent') {
    const Student = require('../models/Student');

    try {
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      if (!student.parentIds.some(p => p.toString() === req.user._id.toString())) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this student\'s data'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error verifying parent access'
      });
    }
  } else {
    return res.status(403).json({
      success: false,
      message: 'Invalid user role'
    });
  }
};

module.exports = {
  authorize,
  sameSchool,
  adminOnly,
  teacherOrAdmin,
  parentAccess
};
