import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './GamePlayer.css';

const GamePlayer = () => {
  const { gameId, studentId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0 && game && !submitting) {
      handleSubmit();
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (startTime && game) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, game.timeLimit - elapsed);
        setTimeRemaining(remaining);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startTime, game]);

  const startGame = async () => {
    try {
      const response = await api.post('/games/start', {
        studentId,
        gameId
      });

      const { attemptId, game: gameData, startedAt } = response.data.data;
      setGame(gameData);
      setAttemptId(attemptId);
      setStartTime(new Date(startedAt).getTime());
      setTimeRemaining(gameData.timeLimit);

      // Initialize answers array based on game type
      if (gameData.gameConfig.questions) {
        setAnswers(new Array(gameData.gameConfig.questions.length).fill({ selectedAnswer: null, timeSpent: 0 }));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error(error.response?.data?.message || 'Failed to start game');
      navigate(`/games/${studentId}`);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    const questionStartTime = newAnswers[currentQuestion]?.startTime || Date.now();
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    newAnswers[currentQuestion] = {
      selectedAnswer: optionIndex,
      timeSpent,
      startTime: questionStartTime
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < game.gameConfig.questions.length - 1) {
      const newAnswers = [...answers];
      if (!newAnswers[currentQuestion + 1]?.startTime) {
        newAnswers[currentQuestion + 1] = {
          ...newAnswers[currentQuestion + 1],
          startTime: Date.now()
        };
        setAnswers(newAnswers);
      }
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

    const unanswered = answers.filter(a => a.selectedAnswer === null).length;
    if (unanswered > 0 && timeRemaining > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);

    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      // Format responses for the backend
      const responses = answers.map((answer, index) => ({
        selectedAnswer: answer.selectedAnswer,
        timeSpent: answer.timeSpent || 0
      }));

      await api.post(`/games/submit/${attemptId}`, {
        responses,
        timeTaken
      });

      toast.success('Game completed!');
      navigate(`/game/results/${attemptId}`);
    } catch (error) {
      console.error('Error submitting game:', error);
      toast.error('Failed to submit game');
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
      <div className="game-player-page">
        <div className="loading">Loading game...</div>
      </div>
    );
  }

  if (!game.gameConfig.questions || game.gameConfig.questions.length === 0) {
    return (
      <div className="game-player-page">
        <div className="error-message">
          <h2>Game Not Available</h2>
          <p>This game type is not yet supported in the player.</p>
          <button onClick={() => navigate(`/games/${studentId}`)}>
            ← Back to Games
          </button>
        </div>
      </div>
    );
  }

  const question = game.gameConfig.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / game.gameConfig.questions.length) * 100;
  const answeredCount = answers.filter(a => a.selectedAnswer !== null).length;

  return (
    <div className="game-player-page">
      {/* Header */}
      <div className="game-header-bar">
        <div className="game-info">
          <h2 className="game-title-small">{game.title}</h2>
          <p className="question-counter">
            Question {currentQuestion + 1} of {game.gameConfig.questions.length}
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

          <h3 className="question-text">{question.question}</h3>

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
        <div className="game-navigation">
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
              {answeredCount} / {game.gameConfig.questions.length} answered
            </span>
          </div>

          <div className="nav-right">
            {currentQuestion < game.gameConfig.questions.length - 1 ? (
              <button className="nav-btn nav-btn-primary" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Game'}
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="question-navigator">
          <p className="navigator-title">Quick Navigation:</p>
          <div className="question-dots">
            {game.gameConfig.questions.map((_, index) => (
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

export default GamePlayer;
