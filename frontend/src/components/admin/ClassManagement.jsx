import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../dashboard/Dashboard.css';
import './ClassManagement.css';

const ClassManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showCreateSection, setShowCreateSection] = useState(false);

  // Form states
  const [newClass, setNewClass] = useState({
    name: '',
    code: '',
    level: 1,
    description: '',
    capacity: 50,
  });

  const [newSection, setNewSection] = useState({
    classId: '',
    name: '',
    roomNumber: '',
    floor: '',
    capacity: 50,
  });

  useEffect(() => {
    fetchClasses();
    fetchSections();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await api.get('/sections');
      setSections(response.data.data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const currentYear = new Date().getFullYear();
      const classData = {
        ...newClass,
        academicYear: {
          start: currentYear,
          end: currentYear + 1,
        },
      };

      await api.post('/classes', classData);

      toast.success('Class created successfully!');
      setShowCreateClass(false);
      setNewClass({
        name: '',
        code: '',
        level: 1,
        description: '',
        capacity: 50,
      });
      fetchClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create class');
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sections', newSection);

      toast.success('Section created successfully!');
      setShowCreateSection(false);
      setNewSection({
        classId: '',
        name: '',
        roomNumber: '',
        floor: '',
        capacity: 50,
      });
      fetchSections();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create section');
    }
  };

  const getSectionsForClass = (classId) => {
    return sections.filter((section) => {
      const sectionClassId =
        typeof section.classId === 'string'
          ? section.classId
          : section.classId._id;
      return sectionClassId === classId;
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const totalSections = sections.length;
  const totalStudents = sections.reduce((sum, section) => sum + section.currentStudents, 0);
  const averageClassSize = totalStudents > 0 && classes.length > 0
    ? Math.round(totalStudents / classes.length)
    : 0;

  return (
    <div className="dashboard-wrapper class-management-wrapper">
      {/* Top Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">AI EdTech</span>
        </div>

        <div className="navbar-center">
          <div className="school-badge">
            <span className="school-icon">🏫</span>
            <div className="school-info">
              <span className="school-name">Class Management</span>
              <span className="school-code">{classes.length} Classes</span>
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
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Class & Section Management 🏫</h1>
            <p className="dashboard-subtitle">Organize your school structure</p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => setShowCreateClass(true)}
              className="btn btn-primary"
            >
              ➕ Create Class
            </button>
            <button
              onClick={() => setShowCreateSection(true)}
              className="btn btn-primary"
            >
              ➕ Create Section
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">🏫</div>
            <div className="stat-info">
              <div className="stat-value">{classes.length}</div>
              <div className="stat-label">Total Classes</div>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <div className="stat-value">{totalSections}</div>
              <div className="stat-label">Sections</div>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-value">{totalStudents}</div>
              <div className="stat-label">Students Enrolled</div>
            </div>
          </div>

          <div className="stat-card stat-card-info">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{averageClassSize}</div>
              <div className="stat-label">Avg. Class Size</div>
            </div>
          </div>
        </div>

        {/* Create Class Modal */}
        {showCreateClass && (
          <div className="modal-overlay" onClick={() => setShowCreateClass(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Class</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowCreateClass(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateClass} className="modal-form">
                <div className="form-group">
                  <label htmlFor="name">Class Name</label>
                  <input
                    type="text"
                    id="name"
                    value={newClass.name}
                    onChange={(e) =>
                      setNewClass({ ...newClass, name: e.target.value })
                    }
                    placeholder="e.g., Grade 5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="code">Class Code</label>
                  <input
                    type="text"
                    id="code"
                    value={newClass.code}
                    onChange={(e) =>
                      setNewClass({ ...newClass, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g., G5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="level">Grade Level</label>
                  <select
                    id="level"
                    value={newClass.level}
                    onChange={(e) =>
                      setNewClass({ ...newClass, level: parseInt(e.target.value) })
                    }
                    required
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Grade {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="capacity">Capacity</label>
                  <input
                    type="number"
                    id="capacity"
                    value={newClass.capacity}
                    onChange={(e) =>
                      setNewClass({ ...newClass, capacity: parseInt(e.target.value) })
                    }
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description (Optional)</label>
                  <textarea
                    id="description"
                    value={newClass.description}
                    onChange={(e) =>
                      setNewClass({ ...newClass, description: e.target.value })
                    }
                    placeholder="Additional information about the class"
                    rows={3}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateClass(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Section Modal */}
        {showCreateSection && (
          <div className="modal-overlay" onClick={() => setShowCreateSection(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Section</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowCreateSection(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateSection} className="modal-form">
                <div className="form-group">
                  <label htmlFor="classId">Select Class</label>
                  <select
                    id="classId"
                    value={newSection.classId}
                    onChange={(e) =>
                      setNewSection({ ...newSection, classId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} ({cls.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sectionName">Section Name</label>
                  <input
                    type="text"
                    id="sectionName"
                    value={newSection.name}
                    onChange={(e) =>
                      setNewSection({ ...newSection, name: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g., A, B, C"
                    maxLength={1}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="roomNumber">Room Number (Optional)</label>
                  <input
                    type="text"
                    id="roomNumber"
                    value={newSection.roomNumber}
                    onChange={(e) =>
                      setNewSection({ ...newSection, roomNumber: e.target.value })
                    }
                    placeholder="e.g., 101"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="floor">Floor (Optional)</label>
                  <input
                    type="text"
                    id="floor"
                    value={newSection.floor}
                    onChange={(e) =>
                      setNewSection({ ...newSection, floor: e.target.value })
                    }
                    placeholder="e.g., First, Second"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sectionCapacity">Capacity</label>
                  <input
                    type="number"
                    id="sectionCapacity"
                    value={newSection.capacity}
                    onChange={(e) =>
                      setNewSection({ ...newSection, capacity: parseInt(e.target.value) })
                    }
                    min="1"
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateSection(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Section
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="card">
            <div className="activity-empty">
              <span className="empty-icon">🏫</span>
              <p>No classes yet. Create your first class to organize students and sections</p>
              <button
                onClick={() => setShowCreateClass(true)}
                className="btn btn-primary"
                style={{ marginTop: 'var(--spacing-lg)' }}
              >
                Create First Class
              </button>
            </div>
          </div>
        ) : (
          <div className="classes-grid">
            {classes.map((cls) => {
              const classSections = getSectionsForClass(cls._id);
              const totalClassStudents = classSections.reduce(
                (sum, section) => sum + section.currentStudents,
                0
              );
              const utilizationRate = cls.capacity && cls.capacity > 0
                ? Math.round((totalClassStudents / cls.capacity) * 100)
                : 0;

              return (
                <div key={cls._id} className="card" style={{ padding: 'var(--spacing-xl)' }}>
                  {/* Class Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 'var(--spacing-xs)' }}>
                        {cls.name}
                      </h3>
                      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                          {cls.code}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                          Grade {cls.level}
                        </span>
                      </div>
                    </div>
                    <div className="badge badge-info" style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}>
                      {utilizationRate}% Full
                    </div>
                  </div>

                  {/* Description */}
                  {cls.description && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 'var(--spacing-lg)' }}>
                      {cls.description}
                    </p>
                  )}

                  {/* Class Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-lg)',
                    paddingBottom: 'var(--spacing-lg)',
                    borderBottom: '1px solid var(--gray-200)'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {classSections.length}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Sections
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                        {totalClassStudents}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Students
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-700)' }}>
                        {cls.capacity || 0}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Capacity
                      </div>
                    </div>
                  </div>

                  {/* Sections List */}
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: 'var(--spacing-sm)' }}>
                      📚 Sections
                    </h4>
                    {classSections.length === 0 ? (
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', margin: 0, fontStyle: 'italic' }}>
                        No sections created yet
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                        {classSections.map((section) => (
                          <div
                            key={section._id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--spacing-xs)',
                              padding: '0.5rem 0.75rem',
                              background: 'var(--gray-50)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--gray-200)',
                              fontSize: '0.875rem'
                            }}
                          >
                            <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                              Section {section.name}
                            </span>
                            <span style={{ color: 'var(--gray-500)' }}>•</span>
                            <span style={{ color: 'var(--gray-600)' }}>
                              {section.currentStudents} students
                            </span>
                            {section.roomNumber && (
                              <>
                                <span style={{ color: 'var(--gray-500)' }}>•</span>
                                <span style={{ color: 'var(--gray-600)' }}>
                                  Room {section.roomNumber}
                                </span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setNewSection({ ...newSection, classId: cls._id });
                        setShowCreateSection(true);
                      }}
                      style={{ flex: 1 }}
                    >
                      ➕ Add Section
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;
