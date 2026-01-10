const { processStudentBulkUpload, generateCredentialsExcel } = require('../services/bulkUpload');
const Student = require('../models/Student');
const User = require('../models/User');

/**
 * @desc    Bulk upload students from Excel file
 * @route   POST /api/admin/students/bulk-upload
 * @access  Private/Admin
 */
const bulkUploadStudents = async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an Excel file'
      });
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid Excel file (.xls or .xlsx)'
      });
    }

    const schoolId = req.user.schoolId;
    const adminId = req.user._id;

    // Process the Excel file
    const results = await processStudentBulkUpload(req.file.buffer, schoolId, adminId);

    // Generate credentials Excel file
    let credentialsBuffer = null;
    if (results.success.length > 0) {
      credentialsBuffer = generateCredentialsExcel(results.success);
    }

    res.status(200).json({
      success: true,
      message: 'Bulk upload processed successfully',
      data: {
        summary: results.summary,
        successRecords: results.success,
        errorRecords: results.errors,
        credentialsFile: credentialsBuffer ? credentialsBuffer.toString('base64') : null
      }
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process bulk upload'
    });
  }
};

/**
 * @desc    Get all students for a school
 * @route   GET /api/admin/students
 * @access  Private/Admin
 */
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 50, grade, classId, search } = req.query;

    const query = { schoolId: req.user.schoolId };

    // Apply filters
    if (grade) {
      query.grade = grade;
    }
    if (classId) {
      query.classId = classId;
    }
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { registerNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const students = await Student.find(query)
      .populate('schoolId', 'name code')
      .populate('classId', 'name')
      .populate('sectionId', 'name')
      .populate('parentIds', 'firstName lastName email phoneNumber')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        students,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalStudents: total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

/**
 * @desc    Get single student details
 * @route   GET /api/admin/students/:id
 * @access  Private/Admin
 */
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId
    })
      .populate('schoolId', 'name code')
      .populate('classId', 'name')
      .populate('sectionId', 'name')
      .populate('parentIds', 'firstName lastName email phoneNumber');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student details'
    });
  }
};

/**
 * @desc    Update student details
 * @route   PUT /api/admin/students/:id
 * @access  Private/Admin
 */
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update allowed fields
    const allowedFields = [
      'firstName', 'lastName', 'dateOfBirth', 'grade', 'rollNumber',
      'classId', 'sectionId', 'subjects', 'profileImage'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student'
    });
  }
};

/**
 * @desc    Delete student
 * @route   DELETE /api/admin/students/:id
 * @access  Private/Admin
 */
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Remove student from parent's children list
    await User.updateMany(
      { _id: { $in: student.parentIds } },
      { $pull: { 'parentData.children': student._id } }
    );

    // Soft delete (set isActive to false)
    student.isActive = false;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student'
    });
  }
};

/**
 * @desc    Get all parents for a school
 * @route   GET /api/admin/parents
 * @access  Private/Admin
 */
const getAllParents = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;

    const query = {
      schoolId: req.user.schoolId,
      role: 'parent'
    };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const parents = await User.find(query)
      .populate('parentData.children', 'firstName lastName studentId grade')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        parents,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalParents: total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get parents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parents'
    });
  }
};

/**
 * @desc    Download sample Excel template for bulk upload
 * @route   GET /api/admin/students/template
 * @access  Private/Admin
 */
const downloadTemplate = async (req, res) => {
  try {
    const XLSX = require('xlsx');

    // Create sample data
    const sampleData = [
      {
        'First Name': 'John',
        'Last Name': 'Doe',
        'DOB': '15/01/2010',
        'Grade': '10',
        'Class': 'A',
        'Section': '1',
        'Register Number': '12345',
        'Roll Number': '15',
        'Admission Number': 'ADM2024001',
        'Parent Email': 'parent@example.com',
        'Parent Phone': '9876543210',
        'Parent First Name': 'Jane',
        'Parent Last Name': 'Doe',
        'Subjects': 'Math, Science, English, Social Studies',
        'Profile Image URL': ''
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=student_bulk_upload_template.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

  } catch (error) {
    console.error('Download template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate template'
    });
  }
};

module.exports = {
  bulkUploadStudents,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getAllParents,
  downloadTemplate
};
