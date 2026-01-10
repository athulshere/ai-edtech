const Game = require('../models/Game');
const GameAttempt = require('../models/GameAttempt');
const Student = require('../models/Student');
const gamificationService = require('../services/gamificationService');

/**
 * Get all games for a specific grade
 */
const getGamesByGrade = async (req, res) => {
  try {
    const { grade } = req.params;
    const { subject, difficulty, gameType } = req.query;

    const query = { grade, isActive: true };
    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;
    if (gameType) query.gameType = gameType;

    const games = await Game.find(query)
      .select('-gameConfig.questions.correctAnswer -gameConfig.pairs.right -gameConfig.correctOrder')
      .sort({ subject: 1, title: 1 });

    // Group by subject
    const gamesBySubject = games.reduce((acc, game) => {
      if (!acc[game.subject]) {
        acc[game.subject] = [];
      }
      acc[game.subject].push(game);
      return acc;
    }, {});

    res.json({
      success: true,
      count: games.length,
      data: games,
      bySubject: gamesBySubject
    });
  } catch (error) {
    console.error('Get Games Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a specific game (without answers)
 */
const getGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Remove correct answers from response
    const gameData = game.toObject();
    if (gameData.gameConfig?.questions) {
      gameData.gameConfig.questions = gameData.gameConfig.questions.map(q => ({
        question: q.question,
        options: q.options,
        points: q.points
      }));
    }

    res.json({
      success: true,
      data: gameData
    });
  } catch (error) {
    console.error('Get Game Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Start a game attempt
 */
const startGame = async (req, res) => {
  try {
    const { studentId, gameId } = req.body;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Authorization check for parents
    if (req.user.role === 'parent' && !student.parentIds.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Create game attempt
    const attempt = await GameAttempt.create({
      studentId,
      gameId,
      maxScore: game.maxScore,
      status: 'in_progress',
      startedAt: new Date()
    });

    // Prepare game data without answers
    const gameData = game.toObject();

    // Remove correct answers based on game type
    if (gameData.gameConfig) {
      if (gameData.gameConfig.questions) {
        gameData.gameConfig.questions = gameData.gameConfig.questions.map(q => ({
          question: q.question,
          options: q.options,
          points: q.points,
          explanation: undefined // Hide explanation until after submission
        }));
      }
      if (gameData.gameConfig.pairs) {
        // For matching games, shuffle and split
        gameData.gameConfig.leftItems = gameData.gameConfig.pairs.map(p => p.left);
        gameData.gameConfig.rightItems = gameData.gameConfig.pairs.map(p => p.right).sort(() => Math.random() - 0.5);
        delete gameData.gameConfig.pairs; // Hide correct pairs
      }
      if (gameData.gameConfig.correctOrder) {
        delete gameData.gameConfig.correctOrder; // Hide correct order
      }
    }

    // Update game stats
    await Game.findByIdAndUpdate(gameId, {
      $inc: { 'stats.timesPlayed': 1 }
    });

    res.json({
      success: true,
      data: {
        attemptId: attempt._id,
        game: gameData,
        startedAt: attempt.startedAt
      }
    });
  } catch (error) {
    console.error('Start Game Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Submit game attempt
 */
const submitGame = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { responses, timeTaken } = req.body;

    const attempt = await GameAttempt.findById(attemptId).populate('gameId studentId');

    if (!attempt) {
      return res.status(404).json({ message: 'Game attempt not found' });
    }

    if (attempt.status === 'completed') {
      return res.status(400).json({ message: 'Game already submitted' });
    }

    // Authorization check
    if (req.user.role === 'parent' && !attempt.studentId.parentIds.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const game = attempt.gameId;
    let totalScore = 0;
    const gradedResponses = [];

    // Grade based on game type
    switch (game.gameType) {
      case 'multiple_choice_race':
      case 'spelling_bee':
        responses.forEach((response, index) => {
          const question = game.gameConfig.questions[index];
          if (question) {
            const isCorrect = response.selectedAnswer === question.correctAnswer;
            const pointsEarned = isCorrect ? question.points : 0;
            totalScore += pointsEarned;

            gradedResponses.push({
              questionIndex: index,
              userAnswer: response.selectedAnswer,
              isCorrect,
              pointsEarned,
              timeSpent: response.timeSpent || 0
            });
          }
        });
        break;

      case 'matching_pairs':
        responses.forEach((response, index) => {
          const pair = game.gameConfig.pairs[index];
          if (pair) {
            const isCorrect = response.leftItem === pair.left && response.rightItem === pair.right;
            const pointsEarned = isCorrect ? (game.maxScore / game.gameConfig.pairs.length) : 0;
            totalScore += pointsEarned;

            gradedResponses.push({
              questionIndex: index,
              userAnswer: response,
              isCorrect,
              pointsEarned,
              timeSpent: response.timeSpent || 0
            });
          }
        });
        break;

      case 'sorting_game':
        responses.forEach((response) => {
          const category = game.gameConfig.categories.find(c => c.name === response.category);
          if (category) {
            const isCorrect = category.items.includes(response.item);
            const pointsEarned = isCorrect ? (game.maxScore / getTotalItems(game.gameConfig.categories)) : 0;
            totalScore += pointsEarned;

            gradedResponses.push({
              userAnswer: response,
              isCorrect,
              pointsEarned
            });
          }
        });
        break;

      case 'pattern_finder':
        responses.forEach((response, index) => {
          const pattern = game.gameConfig.patterns[index];
          if (pattern) {
            const isCorrect = response.selectedAnswer === pattern.correctNext;
            const pointsEarned = isCorrect ? (game.maxScore / game.gameConfig.patterns.length) : 0;
            totalScore += pointsEarned;

            gradedResponses.push({
              questionIndex: index,
              userAnswer: response.selectedAnswer,
              isCorrect,
              pointsEarned,
              timeSpent: response.timeSpent || 0
            });
          }
        });
        break;

      default:
        // Generic scoring
        totalScore = game.maxScore * 0.5; // Default 50% if unknown type
    }

    const percentage = Math.round((totalScore / game.maxScore) * 100);

    // Calculate metrics
    const correctAnswers = gradedResponses.filter(r => r.isCorrect).length;
    const accuracy = gradedResponses.length > 0
      ? Math.round((correctAnswers / gradedResponses.length) * 100)
      : 0;

    const avgTimePerQuestion = gradedResponses.length > 0
      ? gradedResponses.reduce((sum, r) => sum + (r.timeSpent || 0), 0) / gradedResponses.length
      : 0;

    const speed = avgTimePerQuestion > 0 ? Math.round(60 / avgTimePerQuestion) : 0; // Questions per minute

    // Get previous attempts for improvement calculation
    const previousAttempts = await GameAttempt.find({
      studentId: attempt.studentId._id,
      gameId: game._id,
      status: 'completed',
      _id: { $ne: attempt._id }
    }).sort({ createdAt: -1 }).limit(1);

    const improvement = previousAttempts.length > 0
      ? percentage - previousAttempts[0].percentage
      : 0;

    // Update attempt
    attempt.responses = gradedResponses;
    attempt.score = Math.round(totalScore);
    attempt.percentage = percentage;
    attempt.timeTaken = timeTaken;
    attempt.status = 'completed';
    attempt.completedAt = new Date();
    attempt.metrics = {
      accuracy,
      speed,
      consistency: 100, // Can be calculated based on response time variance
      improvement
    };

    await attempt.save();

    // Update game stats
    const gameAttempts = await GameAttempt.find({ gameId: game._id, status: 'completed' });
    const newAvgScore = gameAttempts.reduce((sum, a) => sum + a.percentage, 0) / gameAttempts.length;
    const newAvgTime = gameAttempts.reduce((sum, a) => sum + (a.timeTaken || 0), 0) / gameAttempts.length;
    const newCompletionRate = (gameAttempts.length / game.stats.timesPlayed) * 100;

    await Game.findByIdAndUpdate(game._id, {
      'stats.averageScore': Math.round(newAvgScore),
      'stats.averageTimeSpent': Math.round(newAvgTime),
      'stats.completionRate': Math.round(newCompletionRate)
    });

    // Process gamification
    try {
      const gameCount = await GameAttempt.countDocuments({
        studentId: attempt.studentId._id,
        status: 'completed'
      });

      const gamificationResult = await gamificationService.processGameGamification(
        attempt.studentId._id,
        {
          score: totalScore,
          totalMarks: game.maxScore,
          percentage,
          gameCount,
          previousScore: previousAttempts.length > 0 ? previousAttempts[0].percentage : null,
          timeTaken,
          timeLimit: game.timeLimit,
          gameType: game.gameType
        }
      );

      attempt.gamificationRewards = gamificationResult;
      await attempt.save();

      console.log(`Gamification processed for game attempt ${attemptId}:`, gamificationResult);
    } catch (gamError) {
      console.error('Gamification processing error:', gamError);
    }

    // Prepare response with correct answers
    const results = {
      attemptId: attempt._id,
      score: Math.round(totalScore),
      maxScore: game.maxScore,
      percentage,
      timeTaken,
      metrics: attempt.metrics,
      responses: gradedResponses,
      correctAnswers: getCorrectAnswersForReview(game),
      gamificationRewards: attempt.gamificationRewards
    };

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Submit Game Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get student's game attempts
 */
const getStudentGameAttempts = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 10 } = req.query;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Authorization check
    if (req.user.role === 'parent' && !student.parentIds.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const attempts = await GameAttempt.find({ studentId, status: 'completed' })
      .populate('gameId', 'title subject gameType difficulty pointsReward')
      .sort({ completedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    console.error('Get Game Attempts Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get game attempt details
 */
const getGameAttemptDetails = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await GameAttempt.findById(attemptId)
      .populate('studentId', 'firstName lastName grade')
      .populate('gameId', 'title subject gameType');

    if (!attempt) {
      return res.status(404).json({ message: 'Game attempt not found' });
    }

    // Authorization check
    if (req.user.role === 'parent') {
      const student = await Student.findById(attempt.studentId._id);
      if (!student || !student.parentIds.some(p => p.toString() === req.user._id.toString())) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    res.json({
      success: true,
      data: attempt
    });
  } catch (error) {
    console.error('Get Game Attempt Details Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get game leaderboard
 */
const getGameLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { limit = 10 } = req.query;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const topAttempts = await GameAttempt.find({
      gameId,
      status: 'completed'
    })
      .populate('studentId', 'firstName lastName grade')
      .sort({ percentage: -1, timeTaken: 1 })
      .limit(parseInt(limit));

    const leaderboard = topAttempts.map((attempt, index) => ({
      rank: index + 1,
      student: {
        id: attempt.studentId._id,
        name: `${attempt.studentId.firstName} ${attempt.studentId.lastName}`,
        grade: attempt.studentId.grade
      },
      score: attempt.score,
      percentage: attempt.percentage,
      timeTaken: attempt.timeTaken,
      completedAt: attempt.completedAt
    }));

    res.json({
      success: true,
      game: {
        title: game.title,
        subject: game.subject,
        grade: game.grade
      },
      data: leaderboard
    });
  } catch (error) {
    console.error('Get Leaderboard Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper functions
function getTotalItems(categories) {
  return categories.reduce((sum, cat) => sum + cat.items.length, 0);
}

function getCorrectAnswersForReview(game) {
  const answers = {};

  if (game.gameConfig.questions) {
    answers.questions = game.gameConfig.questions.map(q => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }));
  }

  if (game.gameConfig.pairs) {
    answers.pairs = game.gameConfig.pairs;
  }

  if (game.gameConfig.correctOrder) {
    answers.correctOrder = game.gameConfig.correctOrder;
  }

  if (game.gameConfig.patterns) {
    answers.patterns = game.gameConfig.patterns.map(p => ({
      sequence: p.sequence,
      correctNext: p.correctNext,
      nextItems: p.nextItems
    }));
  }

  return answers;
}

module.exports = {
  getGamesByGrade,
  getGame,
  startGame,
  submitGame,
  getStudentGameAttempts,
  getGameAttemptDetails,
  getGameLeaderboard
};
