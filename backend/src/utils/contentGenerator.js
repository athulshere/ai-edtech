/**
 * Content Generator - Main orchestrator for generating educational content
 *
 * Coordinates AI generation, validation, and database insertion
 */

const { cbseSyllabus, getTopics } = require('./cbseSyllabusData');
const {
  createQuizSyllabusMapping,
  createGameSyllabusMapping,
  createJourneySyllabusMapping,
  getDifficultyFromCompetency,
  getAllTopicsForGrade
} = require('./syllabusMapping');
const {
  generateQuizQuestions,
  generateGameConfig,
  generateHistoricalJourneyStory,
  generateBatch
} = require('./aiContentHelper');
const {
  validateQuiz,
  validateGame,
  validateHistoricalJourney,
  validateBatch
} = require('./contentValidator');

/**
 * Generate a complete quiz for a specific topic
 * @param {object} params - Quiz generation parameters
 * @returns {Promise<object>} Complete quiz object ready for database
 */
const generateQuiz = async ({
  grade,
  subject,
  topicName,
  difficulty = 'medium',
  questionCount = 10,
  timeLimit = 180
}) => {
  console.log(`Generating ${difficulty} quiz for Grade ${grade} ${subject} - ${topicName}`);

  // Get topic details from syllabus
  const topicsData = getTopics(grade, subject);
  const topic = topicsData?.topics.find(t =>
    t.name.toLowerCase().includes(topicName.toLowerCase())
  );

  const learningOutcomes = topic?.learningOutcomes || [];
  const competencyLevel = topic?.competencies?.[0] || 'application';

  // Generate questions using AI
  const questions = await generateQuizQuestions({
    grade,
    subject,
    topic: topicName,
    learningOutcomes,
    difficulty,
    questionCount
  });

  // Calculate total points
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 10), 0);

  // Create syllabus mapping
  const syllabusMapping = createQuizSyllabusMapping(
    grade,
    subject,
    topicName,
    competencyLevel
  );

  // Construct quiz object
  const quiz = {
    title: `Grade ${grade} ${subject} - ${topicName}`,
    description: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} level quiz on ${topicName}`,
    grade,
    subject,
    difficulty,
    timeLimit,
    questions,
    totalPoints,
    syllabusMapping,
    isActive: true
  };

  // Validate quiz
  const validation = validateQuiz(quiz);
  if (!validation.valid) {
    console.error('Quiz validation failed:', validation.errors);
    throw new Error(`Quiz validation failed: ${validation.errors.join(', ')}`);
  }

  if (validation.warnings.length > 0) {
    console.warn('Quiz warnings:', validation.warnings);
  }

  return quiz;
};

/**
 * Generate a complete game for a specific topic
 * @param {object} params - Game generation parameters
 * @returns {Promise<object>} Complete game object ready for database
 */
const generateGame = async ({
  grade,
  subject,
  gameType,
  topicNames = [],
  difficulty = 'medium',
  timeLimit = 300
}) => {
  console.log(`Generating ${gameType} game for Grade ${grade} ${subject} - ${topicNames.join(', ')}`);

  // Get learning objectives from topics
  const topicsData = getTopics(grade, subject);
  const learningObjectives = [];

  topicNames.forEach(topicName => {
    const topic = topicsData?.topics.find(t =>
      t.name.toLowerCase().includes(topicName.toLowerCase())
    );
    if (topic && topic.learningOutcomes) {
      learningObjectives.push(...topic.learningOutcomes);
    }
  });

  // Generate game config using AI
  const gameConfig = await generateGameConfig({
    grade,
    subject,
    gameType,
    topic: topicNames[0] || 'General',
    learningObjectives
  });

  // Create syllabus mapping
  const syllabusMapping = createGameSyllabusMapping(
    grade,
    subject,
    topicNames,
    [`${gameType.replace('_', ' ')} skills`, 'Problem solving', 'Critical thinking']
  );

  // Calculate max score based on game config
  let maxScore = 100;
  if (gameConfig.questions && Array.isArray(gameConfig.questions)) {
    maxScore = gameConfig.questions.length * 10;
  } else if (gameConfig.pairs && Array.isArray(gameConfig.pairs)) {
    maxScore = gameConfig.pairs.length * 10;
  } else if (gameConfig.equations && Array.isArray(gameConfig.equations)) {
    maxScore = gameConfig.equations.length * 10;
  }

  // Construct game object
  const game = {
    title: `Grade ${grade} ${subject} - ${topicNames[0] || 'Game'}`,
    description: `${gameType.replace('_', ' ')} game for practicing ${topicNames.join(', ')}`,
    gameType,
    subject,
    grade,
    difficulty,
    syllabusTopic: topicNames[0],
    gameConfig,
    timeLimit,
    maxScore,
    passingScore: Math.floor(maxScore * 0.6),
    pointsReward: 20,
    syllabusMapping,
    isActive: true
  };

  // Validate game
  const validation = validateGame(game);
  if (!validation.valid) {
    console.error('Game validation failed:', validation.errors);
    throw new Error(`Game validation failed: ${validation.errors.join(', ')}`);
  }

  if (validation.warnings.length > 0) {
    console.warn('Game warnings:', validation.warnings);
  }

  return game;
};

/**
 * Generate a complete historical journey
 * @param {object} params - Journey generation parameters
 * @returns {Promise<object>} Complete journey object ready for database
 */
const generateHistoricalJourney = async ({
  grade,
  era,
  title,
  chapters = [],
  keyFigures = [],
  timePeriod = {},
  difficulty = 'intermediate',
  estimatedDuration = 30
}) => {
  console.log(`Generating historical journey for Grade ${grade} - ${era}`);

  // Generate story using AI
  const story = await generateHistoricalJourneyStory({
    grade,
    era,
    title,
    chapters,
    keyFigures
  });

  // Create syllabus mapping
  const syllabusMapping = createJourneySyllabusMapping(
    grade,
    era,
    chapters,
    keyFigures
  );

  // Construct journey object
  const journey = {
    title,
    era,
    timePeriod,
    grade,
    subject: grade <= '5' ? 'EVS' : 'Social Studies',
    story,
    embeddeAssessment: {
      challenges: story.chapters?.map(ch => ch.challenge) || [],
      decisionPoints: story.chapters?.map(ch => ch.decisionPoint) || []
    },
    rewards: {
      points: 50,
      badges: story.achievements || [],
      certificate: `${era} Explorer`
    },
    estimatedDuration,
    difficulty,
    prerequisiteKnowledge: [],
    curriculumAlignment: {
      topics: chapters,
      learningObjectives: syllabusMapping.learningObjectives,
      ncertChapters: chapters
    },
    syllabusMapping,
    isActive: true
  };

  // Validate journey
  const validation = validateHistoricalJourney(journey);
  if (!validation.valid) {
    console.error('Journey validation failed:', validation.errors);
    throw new Error(`Journey validation failed: ${validation.errors.join(', ')}`);
  }

  if (validation.warnings.length > 0) {
    console.warn('Journey warnings:', validation.warnings);
  }

  return journey;
};

/**
 * Generate multiple quizzes for a grade and subject
 * @param {object} params - Batch generation parameters
 * @returns {Promise<array>} Array of quiz objects
 */
const generateQuizzesForSubject = async ({
  grade,
  subject,
  minQuizzes = 20,
  difficulties = { easy: 0.3, medium: 0.5, hard: 0.2 }
}) => {
  console.log(`\nGenerating ${minQuizzes} quizzes for Grade ${grade} ${subject}`);

  const topics = getAllTopicsForGrade(grade, subject);

  if (topics.length === 0) {
    console.warn(`No topics found for Grade ${grade} ${subject}`);
    return [];
  }

  // Distribute quizzes across topics
  const quizzesPerTopic = Math.ceil(minQuizzes / topics.length);

  const quizSpecs = [];

  topics.forEach(topic => {
    // Generate quizzes at different difficulty levels for each topic
    const easyCount = Math.ceil(quizzesPerTopic * difficulties.easy);
    const mediumCount = Math.ceil(quizzesPerTopic * difficulties.medium);
    const hardCount = Math.floor(quizzesPerTopic * difficulties.hard);

    // Easy quizzes
    for (let i = 0; i < easyCount; i++) {
      quizSpecs.push({
        grade,
        subject,
        topicName: topic.name,
        difficulty: 'easy',
        questionCount: 5,
        timeLimit: 120
      });
    }

    // Medium quizzes
    for (let i = 0; i < mediumCount; i++) {
      quizSpecs.push({
        grade,
        subject,
        topicName: topic.name,
        difficulty: 'medium',
        questionCount: 10,
        timeLimit: 180
      });
    }

    // Hard quizzes
    for (let i = 0; i < hardCount; i++) {
      quizSpecs.push({
        grade,
        subject,
        topicName: topic.name,
        difficulty: 'hard',
        questionCount: 10,
        timeLimit: 240
      });
    }
  });

  // Limit to requested number
  const finalSpecs = quizSpecs.slice(0, minQuizzes);

  console.log(`Generating ${finalSpecs.length} quizzes across ${topics.length} topics`);

  // Generate quizzes in batches
  const quizzes = await generateBatch(
    finalSpecs,
    (spec) => generateQuiz(spec),
    3, // Batch size (to avoid rate limits)
    2000 // Delay between batches (ms)
  );

  console.log(`✅ Successfully generated ${quizzes.length} quizzes for Grade ${grade} ${subject}`);

  return quizzes;
};

/**
 * Generate multiple games for a grade and subject
 * @param {object} params - Batch generation parameters
 * @returns {Promise<array>} Array of game objects
 */
const generateGamesForSubject = async ({
  grade,
  subject,
  minGames = 20
}) => {
  console.log(`\nGenerating ${minGames} games for Grade ${grade} ${subject}`);

  const topics = getAllTopicsForGrade(grade, subject);

  if (topics.length === 0) {
    console.warn(`No topics found for Grade ${grade} ${subject}`);
    return [];
  }

  // Game types based on subject
  const gameTypesBySubject = {
    'Mathematics': ['math_race', 'pattern_finder', 'equation_solver', 'multiple_choice_race', 'sorting_game'],
    'Science': ['multiple_choice_race', 'matching_pairs', 'sorting_game', 'memory_match'],
    'English': ['word_puzzle', 'sentence_builder', 'spelling_bee', 'multiple_choice_race', 'matching_pairs'],
    'Social Studies': ['map_conquest', 'timeline_builder', 'multiple_choice_race', 'matching_pairs'],
    'EVS': ['sorting_game', 'matching_pairs', 'multiple_choice_race']
  };

  const availableGameTypes = gameTypesBySubject[subject] || ['multiple_choice_race', 'matching_pairs'];

  const gameSpecs = [];
  let gameTypeIndex = 0;

  // Distribute games across topics and types
  topics.forEach(topic => {
    const gamesForTopic = Math.ceil(minGames / topics.length);

    for (let i = 0; i < gamesForTopic; i++) {
      gameSpecs.push({
        grade,
        subject,
        gameType: availableGameTypes[gameTypeIndex % availableGameTypes.length],
        topicNames: [topic.name],
        difficulty: getDifficultyFromCompetency(topic.competencies[0]),
        timeLimit: 300
      });
      gameTypeIndex++;
    }
  });

  // Limit to requested number
  const finalSpecs = gameSpecs.slice(0, minGames);

  console.log(`Generating ${finalSpecs.length} games across ${topics.length} topics`);

  // Generate games in batches
  const games = await generateBatch(
    finalSpecs,
    (spec) => generateGame(spec),
    3, // Batch size
    2000 // Delay between batches (ms)
  );

  console.log(`✅ Successfully generated ${games.length} games for Grade ${grade} ${subject}`);

  return games;
};

/**
 * Get historical journey specifications for a grade
 * @param {string} grade - Grade level
 * @returns {array} Array of journey specifications
 */
const getJourneySpecsForGrade = (grade) => {
  const gradeNum = parseInt(grade);

  // Journeys are primarily for grades 6-12 (History/Social Studies)
  if (gradeNum < 6) {
    return [
      { era: 'Ancient Times', title: 'Journey to Ancient Civilizations', chapters: ['Ancient Life', 'Early Humans'], keyFigures: [], timePeriod: { start: -3000, end: -500 } },
      { era: 'Medieval Period', title: 'Medieval Adventures', chapters: ['Kingdoms', 'Trade Routes'], keyFigures: [], timePeriod: { start: 500, end: 1500 } }
    ];
  }

  // Grade-specific journeys based on CBSE curriculum
  const journeysByGrade = {
    '6': [
      { era: 'Ancient India', title: 'Indus Valley Civilization', chapters: ['Early Cities', 'Trade'], keyFigures: [], timePeriod: { start: -2500, end: -1500 } },
      { era: 'Ancient India', title: 'Vedic Period', chapters: ['Vedic Society', 'Literature'], keyFigures: [], timePeriod: { start: -1500, end: -500 } },
      { era: 'Ancient India', title: 'Maurya Empire', chapters: ['Chandragupta', 'Ashoka'], keyFigures: ['Chandragupta Maurya', 'Ashoka'], timePeriod: { start: -322, end: -185 } }
    ],
    '7': [
      { era: 'Medieval India', title: 'Delhi Sultanate', chapters: ['Turkish Invasions', 'Sultanate Rule'], keyFigures: ['Qutub-ud-din Aibak', 'Alauddin Khilji'], timePeriod: { start: 1206, end: 1526 } },
      { era: 'Mughal Empire', title: 'Rise of Mughals', chapters: ['Babur', 'Humayun'], keyFigures: ['Babur', 'Humayun'], timePeriod: { start: 1526, end: 1556 } },
      { era: 'Mughal Empire', title: 'Akbar\'s Reign', chapters: ['Administration', 'Culture'], keyFigures: ['Akbar'], timePeriod: { start: 1556, end: 1605 } }
    ],
    '8': [
      { era: 'Colonial India', title: 'British East India Company', chapters: ['Trade to Territory'], keyFigures: ['Robert Clive'], timePeriod: { start: 1600, end: 1857 } },
      { era: 'Colonial India', title: 'Revolt of 1857', chapters: ['First War of Independence'], keyFigures: ['Rani Lakshmibai', 'Mangal Pandey'], timePeriod: { start: 1857, end: 1858 } },
      { era: 'Modern India', title: 'Indian National Movement', chapters: ['Congress Formation'], keyFigures: ['Allan Octavian Hume'], timePeriod: { start: 1885, end: 1900 } }
    ],
    '9': [
      { era: 'World History', title: 'French Revolution', chapters: ['Causes', 'Revolution', 'Aftermath'], keyFigures: ['Louis XVI', 'Robespierre', 'Napoleon'], timePeriod: { start: 1789, end: 1799 } },
      { era: 'World History', title: 'Russian Revolution', chapters: ['Bolshevik Revolution'], keyFigures: ['Lenin', 'Trotsky'], timePeriod: { start: 1917, end: 1922 } },
      { era: 'India', title: 'Nationalist Movement', chapters: ['Non-Cooperation', 'Civil Disobedience'], keyFigures: ['Gandhi', 'Nehru'], timePeriod: { start: 1920, end: 1947 } }
    ],
    '10': [
      { era: 'World Wars', title: 'World War I', chapters: ['Causes', 'Course', 'Impact'], keyFigures: ['Woodrow Wilson'], timePeriod: { start: 1914, end: 1918 } },
      { era: 'World Wars', title: 'World War II', chapters: ['Rise of Fascism', 'War', 'Aftermath'], keyFigures: ['Hitler', 'Churchill', 'Roosevelt'], timePeriod: { start: 1939, end: 1945 } },
      { era: 'India', title: 'Independence and Partition', chapters: ['Freedom Struggle', 'Partition'], keyFigures: ['Gandhi', 'Nehru', 'Jinnah'], timePeriod: { start: 1945, end: 1947 } }
    ]
  };

  return journeysByGrade[grade] || [];
};

module.exports = {
  generateQuiz,
  generateGame,
  generateHistoricalJourney,
  generateQuizzesForSubject,
  generateGamesForSubject,
  getJourneySpecsForGrade
};
