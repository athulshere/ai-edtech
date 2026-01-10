const Alert = require('../models/Alert');
const Student = require('../models/Student');
const Assessment = require('../models/Assessment');
const QuizAttempt = require('../models/QuizAttempt');

/**
 * Analyze a student and generate alerts based on their performance
 */
const analyzeStudentAndGenerateAlerts = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const alerts = [];

    // 1. Check quiz performance
    const quizAlert = await checkQuizPerformance(studentId);
    if (quizAlert) alerts.push(quizAlert);

    // 2. Check assessment performance trends
    const performanceAlert = await checkPerformanceTrend(studentId);
    if (performanceAlert) alerts.push(performanceAlert);

    // 3. Check activity/engagement
    const activityAlert = await checkActivityLevel(studentId);
    if (activityAlert) alerts.push(activityAlert);

    // 4. Check streak status
    const streakAlert = await checkStreakStatus(student);
    if (streakAlert) alerts.push(streakAlert);

    // Save all new alerts
    const savedAlerts = [];
    for (const alertData of alerts) {
      // Check if similar alert already exists and is active
      const existingAlert = await Alert.findOne({
        studentId,
        alertType: alertData.alertType,
        status: 'active',
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Within last 7 days
      });

      if (!existingAlert) {
        const alert = await Alert.create(alertData);
        savedAlerts.push(alert);
      }
    }

    return savedAlerts;
  } catch (error) {
    console.error('Error analyzing student:', error);
    throw error;
  }
};

/**
 * Check quiz performance and generate alerts if needed
 */
const checkQuizPerformance = async (studentId) => {
  const recentQuizzes = await QuizAttempt.find({
    studentId,
    status: 'completed',
    completedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
  }).sort({ completedAt: -1 }).limit(5);

  if (recentQuizzes.length < 3) {
    return null; // Not enough data
  }

  const averagePercentage = recentQuizzes.reduce((sum, q) => sum + q.percentage, 0) / recentQuizzes.length;
  const failedQuizzes = recentQuizzes.filter(q => q.percentage < 50).length;

  // Alert if average is below 60% or more than 2 quizzes failed
  if (averagePercentage < 60 || failedQuizzes >= 2) {
    const severity = averagePercentage < 40 ? 'high' : failedQuizzes >= 3 ? 'high' : 'medium';

    return {
      studentId,
      alertType: 'low_quiz_scores',
      severity,
      title: 'Low Quiz Performance',
      description: `Student is struggling with quizzes. Average score: ${Math.round(averagePercentage)}% over last ${recentQuizzes.length} quizzes.`,
      metrics: {
        averageScore: Math.round(averagePercentage),
        quizzesFailed: failedQuizzes,
        totalQuizzes: recentQuizzes.length
      },
      recommendations: [
        'Schedule one-on-one tutoring session',
        'Review quiz topics with student',
        'Provide additional practice materials',
        'Check if student needs extra time for assignments'
      ]
    };
  }

  return null;
};

/**
 * Check assessment performance trend
 */
const checkPerformanceTrend = async (studentId) => {
  const recentAssessments = await Assessment.find({
    studentId,
    status: 'completed',
    createdAt: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) } // Last 60 days
  }).sort({ createdAt: -1 }).limit(10);

  if (recentAssessments.length < 4) {
    return null; // Not enough data
  }

  // Split into two halves to compare trends
  const mid = Math.floor(recentAssessments.length / 2);
  const recent = recentAssessments.slice(0, mid);
  const older = recentAssessments.slice(mid);

  const recentAvg = recent.reduce((sum, a) => {
    const percentage = a.aiAnalysis?.overallScore && a.aiAnalysis?.totalScore
      ? (a.aiAnalysis.overallScore / a.aiAnalysis.totalScore) * 100
      : 0;
    return sum + percentage;
  }, 0) / recent.length;

  const olderAvg = older.reduce((sum, a) => {
    const percentage = a.aiAnalysis?.overallScore && a.aiAnalysis?.totalScore
      ? (a.aiAnalysis.overallScore / a.aiAnalysis.totalScore) * 100
      : 0;
    return sum + percentage;
  }, 0) / older.length;

  // Alert if performance dropped by more than 15%
  const dropPercentage = olderAvg - recentAvg;
  if (dropPercentage > 15) {
    const severity = dropPercentage > 25 ? 'high' : 'medium';

    return {
      studentId,
      alertType: 'performance_decline',
      severity,
      title: 'Performance Declining',
      description: `Student's assessment scores have dropped by ${Math.round(dropPercentage)}% compared to previous performance.`,
      metrics: {
        currentScore: Math.round(recentAvg),
        previousScore: Math.round(olderAvg)
      },
      recommendations: [
        'Meet with student to discuss challenges',
        'Review recent assessment feedback',
        'Identify if there are external factors affecting performance',
        'Provide targeted support in weak areas'
      ]
    };
  }

  return null;
};

/**
 * Check activity level
 */
