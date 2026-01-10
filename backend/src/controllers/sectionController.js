const Section = require('../models/Section');
const Class = require('../models/Class');
const Student = require('../models/Student');

// @desc    Create new section
// @route   POST /api/sections
// @access  Admin only
const createSection = async (req, res) => {
  try {
    const { classId, name, classTeacher, maxStudents, roomNumber, floor } = req.body;
    const schoolId = req.user.schoolId;

    // Verify class exists
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if section already exists for this class
    const existingSection = await Section.findOne({
      classId,
      name: name.toUpperCase()
    });

    if (existingSection) {
      return res.status(400).json({
        success: false,
        message: 'Section already exists for this class'
      });
    }

    const section = await Section.create({
      schoolId,
      classId,
      name: name.toUpperCase(),
      code: `${classDoc.code}-${name.toUpperCase()}`,
      classTeacher,
      maxStudents,
      roomNumber,
      floor
    });

    await section.populate('classTeacher', 'firstName lastName email');

    res.status(201).json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Create Section Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all sections for a class
// @route   GET /api/sections?classId=xxx
// @access  Private
const getSections = async (req, res) => {
  try {
    const { classId } = req.query;
    const schoolId = req.user.schoolId;

    let query = { schoolId, isActive: true };

    if (classId) {
      query.classId = classId;
    }

    const sections = await Section.find(query)
      .populate('classId', 'name code level')
      .populate('classTeacher', 'firstName lastName email')
      .sort({ classId: 1, name: 1 });

    // Get student counts
    const sectionsWithCounts = await Promise.all(
      sections.map(async (section) => {
        const studentCount = await Student.countDocuments({
          sectionId: section._id,
          isActive: true
        });

        return {
          ...section.toObject(),
          studentCount
        };
      })
    );

    res.json({
      success: true,
      count: sectionsWithCounts.length,
      data: sectionsWithCounts
    });
  } catch (error) {
    console.error('Get Sections Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single section
// @route   GET /api/sections/:id
// @access  Private
const getSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate('classId', 'name code level')
      .populate('classTeacher', 'firstName lastName email phoneNumber');

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    // Get students in this section
    const students = await Student.find({
      sectionId: section._id,
      isActive: true
    })
      .select('firstName lastName studentId rollNumber profileImage')
      .sort({ rollNumber: 1 });

    res.json({
      success: true,
      data: {
        ...section.toObject(),
        students
      }
    });
  } catch (error) {
    console.error('Get Section Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update section
// @route   PUT /api/sections/:id
// @access  Admin only
const updateSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('classTeacher', 'firstName lastName email');

    res.json({
      success: true,
      data: updatedSection
    });
  } catch (error) {
    console.error('Update Section Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete section
// @route   DELETE /api/sections/:id
// @access  Admin only
const deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    // Check if section has students
    const studentCount = await Student.countDocuments({
      sectionId: section._id,
      isActive: true
    });

    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete section with ${studentCount} active students`
      });
    }

    // Soft delete
    section.isActive = false;
    await section.save();

    res.json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (error) {
    console.error('Delete Section Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createSection,
  getSections,
  getSection,
  updateSection,
  deleteSection
};
