import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import GamificationCard from '../gamification/GamificationCard';
import './Dashboard.css';

const ParentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();

    // Refresh data when user navigates back to this page
    const handleFocus = () => {
      fetchStudents();
      if (selectedStudent) {
        fetchRecentAssessments(selectedStudent._id);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchRecentAssessments(selectedStudent._id);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/parent/children');
      const studentsData = response.data.data || [];
      setStudents(studentsData);
      if (studentsData.length > 0) {
        setSelectedStudent(studentsData[0]);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      toast.error('Failed to load your children data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAssessments = async (studentId) => {
    try {
      const response = await api.get(`/parent/children/${studentId}/assessments`, {
        params: { limit: 5, status: 'completed' }
      });
      setRecentAssessments(response.data.data?.assessments || []);
    } catch (error) {
      console.error('Failed to load assessments:', error);
      // Don't show error toast as this is not critical
      setRecentAssessments([]);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="dashboard-wrapper">
        <nav className="dashboard-navbar">
          <div className="navbar-brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-text">AI EdTech</span>
          </div>
          <div className="navbar-actions">
            <div className="user-menu">
              <div className="user-avatar">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.firstName} {user?.lastName}</span>
                <span className="user-role">Parent</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </nav>

        <div className="dashboard-container">
          <div className="empty-state">
            <span className="empty-icon">👨‍👩‍👧‍👦</span>
            <h2>No Students Found</h2>
            <p>You don't have any students assigned yet. Please contact your school administrator.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Top Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">AI EdTech</span>
        </div>

        <div className="navbar-center">
          {selectedStudent && (
            <div className="school-badge">
              <span className="school-icon">👨‍👩‍👧‍👦</span>
              <div className="school-info">
                <span className="school-name">{selectedStudent.firstName} {selectedStudent.lastName}</span>
                <span className="school-code">Grade {selectedStudent.grade}</span>
              </div>
            </div>
          )}
        </div>

        <div className="navbar-actions">
          <div className="user-menu">
            <div className="user-avatar">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-role">Parent</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, {user?.firstName}! 👋</h1>
            <p className="dashboard-subtitle">Track your child's learning journey and progress</p>
          </div>
          <div className="header-actions">
            {students.length > 1 && (
              <select
                className="form-select"
                value={selectedStudent?._id || ''}
                onChange={(e) => {
                  const student = students.find((s) => s._id === e.target.value);
                  setSelectedStudent(student || null);
                }}
                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1.5px solid var(--gray-300)' }}
              >
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.firstName} {student.lastName} - Grade {student.grade}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {selectedStudent && (
          <>
            {/* Stats Grid */}
            <div className="dashboard-grid">
              <div className="stat-card stat-card-primary">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <div className="stat-value">{selectedStudent.subjects?.length || 0}</div>
                  <div className="stat-label">Subjects</div>
                </div>
              </div>

              <div className="stat-card stat-card-success">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <div className="stat-value">{recentAssessments.length}</div>
                  <div className="stat-label">Assessments</div>
                </div>
              </div>

              <div className="stat-card stat-card-warning">
                <div className="stat-icon">💪</div>
                <div className="stat-info">
                  <div className="stat-value">{selectedStudent.learningProfile?.strengths?.length || 0}</div>
                  <div className="stat-label">Strengths</div>
                </div>
              </div>

              <div className="stat-card stat-card-info">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <div className="stat-value">{selectedStudent.learningProfile?.weaknesses?.length || 0}</div>
                  <div className="stat-label">Focus Areas</div>
                </div>
              </div>
            </div>

            {/* Quick Actions - Featured Section */}
            <div className="section-header">
              <h2 className="section-title">⚡ Quick Actions</h2>
              <p className="section-subtitle">Start learning with engaging activities</p>
            </div>

            <div className="quick-actions-grid">
              <Link
                to={`/journeys/${selectedStudent._id}`}
                className="action-card action-card-featured"
              >
                <div className="action-icon action-icon-primary">
                  <span>🏛️</span>
                </div>
                <div className="action-content">
                  <h3 className="action-title">Historical Journeys</h3>
                  <p className="action-description">
                    Immerse in interactive historical experiences and learn through storytelling
                  </p>
                </div>
                <span className="action-arrow">→</span>
              </Link>

              <Link
                to={`/games/${selectedStudent._id}`}
                className="action-card action-card-featured"
              >
                <div className="action-icon action-icon-success">
                  <span>🎮</span>
                </div>
                <div className="action-content">
                  <h3 className="action-title">Play Games</h3>
                  <p className="action-description">
                    Learn through fun educational games designed for your grade level
                  </p>
                </div>
                <span className="action-arrow">→</span>
              </Link>

              <Link
                to={`/quizzes/${selectedStudent._id}`}
                className="action-card action-card-featured"
              >
                <div className="action-icon action-icon-warning">
                  <span>📝</span>
                </div>
                <div className="action-content">
                  <h3 className="action-title">Take Quiz</h3>
                  <p className="action-description">
                    Test your knowledge with adaptive quizzes and instant feedback
                  </p>
                </div>
                <span className="action-arrow">→</span>
              </Link>

              <Link
                to={`/upload-assessment/${selectedStudent._id}`}
                className="action-card action-card-featured"
              >
                <div className="action-icon action-icon-info">
                  <span>📸</span>
                </div>
                <div className="action-content">
                  <h3 className="action-title">Upload Work</h3>
                  <p className="action-description">
                    Get AI-powered feedback on handwritten assignments and homework
                  </p>
                </div>
                <span className="action-arrow">→</span>
              </Link>
            </div>

            {/* Gamification Card */}
            <GamificationCard student={selectedStudent} />

            {/* Learning Profile */}
            <div className="section-header">
              <h2 className="section-title">🧠 Learning Profile</h2>
              <p className="section-subtitle">AI-identified strengths and areas for growth</p>
            </div>

            <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
              <div className="card">
                <h3 className="card-title" style={{ color: 'var(--success)', marginBottom: 'var(--spacing-lg)' }}>
                  💪 Strengths
                </h3>
                <div className="tag-list">
                  {selectedStudent.learningProfile?.strengths?.length > 0 ? (
                    selectedStudent.learningProfile.strengths.map((strength, idx) => (
                      <span key={idx} className="badge badge-success" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                        {strength}
                      </span>
                    ))
                  ) : (
                    <p className="text-muted" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                      Complete assessments to identify strengths
                    </p>
                  )}
                </div>
              </div>

              <div className="card">
                <h3 className="card-title" style={{ color: 'var(--warning)', marginBottom: 'var(--spacing-lg)' }}>
                  🎯 Areas for Improvement
                </h3>
                <div className="tag-list">
                  {selectedStudent.learningProfile?.weaknesses?.length > 0 ? (
                    selectedStudent.learningProfile.weaknesses.map((weakness, idx) => (
                      <span key={idx} className="badge badge-warning" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                        {weakness}
                      </span>
                    ))
                  ) : (
                    <p className="text-muted" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                      Complete assessments to identify areas for improvement
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="section-header mt-xl">
              <h2 className="section-title">📋 Recent Assessments</h2>
              <Link to={`/student/${selectedStudent._id}/progress`} className="btn btn-sm btn-secondary">
                View All →
              </Link>
            </div>

            <div className="card">
              {recentAssessments.length > 0 ? (
                <div className="activity-list">
                  {recentAssessments.map((assessment) => (
                    <Link
                      key={assessment._id}
                      to={`/assessment/${assessment._id}`}
                      className="activity-item"
                      style={{ textDecoration: 'none', transition: 'var(--transition)' }}
                    >
                      <div className="activity-icon-wrapper activity-info">
                        <span>📝</span>
                      </div>
                      <div className="activity-content">
                        <p className="activity-title">{assessment.subject}</p>
                        <p className="activity-description">{assessment.topic}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <div className="badge badge-primary" style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}>
                          {assessment.aiAnalysis?.overallScore || 0}%
                        </div>
                        <span className="activity-time">
                          {new Date(assessment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="activity-empty">
                  <span className="empty-icon">📭</span>
                  <p>No assessments yet. Upload your first assessment to get started!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-brand">
              <span className="brand-icon">🎓</span>
              <span className="footer-brand-text">AI EdTech Platform</span>
            </div>
            <p className="footer-description">
              Empowering students with AI-driven personalized learning experiences
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4>Platform</h4>
              <ul>
                <li><a href="#assessments">Assessments</a></li>
                <li><a href="#games">Games</a></li>
                <li><a href="#journeys">Journeys</a></li>
                <li><a href="#quizzes">Quizzes</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 AI EdTech Platform. All rights reserved.</p>
          <p className="footer-tagline">Built with ❤️ for better education</p>
        </div>
      </footer>
    </div>
  );
};

export default ParentDashboard;
