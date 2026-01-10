import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GamificationCard.css';

const GamificationCard = ({ student }) => {
  const navigate = useNavigate();
  const gamification = student?.gamification || {
    totalPoints: 0,
    level: 1,
    badges: [],
    streaks: { current: 0, longest: 0 }
  };

  const pointsToNextLevel = ((gamification.level) * 100) - gamification.totalPoints;
  const progressPercentage = (gamification.totalPoints % 100);

  return (
    <div
      className="gamification-card"
      onClick={() => navigate(`/gamification/${student._id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="gamification-header">
        <h3>🎮 Learning Progress</h3>
        <p style={{ fontSize: '0.85rem', margin: '0.5rem 0 0 0', opacity: 0.9 }}>
          Click to view details →
        </p>
      </div>

      <div className="gamification-content">
        {/* Level and Points */}
        <div className="level-section">
          <div className="level-badge">
            <span className="level-number">{gamification.level}</span>
            <span className="level-label">Level</span>
          </div>
          <div className="points-info">
            <div className="total-points">
              <span className="points-value">{gamification.totalPoints}</span>
              <span className="points-label">Total Points</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="next-level-text">
              {pointsToNextLevel} points to Level {gamification.level + 1}
            </p>
          </div>
        </div>

        {/* Streaks */}
        <div className="streaks-section">
          <div className="streak-item">
            <span className="streak-icon">🔥</span>
            <div className="streak-details">
              <span className="streak-value">{gamification.streaks.current}</span>
              <span className="streak-label">Day Streak</span>
            </div>
          </div>
          <div className="streak-item">
            <span className="streak-icon">🏆</span>
            <div className="streak-details">
              <span className="streak-value">{gamification.streaks.longest}</span>
              <span className="streak-label">Best Streak</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="badges-section">
          <h4 className="badges-title">
            Badges ({gamification.badges.length})
          </h4>
          <div className="badges-grid">
            {gamification.badges.length === 0 ? (
              <p className="no-badges">No badges earned yet. Keep learning!</p>
            ) : (
              gamification.badges.slice(0, 6).map((badge, index) => (
                <div key={index} className="badge-item" title={badge.description}>
                  <span className="badge-icon">{badge.icon}</span>
                  <span className="badge-name">{badge.name}</span>
                </div>
              ))
            )}
          </div>
          {gamification.badges.length > 6 && (
            <p className="more-badges">
              +{gamification.badges.length - 6} more badges
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationCard;
