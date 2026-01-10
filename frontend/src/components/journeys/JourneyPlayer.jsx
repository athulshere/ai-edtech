import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './JourneyPlayer.css';

const JourneyPlayer = () => {
  const { journeyId, studentId, attemptId } = useParams();
  const navigate = useNavigate();

  console.log('JourneyPlayer mounted with:', { journeyId, studentId, attemptId });

  const [journey, setJourney] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(1);
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [chapterStartTime, setChapterStartTime] = useState(Date.now());
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [showDecisionResult, setShowDecisionResult] = useState(false);
  const [decisionResult, setDecisionResult] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [discoveries, setDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [discoveryDetails, setDiscoveryDetails] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered, fetching data...');
    fetchData();
  }, [journeyId, attemptId]);

  const fetchData = async () => {
    try {
      console.log('Fetching journey:', journeyId);
      console.log('Fetching attempt:', attemptId);

      const [journeyRes, attemptRes] = await Promise.all([
        api.get(`/journeys/${journeyId}`),
        api.get(`/journeys/attempt/${attemptId}`)
      ]);

      console.log('Journey response:', journeyRes.data);
      console.log('Attempt response:', attemptRes.data);

      const journeyData = journeyRes.data.data || journeyRes.data;
      const attemptData = attemptRes.data.data || attemptRes.data;

      console.log('Setting journey:', journeyData);
      console.log('Setting attempt:', attemptData);
      console.log('chaptersVisited:', attemptData.chaptersVisited);
      console.log('chaptersVisited length:', attemptData.chaptersVisited?.length);

      setJourney(journeyData);
      setAttempt(attemptData);
      // currentChapter from backend is 0-indexed, but our chapterNumbers are 1-indexed
      setCurrentChapterIndex(attemptData.currentChapter !== undefined ? attemptData.currentChapter + 1 : 1);
      setDiscoveries(attemptData.discoveriesCollected || []);

      // If starting fresh, show introduction
      console.log('DEBUG: chaptersVisited value:', attemptData.chaptersVisited);
      console.log('DEBUG: Type of chaptersVisited:', typeof attemptData.chaptersVisited);
      console.log('DEBUG: Is array?', Array.isArray(attemptData.chaptersVisited));
      console.log('DEBUG: Length:', attemptData.chaptersVisited?.length);
      console.log('DEBUG: !attemptData.chaptersVisited =', !attemptData.chaptersVisited);
      console.log('DEBUG: attemptData.chaptersVisited.length === 0 =', attemptData.chaptersVisited?.length === 0);

      const shouldShowIntro = !attemptData.chaptersVisited || attemptData.chaptersVisited.length === 0;
      console.log('Should show introduction?', shouldShowIntro);

      if (shouldShowIntro) {
        console.log('Showing introduction - fresh start');
        setShowIntroduction(true);
      } else {
        console.log('Resuming journey - skipping introduction, chapters visited:', attemptData.chaptersVisited.length);
        setShowIntroduction(false);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching journey data:', error);
      console.error('Error response:', error.response?.data);
      toast.error(`Failed to load journey: ${error.response?.data?.message || error.message}`);
      setLoading(false);
    }
  };

  const handleStartChapter = async () => {
    setShowIntroduction(false);
    setChapterStartTime(Date.now());

    // Record chapter visit (backend uses 0-indexed chapters)
    const timeSpent = Math.floor((Date.now() - chapterStartTime) / 1000);
    try {
      await api.post(`/journeys/progress/${attemptId}`, {
        chapterNumber: currentChapterIndex - 1,
        timeSpent
      });
    } catch (error) {
      console.error('Error recording progress:', error);
    }
  };

  const handleDecisionSelect = async (decisionIndex, optionIndex) => {
    const timeSpent = Math.floor((Date.now() - chapterStartTime) / 1000);

    try {
      const response = await api.post(`/journeys/decision/${attemptId}`, {
        chapterNumber: currentChapterIndex - 1,
        decisionIndex,
        optionChosen: optionIndex,
        timeSpent
      });

      setDecisionResult(response.data.data);
      setShowDecisionResult(true);
      setSelectedDecision({ decisionIndex, optionIndex });

      // Refresh attempt data
      const attemptRes = await api.get(`/journeys/attempt/${attemptId}`);
      setAttempt(attemptRes.data.data);
    } catch (error) {
      console.error('Error recording decision:', error);
      toast.error('Failed to record decision');
    }
  };

  const handleContinueAfterDecision = () => {
    setShowDecisionResult(false);

    const nextChapter = decisionResult.nextChapter;
    if (nextChapter !== null && nextChapter !== undefined) {
      // Backend returns 0-indexed, convert to 1-indexed
      setCurrentChapterIndex(nextChapter + 1);
      setChapterStartTime(Date.now());
    } else {
      // End of journey
      handleCompleteJourney();
    }
  };

  const handleDiscoverArtifact = async (discoveryIndex) => {
    try {
      const chapter = journey.story.chapters.find(ch => ch.chapterNumber === currentChapterIndex);
      const discovery = chapter.discoveries[discoveryIndex];

      await api.post(`/journeys/discovery/${attemptId}`, {
        chapterNumber: currentChapterIndex - 1,
        discoveryIndex
      });

      // Show discovery modal with details
      setDiscoveryDetails(discovery);
      setShowDiscoveryModal(true);

      // Refresh discoveries
      const attemptRes = await api.get(`/journeys/attempt/${attemptId}`);
      setDiscoveries(attemptRes.data.data.discoveriesCollected);
    } catch (error) {
      console.error('Error recording discovery:', error);
      toast.error('Failed to collect discovery');
    }
  };

  const handleChallengeComplete = async (success, timeSpent, attempts) => {
    try {
      const response = await api.post(`/journeys/challenge/${attemptId}`, {
        chapterNumber: currentChapterIndex - 1,
        challengeIndex: activeChallenge.index,
        success,
        timeSpent,
        attempts
      });

      if (success) {
        toast.success(`Challenge completed! +${response.data.data.pointsEarned} points`);
      }

      setActiveChallenge(null);

      // Refresh attempt data
      const attemptRes = await api.get(`/journeys/attempt/${attemptId}`);
      setAttempt(attemptRes.data.data);
    } catch (error) {
      console.error('Error submitting challenge:', error);
      toast.error('Failed to submit challenge');
    }
  };

  const handleCompleteJourney = async () => {
    try {
      const response = await api.post(`/journeys/complete/${attemptId}`);
      toast.success('Journey completed! 🎉');
      navigate(`/journey/results/${attemptId}`);
    } catch (error) {
      console.error('Error completing journey:', error);
      toast.error('Failed to complete journey');
    }
  };

  if (loading) {
    return <div className="loading">Loading your historical journey...</div>;
  }

  if (!journey) {
    return <div className="error">Journey not found</div>;
  }

  // Show introduction screen
  if (showIntroduction) {
    return (
      <div className="journey-player introduction-screen">
        <div className="introduction-content">
          <h1>{journey.story.introduction.title}</h1>
          <div className="intro-setting">{journey.story.introduction.setting}</div>

          <div className="intro-narrative">
            {journey.story.introduction.narrative}
          </div>

          <div className="character-role">
            <strong>Your Role:</strong> {journey.story.introduction.characterRole}
          </div>

          <div className="journey-info">
            <div className="info-item">
              <span className="icon">📖</span>
              <span>{journey.story.chapters.length} Chapters</span>
            </div>
            <div className="info-item">
              <span className="icon">⏱️</span>
              <span>{journey.estimatedDuration} minutes</span>
            </div>
            <div className="info-item">
              <span className="icon">🎖️</span>
              <span>{journey.rewards.badges.length} Badges to Earn</span>
            </div>
          </div>

          <button className="btn btn-primary btn-large" onClick={handleStartChapter}>
            Begin Your Journey →
          </button>
        </div>
      </div>
    );
  }

  // Get current chapter
  console.log('Looking for chapter with chapterNumber:', currentChapterIndex);
  console.log('Available chapters:', journey.story.chapters.map(ch => ch.chapterNumber));

  const currentChapter = journey.story.chapters.find(
    ch => ch.chapterNumber === currentChapterIndex
  );

  console.log('Found chapter:', currentChapter);

  if (!currentChapter) {
    console.error('Chapter not found! currentChapterIndex:', currentChapterIndex);
    return <div className="error">Chapter not found</div>;
  }

  // Show decision result overlay
  if (showDecisionResult && decisionResult) {
    return (
      <div className="journey-player decision-result-screen">
        <div className="decision-result-content">
          <div className="result-icon">
            {decisionResult.consequence && '📜'}
          </div>

          <h2>Your Decision</h2>

          <div className="consequence-text">
            {decisionResult.consequence}
          </div>

          {decisionResult.learningPoint && (
            <div className="learning-point">
              <strong>💡 Historical Insight:</strong>
              <p>{decisionResult.learningPoint}</p>
            </div>
          )}

          <div className="points-awarded">
            +{journey.story.chapters.find(ch => ch.chapterNumber === currentChapterIndex)?.decisions[selectedDecision.decisionIndex]
              .options[selectedDecision.optionIndex].pointsAwarded} Points
          </div>

          <button className="btn btn-primary" onClick={handleContinueAfterDecision}>
            Continue Journey →
          </button>
        </div>
      </div>
    );
  }

  // Show discovery modal
  if (showDiscoveryModal && discoveryDetails) {
    return (
      <div className="journey-player discovery-modal-screen">
        <div className="discovery-modal-content">
          <div className="discovery-header">
            <div className="discovery-icon">
              {discoveryDetails.type === 'letter' && '📜'}
              {discoveryDetails.type === 'scroll' && '📃'}
              {discoveryDetails.type === 'artifact' && '🏺'}
              {discoveryDetails.type === 'document' && '📄'}
              {discoveryDetails.type === 'photograph' && '📷'}
            </div>
            <h2>Discovery Collected!</h2>
          </div>

          <h3>{discoveryDetails.name}</h3>

          {discoveryDetails.year && (
            <div className="discovery-year">Year: {discoveryDetails.year}</div>
          )}

          <div className="discovery-content">
            {discoveryDetails.content}
          </div>

          {discoveryDetails.historicalSignificance && (
            <div className="historical-significance">
              <strong>📚 Historical Significance:</strong>
              <p>{discoveryDetails.historicalSignificance}</p>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={() => setShowDiscoveryModal(false)}
          >
            Continue Journey →
          </button>
        </div>
      </div>
    );
  }

  // Show active challenge
  if (activeChallenge) {
    return (
      <div className="journey-player challenge-screen">
        <ChallengeComponent
          challenge={activeChallenge.challenge}
          onComplete={handleChallengeComplete}
          onCancel={() => setActiveChallenge(null)}
        />
      </div>
    );
  }

  // Main chapter view
  return (
    <div className="journey-player">
      <div className="player-header">
        <div className="journey-progress">
          <div className="chapter-indicator">
            Chapter {currentChapterIndex} of {journey.story.chapters.length}
          </div>
          <div className="points-display">
            Points: {attempt?.totalPoints || 0}
          </div>
        </div>
        <div className="discoveries-count">
          🏺 Discoveries: {discoveries.length}
        </div>
      </div>

      <div className="chapter-container">
        <div className="scene-header">
          <h1>{currentChapter.title}</h1>
          <div className="scene-info">
            <div className="location">📍 {currentChapter.scene.location}</div>
            <div className="atmosphere">
              {currentChapter.scene.timeOfDay} • {currentChapter.scene.atmosphere}
            </div>
          </div>
        </div>

        <div className="narrative-section">
          <p className="narrative-text">{currentChapter.narrative}</p>
        </div>

        {/* Characters */}
        {currentChapter.characters && currentChapter.characters.length > 0 && (
          <div className="characters-section">
            <h3>Characters You Meet</h3>
            {currentChapter.characters.map((character, idx) => (
              <div key={idx} className="character-card">
                <div className="character-header">
                  <strong>{character.name}</strong>
                  <span className="character-role">{character.role}</span>
                </div>
                <div className="character-dialogue">"{character.dialogue}"</div>
              </div>
            ))}
          </div>
        )}

        {/* Discoveries */}
        {currentChapter.discoveries && currentChapter.discoveries.length > 0 && (
          <div className="discoveries-section">
            <h3>🔍 Discoveries</h3>
            <div className="discoveries-grid">
              {currentChapter.discoveries.map((discovery, idx) => {
                // Backend stores 0-indexed chapterNumber
                const isCollected = discoveries.some(
                  d => d.chapterNumber === currentChapterIndex - 1 && d.discoveryIndex === idx
                );

                return (
                  <div
                    key={idx}
                    className={`discovery-card ${isCollected ? 'collected' : ''}`}
                    onClick={() => !isCollected && handleDiscoverArtifact(idx)}
                  >
                    <div className="discovery-icon">
                      {discovery.type === 'letter' && '📜'}
                      {discovery.type === 'scroll' && '📃'}
                      {discovery.type === 'artifact' && '🏺'}
                      {discovery.type === 'painting' && '🖼️'}
                      {discovery.type === 'document' && '📄'}
                    </div>
                    <div className="discovery-name">{discovery.name}</div>
                    {isCollected && <div className="collected-badge">✓ Collected</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Challenges */}
        {currentChapter.challenges && currentChapter.challenges.length > 0 && (
          <div className="challenges-section">
            <h3>🎯 Challenges</h3>
            {currentChapter.challenges.map((challenge, idx) => (
              <div key={idx} className="challenge-card">
                <div className="challenge-icon">
                  {challenge.type === 'timeline-order' && '📅'}
                  {challenge.type === 'artifact-identify' && '🏺'}
                  {challenge.type === 'map-navigate' && '🗺️'}
                  {challenge.type === 'decode-message' && '🔐'}
                </div>
                <div className="challenge-info">
                  <h4>{challenge.description}</h4>
                  <p className="challenge-type">{challenge.type.replace('-', ' ')}</p>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => setActiveChallenge({ challenge, index: idx })}
                >
                  Start Challenge
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Decisions */}
        {currentChapter.decisions && currentChapter.decisions.length > 0 && (
          <div className="decisions-section">
            {currentChapter.decisions.map((decision, decIdx) => (
              <div key={decIdx} className="decision-block">
                <h3 className="decision-prompt">{decision.prompt}</h3>
                <div className="decision-options">
                  {decision.options.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      className="decision-option"
                      onClick={() => handleDecisionSelect(decIdx, optIdx)}
                    >
                      <div className="option-text">{option.text}</div>
                      <div className="option-arrow">→</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Challenge Component (simplified - can be expanded)
const ChallengeComponent = ({ challenge, onComplete, onCancel }) => {
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [startTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let success = false;

    if (challenge.type === 'decode-message') {
      success = answer.toUpperCase() === challenge.interactiveElement.decodedMessage.toUpperCase();
    } else if (challenge.type === 'map-navigate') {
      // Check if selected location is correct
      const selectedLocation = challenge.interactiveElement.locations?.[selectedOption];
      success = selectedLocation?.isCorrect === true;
    } else if (challenge.type === 'timeline-order' || challenge.type === 'artifact-identify') {
      // For these challenges, check if selected option matches correct answer
      success = selectedOption === challenge.interactiveElement.correctAnswer;
    }

    onComplete(success, timeSpent, newAttempts);
  };

  return (
    <div className="challenge-container">
      <h2>{challenge.description}</h2>

      {challenge.type === 'decode-message' && (
        <div className="decode-challenge">
          <div className="encoded-message">{challenge.interactiveElement.encodedMessage}</div>
          <p className="hint">💡 {challenge.interactiveElement.hint}</p>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter decoded message"
            className="challenge-input"
          />
        </div>
      )}

      {challenge.type === 'map-navigate' && challenge.interactiveElement && (
        <div className="map-challenge">
          <p className="challenge-instruction">Select locations for the march route (choose wisely!):</p>
          <div className="options-list">
            {challenge.interactiveElement.locations?.map((location, idx) => (
              <div
                key={idx}
                className={`challenge-option ${selectedOption === idx ? 'selected' : ''}`}
                onClick={() => setSelectedOption(idx)}
              >
                <input
                  type="radio"
                  name="route"
                  checked={selectedOption === idx}
                  onChange={() => setSelectedOption(idx)}
                />
                <label>{location.name || location}</label>
              </div>
            ))}
          </div>
          <p className="hint">💡 Think about visibility and safety</p>
        </div>
      )}

      {challenge.type === 'timeline-order' && challenge.interactiveElement && (
        <div className="timeline-challenge">
          <p className="challenge-instruction">Arrange these events in chronological order:</p>
          <div className="options-list">
            {challenge.interactiveElement.events?.map((event, idx) => (
              <div key={idx} className="timeline-event">
                {event}
              </div>
            ))}
          </div>
          <p className="hint">💡 Select the correct sequence</p>
        </div>
      )}

      {challenge.type === 'artifact-identify' && challenge.interactiveElement && (
        <div className="artifact-challenge">
          <p className="challenge-instruction">Identify this historical artifact:</p>
          <div className="options-list">
            {challenge.interactiveElement.options?.map((option, idx) => (
              <div
                key={idx}
                className={`challenge-option ${selectedOption === idx ? 'selected' : ''}`}
                onClick={() => setSelectedOption(idx)}
              >
                <input
                  type="radio"
                  name="artifact"
                  checked={selectedOption === idx}
                  onChange={() => setSelectedOption(idx)}
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="challenge-actions">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default JourneyPlayer;
