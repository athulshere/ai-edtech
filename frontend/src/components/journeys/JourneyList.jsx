import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './JourneyList.css';

const JourneyList = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [journeys, setJourneys] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    try {
      // Fetch student details
      console.log('Fetching student:', studentId);
      const studentRes = await api.get(`/students/${studentId}`);
      console.log('Student response:', studentRes.data);

      // Student API returns data directly, not wrapped in data.data
      const studentData = studentRes.data.data || studentRes.data;
      setStudent(studentData);

      // Fetch journeys for student's grade
      const grade = studentData.grade;
      console.log('Fetching journeys for grade:', grade);
      const journeysRes = await api.get(`/journeys/grade/${grade}`);
      console.log('Journeys response:', journeysRes.data);
      setJourneys(journeysRes.data.data || []);

      // Fetch student's journey attempts
      console.log('Fetching attempts for student:', studentId);
      const attemptsRes = await api.get(`/journeys/student/${studentId}/attempts`);
      console.log('Attempts response:', attemptsRes.data);
      // Filter out any attempts where journey has been deleted
      const validAttempts = (attemptsRes.data.data || []).filter(attempt => attempt.journeyId !== null);
      setAttempts(validAttempts);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error response:', error.response?.data);
      toast.error(`Failed to load journeys: ${error.response?.data?.message || error.message}`);
      setLoading(false);
    }
  };

  const handleStartJourney = async (journeyId) => {
    try {
      const response = await api.post('/journeys/start', {
        journeyId,
        studentId
      });

      const attemptId = response.data.data._id;
      navigate(`/journey/${journeyId}/play/${studentId}/${attemptId}`);
    } catch (error) {
      console.error('Error starting journey:', error);
      toast.error('Failed to start journey');
    }
  };

  const handleResumeJourney = (attempt) => {
    navigate(`/journey/${attempt.journeyId._id}/play/${studentId}/${attempt._id}`);
  };

  const handleViewResults = (attemptId) => {
    navigate(`/journey/results/${attemptId}`);
  };

  const getAttemptForJourney = (journeyId) => {
    return attempts.find(
      a => a.journeyId._id === journeyId && a.status === 'in_progress'
    );
  };

  const getCompletedAttempts = (journeyId) => {
    return attempts.filter(
      a => a.journeyId._id === journeyId && a.status === 'completed'
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#999';
    }
  };

  if (loading) {
    return <div className="loading">Loading historical journeys...</div>;
  }

  return (
    <div className="journey-list-page">
      <div className="journey-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Historical Journeys</h1>
        {student && (
          <p className="student-info">
            Immersive history learning for {student.firstName} {student.lastName} - Grade {student.grade}
          </p>
        )}
      </div>

      {journeys.length === 0 ? (
        <div className="no-journeys">
          <div className="no-journeys-icon">🏛️</div>
          <h2>No journeys available for Grade {student?.grade}</h2>
          <p>Check back soon for immersive historical experiences!</p>
        </div>
      ) : (
        <div className="journeys-container">
          {/* In Progress Section */}
          {attempts.filter(a => a.status === 'in_progress').length > 0 && (
            <div className="section">
              <h2>🔄 Continue Your Journey</h2>
              <div className="journeys-grid">
                {attempts
                  .filter(a => a.status === 'in_progress')
                  .map(attempt => (
                    <div key={attempt._id} className="journey-card in-progress">
                      <div className="journey-badge in-progress-badge">In Progress</div>
                      <div className="journey-icon">📚</div>
                      <h3>{attempt.journeyId.title}</h3>
                      <p className="journey-era">{attempt.journeyId.era}</p>

                      <div className="progress-info">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${(attempt.currentChapter / 5) * 100}%`
                            }}
                          />
                        </div>
                        <p>Chapter {attempt.currentChapter + 1} of 5</p>
                        <p className="points-earned">Points: {attempt.totalPoints}</p>
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={() => handleResumeJourney(attempt)}
                      >
                        Continue Journey →
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Available Journeys Section */}
          <div className="section">
            <h2>🌍 Available Journeys</h2>
            <div className="journeys-grid">
              {journeys.map(journey => {
                const inProgress = getAttemptForJourney(journey._id);
                const completed = getCompletedAttempts(journey._id);

                return (
                  <div key={journey._id} className="journey-card">
                    {completed.length > 0 && (
                      <div className="journey-badge completed-badge">
                        ✓ Completed {completed.length}x
                      </div>
                    )}

                    <div className="journey-icon">
                      {journey.subject === 'History' && '🏛️'}
                      {journey.subject === 'Social Studies' && '🌏'}
                      {journey.subject === 'Geography' && '🗺️'}
                    </div>

                    <h3>{journey.title}</h3>
                    <p className="journey-era">{journey.era}</p>
                    <p className="journey-period">
                      {journey.timePeriod.start} - {journey.timePeriod.end}
                    </p>

                    <div className="journey-meta">
                      <span
                        className="difficulty-badge"
                        style={{
                          backgroundColor: getDifficultyColor(journey.difficulty),
                          color: 'white'
                        }}
                      >
                        {journey.difficulty}
                      </span>
                      <span className="duration">⏱️ {journey.estimatedDuration} min</span>
                    </div>

                    <p className="journey-description">
                      Immerse yourself in {journey.era}. Experience history through interactive
                      storytelling, make decisions, and discover artifacts from this fascinating period.
                    </p>

                    <div className="journey-stats">
                      <span>📖 {journey.story.chapters.length} Chapters</span>
                      <span>🎖️ {journey.rewards.badges.length} Badges</span>
                    </div>

                    {inProgress ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleResumeJourney(inProgress)}
                      >
                        Resume Journey →
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleStartJourney(journey._id)}
                      >
                        Begin Journey →
                      </button>
                    )}

                    {completed.length > 0 && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleViewResults(completed[0]._id)}
                        style={{ marginTop: '8px' }}
                      >
                        View Results
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completed Journeys Section */}
          {attempts.filter(a => a.status === 'completed').length > 0 && (
            <div className="section">
              <h2>✅ Completed Journeys</h2>
              <div className="completed-list">
                {attempts
                  .filter(a => a.status === 'completed')
                  .map(attempt => (
                    <div key={attempt._id} className="completed-item">
                      <div className="completed-icon">✓</div>
                      <div className="completed-info">
                        <h4>{attempt.journeyId.title}</h4>
                        <p>{attempt.journeyId.era}</p>
                        <div className="completed-stats">
                          <span>Points: {attempt.totalPoints}</span>
                          <span>Accuracy: {attempt.historicalAccuracyRate.toFixed(0)}%</span>
                          <span>Engagement: {attempt.engagementScore}%</span>
                        </div>
                      </div>
                      <button
                        className="btn btn-small"
                        onClick={() => handleViewResults(attempt._id)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JourneyList;
