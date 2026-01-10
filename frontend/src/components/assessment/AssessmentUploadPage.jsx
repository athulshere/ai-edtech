import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AssessmentUpload from './AssessmentUpload';

const AssessmentUploadPage = () => {
  const { studentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      const response = await api.get(`/parent/children/${studentId}`);
      setStudent(response.data.data);
    } catch (error) {
      console.error('Error fetching student:', error);
      toast.error('Student not found or you do not have access');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading student information...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="dashboard-container">
        <div className="error">Student not found</div>
      </div>
    );
  }

  return <AssessmentUpload student={student} />;
};

export default AssessmentUploadPage;
