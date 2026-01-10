const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Student = require('../models/Student');
const gamificationService = require('../services/gamificationService');

/**
 * Get all quizzes for a specific grade
 */
const getQuizzesByGrade = async (req, res) => {
  try {
    const { grade } = req.params;
    const { subject } = req.query;

    const query = { grade, isActive: true };
    if (subject) {
      query.subject = subject;
    }

    const quizzes = await Quiz.find(query)
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ subject: 1, title: 1 });

    res.json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    console.error('Get Quizzes Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a specific quiz (without answers)
 */
const getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId)
      .select('-questions.correctAnswer -questions.explanation');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Get Quiz Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Start a quiz attempt
 */
const startQuiz = async (req, res) => {
  try {
    const { studentId, quizId } = req.body;

    // Verify student exists and user has access
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Authorization check for parents
    if (req.user.role === 'parent' && !student.parentIds.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if grade matches
    if (quiz.grade !== student.grade) {
      return res.status(400).json({
        message: `This quiz is for Grade ${quiz.grade}. Student is in Grade ${student.grade}.`
      });
    }

    // Create quiz attempt
    const attempt = await QuizAttempt.create({
      studentId,
      quizId,
      totalPoints: quiz.totalPoints,
      answers: [],
      score: 0,
      percentage: 0,
      timeTaken: 0,
      status: 'in_progress',
      startedAt: new Date()
    });

    // Return quiz with questions but without answers
    const quizData = quiz.toObject();
    quizData.questions = quizData.questions.map(q => ({
      questionText: q.questionText,
      options: q.options,
      points: q.points
    }));

    res.json({
      success: true,
      data: {
        attemptId: attempt._id,
        quiz: quizData,
        startedAt: attempt.startedAt
      }
    });
  } catch (error) {
    console.error('Start Quiz Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Submit quiz answers
 */
const submitQuiz = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, timeTaken } = req.body;

    const attempt = await QuizAttempt.findById(attemptId).populate('quizId studentId');

    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    if (attempt.status === 'completed') {
      return res.status(400).json({ message: 'Quiz already submitted' });
    }

    // Authorization check
    if (req.user.role === 'parent' && !attempt.studentId.parentIds.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const quiz = attempt.quizId;
    let totalScore = 0;
    const gradedAnswers = [];

    // Grade each answer
    answers.forEach((answer, index) => {
      const question = quiz.questions[index];
      if (question) {
        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        const pointsEarned = isCorrect ? question.points : 0;
        totalScore += pointsEarned;

        gradedAnswers.push({
          questionIndex: index,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
          pointsEarned
        });
      }
    });

    const percentage = Math.round((totalScore / quiz.totalPoints) * 100);

    // Update attempt
    attempt.answers = gradedAnswers;
    attempt.score = totalScore;
    attempt.percentage = percentage;
    attempt.timeTaken = timeTaken;
    attempt.status = 'completed';
    attempt.completedAt = new Date();

    await attempt.save();

    // Process Gamification
    try {
      const quizCount = await QuizAttempt.countDocuments({
        studentId: attempt.studentId._id,
        status: 'completed'
      });

      // Get previous quiz score for improvement tracking
      const previousAttempts = await QuizAttempt.find({
        studentId: attempt.studentId._id,
        status: 'completed',
        _id: { $ne: attempt._id }
      }).sort({ createdAt: -1 }).limit(1);

      const previousScore = previousAttempts.length > 0
        ? previousAttempts[0].percentage
        : null;

      const gamificationResult = await gamificationService.processQuizGamification(
        attempt.studentId._id,
        {
          score: totalScore,
          totalMarks: quiz.totalPoints,
          percentage,
          quizCount,
          previousScore,
          timeTaken,
          timeLimit: quiz.timeLimit
        }
      );

      attempt.gamificationRewards = gamificationResult;
      await attempt.save();

      console.log(`Gamification processed for quiz attempt ${attemptId}:`, gamificationResult);
    } catch (gamError) {
      console.error('Gamification processing error:', gamError);
    }

    // Prepare response with correct answers
    const results = {
      attemptId: attempt._id,
      score: totalScore,
      totalPoints: quiz.totalPoints,
      percentage,
      timeTaken,
      answers: gradedAnswers.map((answer, index) => ({
        questionIndex: index,
        questionText: quiz.questions[index].questionText,
        options: quiz.questions[index].options,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: quiz.questions[index].correctAnswer,
        isCorrect: answer.isCorrect,
        pointsEarned: answer.pointsEarned,
        explanation: quiz.questions[index].explanation
      })),
      gamificationRewards: attempt.gamificationRewards
    };

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Submit Quiz Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get student's quiz attempts
 */
const getStudentQuizAttempts = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Authorization check
    if (req.user.role === 'parent' && !student.parentIds.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const attempts = await QuizAttempt.find({ studentId, status: 'completed' })
      .populate('quizId', 'title subject grade difficulty')
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await QuizAttempt.countDocuments({ studentId, status: 'completed' });

    res.json({
      success: true,
      data: {
        attempts,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get Quiz Attempts Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get quiz attempt details
 */
const getQuizAttemptDetails = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await QuizAttempt.findById(attemptId)
      .populate('studentId', 'firstName lastName grade parentIds')
      .populate('quizId');

    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    // Authorization check
    if (req.user.role === 'parent' && !attempt.studentId.parentIds.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Format response with full question details
    const quiz = attempt.quizId;
    const formattedAnswers = attempt.answers.map((answer) => {
      const question = quiz.questions[answer.questionIndex];
      return {
        questionIndex: answer.questionIndex,
        questionText: question.questionText,
        options: question.options,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: answer.isCorrect,
        pointsEarned: answer.pointsEarned,
        explanation: question.explanation
      };
    });

    const results = {
      attemptId: attempt._id,
      studentId: attempt.studentId,
      score: attempt.score,
      totalPoints: attempt.totalPoints,
      percentage: attempt.percentage,
      timeTaken: attempt.timeTaken,
      answers: formattedAnswers,
      gamificationRewards: attempt.gamificationRewards
    };

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Get Attempt Details Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getQuizzesByGrade,
  getQuiz,
  startQuiz,
  submitQuiz,
  getStudentQuizAttempts,
  getQuizAttemptDetails
};
