const alertService = require('../services/alertService');

/**
 * Analyze a student and generate alerts
 */
const analyzeStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const alerts = await alertService.analyzeStudentAndGenerateAlerts(studentId);

    res.json({
      success: true,
      message: `Generated ${alerts.length} new alert(s)`,
      data: alerts
    });
  } catch (error) {
    console.error('Analyze Student Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get alerts for a specific student
 */
const getStudentAlerts = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status, limit } = req.query;

    const alerts = await alertService.getStudentAlerts(studentId, { status, limit });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Get Student Alerts Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all alerts for teacher's view (filtered by school/class)
 */
const getTeacherAlerts = async (req, res) => {
  try {
    const { schoolId, classId, severity, alertType, status, limit } = req.query;

    const alerts = await alertService.getAlertsForTeacher({
      schoolId,
      classId,
      severity,
      alertType,
      status,
      limit
    });

    // Group by severity for dashboard
    const groupedBySeverity = {
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length
    };

    res.json({
      success: true,
      count: alerts.length,
      summary: groupedBySeverity,
      data: alerts
    });
  } catch (error) {
    console.error('Get Teacher Alerts Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Acknowledge an alert
 */
const acknowledgeAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { notes } = req.body;

    const alert = await alertService.acknowledgeAlert(
      alertId,
      req.user._id,
      req.user.role,
      notes
    );

    res.json({
      success: true,
      message: 'Alert acknowledged',
      data: alert
    });
  } catch (error) {
    console.error('Acknowledge Alert Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Resolve an alert
 */
const resolveAlert = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await alertService.resolveAlert(alertId);

    res.json({
      success: true,
      message: 'Alert resolved',
      data: alert
    });
  } catch (error) {
    console.error('Resolve Alert Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Dismiss an alert
 */
const dismissAlert = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await alertService.dismissAlert(alertId);

    res.json({
      success: true,
      message: 'Alert dismissed',
      data: alert
    });
  } catch (error) {
    console.error('Dismiss Alert Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Bulk analyze students (for running periodic checks)
 */
const bulkAnalyze = async (req, res) => {
  try {
    const { schoolId, classId } = req.query;

    const results = await alertService.bulkAnalyzeStudents({ schoolId, classId });

    const totalAlerts = results.reduce((sum, r) => sum + r.alertsGenerated, 0);

    res.json({
      success: true,
      message: `Analyzed ${results.length} students, generated ${totalAlerts} alerts`,
      data: results
    });
  } catch (error) {
    console.error('Bulk Analyze Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  analyzeStudent,
  getStudentAlerts,
  getTeacherAlerts,
  acknowledgeAlert,
  resolveAlert,
  dismissAlert,
  bulkAnalyze
};
