const Student = require('../models/Student');
const Assessment = require('../models/Assessment');
const QuizAttempt = require('../models/QuizAttempt');

/**
 * @desc    Get all children for logged-in parent
 * @route   GET /api/parent/children
 * @access  Private/Parent
 */
const getMyChildren = async (req, res) => {
  try {
    const children = await Student.find({
      parentIds: req.user._id,
      isActive: true
    })
      .populate('schoolId', 'name code address')
      .populate('classId', 'name')
      .populate('sectionId', 'name')
      .sort({ grade: 1, firstName: 1 });

    res.status(200).json({
      success: true,
      data: children
    });

  } catch (error) {
    console.error('Get children error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch children data'
    });
  }
};

/**
 * @desc    Get single child details
 * @route   GET /api/parent/children/:id
 * @access  Private/Parent
 */
const getChildById = async (req, res) => {
  try {
    const child = await Student.findOne({
      _id: req.params.id,
      parentIds: req.user._id,
      isActive: true
    })
      .populate('schoolId', 'name code address email phone')
      .populate('classId', 'name')
      .populate('sectionId', 'name');

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or you do not have access'
      });
    }

    res.status(200).json({
      success: true,
      data: child
    });

  } catch (error) {
    console.error('Get child error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch child details'
    });
  }
};

/**
 * @desc    Get assessments for a specific child
 * @route   GET /api/parent/children/:id/assessments
 * @access  Private/Parent
 */
const getChildAssessments = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, status, limit = 20, page = 1 } = req.query;

    // Verify child belongs to parent
    const child = await Student.findOne({
      _id: id,
      parentIds: req.user._id,
      isActive: true
    });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or you do not have access'
      });
    }

    // Build query
    const query = { studentId: id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch both paper assessments and quiz attempts
    const assessments = await Assessment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    // Fetch quiz attempts (completed only)
    const quizQuery = { studentId: id, status: 'completed' };
    const quizAttempts = await QuizAttempt.find(quizQuery)
      .populate('quizId', 'title subject difficulty')
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-answers');

    // Transform quiz attempts to match assessment format
    const quizAssessments = quizAttempts.map(attempt => ({
      _id: attempt._id,
      studentId: attempt.studentId,
      subject: attempt.quizId?.subject || 'Unknown',
      type: 'quiz',
      title: attempt.quizId?.title || 'Quiz',
      score: attempt.score,
      totalMarks: attempt.totalPoints,
      percentage: attempt.percentage,
      status: 'completed',
      createdAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      timeTaken: attempt.timeTaken,
      difficulty: attempt.quizId?.difficulty,
      gamificationRewards: attempt.gamificationRewards
    }));

    // Combine both types
    const allAssessments = [...assessments, ...quizAssessments]
      .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt))
      .slice(0, parseInt(limit));

    const totalAssessments = await Assessment.countDocuments(query);
    const totalQuizAttempts = await QuizAttempt.countDocuments(quizQuery);
    const total = totalAssessments + totalQuizAttempts;

    res.status(200).json({
      success: true,
      data: {
        assessments: allAssessments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get child assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessments'
    });
  }
};

/**
 * @desc    Get dashboard summary for parent
 * @route   GET /api/parent/dashboard
 * @access  Private/Parent
 */
const getDashboardSummary = async (req, res) => {
  try {
    // Get all children
    const children = await Student.find({
      parentIds: req.user._id,
      isActive: true
    })
      .populate('schoolId', 'name')
      .populate('classId', 'name')
      .populate('sectionId', 'name')
      .lean();

    // Get assessment statistics for each child
    const childrenWithStats = await Promise.all(
      children.map(async (child) => {
        const assessmentStats = await Assessment.aggregate([
          { $match: { studentId: child._id } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);

        const recentAssessments = await Assessment.find({
          studentId: child._id
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('subject topic status createdAt aiAnalysis.overallScore');

        // Calculate statistics
        const stats = {
          total: 0,
          completed: 0,
          processing: 0,
          failed: 0
        };

        assessmentStats.forEach(stat => {
          stats.total += stat.count;
          stats[stat._id] = stat.count;
        });

        return {
          ...child,
          assessmentStats: stats,
          recentAssessments,
          strengths: child.learningProfile?.strengths || [],
          weaknesses: child.learningProfile?.weaknesses || []
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        children: childrenWithStats,
        totalChildren: children.length
      }
    });

  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};

module.exports = {
  getMyChildren,
  getChildById,
  getChildAssessments,
  getDashboardSummary
};
