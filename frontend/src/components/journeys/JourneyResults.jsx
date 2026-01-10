import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './JourneyResults.css';

const JourneyResults = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [attemptId]);

  const fetchResults = async () => {
    try {
      const response = await api.get(`/journeys/attempt/${attemptId}`);
      setResults(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load results');
      setLoading(false);
    }
  };

  const getEngagementMessage = (score) => {
    if (score >= 90) return { emoji: '🌟', message: 'Outstanding Engagement!', color: '#4caf50' };
    if (score >= 75) return { emoji: '🎯', message: 'Great Engagement!', color: '#8bc34a' };
    if (score >= 60) return { emoji: '👍', message: 'Good Engagement', color: '#ffc107' };
    return { emoji: '💪', message: 'Keep Learning!', color: '#ff9800' };
  };

  const getAccuracyMessage = (rate) => {
    if (rate >= 90) return { emoji: '🎓', message: 'History Expert!', color: '#4caf50' };
    if (rate >= 75) return { emoji: '📚', message: 'History Scholar', color: '#8bc34a' };
    if (rate >= 60) return { emoji: '📖', message: 'Learning Well', color: '#ffc107' };
    return { emoji: '📝', message: 'Keep Studying', color: '#ff9800' };
  };

  if (loading) {
    return <div className="loading">Loading your journey results...</div>;
  };

  if (!results) {
    return <div className="error">Results not found</div>;
  }

  const engagementInfo = getEngagementMessage(results.engagementScore);
  const accuracyInfo = getAccuracyMessage(results.historicalAccuracyRate);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="journey-results-page">
      <div className="results-container">
        <div className="results-header">
          <h1>Journey Complete!</h1>
          <p className="journey-title">{results.journeyId.title}</p>
        </div>

        {/* Main Score Circle */}
        <div className="score-circle">
          <div className="score-emoji">🎉</div>
          <div className="total-points">{results.totalPoints}</div>
          <div className="points-label">Total Points</div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ color: engagementInfo.color }}>
              {engagementInfo.emoji}
            </div>
            <div className="stat-value">{results.engagementScore}%</div>
            <div className="stat-label">Engagement</div>
            <div className="stat-message" style={{ color: engagementInfo.color }}>
              {engagementInfo.message}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ color: accuracyInfo.color }}>
              {accuracyInfo.emoji}
            </div>
            <div className="stat-value">{results.historicalAccuracyRate.toFixed(0)}%</div>
            <div className="stat-label">Historical Accuracy</div>
            <div className="stat-message" style={{ color: accuracyInfo.color }}>
              {accuracyInfo.message}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📖</div>
            <div className="stat-value">{results.chaptersVisited.length}</div>
            <div className="stat-label">Chapters Completed</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{formatTime(results.totalTimeTaken)}</div>
            <div className="stat-label">Time Spent</div>
          </div>
        </div>

        {/* Points Breakdown */}
        <div className="breakdown-section">
          <h2>Points Breakdown</h2>
          <div className="breakdown-grid">
            <div className="breakdown-item">
              <span className="breakdown-label">Decision Points</span>
              <span className="breakdown-value">{results.breakdown.decisionPoints}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Challenge Points</span>
              <span className="breakdown-value">{results.breakdown.challengePoints}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Completion Bonus</span>
              <span className="breakdown-value">{results.breakdown.completionBonus}</span>
            </div>
            {results.breakdown.accuracyBonus > 0 && (
              <div className="breakdown-item highlight">
                <span className="breakdown-label">Accuracy Bonus</span>
                <span className="breakdown-value">{results.breakdown.accuracyBonus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Discoveries Collected */}
        {results.discoveriesCollected.length > 0 && (
          <div className="discoveries-section">
            <h2>🏺 Discoveries Collected</h2>
            <div className="discoveries-list">
              {results.discoveriesCollected.map((discovery, idx) => (
                <div key={idx} className="discovery-item">
                  <div className="discovery-icon-small">
                    {discovery.type === 'letter' && '📜'}
                    {discovery.type === 'scroll' && '📃'}
                    {discovery.type === 'artifact' && '🏺'}
                    {discovery.type === 'painting' && '🖼️'}
                    {discovery.type === 'document' && '📄'}
                  </div>
                  <span className="discovery-name-small">{discovery.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gamification Rewards */}
        {results.gamificationRewards && (
          <div className="rewards-section">
            <h2>🎖️ Rewards Earned</h2>

            <div className="rewards-grid">
              <div className="reward-card">
                <div className="reward-icon">⭐</div>
                <div className="reward-value">{results.gamificationRewards.pointsAwarded}</div>
                <div className="reward-label">Gamification Points</div>
              </div>

              <div className="reward-card">
                <div className="reward-icon">📊</div>
                <div className="reward-value">Level {results.gamificationRewards.level}</div>
                <div className="reward-label">Current Level</div>
              </div>

              <div className="reward-card">
                <div className="reward-icon">🔥</div>
                <div className="reward-value">{results.gamificationRewards.currentStreak}</div>
                <div className="reward-label">Day Streak</div>
              </div>
            </div>

            {results.gamificationRewards.badgesEarned.length > 0 && (
              <div className="badges-earned">
                <h3>Badges Earned</h3>
                <div className="badges-list">
                  {results.gamificationRewards.badgesEarned.map((badge, idx) => (
                    <div key={idx} className="badge-item">
                      <span className="badge-icon">🏅</span>
                      <span className="badge-name">{badge.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.gamificationRewards.levelProgression &&
             results.gamificationRewards.levelProgression.levelsGained > 0 && (
              <div className="level-up-message">
                🎉 Level Up! You advanced from Level {results.gamificationRewards.levelProgression.startLevel} to Level {results.gamificationRewards.levelProgression.endLevel}!
              </div>
            )}
          </div>
        )}

        {/* Journey Path */}
        <div className="path-section">
          <h2>Your Historical Journey Path</h2>
          <div className="path-visualization">
            {results.narrativePath.map((chapterNum, idx) => (
              <React.Fragment key={idx}>
                <div className="path-node">
                  <div className="node-number">{chapterNum + 1}</div>
                  <div className="node-label">Chapter {chapterNum + 1}</div>
                </div>
                {idx < results.narrativePath.length - 1 && (
                  <div className="path-arrow">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Decisions Analysis */}
        {results.decisionsRecord.length > 0 && (
          <div className="decisions-analysis">
            <h2>Your Decisions</h2>
            <p className="analysis-text">
              You made {results.decisionsRecord.length} decisions throughout your journey.
              {' '}
              {results.decisionsRecord.filter(d => d.wasHistoricallyAccurate).length} of them
              were historically accurate choices that people of that era might have made.
            </p>
          </div>
        )}

        {/* Challenges Performance */}
        {results.challengeResults.length > 0 && (
          <div className="challenges-performance">
            <h2>Challenge Performance</h2>
            <div className="performance-stats">
              <div className="perf-item">
                <span className="perf-label">Challenges Attempted:</span>
                <span className="perf-value">{results.challengeResults.length}</span>
              </div>
              <div className="perf-item">
                <span className="perf-label">Challenges Completed:</span>
                <span className="perf-value">
                  {results.challengeResults.filter(c => c.success).length}
                </span>
              </div>
              <div className="perf-item">
                <span className="perf-label">Success Rate:</span>
                <span className="perf-value">
                  {((results.challengeResults.filter(c => c.success).length /
                     results.challengeResults.length) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/journeys/${results.studentId._id}`)}
          >
            Explore More Journeys
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default JourneyResults;
