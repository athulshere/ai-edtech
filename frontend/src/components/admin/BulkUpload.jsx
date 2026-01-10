import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './BulkUpload.css';

const BulkUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Please upload a valid Excel file (.xls or .xlsx)');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setUploadResults(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get('/admin/students/template', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_bulk_upload_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Template downloaded successfully');
    } catch (error) {
      console.error('Download template error:', error);
      toast.error('Failed to download template');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/admin/students/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadResults(response.data.data);
      toast.success(response.data.message || 'Upload completed successfully');

      // Download credentials if available
      if (response.data.data.credentialsFile) {
        downloadCredentials(response.data.data.credentialsFile);
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const downloadCredentials = (base64Data) => {
    try {
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `student_credentials_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.info('Student credentials downloaded');
    } catch (error) {
      console.error('Download credentials error:', error);
      toast.error('Failed to download credentials');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bulk-upload-container">
      <div className="bulk-upload-header">
        <div>
          <h1 className="page-title">📤 Bulk Upload Students</h1>
          <p className="page-subtitle">Upload multiple students at once using an Excel file</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Instructions Section */}
      <div className="card mb-lg">
        <h2 className="section-title">📋 How to Use Bulk Upload</h2>
        <ol className="instructions-list">
          <li>
            <strong>Download the Excel template</strong> by clicking the button below
          </li>
          <li>
            <strong>Fill in student details</strong> in the template (First Name, Last Name, DOB, Grade, etc.)
          </li>
          <li>
            <strong>Include parent information</strong> (Email or Phone Number required)
          </li>
          <li>
            <strong>Upload the completed file</strong> using the upload area
          </li>
          <li>
            <strong>Download student credentials</strong> after successful upload
          </li>
        </ol>

        <div className="template-section">
          <button className="btn btn-primary" onClick={handleDownloadTemplate}>
            📥 Download Excel Template
          </button>
          <p className="help-text mt-sm">
            The template includes sample data to help you format your student information correctly
          </p>
        </div>
      </div>

      {/* Upload Section */}
      {!uploadResults && (
        <div className="card">
          <h2 className="section-title">📂 Upload Student Data</h2>

          <div
            className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {!file ? (
              <>
                <div className="drop-icon">📄</div>
                <p className="drop-title">Drag & drop your Excel file here</p>
                <p className="drop-subtitle">or click to browse</p>
                <p className="drop-hint">Supports .xls and .xlsx files (max 10MB)</p>
              </>
            ) : (
              <>
                <div className="drop-icon success">✓</div>
                <p className="drop-title">{file.name}</p>
                <p className="drop-subtitle">{(file.size / 1024).toFixed(2)} KB</p>
                <button
                  className="btn btn-sm btn-danger mt-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetUpload();
                  }}
                >
                  Remove File
                </button>
              </>
            )}
          </div>

          {file && (
            <div className="upload-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="spinner"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    📤 Upload Students
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Section */}
      {uploadResults && (
        <div className="card">
          <h2 className="section-title">✅ Upload Results</h2>

          <div className="results-summary">
            <div className="summary-card summary-total">
              <div className="summary-value">{uploadResults.summary.total}</div>
              <div className="summary-label">Total Records</div>
            </div>
            <div className="summary-card summary-success">
              <div className="summary-value">{uploadResults.summary.created}</div>
              <div className="summary-label">Successfully Created</div>
            </div>
            <div className="summary-card summary-error">
              <div className="summary-value">{uploadResults.summary.failed}</div>
              <div className="summary-label">Failed</div>
            </div>
            <div className="summary-card summary-info">
              <div className="summary-value">{uploadResults.summary.parentsCreated}</div>
              <div className="summary-label">Parents Created</div>
            </div>
          </div>

          {uploadResults.successRecords.length > 0 && (
            <div className="results-section">
              <h3 className="results-subtitle">✓ Successfully Created Students</h3>
              <div className="results-table-wrapper">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Register Number</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th>Parent Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadResults.successRecords.slice(0, 10).map((record, idx) => (
                      <tr key={idx}>
                        <td>{record.studentId}</td>
                        <td>{record.name}</td>
                        <td>{record.registerNumber}</td>
                        <td><code>{record.username}</code></td>
                        <td><code>{record.password}</code></td>
                        <td>{record.parentEmail || record.parentPhone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {uploadResults.successRecords.length > 10 && (
                <p className="table-note">
                  Showing 10 of {uploadResults.successRecords.length} successful records.
                  Download the credentials file for complete list.
                </p>
              )}
            </div>
          )}

          {uploadResults.errorRecords.length > 0 && (
            <div className="results-section error-section">
              <h3 className="results-subtitle">❌ Failed Records</h3>
              <div className="error-list">
                {uploadResults.errorRecords.map((error, idx) => (
                  <div key={idx} className="error-item">
                    <span className="error-row">Row {error.row}</span>
                    <span className="error-message">{error.error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="results-actions">
            <button className="btn btn-primary" onClick={resetUpload}>
              📤 Upload Another File
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/students')}>
              👥 View All Students
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
