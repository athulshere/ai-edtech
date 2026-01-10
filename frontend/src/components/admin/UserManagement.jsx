import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../dashboard/Dashboard.css';
import './UserManagement.css';

const UserManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tempPassword, setTempPassword] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'parent',
  });

  useEffect(() => {
    fetchUsers();
  }, [selectedRole, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedRole !== 'all') params.role = selectedRole;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/users', { params });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/users', formData);
      toast.success('User created successfully!');
      setTempPassword(response.data.temporaryPassword);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: 'parent',
      });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleResetPassword = async (userId) => {
    if (!window.confirm('Are you sure you want to reset this user\'s password?')) {
      return;
    }

    try {
      const response = await api.post(`/users/${userId}/reset-password`);
      setTempPassword(response.data.temporaryPassword);
      toast.success('Password reset successfully!');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) {
      return;
    }

    try {
      await api.patch(`/users/${userId}/deactivate`);
      toast.success('User deactivated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error('Failed to deactivate user');
    }
  };

  const handleReactivateUser = async (userId) => {
    try {
      await api.patch(`/users/${userId}/reactivate`);
      toast.success('User reactivated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error reactivating user:', error);
      toast.error('Failed to reactivate user');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const closeTempPasswordModal = () => {
    setTempPassword(null);
    setShowCreateModal(false);
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      admin: 'badge-admin',
      teacher: 'badge-teacher',
      parent: 'badge-parent',
      student: 'badge-student',
    };
    return classes[role] || 'badge-default';
  };

  return (
    <div className="dashboard-wrapper user-management-wrapper">
      {/* Top Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">AI EdTech</span>
        </div>

        <div className="navbar-center">
          <div className="school-badge">
            <span className="school-icon">👥</span>
            <div className="school-info">
              <span className="school-name">User Management</span>
              <span className="school-code">{users.length} Users</span>
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
            <h1 className="dashboard-title">User Management 👥</h1>
            <p className="dashboard-subtitle">Manage teachers, parents, and students</p>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              ← Back to Dashboard
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              ➕ Create New User
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">👨‍🏫</div>
            <div className="stat-info">
              <div className="stat-value">{users.filter(u => u.role === 'teacher').length}</div>
              <div className="stat-label">Teachers</div>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">👪</div>
            <div className="stat-info">
              <div className="stat-value">{users.filter(u => u.role === 'parent').length}</div>
              <div className="stat-label">Parents</div>
            </div>
          </div>

          <div className="stat-card stat-card-info">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">{users.filter(u => u.isActive).length}</div>
              <div className="stat-label">Active</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: '2', minWidth: '250px', marginBottom: 0 }}>
              <label className="form-label">Search Users</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ flex: '1', minWidth: '150px', marginBottom: 0 }}>
              <label className="form-label">Filter by Role</label>
              <select
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="teacher">Teachers</option>
                <option value="parent">Parents</option>
                <option value="student">Students</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="card">
            <div className="activity-empty">
              <span className="empty-icon">👥</span>
              <p>No users found</p>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem._id} style={{ opacity: !userItem.isActive ? 0.6 : 1 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '0.875rem' }}>
                          {userItem.firstName?.charAt(0)}{userItem.lastName?.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                            {userItem.firstName} {userItem.lastName}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                            {userItem.username || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>
                        <div style={{ color: 'var(--gray-900)', marginBottom: '0.25rem' }}>{userItem.email}</div>
                        <div style={{ color: 'var(--gray-600)' }}>{userItem.phoneNumber || '-'}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(userItem.role)}`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td>
                      {userItem.isActive ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-danger">Inactive</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      {new Date(userItem.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                        <button
                          onClick={() => handleResetPassword(userItem._id)}
                          className="btn btn-sm btn-secondary"
                          title="Reset Password"
                          style={{ padding: '0.375rem 0.75rem' }}
                        >
                          🔑
                        </button>
                        {userItem.isActive ? (
                          <button
                            onClick={() => handleDeactivateUser(userItem._id)}
                            className="btn btn-sm btn-danger"
                            title="Deactivate User"
                            style={{ padding: '0.375rem 0.75rem' }}
                          >
                            🚫
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivateUser(userItem._id)}
                            className="btn btn-sm btn-success"
                            title="Reactivate User"
                            style={{ padding: '0.375rem 0.75rem' }}
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => !tempPassword && setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New User</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            {!tempPassword ? (
              <form onSubmit={handleCreateUser} className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  >
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create User
                  </button>
                </div>
              </form>
            ) : (
              <div className="temp-password-display">
                <div className="success-icon">✓</div>
                <h3>User Created Successfully!</h3>
                <p className="instruction-text">
                  Share the following temporary password with the user:
                </p>
                <div className="password-box">
                  <code>{tempPassword}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tempPassword);
                      toast.success('Password copied to clipboard!');
                    }}
                    className="btn-copy"
                  >
                    Copy
                  </button>
                </div>
                <p className="warning-text">
                  ⚠️ The user will be required to change this password on first login.
                </p>
                <button
                  onClick={closeTempPasswordModal}
                  className="btn btn-primary"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Temporary Password Modal (for reset) */}
      {tempPassword && !showCreateModal && (
        <div className="modal-overlay" onClick={closeTempPasswordModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Password Reset</h2>
              <button onClick={closeTempPasswordModal} className="modal-close">
                ×
              </button>
            </div>

            <div className="temp-password-display">
              <div className="success-icon">✓</div>
              <h3>Password Reset Successfully!</h3>
              <p className="instruction-text">
                Share the following temporary password with the user:
              </p>
              <div className="password-box">
                <code>{tempPassword}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(tempPassword);
                    toast.success('Password copied to clipboard!');
                  }}
                  className="btn-copy"
                >
                  Copy
                </button>
              </div>
              <p className="warning-text">
                ⚠️ The user will be required to change this password on first login.
              </p>
              <button onClick={closeTempPasswordModal} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
