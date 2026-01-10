import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './GameList.css';

const GameList = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [games, setGames] = useState([]);
  const [gamesBySubject, setGamesBySubject] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All');

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      const response = await api.get(`/parent/children/${studentId}`);
      const studentData = response.data.data;
      setStudent(studentData);
      fetchGames(studentData.grade);
    } catch (error) {
      console.error('Error fetching student:', error);
      toast.error('Failed to load student data');
      navigate('/dashboard');
    }
  };

  const fetchGames = async (grade) => {
    try {
      const response = await api.get(`/games/grade/${grade}`);
      setGames(response.data.data);
      setGamesBySubject(response.data.bySubject);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast.error('Failed to load games');
      setLoading(false);
    }
  };

  const handlePlayGame = (gameId) => {
    navigate(`/game/${gameId}/play/${studentId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#999';
    }
  };

  const getGameIcon = (gameType) => {
    const icons = {
      'word_puzzle': '🔤',
      'sentence_builder': '📝',
      'math_race': '🔢',
      'map_conquest': '🗺️',
      'timeline_builder': '📅',
      'equation_solver': '➗',
      'spelling_bee': '🐝',
      'pattern_finder': '🔍',
      'memory_match': '🃏',
      'drag_drop': '🎯',
      'multiple_choice_race': '⚡',
      'fill_blanks': '✏️',
      'sorting_game': '📊',
      'matching_pairs': '🔗'
    };
    return icons[gameType] || '🎮';
  };

  if (loading) {
    return (
      <div className="game-list-page">
        <div className="loading">Loading games...</div>
      </div>
    );
  }

  const subjects = Object.keys(gamesBySubject);
  const filteredGames = selectedSubject === 'All'
    ? games
    : gamesBySubject[selectedSubject] || [];

  return (
    <div className="game-list-page">
      {/* Header */}
      <div className="game-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <div className="game-header-info">
          <h1>🎮 Learning Games</h1>
          {student && (
            <p className="student-name">
              {student.firstName} {student.lastName} - Grade {student.grade}
            </p>
          )}
        </div>
      </div>

      {/* Subject Filter */}
      <div className="subject-filter">
        <button
          className={`subject-btn ${selectedSubject === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedSubject('All')}
        >
          All Subjects ({games.length})
        </button>
        {subjects.map(subject => (
          <button
            key={subject}
            className={`subject-btn ${selectedSubject === subject ? 'active' : ''}`}
            onClick={() => setSelectedSubject(subject)}
          >
            {subject} ({gamesBySubject[subject].length})
          </button>
        ))}
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="no-games">
          <p>No games available for {selectedSubject === 'All' ? 'this grade' : selectedSubject}</p>
        </div>
      ) : (
        <div className="games-grid">
          {filteredGames.map(game => (
            <div key={game._id} className="game-card">
              <div className="game-icon">{getGameIcon(game.gameType)}</div>

              <div className="game-content">
                <h3 className="game-title">{game.title}</h3>
                <p className="game-description">{game.description}</p>

                <div className="game-meta">
                  <span className="game-subject">{game.subject}</span>
                  <span
                    className="game-difficulty"
                    style={{ backgroundColor: getDifficultyColor(game.difficulty) }}
                  >
                    {game.difficulty}
                  </span>
                </div>

                <div className="game-stats">
                  <div className="stat">
                    <span className="stat-icon">⏱️</span>
                    <span>{Math.floor(game.timeLimit / 60)} min</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">⭐</span>
                    <span>{game.maxScore} pts</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">🎁</span>
                    <span>+{game.pointsReward} XP</span>
                  </div>
                </div>

                {game.stats && game.stats.timesPlayed > 0 && (
                  <div className="game-played-stats">
                    <div className="played-stat">
                      <span>🎯 Avg: {game.stats.averageScore}%</span>
                    </div>
                    <div className="played-stat">
                      <span>🎮 Played: {game.stats.timesPlayed} times</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="play-btn"
                onClick={() => handlePlayGame(game._id)}
              >
                Play Now →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameList;
