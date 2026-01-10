import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './GameResults.css';

const GameResults = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [attemptId]);

  const fetchResults = async () => {
    try {
      const response = await api.get(`/games/attempt/${attemptId}`);
      setResults(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load results');
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
      <div className="game-results-page">
        <div className="loading">Loading results...</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="game-results-page">
        <div className="error">Could not load results</div>
      </div>
    );
  }

  const gradeInfo = getGrade(results.percentage);

  return (
    <div className="game-results-page">
      <div className="results-container">
        {/* Score Circle */}
        <div className="score-circle" style={{ borderColor: gradeInfo.color }}>
          <div className="score-emoji">{gradeInfo.emoji}</div>
          <div className="score-percentage">{results.percentage}%</div>
          <div className="score-grade" style={{ color: gradeInfo.color }}>
            Grade {gradeInfo.grade}
          </div>
          <div className="score-points">
            {results.score} / {results.maxScore} points
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{formatTime(results.timeTaken)}</div>
            <div className="stat-label">Time Taken</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{results.metrics?.accuracy || 0}%</div>
            <div className="stat-label">Accuracy</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">{results.metrics?.speed || 0}</div>
            <div className="stat-label">Q/min</div>
          </div>
        </div>

        {/* Gamification Rewards */}
        {results.gamificationRewards && (
          <div className="rewards-section">
            <h2>🎁 Rewards Earned</h2>
            <div className="rewards-grid">
              <div className="reward-card">
                <div className="reward-icon">⭐</div>
                <div className="reward-value">+{results.gamificationRewards.pointsEarned}</div>
                <div className="reward-label">Points Earned</div>
              </div>

              <div className="reward-card">
                <div className="reward-icon">💎</div>
                <div className="reward-value">{results.gamificationRewards.totalPoints}</div>
                <div className="reward-label">Total Points</div>
              </div>

              <div className="reward-card">
                <div className="reward-icon">📈</div>
                <div className="reward-value">Level {results.gamificationRewards.level}</div>
                <div className="reward-label">Current Level</div>
              </div>

              <div className="reward-card">
                <div className="reward-icon">🔥</div>
                <div className="reward-value">{results.gamificationRewards.currentStreak}</div>
                <div className="reward-label">Day Streak</div>
              </div>
            </div>

            {results.gamificationRewards.awards && results.gamificationRewards.awards.length > 0 && (
              <div className="badges-section">
                <h3>Badges Unlocked!</h3>
                <div className="badges-list">
                  {results.gamificationRewards.awards
                    .filter(a => a.type === 'badge')
                    .map((award, index) => (
                      <div key={index} className="badge-earned">
                        <div className="badge-icon">🏆</div>
                        <div className="badge-name">{award.reason}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/games/${results.studentId._id}`)}
          >
            ← Back to Games
          </button>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Play Again 🎮
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResults;