const checkActivityLevel = async (studentId) => {
  const lastAssessment = await Assessment.findOne({
    studentId,
    status: 'completed'
  }).sort({ createdAt: -1 });

  const lastQuiz = await QuizAttempt.findOne({
    studentId,
    status: 'completed'
  }).sort({ completedAt: -1 });

  // Find the most recent activity
  let lastActivityDate = null;
  if (lastAssessment && lastQuiz) {
    lastActivityDate = lastAssessment.createdAt > lastQuiz.completedAt
      ? lastAssessment.createdAt
      : lastQuiz.completedAt;
  } else if (lastAssessment) {
    lastActivityDate = lastAssessment.createdAt;
  } else if (lastQuiz) {
    lastActivityDate = lastQuiz.completedAt;
  }

  if (!lastActivityDate) {
    return null; // No activity data
  }

  const daysInactive = Math.floor((Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

  // Alert if no activity for more than 14 days
  if (daysInactive > 14) {
    const severity = daysInactive > 30 ? 'high' : 'medium';

    return {
      studentId,
      alertType: 'no_activity',
      severity,
      title: 'No Recent Activity',
      description: `Student has not submitted any work for ${daysInactive} days.`,
      metrics: {
        daysInactive
      },
      recommendations: [
        'Contact parent to check on student well-being',
        'Send reminder about pending assignments',
        'Offer flexible deadlines if needed',
        'Check if student is facing technical issues'
      ]
    };
  }

  return null;
};

/**
 * Check streak status
 */
const checkStreakStatus = async (student) => {
  if (!student.gamification?.streaks) {
    return null;
  }

  const { current, longest, lastActivityDate } = student.gamification.streaks;

  // Alert if had a long streak (7+ days) but lost it
  if (longest >= 7 && current === 0 && lastActivityDate) {
    const daysSinceLastActivity = Math.floor(
      (Date.now() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastActivity <= 7) { // Only alert if recently broken
      return {
        studentId: student._id,
        alertType: 'streak_broken',
        severity: 'low',
        title: 'Activity Streak Broken',
        description: `Student lost their ${longest}-day activity streak. This may indicate declining engagement.`,
        metrics: {
          daysInactive: daysSinceLastActivity
        },
        recommendations: [
          'Send motivational message to student',
          'Encourage them to restart their streak',
          'Remind about the benefits of consistent practice'
        ]
      };
    }
  }

  return null;
};

/**
 * Get all active alerts for a student
 */
const getStudentAlerts = async (studentId, options = {}) => {
  const { status = 'active', limit = 10 } = options;

  const query = { studentId };
  if (status) {
    query.status = status;
  }

  const alerts = await Alert.find(query)
    .sort({ severity: -1, createdAt: -1 })
    .limit(limit);

  return alerts;
};

/**
 * Get alerts for all students in a class/school
 */
const getAlertsForTeacher = async (filters = {}) => {
  const { schoolId, classId, severity, alertType, status = 'active', limit = 50 } = filters;

  // First get students matching the criteria
  const studentQuery = {};
  if (schoolId) studentQuery.schoolId = schoolId;
  if (classId) studentQuery.classId = classId;

  const students = await Student.find(studentQuery).select('_id');
  const studentIds = students.map(s => s._id);

  // Then get alerts for those students
  const alertQuery = {
    studentId: { $in: studentIds },
    status
  };
  if (severity) alertQuery.severity = severity;
  if (alertType) alertQuery.alertType = alertType;

  const alerts = await Alert.find(alertQuery)
    .populate('studentId', 'firstName lastName grade registerNumber')
    .sort({ severity: -1, createdAt: -1 })
    .limit(limit);

  return alerts;
};

/**
 * Acknowledge an alert
 */
const acknowledgeAlert = async (alertId, userId, userRole, notes) => {
  const alert = await Alert.findByIdAndUpdate(
    alertId,
    {
      status: 'acknowledged',
      acknowledgedBy: {
        userId,
        userRole,
        acknowledgedAt: new Date(),
        notes
      }
    },
    { new: true }
  ).populate('studentId', 'firstName lastName grade');

  return alert;
};

/**
 * Resolve an alert
 */
const resolveAlert = async (alertId) => {
  const alert = await Alert.findByIdAndUpdate(
    alertId,
    {
      status: 'resolved',
      resolvedAt: new Date()
    },
    { new: true }
  ).populate('studentId', 'firstName lastName grade');

  return alert;
};

/**
 * Dismiss an alert
 */
const dismissAlert = async (alertId) => {
  const alert = await Alert.findByIdAndUpdate(
    alertId,
    { status: 'dismissed' },
    { new: true }
  );

  return alert;
};

/**
 * Bulk analyze all students in a school/class
 */
const bulkAnalyzeStudents = async (filters = {}) => {
  const { schoolId, classId } = filters;

  const studentQuery = {};
  if (schoolId) studentQuery.schoolId = schoolId;
  if (classId) studentQuery.classId = classId;

  const students = await Student.find(studentQuery);
  const results = [];

  for (const student of students) {
    try {
      const alerts = await analyzeStudentAndGenerateAlerts(student._id);
      results.push({
        studentId: student._id,
        studentName: `${student.firstName} ${student.lastName}`,
        alertsGenerated: alerts.length,
        alerts
      });
    } catch (error) {
      console.error(`Error analyzing student ${student._id}:`, error);
    }
  }

  return results;
};

module.exports = {
  analyzeStudentAndGenerateAlerts,
  getStudentAlerts,
  getAlertsForTeacher,
  acknowledgeAlert,
  resolveAlert,
  dismissAlert,
  bulkAnalyzeStudents
};
