/**
 * Syllabus Mapping Helper Utilities
 *
 * Provides helper functions for mapping content to CBSE syllabus
 */

const { cbseSyllabus, getTopics, getSubjects } = require('./cbseSyllabusData');

/**
 * Get syllabus mapping for a specific topic
 * @param {string} grade - Grade level (1-12)
 * @param {string} subject - Subject name
 * @param {string} topicName - Topic name to find
 * @returns {object|null} Topic mapping or null if not found
 */
const getTopicMapping = (grade, subject, topicName) => {
  const topics = getTopics(grade, subject);
  if (!topics || !topics.topics) return null;

  const topic = topics.topics.find(t =>
    t.name.toLowerCase().includes(topicName.toLowerCase()) ||
    topicName.toLowerCase().includes(t.name.toLowerCase())
  );

  return topic || null;
};

/**
 * Create syllabus mapping object for quiz
 * @param {string} grade - Grade level
 * @param {string} subject - Subject name
 * @param {string} topicName - Topic name
 * @param {string} competencyLevel - Competency level
 * @returns {object} Syllabus mapping object
 */
const createQuizSyllabusMapping = (grade, subject, topicName, competencyLevel = 'application') => {
  const topic = getTopicMapping(grade, subject, topicName);

  if (!topic) {
    return {
      cbseGrade: grade,
      cbseSubject: subject,
      cbseTopic: topicName,
      competencyLevel
    };
  }

  return {
    cbseGrade: grade,
    cbseSubject: subject,
    cbseUnit: topic.unit || '',
    cbseChapter: topic.chapters ? topic.chapters[0] : '',
    cbseTopic: topic.name,
    learningOutcomes: topic.learningOutcomes || [],
    competencyLevel: competencyLevel || topic.competencies[0]
  };
};

/**
 * Create syllabus mapping object for game
 * @param {string} grade - Grade level
 * @param {string} subject - Subject name
 * @param {array} topics - Array of topic names
 * @param {array} skills - Skills developed
 * @returns {object} Syllabus mapping object
 */
const createGameSyllabusMapping = (grade, subject, topics, skills = []) => {
  const learningObjectives = [];
  const cbseTopics = [];

  topics.forEach(topicName => {
    const topic = getTopicMapping(grade, subject, topicName);
    if (topic) {
      cbseTopics.push(topic.name);
      if (topic.learningOutcomes) {
        learningObjectives.push(...topic.learningOutcomes);
      }
    } else {
      cbseTopics.push(topicName);
    }
  });

  return {
    cbseGrade: grade,
    cbseSubject: subject,
    cbseTopics: cbseTopics.length > 0 ? cbseTopics : topics,
    skillsDeveloped: skills,
    learningObjectives: learningObjectives,
    competencyLevel: 'application'
  };
};

/**
 * Create syllabus mapping object for historical journey
 * @param {string} grade - Grade level
 * @param {string} era - Historical era
 * @param {array} chapters - CBSE chapters covered
 * @param {array} keyFigures - Historical figures
 * @returns {object} Syllabus mapping object
 */
const createJourneySyllabusMapping = (grade, era, chapters = [], keyFigures = []) => {
  const subject = grade <= '5' ? 'EVS' : 'Social Studies';
  const topics = getTopics(grade, subject);

  let unit = '';
  let learningObjectives = [];

  if (topics && topics.topics) {
    // Try to find matching topic in syllabus
    const matchingTopic = topics.topics.find(t =>
      t.chapters.some(ch => chapters.some(journeyChapter =>
        ch.toLowerCase().includes(journeyChapter.toLowerCase())
      ))
    );

    if (matchingTopic) {
      unit = matchingTopic.unit;
      learningObjectives = matchingTopic.learningOutcomes || [];
    }
  }

  return {
    cbseGrade: grade,
    cbseUnit: unit,
    cbseChapters: chapters,
    historicalPeriod: era,
    geographicalContext: 'India', // Default, can be customized
    keyFigures: keyFigures,
    learningObjectives: learningObjectives,
    competencyLevel: 'understanding'
  };
};

