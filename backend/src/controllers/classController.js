const Class = require('../models/Class');
const Section = require('../models/Section');
const Student = require('../models/Student');

// @desc    Create new class
// @route   POST /api/classes
// @access  Admin only
const createClass = async (req, res) => {
  try {
    const { name, code, level, academicYear, maxStudents } = req.body;
    const schoolId = req.user.schoolId;

    // Check if class already exists for this academic year
    const existingClass = await Class.findOne({
      schoolId,
      code: code.toUpperCase(),
      'academicYear.start': academicYear.start,
      'academicYear.end': academicYear.end
    });

    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: 'Class already exists for this academic year'
      });
    }

    const classDoc = await Class.create({
      schoolId,
      name,
      code: code.toUpperCase(),
      level,
      academicYear,
      maxStudents
    });

    res.status(201).json({
      success: true,
      data: classDoc
    });
  } catch (error) {
    console.error('Create Class Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all classes for a school
// @route   GET /api/classes
// @access  Private
const getClasses = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { academicYear } = req.query;

    let query = { schoolId, isActive: true };

    if (academicYear) {
      const [start, end] = academicYear.split('-');
      query['academicYear.start'] = parseInt(start);
      query['academicYear.end'] = parseInt(end);
    }

    const classes = await Class.find(query).sort({ level: 1 });

    // Get section counts for each class
    const classesWithSections = await Promise.all(
      classes.map(async (classDoc) => {
        const sectionCount = await Section.countDocuments({
          classId: classDoc._id,
          isActive: true
        });

        const studentCount = await Student.countDocuments({
          classId: classDoc._id,
          isActive: true
        });

        return {
          ...classDoc.toObject(),
          sectionCount,
          studentCount
        };
      })
    );

    res.json({
      success: true,
      count: classesWithSections.length,
      data: classesWithSections
    });
  } catch (error) {
    console.error('Get Classes Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Private
const getClass = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Get sections for this class
    const sections = await Section.find({
      classId: classDoc._id,
      isActive: true
    }).populate('classTeacher', 'firstName lastName email');

    res.json({
      success: true,
      data: {
        ...classDoc.toObject(),
        sections
      }
    });
  } catch (error) {
    console.error('Get Class Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Admin only
const updateClass = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: updatedClass
    });
  } catch (error) {
    console.error('Update Class Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Admin only
const deleteClass = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if class has students
    const studentCount = await Student.countDocuments({
      classId: classDoc._id,
      isActive: true
    });

    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete class with ${studentCount} active students`
      });
    }

    // Soft delete
    classDoc.isActive = false;
    await classDoc.save();

    // Also deactivate sections
    await Section.updateMany(
      { classId: classDoc._id },
      { isActive: false }
    );

    res.json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Delete Class Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass
};
