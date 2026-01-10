import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    totalClasses: 0,
    totalSections: 0,
  });
  const [loading, setLoading] = useState(true);
  const [schoolInfo, setSchoolInfo] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user?.schoolId) {
        const schoolId = typeof user.schoolId === 'string' ? user.schoolId : user.schoolId._id;
        const schoolRes = await api.get(`/schools/${schoolId}`);
        setSchoolInfo(schoolRes.data.data);
      }

      const classesRes = await api.get('/classes');
      const classes = classesRes.data.data || [];

      const sectionsRes = await api.get('/sections');
      const sections = sectionsRes.data.data || [];

      const totalStudents = sections.reduce(
        (sum, section) => sum + (section.currentStudents || 0),
        0
      );

      setStats({
        totalStudents,
        totalTeachers: 0,
        totalParents: 0,
        totalClasses: classes.length,
        totalSections: sections.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  return (
    <div className="dashboard-wrapper">
      {/* Top Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">AI EdTech</span>
        </div>

        <div className="navbar-center">
          {schoolInfo && (
            <div className="school-badge">
              <span className="school-icon">🏫</span>
              <div className="school-info">
                <span className="school-name">{schoolInfo.name}</span>
                <span className="school-code">{schoolInfo.code}</span>
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
              <span className="user-role">Administrator</span>
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
            <p className="dashboard-subtitle">Here's what's happening with your school today</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/admin/reports')}>
              📊 View Reports
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/admin/users')}>
              ➕ Add User
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalStudents}</div>
              <div className="stat-label">Total Students</div>
            </div>
            <div className="stat-trend">
              <span className="trend-badge trend-up">+12%</span>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">👨‍🏫</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalTeachers}</div>
              <div className="stat-label">Teachers</div>
            </div>
            <div className="stat-trend">
              <span className="trend-badge trend-up">+5%</span>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalClasses}</div>
              <div className="stat-label">Classes</div>
            </div>
            <div className="stat-trend">
              <span className="trend-badge trend-neutral">—</span>
            </div>
          </div>

          <div className="stat-card stat-card-info">
            <div className="stat-icon">🏛️</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalSections}</div>
              <div className="stat-label">Sections</div>
            </div>
            <div className="stat-trend">
              <span className="trend-badge trend-up">+3</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-header">
          <h2 className="section-title">⚡ Quick Actions</h2>
          <p className="section-subtitle">Manage your school efficiently</p>
        </div>

        <div className="quick-actions-grid">
          <button className="action-card" onClick={() => navigate('/admin/users')}>
            <div className="action-icon action-icon-primary">
              <span>👤</span>
            </div>
            <div className="action-content">
              <h3 className="action-title">User Management</h3>
              <p className="action-description">Manage teachers, parents, and students</p>
            </div>
            <div className="action-arrow">→</div>
          </button>

          <button className="action-card" onClick={() => navigate('/admin/classes')}>
            <div className="action-icon action-icon-success">
              <span>📖</span>
            </div>
            <div className="action-content">
              <h3 className="action-title">Classes & Sections</h3>
              <p className="action-description">Organize classes and manage sections</p>
            </div>
            <div className="action-arrow">→</div>
          </button>

          <button className="action-card" onClick={() => navigate('/admin/bulk-upload')}>
            <div className="action-icon action-icon-warning">
              <span>📤</span>
            </div>
            <div className="action-content">
              <h3 className="action-title">Bulk Upload Students</h3>
              <p className="action-description">Upload multiple students via Excel file</p>
            </div>
            <div className="action-arrow">→</div>
          </button>

          

          <button className="action-card" onClick={() => navigate('/admin/reports')}>
            <div className="action-icon action-icon-info">
              <span>📊</span>
            </div>
            <div className="action-content">
              <h3 className="action-title">Analytics & Reports</h3>
              <p className="action-description">View performance and insights</p>
            </div>
            <div className="action-arrow">→</div>
          </button>
        </div>

        {/* AI Features Section */}
        <div className="section-header mt-xl">
          <h2 className="section-title">🤖 AI-Powered Features</h2>
          <p className="section-subtitle">Leverage artificial intelligence for better outcomes</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon feature-icon-gradient">🎯</div>
            <h3 className="feature-title">Smart Assessment</h3>
            <p className="feature-description">
              Automatically grade and analyze student performance with AI
            </p>
            <button className="btn btn-sm btn-secondary mt-md">Learn More</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-gradient">📈</div>
            <h3 className="feature-title">Predictive Analytics</h3>
            <p className="feature-description">
              Get insights and predictions on student progress
            </p>
            <button className="btn btn-sm btn-secondary mt-md">Learn More</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-gradient">💡</div>
            <h3 className="feature-title">Personalized Learning</h3>
            <p className="feature-description">
              AI-driven recommendations for each student
            </p>
            <button className="btn btn-sm btn-secondary mt-md">Learn More</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section-header mt-xl">
          <h2 className="section-title">📋 Recent Activity</h2>
          <button className="btn btn-sm btn-secondary">View All</button>
        </div>

        <div className="card">
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon-wrapper activity-success">
                <span>✓</span>
              </div>
              <div className="activity-content">
                <p className="activity-title">New student enrolled</p>
                <p className="activity-description">Emma Smith joined Grade 3-A</p>
              </div>
              <span className="activity-time">2 hours ago</span>
            </div>

            <div className="activity-item">
              <div className="activity-icon-wrapper activity-info">
                <span>📝</span>
              </div>
              <div className="activity-content">
                <p className="activity-title">Assessment created</p>
                <p className="activity-description">Mathematics Quiz for Grade 5</p>
              </div>
              <span className="activity-time">5 hours ago</span>
            </div>

            <div className="activity-item">
              <div className="activity-icon-wrapper activity-warning">
                <span>👤</span>
              </div>
              <div className="activity-content">
                <p className="activity-title">New teacher added</p>
                <p className="activity-description">John Doe - Science Department</p>
              </div>
              <span className="activity-time">1 day ago</span>
            </div>

            <div className="activity-empty">
              <span className="empty-icon">📭</span>
              <p>No more recent activities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
