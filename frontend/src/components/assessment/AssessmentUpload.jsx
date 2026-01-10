import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Assessment.css';

const AssessmentUpload = ({ student }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    assessmentType: 'practice',
  });
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select an image file');
      return;
    }

    if (!formData.subject || !formData.topic) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('image', selectedFile);
      uploadData.append('studentId', student._id);
      uploadData.append('subject', formData.subject);
      uploadData.append('topic', formData.topic);
      uploadData.append('assessmentType', formData.assessmentType);
      uploadData.append('grade', student.grade);

      const response = await assessmentAPI.uploadAssessment(uploadData);

      toast.success('Assessment uploaded successfully! Processing in progress...');

      setTimeout(() => {
        navigate(`/assessment/${response.data.assessmentId}`);
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload assessment');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  return (
    <div className="assessment-upload">
      <h2>Upload Handwritten Assessment</h2>
      <p className="upload-subtitle">
        Upload a clear image of {student.firstName}'s handwritten work for AI analysis
      </p>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-section">
          <h3>Assessment Details</h3>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Mathematics, Science, English"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="topic">Topic *</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., Algebra, Cell Biology, Essay Writing"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="assessmentType">Assessment Type</label>
            <select
              id="assessmentType"
              name="assessmentType"
              value={formData.assessmentType}
              onChange={handleChange}
            >
              <option value="practice">Practice</option>
              <option value="homework">Homework</option>
              <option value="quiz">Quiz</option>
              <option value="exam">Exam</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Upload Image</h3>

          <div className="file-upload-area">
            {!previewUrl ? (
              <label htmlFor="file-input" className="file-upload-label">
                <div className="upload-icon">📁</div>
                <p className="upload-text">Click to upload or drag and drop</p>
                <p className="upload-hint">JPG, PNG, WEBP (Max 10MB)</p>
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </label>
            ) : (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
                <button
                  type="button"
                  className="btn-remove"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? 'Uploading and Analyzing...' : 'Upload & Analyze'}
          </button>
        </div>
      </form>

      {isUploading && (
        <div className="processing-info">
          <div className="spinner"></div>
          <p>Analyzing handwriting with Google Vision AI...</p>
          <p>Generating personalized feedback with OpenAI...</p>
          <p>This may take 30-60 seconds...</p>
        </div>
      )}
    </div>
  );
};

export default AssessmentUpload;
