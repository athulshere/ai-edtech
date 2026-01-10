import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './GamificationPage.css';

const GamificationPage = () => {
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
      <div className="gamification-page">
        <div className="loading">Loading gamification data...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="gamification-page">
        <div className="error">Student not found</div>
      </div>
    );
  }

  const gamification = student.gamification || {
    totalPoints: 0,
    level: 1,
    badges: [],
    streaks: { current: 0, longest: 0 },
    achievements: []
  };

  const pointsToNextLevel = ((gamification.level) * 100) - gamification.totalPoints;
  const progressPercentage = (gamification.totalPoints % 100);

  return (
    <div className="gamification-page">
      {/* Header */}
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h1 className="page-title">
            🎮 {student.firstName}'s Learning Journey
          </h1>
          <p className="page-subtitle">Track progress, earn badges, and level up!</p>
        </div>
      </div>

      {/* Level and Points Overview */}
      <div className="overview-section">
        <div className="level-overview">
          <div className="level-circle">
            <div className="level-number">{gamification.level}</div>
            <div className="level-label">Level</div>
          </div>
          <div className="level-details">
            <h2>Level {gamification.level} Learner</h2>
            <div className="points-display">
              <span className="points-value">{gamification.totalPoints}</span>
              <span className="points-label">Total Points</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar-large">
                <div
                  className="progress-fill-large"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {pointsToNextLevel} points until Level {gamification.level + 1}
              </p>
            </div>
          </div>
        </div>

        <div className="streaks-overview">
          <div className="streak-card current-streak">
            <div className="streak-icon-large">🔥</div>
            <div className="streak-info">
              <div className="streak-number">{gamification.streaks.current}</div>
              <div className="streak-title">Current Streak</div>
              <div className="streak-description">
                {gamification.streaks.current === 0
                  ? 'Start learning today!'
                  : `${gamification.streaks.current} day${gamification.streaks.current > 1 ? 's' : ''} in a row`}
              </div>
            </div>
          </div>
          <div className="streak-card best-streak">
            <div className="streak-icon-large">👑</div>
            <div className="streak-info">
              <div className="streak-number">{gamification.streaks.longest}</div>
              <div className="streak-title">Best Streak</div>
              <div className="streak-description">Personal record</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="section">
        <div className="section-header-inline">
          <h2 className="section-title">🏆 Badges Earned</h2>
          <span className="badge-count">{gamification.badges.length} Badges</span>
        </div>
        <div className="badges-grid-large">
          {gamification.badges.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎯</span>
              <p>No badges earned yet</p>
              <p className="empty-description">
                Complete assessments and maintain streaks to earn badges!
              </p>
            </div>
          ) : (
            gamification.badges.map((badge, index) => (
              <div key={index} className="badge-card">
                <div className="badge-icon-large">{badge.icon}</div>
                <div className="badge-content">
                  <h3 className="badge-title">{badge.name}</h3>
                  <p className="badge-description">{badge.description}</p>
                  <p className="badge-date">
                    Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Achievements History */}
      <div className="section">
        <div className="section-header-inline">
          <h2 className="section-title">⭐ Recent Achievements</h2>
          <span className="achievement-count">
            {gamification.achievements.length} Total
          </span>
        </div>
        <div className="achievements-list">
          {gamification.achievements.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>No achievements yet</p>
              <p className="empty-description">
                Upload assessments to start earning achievements!
              </p>
            </div>
          ) : (
            gamification.achievements
              .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
              .slice(0, 20)
              .map((achievement, index) => (
                <div key={index} className="achievement-item">
                  <div className="achievement-icon">
                    {achievement.category === 'assessment' && '📝'}
                    {achievement.category === 'improvement' && '📈'}
                    {achievement.category === 'consistency' && '🔥'}
                    {achievement.category === 'mastery' && '🎯'}
                    {achievement.category === 'points' && '⭐'}
                  </div>
                  <div className="achievement-content">
                    <h3 className="achievement-title">{achievement.title}</h3>
                    <p className="achievement-description">
                      {achievement.description}
                    </p>
                    <p className="achievement-date">
                      {new Date(achievement.earnedAt).toLocaleDateString()} at{' '}
                      {new Date(achievement.earnedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="achievement-points">
                    +{achievement.pointsAwarded}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h3>Keep the momentum going!</h3>
        <p>Upload more assessments to earn points, badges, and level up.</p>
        <button
          className="btn-primary-large"
          onClick={() => navigate(`/upload-assessment/${studentId}`)}
        >
          📸 Upload Assessment
        </button>
      </div>
    </div>
  );
};

export default GamificationPage;
