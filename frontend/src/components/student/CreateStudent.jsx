import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Student.css';

const CreateStudent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentCredentials, setParentCredentials] = useState(null);
  const [subjectInput, setSubjectInput] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    grade: '',
    subjects: [],
    // Parent options
    createNewParent: true,
    parentEmail: '',
    parentFirstName: '',
    parentLastName: '',
    parentPhone: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const addSubject = () => {
    if (subjectInput.trim() && !formData.subjects.includes(subjectInput.trim())) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, subjectInput.trim()],
      });
      setSubjectInput('');
    }
  };

  const removeSubject = (subject) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((s) => s !== subject),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.grade) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate parent information if creating new parent
    if (formData.createNewParent && (user.role === 'admin' || user.role === 'teacher')) {
      if (!formData.parentEmail) {
        toast.error('Parent email is required');
        return;
      }
      if (!formData.parentFirstName || !formData.parentLastName) {
        toast.error('Parent name is required');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await studentAPI.createStudent(formData);

      toast.success('Student created successfully!');

      // If parent was created, show credentials
      if (response.data.parentCreated && response.data.parentCredentials) {
        setParentCredentials(response.data.parentCredentials);
      } else {
        // Navigate to dashboard if no parent credentials to show
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating student:', error);
      toast.error(error.response?.data?.message || 'Failed to create student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeCredentialsModal = () => {
    setParentCredentials(null);
    navigate('/dashboard');
  };

  // If parent credentials modal is showing
  if (parentCredentials) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Student & Parent Created Successfully!</h2>
          </div>

          <div className="temp-password-display">
            <div className="success-icon">✓</div>
            <h3>Parent Account Created</h3>
            <p className="instruction-text">
              Share the following credentials with the parent:
            </p>

            <div className="credentials-box">
              <div className="credential-row">
                <strong>Email:</strong>
                <code>{parentCredentials.email}</code>
              </div>
              <div className="credential-row">
                <strong>Temporary Password:</strong>
                <code>{parentCredentials.temporaryPassword}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(parentCredentials.temporaryPassword);
                    toast.success('Password copied to clipboard!');
                  }}
                  className="btn-copy-small"
                >
                  Copy
                </button>
              </div>
            </div>

            <p className="warning-text">
              ⚠️ {parentCredentials.message}
            </p>

            <button onClick={closeCredentialsModal} className="btn btn-primary">
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-student-container">
      <div className="create-student-card">
        <h1>Add New Student</h1>
        <p className="subtitle">Enter student and parent information below</p>

        <form onSubmit={handleSubmit} className="student-form">
          {/* Student Information Section */}
          <div className="form-section">
            <h3 className="section-title">Student Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="grade">Grade *</label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select grade</option>
                  <option value="K">Kindergarten</option>
                  <option value="1">1st Grade</option>
                  <option value="2">2nd Grade</option>
                  <option value="3">3rd Grade</option>
                  <option value="4">4th Grade</option>
                  <option value="5">5th Grade</option>
                  <option value="6">6th Grade</option>
                  <option value="7">7th Grade</option>
                  <option value="8">8th Grade</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                  <option value="11">11th Grade</option>
                  <option value="12">12th Grade</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subjects">Subjects (Optional)</label>
              <div className="subject-input-group">
                <input
                  type="text"
                  id="subjects"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                  placeholder="Type a subject and press Enter"
                />
                <button
                  type="button"
                  onClick={addSubject}
                  className="btn btn-secondary"
                  disabled={!subjectInput.trim()}
                >
                  Add
                </button>
              </div>

              {formData.subjects.length > 0 && (
                <div className="subjects-list">
                  {formData.subjects.map((subject) => (
                    <span key={subject} className="subject-tag">
                      {subject}
                      <button
                        type="button"
                        onClick={() => removeSubject(subject)}
                        className="remove-subject"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Parent Information Section - Only for Admin/Teacher */}
          {(user.role === 'admin' || user.role === 'teacher') && (
            <div className="form-section">
              <h3 className="section-title">Parent Information</h3>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="createNewParent"
                    checked={formData.createNewParent}
                    onChange={handleChange}
                  />
                  <span>Create new parent account for this student</span>
                </label>
                <p className="helper-text">
                  {formData.createNewParent
                    ? 'A parent account will be created with temporary credentials'
                    : 'You will need to link an existing parent account after creation'}
                </p>
              </div>

              {formData.createNewParent && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="parentFirstName">Parent First Name *</label>
                      <input
                        type="text"
                        id="parentFirstName"
                        name="parentFirstName"
                        value={formData.parentFirstName}
                        onChange={handleChange}
                        placeholder="Parent's first name"
                        required={formData.createNewParent}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="parentLastName">Parent Last Name *</label>
                      <input
                        type="text"
                        id="parentLastName"
                        name="parentLastName"
                        value={formData.parentLastName}
                        onChange={handleChange}
                        placeholder="Parent's last name"
                        required={formData.createNewParent}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="parentEmail">Parent Email *</label>
                      <input
                        type="email"
                        id="parentEmail"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleChange}
                        placeholder="parent@example.com"
                        required={formData.createNewParent}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="parentPhone">Parent Phone</label>
                      <input
                        type="tel"
                        id="parentPhone"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div className="info-box">
                    <strong>Note:</strong> A temporary password will be generated and you'll need
                    to share it with the parent. They will be required to change it on first login.
                  </div>
                </>
              )}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;