/**
 * Get all topics for a grade and subject (formatted for selection)
 * @param {string} grade - Grade level
 * @param {string} subject - Subject name
 * @returns {array} Array of topic objects with name and description
 */
const getAllTopicsForGrade = (grade, subject) => {
  const topics = getTopics(grade, subject);
  if (!topics || !topics.topics) return [];

  return topics.topics.map(topic => ({
    name: topic.name,
    unit: topic.unit,
    chapters: topic.chapters,
    description: topic.learningOutcomes ? topic.learningOutcomes[0] : '',
    competencies: topic.competencies
  }));
};

/**
 * Get difficulty level based on competency
 * @param {string} competencyLevel - Competency level from Bloom's taxonomy
 * @returns {string} Difficulty level (easy/medium/hard)
 */
const getDifficultyFromCompetency = (competencyLevel) => {
  const competencyMap = {
    'knowledge': 'easy',
    'understanding': 'easy',
    'application': 'medium',
    'analysis': 'medium',
    'synthesis': 'hard',
    'evaluation': 'hard'
  };

  return competencyMap[competencyLevel] || 'medium';
};

/**
 * Validate syllabus mapping object
 * @param {object} mapping - Syllabus mapping to validate
 * @param {string} type - Type of content (quiz/game/journey)
 * @returns {object} Validation result { valid: boolean, errors: array }
 */
const validateSyllabusMapping = (mapping, type = 'quiz') => {
  const errors = [];

  if (!mapping) {
    return { valid: false, errors: ['Mapping object is required'] };
  }

  // Common validations
  if (!mapping.cbseGrade) {
    errors.push('cbseGrade is required');
  }

  if (type === 'quiz') {
    if (!mapping.cbseSubject) errors.push('cbseSubject is required');
    if (!mapping.cbseTopic) errors.push('cbseTopic is required');
  } else if (type === 'game') {
    if (!mapping.cbseSubject) errors.push('cbseSubject is required');
    if (!mapping.cbseTopics || mapping.cbseTopics.length === 0) {
      errors.push('cbseTopics array is required');
    }
  } else if (type === 'journey') {
    if (!mapping.historicalPeriod) errors.push('historicalPeriod is required');
    if (!mapping.cbseChapters || mapping.cbseChapters.length === 0) {
      errors.push('cbseChapters array is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get grade-appropriate subjects
 * @param {string} grade - Grade level
 * @returns {array} Array of subjects for the grade
 */
const getGradeSubjects = (grade) => {
  return getSubjects(grade);
};

/**
 * Check if subject is available for grade
 * @param {string} grade - Grade level
 * @param {string} subject - Subject name
 * @returns {boolean} True if subject is available for grade
 */
const isSubjectAvailableForGrade = (grade, subject) => {
  const subjects = getGradeSubjects(grade);
  return subjects.includes(subject);
};

/**
 * Get quiz distribution recommendation
 * @param {string} grade - Grade level
 * @param {string} subject - Subject name
 * @returns {object} Recommended quiz distribution per topic
 */
const getQuizDistribution = (grade, subject) => {
  const topics = getTopics(grade, subject);
  if (!topics || !topics.topics) return null;

  const totalTopics = topics.topics.length;
  const minQuizzesPerSubject = 20;

  // Distribute quizzes across topics
  const quizzesPerTopic = Math.ceil(minQuizzesPerSubject / totalTopics);

  return {
    totalTopics,
    recommendedQuizzesPerTopic: quizzesPerTopic,
    distribution: topics.topics.map(topic => ({
      topic: topic.name,
      unit: topic.unit,
      recommendedQuizzes: quizzesPerTopic,
      difficulties: {
        easy: Math.ceil(quizzesPerTopic * 0.3),
        medium: Math.ceil(quizzesPerTopic * 0.5),
        hard: Math.floor(quizzesPerTopic * 0.2)
      }
    }))
  };
};

module.exports = {
  getTopicMapping,
  createQuizSyllabusMapping,
  createGameSyllabusMapping,
  createJourneySyllabusMapping,
  getAllTopicsForGrade,
  getDifficultyFromCompetency,
  validateSyllabusMapping,
  getGradeSubjects,
  isSubjectAvailableForGrade,
  getQuizDistribution
};
