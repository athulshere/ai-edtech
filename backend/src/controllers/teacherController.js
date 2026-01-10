const Student = require('../models/Student');
const Assessment = require('../models/Assessment');
const QuizAttempt = require('../models/QuizAttempt');
const Alert = require('../models/Alert');
const User = require('../models/User');

/**
 * Get teacher dashboard overview
 */
const getDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }

    const { schoolId, teacherData } = teacher;
    const { classes, sections } = teacherData || {};

    // Get all students in teacher's classes
    const studentQuery = { schoolId };
    if (classes && classes.length > 0) {
      studentQuery.classId = { $in: classes };
    }
    if (sections && sections.length > 0) {
      studentQuery.sectionId = { $in: sections };
    }

    const students = await Student.find(studentQuery);
    const studentIds = students.map(s => s._id);

    // Get active alerts for these students
    const activeAlerts = await Alert.find({
      studentId: { $in: studentIds },
      status: 'active'
    }).populate('studentId', 'firstName lastName grade registerNumber');

    // Get recent assessments
    const recentAssessments = await Assessment.find({
      studentId: { $in: studentIds },
      status: 'completed'
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('studentId', 'firstName lastName grade');

    // Get recent quiz attempts
    const recentQuizzes = await QuizAttempt.find({
      studentId: { $in: studentIds },
      status: 'completed'
    })
      .sort({ completedAt: -1 })
      .limit(10)
      .populate('studentId', 'firstName lastName grade')
      .populate('quizId', 'title subject');

    // Calculate summary statistics
    const totalStudents = students.length;
    const alertsBySeverity = {
      critical: activeAlerts.filter(a => a.severity === 'critical').length,
      high: activeAlerts.filter(a => a.severity === 'high').length,
      medium: activeAlerts.filter(a => a.severity === 'medium').length,
      low: activeAlerts.filter(a => a.severity === 'low').length
    };

    // Calculate average scores
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentAssessmentStats = await Assessment.find({
      studentId: { $in: studentIds },
      status: 'completed',
      createdAt: { $gte: last30Days }
    });

    const avgAssessmentScore = recentAssessmentStats.length > 0
      ? recentAssessmentStats.reduce((sum, a) => {
          const percentage = a.aiAnalysis?.overallScore && a.aiAnalysis?.totalScore
            ? (a.aiAnalysis.overallScore / a.aiAnalysis.totalScore) * 100
            : 0;
          return sum + percentage;
        }, 0) / recentAssessmentStats.length
      : 0;

    const recentQuizStats = await QuizAttempt.find({
      studentId: { $in: studentIds },
      status: 'completed',
      completedAt: { $gte: last30Days }
    });

    const avgQuizScore = recentQuizStats.length > 0
      ? recentQuizStats.reduce((sum, q) => sum + q.percentage, 0) / recentQuizStats.length
      : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalStudents,
          totalAlerts: activeAlerts.length,
          alertsBySeverity,
          avgAssessmentScore: Math.round(avgAssessmentScore),
          avgQuizScore: Math.round(avgQuizScore),
          recentAssessmentsCount: recentAssessmentStats.length,
          recentQuizzesCount: recentQuizStats.length
        },
        alerts: activeAlerts.slice(0, 5), // Top 5 alerts
        recentActivity: {
          assessments: recentAssessments.slice(0, 5),
          quizzes: recentQuizzes.slice(0, 5)
        }
      }
    });
  } catch (error) {
    console.error('Get Teacher Dashboard Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all students in teacher's classes with performance metrics
 */
const getMyStudents = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }

    const { schoolId, teacherData } = teacher;
    const { classes, sections } = teacherData || {};

    // Get all students in teacher's classes
    const studentQuery = { schoolId, isActive: true };
    if (classes && classes.length > 0) {
      studentQuery.classId = { $in: classes };
    }
    if (sections && sections.length > 0) {
      studentQuery.sectionId = { $in: sections };
    }

    const students = await Student.find(studentQuery)
      .populate('classId', 'name')
      .populate('sectionId', 'name')
      .sort({ grade: 1, lastName: 1 });

    // Get performance metrics for each student
    const studentsWithMetrics = await Promise.all(
      students.map(async (student) => {
        // Get recent assessments
        const assessments = await Assessment.find({
          studentId: student._id,
          status: 'completed'
        }).sort({ createdAt: -1 }).limit(5);

        // Get recent quizzes
        const quizzes = await QuizAttempt.find({
          studentId: student._id,
          status: 'completed'
        }).sort({ completedAt: -1 }).limit(5);

        // Get active alerts
        const alerts = await Alert.find({
          studentId: student._id,
          status: 'active'
        });

        // Calculate averages
        const avgAssessmentScore = assessments.length > 0
          ? assessments.reduce((sum, a) => {
              const percentage = a.aiAnalysis?.overallScore && a.aiAnalysis?.totalScore
                ? (a.aiAnalysis.overallScore / a.aiAnalysis.totalScore) * 100
                : 0;
              return sum + percentage;
            }, 0) / assessments.length
          : null;

        const avgQuizScore = quizzes.length > 0
          ? quizzes.reduce((sum, q) => sum + q.percentage, 0) / quizzes.length
          : null;

        return {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          registerNumber: student.registerNumber,
          grade: student.grade,
          class: student.classId?.name,
          section: student.sectionId?.name,
          gamification: student.gamification,
          metrics: {
            avgAssessmentScore: avgAssessmentScore ? Math.round(avgAssessmentScore) : null,
            avgQuizScore: avgQuizScore ? Math.round(avgQuizScore) : null,
            totalAssessments: assessments.length,
            totalQuizzes: quizzes.length,
            activeAlerts: alerts.length,
            highestAlertSeverity: alerts.length > 0
              ? alerts.reduce((max, a) => {
                  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                  return severityOrder[a.severity] > severityOrder[max]
                    ? a.severity
                    : max;
                }, 'low')
              : null
          },
          lastActivity: student.gamification?.streaks?.lastActivityDate || null
        };
      })
    );

    res.json({
      success: true,
      count: studentsWithMetrics.length,
      data: studentsWithMetrics
    });
  } catch (error) {
    console.error('Get My Students Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get detailed student profile for teacher view
 */
const getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user._id;
    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }

    const student = await Student.findById(studentId)
      .populate('classId', 'name')
      .populate('sectionId', 'name')
      .populate('parentIds', 'firstName lastName email phoneNumber');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify student is in teacher's class
    const { teacherData } = teacher;
    const isAuthorized =
      (!teacherData?.classes?.length || teacherData.classes.some(c => c.toString() === student.classId._id.toString())) &&
      (!teacherData?.sections?.length || teacherData.sections.some(s => s.toString() === student.sectionId._id.toString()));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view this student' });
    }

    // Get all assessments
    const assessments = await Assessment.find({
      studentId,
      status: 'completed'
    }).sort({ createdAt: -1 });

    // Get all quizzes
    const quizzes = await QuizAttempt.find({
      studentId,
      status: 'completed'
    })
      .populate('quizId', 'title subject grade')
      .sort({ completedAt: -1 });

    // Get all alerts
    const alerts = await Alert.find({ studentId }).sort({ createdAt: -1 });

    // Calculate performance trends
    const performanceTrend = calculatePerformanceTrend(assessments, quizzes);

    // Get subject-wise performance
    const subjectPerformance = calculateSubjectPerformance(assessments, quizzes);

    res.json({
      success: true,
      data: {
        student: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          registerNumber: student.registerNumber,
          grade: student.grade,
          class: student.classId,
          section: student.sectionId,
          dateOfBirth: student.dateOfBirth,
          subjects: student.subjects,
          gamification: student.gamification,
          learningProfile: student.learningProfile,
          parents: student.parentIds
        },
        performance: {
          assessments: {
            total: assessments.length,
            recent: assessments.slice(0, 10),
            avgScore: assessments.length > 0
              ? Math.round(
                  assessments.reduce((sum, a) => {
                    const percentage = a.aiAnalysis?.overallScore && a.aiAnalysis?.totalScore
                      ? (a.aiAnalysis.overallScore / a.aiAnalysis.totalScore) * 100
                      : 0;
                    return sum + percentage;
                  }, 0) / assessments.length
                )
              : null
          },
          quizzes: {
            total: quizzes.length,
            recent: quizzes.slice(0, 10),
            avgScore: quizzes.length > 0
              ? Math.round(quizzes.reduce((sum, q) => sum + q.percentage, 0) / quizzes.length)
              : null
          },
          trend: performanceTrend,
          bySubject: subjectPerformance
        },
        alerts: {
          total: alerts.length,
          active: alerts.filter(a => a.status === 'active'),
          recent: alerts.slice(0, 5)
        }
      }
    });
  } catch (error) {
    console.error('Get Student Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get class analytics
 */
const getClassAnalytics = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user._id;
    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }

    // Verify teacher has access to this class
    if (teacher.teacherData?.classes && !teacher.teacherData.classes.some(c => c.toString() === classId)) {
      return res.status(403).json({ message: 'Not authorized to view this class' });
    }

    const students = await Student.find({ classId, isActive: true });
    const studentIds = students.map(s => s._id);

    // Get all assessments for the class
    const assessments = await Assessment.find({
      studentId: { $in: studentIds },
      status: 'completed'
    });

    // Get all quizzes for the class
    const quizzes = await QuizAttempt.find({
      studentId: { $in: studentIds },
      status: 'completed'
    }).populate('quizId', 'subject');

    // Calculate class performance distribution
    const performanceDistribution = {
      excellent: 0, // 90-100%
      good: 0,      // 75-89%
      average: 0,   // 60-74%
      poor: 0       // <60%
    };

    students.forEach((student) => {
      const studentAssessments = assessments.filter(a => a.studentId.toString() === student._id.toString());
      const studentQuizzes = quizzes.filter(q => q.studentId.toString() === student._id.toString());

      const totalItems = studentAssessments.length + studentQuizzes.length;
      if (totalItems === 0) return;

      const avgScore = (
        studentAssessments.reduce((sum, a) => {
          const percentage = a.aiAnalysis?.overallScore && a.aiAnalysis?.totalScore
            ? (a.aiAnalysis.overallScore / a.aiAnalysis.totalScore) * 100
            : 0;
          return sum + percentage;
        }, 0) +
        studentQuizzes.reduce((sum, q) => sum + q.percentage, 0)
      ) / totalItems;

      if (avgScore >= 90) performanceDistribution.excellent++;
      else if (avgScore >= 75) performanceDistribution.good++;
      else if (avgScore >= 60) performanceDistribution.average++;
      else performanceDistribution.poor++;
    });

    // Get subject-wise class performance
    const subjectStats = {};
    [...assessments, ...quizzes].forEach((item) => {
      const subject = item.subject || item.quizId?.subject;
      if (!subject) return;

      if (!subjectStats[subject]) {
        subjectStats[subject] = { scores: [], count: 0 };
      }

      const score = item.percentage || (
        item.aiAnalysis?.overallScore && item.aiAnalysis?.totalScore
          ? (item.aiAnalysis.overallScore / item.aiAnalysis.totalScore) * 100
          : 0
      );

      subjectStats[subject].scores.push(score);
      subjectStats[subject].count++;
    });

    const subjectPerformance = Object.entries(subjectStats).map(([subject, data]) => ({
      subject,
      avgScore: Math.round(data.scores.reduce((sum, s) => sum + s, 0) / data.count),
      count: data.count
    }));

    res.json({
      success: true,
      data: {
        totalStudents: students.length,
        performanceDistribution,
        subjectPerformance,
        overallStats: {
          totalAssessments: assessments.length,
          totalQuizzes: quizzes.length,
          avgClassScore: assessments.length + quizzes.length > 0
            ? Math.round(
                ([...assessments, ...quizzes].reduce((sum, item) => {
                  const score = item.percentage || (
                    item.aiAnalysis?.overallScore && item.aiAnalysis?.totalScore
                      ? (item.aiAnalysis.overallScore / item.aiAnalysis.totalScore) * 100
                      : 0
                  );
                  return sum + score;
                }, 0)) / (assessments.length + quizzes.length)
              )
            : 0
        }
      }
    });
  } catch (error) {
    console.error('Get Class Analytics Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper functions
function calculatePerformanceTrend(assessments, quizzes) {
  const allItems = [
    ...assessments.map(a => ({
      date: a.createdAt,
      score: a.aiAnalysis?.overallScore && a.aiAnalysis?.totalScore
        ? (a.aiAnalysis.overallScore / a.aiAnalysis.totalScore) * 100
        : 0
    })),
    ...quizzes.map(q => ({
      date: q.completedAt,
      score: q.percentage
    }))
  ].sort((a, b) => a.date - b.date);

  if (allItems.length < 2) return null;

  const mid = Math.floor(allItems.length / 2);
  const firstHalf = allItems.slice(0, mid);
  const secondHalf = allItems.slice(mid);

  const firstAvg = firstHalf.reduce((sum, i) => sum + i.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, i) => sum + i.score, 0) / secondHalf.length;

  return {
    direction: secondAvg > firstAvg ? 'improving' : secondAvg < firstAvg ? 'declining' : 'stable',
    change: Math.round(secondAvg - firstAvg)
  };
}

function calculateSubjectPerformance(assessments, quizzes) {
  const subjectData = {};

  assessments.forEach(a => {
    if (!a.subject) return;
    if (!subjectData[a.subject]) subjectData[a.subject] = [];
    const score = a.aiAnalysis?.overallScore && a.aiAnalysis?.totalScore
      ? (a.aiAnalysis.overallScore / a.aiAnalysis.totalScore) * 100
      : 0;
    subjectData[a.subject].push(score);
  });

  quizzes.forEach(q => {
    const subject = q.quizId?.subject;
    if (!subject) return;
    if (!subjectData[subject]) subjectData[subject] = [];
    subjectData[subject].push(q.percentage);
  });

  return Object.entries(subjectData).map(([subject, scores]) => ({
    subject,
    avgScore: Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length),
    count: scores.length
  }));
}

module.exports = {
  getDashboard,
  getMyStudents,
  getStudentProfile,
  getClassAnalytics
};
