const School = require('../models/School');

// @desc    Create new school
// @route   POST /api/schools
// @access  Super Admin (for now, any authenticated user can create for demo)
const createSchool = async (req, res) => {
  try {
    const {
      name,
      code,
      type,
      email,
      phone,
      website,
      address,
      principal,
      establishedYear,
      affiliation,
      affiliationNumber
    } = req.body;

    // Check if school code already exists
    if (code) {
      const existingSchool = await School.findOne({ code: code.toUpperCase() });
      if (existingSchool) {
        return res.status(400).json({
          success: false,
          message: 'School code already exists'
        });
      }
    }

    const school = await School.create({
      name,
      code: code || undefined,
      type,
      email,
      phone,
      website,
      address,
      principal,
      establishedYear,
      affiliation,
      affiliationNumber
    });

    res.status(201).json({
      success: true,
      data: school
    });
  } catch (error) {
    console.error('Create School Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get school by ID
// @route   GET /api/schools/:id
// @access  Private (same school)
const getSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.json({
      success: true,
      data: school
    });
  } catch (error) {
    console.error('Get School Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update school
// @route   PUT /api/schools/:id
// @access  Admin only
const updateSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    const updatedSchool = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: updatedSchool
    });
  } catch (error) {
    console.error('Update School Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all schools (for super admin)
// @route   GET /api/schools
// @access  Private
const getSchools = async (req, res) => {
  try {
    const schools = await School.find({ isActive: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: schools.length,
      data: schools
    });
  } catch (error) {
    console.error('Get Schools Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update school settings
// @route   PUT /api/schools/:id/settings
// @access  Admin only
const updateSchoolSettings = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    school.settings = {
      ...school.settings,
      ...req.body
    };

    await school.save();

    res.json({
      success: true,
      data: school
    });
  } catch (error) {
    console.error('Update Settings Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createSchool,
  getSchool,
  updateSchool,
  getSchools,
  updateSchoolSettings
};
