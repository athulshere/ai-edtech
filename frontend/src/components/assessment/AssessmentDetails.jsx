import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './AssessmentDetails.css';

const AssessmentDetails = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExtractedText, setShowExtractedText] = useState(false);

  useEffect(() => {
    if (assessmentId) {
      fetchAssessment(assessmentId);
    }
  }, [assessmentId]);

  // Auto-refresh while processing
  useEffect(() => {
    if (assessment?.status === 'processing') {
      const interval = setInterval(() => {
        if (assessmentId) {
          fetchAssessment(assessmentId);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [assessment?.status, assessmentId]);

  const fetchAssessment = async (id) => {
    try {
      const response = await assessmentAPI.getAssessmentById(id);
      setAssessment(response.data);
    } catch (error) {
      toast.error('Failed to load assessment');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading assessment...</div>;
  }

  if (!assessment) {
    return <div className="error">Assessment not found</div>;
  }

  const studentName = typeof assessment.studentId === 'object'
    ? `${assessment.studentId.firstName} ${assessment.studentId.lastName}`
    : 'Student';

  return (
    <div className="assessment-details">
      <div className="assessment-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Assessment Details</h1>
      </div>

      <div className="assessment-info-card">
        <div className="info-row">
          <div className="info-item">
            <label>Student:</label>
            <span>{studentName}</span>
          </div>
          <div className="info-item">
            <label>Subject:</label>
            <span>{assessment.subject}</span>
          </div>
          <div className="info-item">
            <label>Topic:</label>
            <span>{assessment.topic}</span>
          </div>
          <div className="info-item">
            <label>Grade:</label>
            <span>{assessment.grade}</span>
          </div>
          <div className="info-item">
            <label>Date:</label>
            <span>{new Date(assessment.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <label>Status:</label>
            <span className={`status-badge ${assessment.status}`}>
              {assessment.status}
            </span>
          </div>
        </div>
      </div>

      {assessment.status === 'processing' && (
        <div className="processing-banner">
          <div className="spinner"></div>
          <p>AI analysis in progress... This may take up to 60 seconds.</p>
        </div>
      )}

      {assessment.status === 'failed' && (
        <div className="error-banner">
          <p>⚠️ AI analysis failed (likely due to OpenAI quota/credits issue). Handwriting was extracted successfully - see below.</p>
        </div>
      )}

      {/* Show extracted text even for failed assessments if available */}
      {assessment.status === 'failed' && assessment.extractedText && (
        <div className="extracted-text-card">
          <div className="card-header" onClick={() => setShowExtractedText(!showExtractedText)}>
            <h2>📄 Text Recognized by Google Vision AI</h2>
            <button className="toggle-btn">
              {showExtractedText ? '▼' : '▶'}
            </button>
          </div>
          {showExtractedText && (
            <div className="extracted-text-content">
              <pre className="extracted-text">{assessment.extractedText}</pre>
            </div>
          )}
        </div>
      )}

      {assessment.status === 'completed' && (
        <>
          {/* Overall Score */}
          <div className="score-card">
            <h2>Overall Score</h2>
            <div className="score-display">
              <div className="score-value">
                {assessment.aiAnalysis?.overallScore || 0}%
              </div>
              <div className="score-breakdown">
                {assessment.questions.length > 0 && (
                  <span>
                    {assessment.questions.reduce((sum, q) => sum + q.score, 0)} /
                    {assessment.questions.reduce((sum, q) => sum + q.maxScore, 0)} points
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Extracted Text Section */}
          <div className="extracted-text-card">
            <div className="card-header" onClick={() => setShowExtractedText(!showExtractedText)}>
              <h2>📄 Text Recognized by Google Vision AI</h2>
              <button className="toggle-btn">
                {showExtractedText ? '▼' : '▶'}
              </button>
            </div>
            {showExtractedText && (
              <div className="extracted-text-content">
                {assessment.extractedText ? (
                  <pre className="extracted-text">{assessment.extractedText}</pre>
                ) : (
                  <p className="text-muted">No text was extracted from this assessment.</p>
                )}
              </div>
            )}
          </div>

          {/* Questions and Answers */}
          {assessment.questions.length > 0 && (
            <div className="questions-section">
              <h2>Questions & Answers</h2>
              {assessment.questions.map((question, index) => (
                <div key={index} className={`question-card ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="question-header">
                    <h3>Question {question.questionNumber}</h3>
                    <div className="question-score">
                      {question.score} / {question.maxScore} points
                    </div>
                  </div>
                  {question.questionText && (
                    <div className="question-text">
                      <strong>Question:</strong> {question.questionText}
                    </div>
                  )}
                  <div className="student-answer">
                    <strong>Student's Answer:</strong>
                    <p>{question.studentAnswer}</p>
                  </div>
                  {question.correctAnswer && (
                    <div className="correct-answer">
                      <strong>Correct Answer:</strong>
                      <p>{question.correctAnswer}</p>
                    </div>
                  )}
                  <div className={`correctness-badge ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                    {question.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mistakes Analysis */}
          {assessment.aiAnalysis?.mistakes && assessment.aiAnalysis.mistakes.length > 0 && (
            <div className="mistakes-section">
              <h2>Identified Mistakes</h2>
              {assessment.aiAnalysis.mistakes.map((mistake, index) => (
                <div key={index} className="mistake-card">
                  <div className="mistake-header">
                    <span className={`mistake-type ${mistake.mistakeType}`}>
                      {mistake.mistakeType}
                    </span>
                    <span className="question-ref">Question {mistake.questionNumber}</span>
                  </div>
                  <div className="mistake-description">
                    <strong>What went wrong:</strong>
                    <p>{mistake.description}</p>
                  </div>
                  <div className="mistake-suggestion">
                    <strong>How to improve:</strong>
                    <p>{mistake.suggestion}</p>
                  </div>
                  {mistake.relatedConcepts.length > 0 && (
                    <div className="related-concepts">
                      <strong>Related concepts to review:</strong>
                      <div className="tag-list">
                        {mistake.relatedConcepts.map((concept, idx) => (
                          <span key={idx} className="tag">{concept}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Personalized Feedback */}
          {assessment.aiAnalysis?.personalizedFeedback && (
            <div className="feedback-card">
              <h2>Personalized Feedback</h2>
              <p>{assessment.aiAnalysis.personalizedFeedback}</p>
            </div>
          )}

          {/* Strengths and Improvements */}
          <div className="strengths-improvements">
            <div className="strengths-card">
              <h2>💪 Strengths</h2>
              {assessment.aiAnalysis?.strengths && assessment.aiAnalysis.strengths.length > 0 ? (
                <ul>
                  {assessment.aiAnalysis.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No specific strengths identified</p>
              )}
            </div>
            <div className="improvements-card">
              <h2>📈 Areas for Improvement</h2>
              {assessment.aiAnalysis?.areasForImprovement && assessment.aiAnalysis.areasForImprovement.length > 0 ? (
                <ul>
                  {assessment.aiAnalysis.areasForImprovement.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No areas for improvement identified</p>
              )}
            </div>
          </div>

          {/* Recommended Topics */}
          {assessment.aiAnalysis?.recommendedTopics && assessment.aiAnalysis.recommendedTopics.length > 0 && (
            <div className="recommendations-card">
              <h2>📚 Recommended Topics to Study</h2>
              <div className="tag-list">
                {assessment.aiAnalysis.recommendedTopics.map((topic, idx) => (
                  <span key={idx} className="tag recommended">{topic}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AssessmentDetails;
