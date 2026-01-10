import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './Dashboard.css';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Failed to load students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;

    const matchesSubject = filterSubject === 'all' ||
      student.subjects?.includes(filterSubject);

    return matchesSearch && matchesGrade && matchesSubject;
  });

  const uniqueGrades = Array.from(new Set(students.map((s) => s.grade))).sort();
  const uniqueSubjects = Array.from(new Set(students.flatMap((s) => s.subjects || []))).sort();

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
          <div className="school-badge">
            <span className="school-icon">👨‍🏫</span>
            <div className="school-info">
              <span className="school-name">Teacher Portal</span>
              <span className="school-code">{students.length} Students</span>
            </div>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="user-menu">
            <div className="user-avatar">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-role">Teacher</span>
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
            <p className="dashboard-subtitle">Monitor and guide your students' progress</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">Total Students</div>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <div className="stat-value">{uniqueGrades.length}</div>
              <div className="stat-label">Grade Levels</div>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">📖</div>
            <div className="stat-info">
              <div className="stat-value">{uniqueSubjects.length}</div>
              <div className="stat-label">Subjects</div>
            </div>
          </div>

          <div className="stat-card stat-card-info">
            <div className="stat-icon">🔍</div>
            <div className="stat-info">
              <div className="stat-value">{filteredStudents.length}</div>
              <div className="stat-label">Filtered Results</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="section-header">
          <h2 className="section-title">🎓 Student Directory</h2>
        </div>

        <div className="card" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '2', minWidth: '250px', marginBottom: 0 }}>
              <label className="form-label">Search Students</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ flex: '1', minWidth: '150px', marginBottom: 0 }}>
              <label className="form-label">Filter by Grade</label>
              <select
                className="form-select"
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
              >
                <option value="all">All Grades</option>
                {uniqueGrades.map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: '1', minWidth: '150px', marginBottom: 0 }}>
              <label className="form-label">Filter by Subject</label>
              <select
                className="form-select"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="all">All Subjects</option>
                {uniqueSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="card">
            <div className="activity-empty">
              <span className="empty-icon">🔍</span>
              <p>No students found matching your criteria</p>
            </div>
          </div>
        ) : (
          <div className="students-grid">
            {filteredStudents.map((student) => (
              <div key={student._id} className="card" style={{ padding: 'var(--spacing-xl)' }}>
                {/* Student Header */}
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                  <div className="user-avatar" style={{ width: '60px', height: '60px', fontSize: '1.25rem' }}>
                    {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 'var(--spacing-xs)' }}>
                      {student.firstName} {student.lastName}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                      ID: {student.studentId}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                      Grade {student.grade}
                    </p>
                  </div>
                </div>

                {/* Subjects */}
                <div style={{ marginBottom: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--gray-200)' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: 'var(--spacing-sm)' }}>
                    Subjects
                  </h4>
                  <div className="tag-list">
                    {student.subjects?.length > 0 ? (
                      student.subjects.map((subject, idx) => (
                        <span key={idx} className="badge badge-primary">
                          {subject}
                        </span>
                      ))
                    ) : (
                      <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>No subjects assigned</p>
                    )}
                  </div>
                </div>

                {/* Learning Profile */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <strong style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                      💪 Strengths:
                    </strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                      {student.learningProfile?.strengths?.length > 0
                        ? student.learningProfile.strengths.slice(0, 2).join(', ')
                        : 'Not yet identified'}
                    </p>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                      🎯 Needs Attention:
                    </strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                      {student.learningProfile?.weaknesses?.length > 0
                        ? student.learningProfile.weaknesses.slice(0, 2).join(', ')
                        : 'Not yet identified'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <Link
                    to={`/upload-assessment/${student._id}`}
                    className="btn btn-success btn-sm"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    📸 Upload Assessment
                  </Link>
                  <Link
                    to={`/student/${student._id}/progress`}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    View Progress
                  </Link>
                  <Link
                    to={`/student/${student._id}/assessments`}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Assessments
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
