import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './QuizList.css';

const QuizList = () => {
  const { studentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  useEffect(() => {
    if (student) {
      fetchQuizzes();
    }
  }, [student]);

  useEffect(() => {
    if (selectedSubject === 'All') {
      setFilteredQuizzes(quizzes);
    } else {
      setFilteredQuizzes(quizzes.filter(q => q.subject === selectedSubject));
    }
  }, [selectedSubject, quizzes]);

  const fetchStudent = async () => {
    try {
      const response = await api.get(`/parent/children/${studentId}`);
      setStudent(response.data.data);
    } catch (error) {
      console.error('Error fetching student:', error);
      toast.error('Student not found');
      navigate('/dashboard');
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await api.get(`/quizzes/grade/${student.grade}`);
      setQuizzes(response.data.data || []);
      setFilteredQuizzes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}/take/${studentId}`);
  };

  const subjects = ['All', ...new Set(quizzes.map(q => q.subject))];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#2196f3';
    }
  };

  if (loading) {
    return (
      <div className="quiz-list-page">
        <div className="loading">Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div className="quiz-list-page">
      {/* Header */}
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h1 className="page-title">
            🎮 Quizzes for {student?.firstName}
          </h1>
          <p className="page-subtitle">
            Grade {student?.grade} - {filteredQuizzes.length} quizzes available
          </p>
        </div>
      </div>

      {/* Subject Filter */}
      <div className="filter-section">
        <label className="filter-label">Filter by Subject:</label>
        <div className="subject-filters">
          {subjects.map(subject => (
            <button
              key={subject}
              className={`subject-filter-btn ${selectedSubject === subject ? 'active' : ''}`}
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="quizzes-grid">
        {filteredQuizzes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📝</span>
            <p>No quizzes available for this subject</p>
          </div>
        ) : (
          filteredQuizzes.map(quiz => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-header">
                <h3 className="quiz-title">{quiz.title}</h3>
                <span
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(quiz.difficulty) }}
                >
                  {quiz.difficulty}
                </span>
              </div>

              <p className="quiz-description">{quiz.description}</p>

              <div className="quiz-meta">
                <div className="meta-item">
                  <span className="meta-icon">📚</span>
                  <span className="meta-text">{quiz.subject}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">❓</span>
                  <span className="meta-text">{quiz.questions?.length || 0} Questions</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">⏱️</span>
                  <span className="meta-text">{Math.floor(quiz.timeLimit / 60)} Minutes</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">⭐</span>
                  <span className="meta-text">{quiz.totalPoints} Points</span>
                </div>
              </div>

              <button
                className="start-quiz-btn"
                onClick={() => handleStartQuiz(quiz._id)}
              >
                Start Quiz →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizList;
