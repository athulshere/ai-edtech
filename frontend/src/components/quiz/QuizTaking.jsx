import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './QuizTaking.css';

const QuizTaking = () => {
  const { quizId, studentId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    startQuiz();
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0 && quiz) {
      handleSubmit();
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (startTime) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, quiz.timeLimit - elapsed);
        setTimeRemaining(remaining);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startTime, quiz]);

  const startQuiz = async () => {
    try {
      const response = await api.post('/quizzes/start', {
        studentId,
        quizId
      });

      const { attemptId, quiz: quizData, startedAt } = response.data.data;
      setQuiz(quizData);
      setAttemptId(attemptId);
      setStartTime(new Date(startedAt).getTime());
      setTimeRemaining(quizData.timeLimit);
      setAnswers(new Array(quizData.questions.length).fill({ selectedAnswer: null }));
      setLoading(false);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error(error.response?.data?.message || 'Failed to start quiz');
      navigate(`/quizzes/${studentId}`);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = { selectedAnswer: optionIndex };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    // Check if all questions are answered
    const unanswered = answers.filter(a => a.selectedAnswer === null).length;
    if (unanswered > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);

    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      const response = await api.post(`/quizzes/submit/${attemptId}`, {
        answers,
        timeTaken
      });

      toast.success('Quiz submitted successfully!');
      navigate(`/quiz/results/${attemptId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining > 60) return '#4caf50';
    if (timeRemaining > 30) return '#ff9800';
    return '#f44336';
  };

  if (loading) {
    return (
      <div className="quiz-taking-page">
        <div className="loading">Loading quiz...</div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = answers.filter(a => a.selectedAnswer !== null).length;

  return (
    <div className="quiz-taking-page">
      {/* Header */}
      <div className="quiz-header-bar">
        <div className="quiz-info">
          <h2 className="quiz-title-small">{quiz.title}</h2>
          <p className="question-counter">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className="timer" style={{ color: getTimeColor() }}>
          <span className="timer-icon">⏱️</span>
          <span className="timer-text">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Question Card */}
      <div className="question-container">
        <div className="question-card">
          <div className="question-header">
            <span className="question-number">Question {currentQuestion + 1}</span>
            <span className="question-points">{question.points} points</span>
          </div>

          <h3 className="question-text">{question.questionText}</h3>

          <div className="options-list">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  answers[currentQuestion]?.selectedAnswer === index ? 'selected' : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {answers[currentQuestion]?.selectedAnswer === index && (
                  <span className="check-icon">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="quiz-navigation">
          <div className="nav-left">
            <button
              className="nav-btn"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>
          </div>

          <div className="nav-center">
            <span className="answered-count">
              {answeredCount} / {quiz.questions.length} answered
            </span>
          </div>

          <div className="nav-right">
            {currentQuestion < quiz.questions.length - 1 ? (
              <button className="nav-btn nav-btn-primary" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="question-navigator">
          <p className="navigator-title">Quick Navigation:</p>
          <div className="question-dots">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                className={`question-dot ${
                  index === currentQuestion ? 'active' : ''
                } ${answers[index]?.selectedAnswer !== null ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;
