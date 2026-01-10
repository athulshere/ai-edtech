const Student = require('../models/Student');
const User = require('../models/User');
const School = require('../models/School');
const Class = require('../models/Class');
const Section = require('../models/Section');
const Assessment = require('../models/Assessment');
const crypto = require('crypto');
const { generateUsername, generatePassword } = require('../utils/credentialsGenerator');

const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      grade,
      subjects,
      classId,
      sectionId,
      parentId,
      // Parent details (if creating new parent)
      parentEmail,
      parentFirstName,
      parentLastName,
      parentPhone,
      createNewParent // Flag to indicate whether to create new parent
    } = req.body;

    let finalParentId = parentId;
    let parentPassword = null;
    let parentCreated = false;

    // Get schoolId from the user
    const schoolId = req.user.schoolId;

    // Handle parent creation/linking based on role and request
    if (req.user.role === 'parent') {
      // If parent is creating student, use their own ID
      finalParentId = req.user._id;
    } else if (req.user.role === 'admin' || req.user.role === 'teacher') {
      // Admin or Teacher creating student

      if (createNewParent && parentEmail) {
        // Create new parent account

        // Check if parent with this email already exists
        const existingParent = await User.findOne({ email: parentEmail });

        if (existingParent) {
          if (existingParent.role !== 'parent') {
            return res.status(400).json({
              message: `User with email ${parentEmail} already exists but is not a parent`
            });
          }
          // Use existing parent
          finalParentId = existingParent._id;
        } else {
          // Create new parent account
          const parentFName = parentFirstName || 'Parent';
          const parentLName = parentLastName || lastName;

          // Generate username and password for parent
          const parentUsername = await generateUsername(parentFName, parentLName, 'parent', null);
          parentPassword = generatePassword(parentFName, parentLName, 'parent', null);

          const newParent = await User.create({
            firstName: parentFName,
            lastName: parentLName,
            email: parentEmail,
            username: parentUsername,
            password: parentPassword,
            role: 'parent',
            phoneNumber: parentPhone || '',
            schoolId: schoolId,
            mustChangePassword: true,
            parentData: {
              children: [] // Will be updated after student creation
            }
          });

          finalParentId = newParent._id;
          parentCreated = true;
        }
      } else if (parentId) {
        // Use provided parent ID
        const parent = await User.findById(parentId);
        if (!parent || parent.role !== 'parent') {
          return res.status(400).json({ message: 'Invalid parent ID' });
        }
        finalParentId = parentId;
      } else {
        return res.status(400).json({
          message: 'Either provide parentId or parent details (email, name) to create new parent'
        });
      }
    }

    // If classId and sectionId not provided, try to find/create default ones
    let finalClassId = classId;
    let finalSectionId = sectionId;

    if (!finalClassId || !finalSectionId) {
      // Try to find a class matching the grade
      const gradeNumber = parseInt(grade.replace(/\D/g, '')) || parseInt(grade);

      let classDoc = await Class.findOne({
        schoolId,
        level: gradeNumber,
        isActive: true
      });

      // If no class exists for this grade, create one
      if (!classDoc) {
        classDoc = await Class.create({
          schoolId,
          name: `Grade ${gradeNumber}`,
          code: `G${gradeNumber}`,
          level: gradeNumber,
          academicYear: {
            start: new Date().getFullYear(),
            end: new Date().getFullYear() + 1
          },
          capacity: 50
        });
      }

      finalClassId = classDoc._id;

      // Try to find section A for this class
      let sectionDoc = await Section.findOne({
        classId: finalClassId,
        name: 'A',
        isActive: true
      });

      // If no section exists, create section A
      if (!sectionDoc) {
        sectionDoc = await Section.create({
          schoolId,
          classId: finalClassId,
          name: 'A',
          code: `${classDoc.code}-A`,
          capacity: 50
        });
      }

      finalSectionId = sectionDoc._id;
    }

    const student = await Student.create({
      firstName,
      lastName,
      dateOfBirth,
      grade,
      parentId: finalParentId,
      schoolId,
      classId: finalClassId,
      sectionId: finalSectionId,
      teacherIds: req.user.role === 'teacher' ? [req.user._id] : [],
      subjects: subjects || [],
      learningProfile: {
        strengths: [],
        weaknesses: [],
        commonMistakePatterns: []
      }
    });

    // Update section student count
    await Section.findByIdAndUpdate(finalSectionId, {
      $inc: { currentStudents: 1 }
    });

    // Update parent's children array
    await User.findByIdAndUpdate(finalParentId, {
      $addToSet: { 'parentData.children': student._id }
    });

    // Prepare response
    const response = {
      message: 'Student created successfully',
      student: student
    };

    // If parent was created, include credentials
    if (parentCreated && parentPassword) {
      response.parentCreated = true;
      response.parentCredentials = {
        email: parentEmail,
        temporaryPassword: parentPassword,
        message: 'Share these credentials with the parent. They will be required to change the password on first login.'
      };
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Create Student Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'parent') {
      query.parentIds = req.user._id;
    }

    const students = await Student.find(query)
      .populate('parentIds', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    console.error('Get Students Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('parentIds', 'firstName lastName email phoneNumber');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.role === 'parent' && !student.parentIds.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get Student Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.role === 'parent' && !student.parentIds.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedUpdates = ['firstName', 'lastName', 'dateOfBirth', 'grade', 'subjects', 'profileImage'];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    const updatedStudent = await student.save();

    res.json(updatedStudent);
  } catch (error) {
    console.error('Update Student Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject, timeframe = '30' } = req.query;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.role === 'parent' && !student.parentIds.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - parseInt(timeframe));

    const query = {
      studentId,
      status: 'completed',
      createdAt: { $gte: dateFrom }
    };

    if (subject) {
      query.subject = subject;
    }

    const assessments = await Assessment.find(query).sort({ createdAt: 1 });

    const progressData = {
      totalAssessments: assessments.length,
      averageScore: 0,
      scoresTrend: [],
      mistakesByType: {},
      topWeaknesses: student.learningProfile.weaknesses.slice(0, 5),
      topStrengths: student.learningProfile.strengths.slice(0, 5),
      subjectPerformance: {}
    };

    if (assessments.length > 0) {
      const totalScore = assessments.reduce((sum, a) => sum + (a.aiAnalysis?.overallScore || 0), 0);
      progressData.averageScore = (totalScore / assessments.length).toFixed(2);

      progressData.scoresTrend = assessments.map(a => ({
        date: a.createdAt,
        score: a.aiAnalysis?.overallScore || 0,
        subject: a.subject
      }));

      assessments.forEach(assessment => {
        assessment.aiAnalysis?.mistakes?.forEach(mistake => {
          progressData.mistakesByType[mistake.mistakeType] =
            (progressData.mistakesByType[mistake.mistakeType] || 0) + 1;
        });

        if (!progressData.subjectPerformance[assessment.subject]) {
          progressData.subjectPerformance[assessment.subject] = {
            count: 0,
            totalScore: 0,
            averageScore: 0
          };
        }

        progressData.subjectPerformance[assessment.subject].count++;
        progressData.subjectPerformance[assessment.subject].totalScore += assessment.aiAnalysis?.overallScore || 0;
      });

      Object.keys(progressData.subjectPerformance).forEach(subject => {
        const perf = progressData.subjectPerformance[subject];
        perf.averageScore = (perf.totalScore / perf.count).toFixed(2);
      });
    }

    res.json(progressData);
  } catch (error) {
    console.error('Get Student Progress Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  getStudentProgress
};
