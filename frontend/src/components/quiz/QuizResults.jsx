import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './QuizResults.css';

const QuizResults = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [attemptId]);

  const fetchResults = async () => {
    try {
      const response = await api.get(`/quizzes/attempt/${attemptId}`);
      setResults(response.data.data);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load results');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: '#4caf50', emoji: '🌟' };
    if (percentage >= 80) return { grade: 'A', color: '#8bc34a', emoji: '⭐' };
    if (percentage >= 70) return { grade: 'B', color: '#ffc107', emoji: '👍' };
    if (percentage >= 60) return { grade: 'C', color: '#ff9800', emoji: '👌' };
    if (percentage >= 50) return { grade: 'D', color: '#ff5722', emoji: '📚' };
    return { grade: 'F', color: '#f44336', emoji: '💪' };
  };

  if (loading) {
    return (
      <div className="quiz-results-page">
        <div className="loading">Loading results...</div>
      </div>
    );
  }

  const gradeInfo = getGrade(results.percentage);
  const correctAnswers = results.answers.filter(a => a.isCorrect).length;

  return (
    <div className="quiz-results-page">
      {/* Header */}
      <div className="results-header">
        <h1 className="results-title">Quiz Complete! {gradeInfo.emoji}</h1>
        <p className="results-subtitle">Here's how you did</p>
      </div>

      {/* Score Card */}
      <div className="score-card">
        <div className="score-circle" style={{ borderColor: gradeInfo.color }}>
          <div className="score-percentage" style={{ color: gradeInfo.color }}>
            {results.percentage}%
          </div>
          <div className="score-grade" style={{ color: gradeInfo.color }}>
            Grade {gradeInfo.grade}
          </div>
        </div>

        <div className="score-details">
          <div className="score-detail-item">
            <span className="detail-label">Score</span>
            <span className="detail-value">
              {results.score} / {results.totalPoints}
            </span>
          </div>
          <div className="score-detail-item">
            <span className="detail-label">Correct Answers</span>
            <span className="detail-value">
              {correctAnswers} / {results.answers.length}
            </span>
          </div>
          <div className="score-detail-item">
            <span className="detail-label">Time Taken</span>
            <span className="detail-value">{formatTime(results.timeTaken)}</span>
          </div>
        </div>
      </div>

      {/* Gamification Rewards */}
      {results.gamificationRewards && (
        <div className="rewards-section">
          <h2 className="section-title">🎮 Rewards Earned</h2>
          <div className="rewards-grid">
            <div className="reward-card">
              <div className="reward-icon">⭐</div>
              <div className="reward-content">
                <div className="reward-label">Points Earned</div>
                <div className="reward-value">
                  +{results.gamificationRewards.pointsEarned}
                </div>
              </div>
            </div>

            <div className="reward-card">
              <div className="reward-icon">📊</div>
              <div className="reward-content">
                <div className="reward-label">Total Points</div>
                <div className="reward-value">
                  {results.gamificationRewards.totalPoints}
                </div>
              </div>
            </div>

            <div className="reward-card">
              <div className="reward-icon">🎯</div>
              <div className="reward-content">
                <div className="reward-label">Level</div>
                <div className="reward-value">
                  {results.gamificationRewards.level}
                </div>
              </div>
            </div>

            <div className="reward-card">
              <div className="reward-icon">🔥</div>
              <div className="reward-content">
                <div className="reward-label">Streak</div>
                <div className="reward-value">
                  {results.gamificationRewards.currentStreak} days
                </div>
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          {results.gamificationRewards.awards && results.gamificationRewards.awards.length > 0 && (
            <div className="badges-earned">
              <h3 className="badges-title">🏆 New Badges!</h3>
              <div className="badges-list">
                {results.gamificationRewards.awards
                  .filter(award => award.type === 'badge')
                  .map((award, index) => (
                    <div key={index} className="badge-earned">
                      <span className="badge-icon-large">{award.value.icon}</span>
                      <div className="badge-info">
                        <div className="badge-name">{award.value.name}</div>
                        <div className="badge-desc">{award.value.description}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Answer Review */}
      <div className="answers-section">
        <h2 className="section-title">📝 Answer Review</h2>
        <div className="answers-list">
          {results.answers.map((answer, index) => (
            <div
              key={index}
              className={`answer-card ${answer.isCorrect ? 'correct' : 'incorrect'}`}
            >
              <div className="answer-header">
                <span className="answer-number">Question {index + 1}</span>
                <span className={`answer-status ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                  {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>

              <p className="answer-question">{answer.questionText}</p>

              <div className="answer-options">
                {answer.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`answer-option ${
                      optIndex === answer.selectedAnswer ? 'selected' : ''
                    } ${optIndex === answer.correctAnswer ? 'correct-answer' : ''}`}
                  >
                    <span className="option-letter-small">
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <span className="option-text-small">{option}</span>
                    {optIndex === answer.correctAnswer && (
                      <span className="correct-badge">Correct Answer</span>
                    )}
                    {optIndex === answer.selectedAnswer && optIndex !== answer.correctAnswer && (
                      <span className="your-answer-badge">Your Answer</span>
                    )}
                  </div>
                ))}
              </div>

              {answer.explanation && (
                <div className="answer-explanation">
                  <strong>Explanation:</strong> {answer.explanation}
                </div>
              )}

              <div className="answer-points">
                Points: {answer.pointsEarned} / {answer.options.length > 0 ? 10 : 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="results-actions">
        <button
          className="action-btn action-btn-secondary"
          onClick={() => navigate(`/quizzes/${results.studentId._id}`)}
        >
          Take Another Quiz
        </button>
        <button
          className="action-btn action-btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
