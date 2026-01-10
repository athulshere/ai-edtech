const Student = require('../models/Student');

// Badge definitions
const BADGES = {
  FIRST_ASSESSMENT: {
    id: 'first_assessment',
    name: 'First Steps',
    description: 'Completed your first assessment',
    icon: '🎯'
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Achieved 100% on an assessment',
    icon: '🌟'
  },
  FIVE_STREAK: {
    id: 'five_streak',
    name: 'On Fire',
    description: '5-day activity streak',
    icon: '🔥'
  },
  TEN_STREAK: {
    id: 'ten_streak',
    name: 'Unstoppable',
    description: '10-day activity streak',
    icon: '💪'
  },
  THIRTY_STREAK: {
    id: 'thirty_streak',
    name: 'Legend',
    description: '30-day activity streak',
    icon: '👑'
  },
  FIVE_ASSESSMENTS: {
    id: 'five_assessments',
    name: 'Getting Started',
    description: 'Completed 5 assessments',
    icon: '📚'
  },
  TWENTY_ASSESSMENTS: {
    id: 'twenty_assessments',
    name: 'Dedicated Learner',
    description: 'Completed 20 assessments',
    icon: '🎓'
  },
  FIFTY_ASSESSMENTS: {
    id: 'fifty_assessments',
    name: 'Master Student',
    description: 'Completed 50 assessments',
    icon: '🏆'
  },
  IMPROVEMENT_STREAK: {
    id: 'improvement_streak',
    name: 'Rising Star',
    description: 'Improved score 3 times in a row',
    icon: '📈'
  },
  QUICK_LEARNER: {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Scored 90%+ on first attempt',
    icon: '⚡'
  },
  FIRST_QUIZ: {
    id: 'first_quiz',
    name: 'Quiz Starter',
    description: 'Completed your first quiz',
    icon: '🎮'
  },
  QUIZ_MASTER: {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Completed 10 quizzes',
    icon: '🧠'
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Finished quiz in under 1 minute',
    icon: '⚡'
  },
  QUIZ_PERFECTIONIST: {
    id: 'quiz_perfectionist',
    name: 'Quiz Perfectionist',
    description: 'Got 100% on a quiz',
    icon: '💯'
  }
};

// Points system
const POINTS = {
  ASSESSMENT_COMPLETED: 10,
  PERFECT_SCORE_BONUS: 50,
  HIGH_SCORE_BONUS: 20, // 90%+
  IMPROVEMENT_BONUS: 15,
  DAILY_ACTIVITY: 5,
  STREAK_MULTIPLIER: 1.5, // Applied to daily points when on streak
  QUIZ_COMPLETED: 15,
  QUIZ_PERFECT_BONUS: 30,
  QUIZ_HIGH_SCORE_BONUS: 15, // 90%+
  QUIZ_SPEED_BONUS: 10 // Completed in under half the time limit
};

/**
 * Update student's daily activity streak
 */
const updateStreak = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = student.gamification?.streaks?.lastActivityDate
      ? new Date(student.gamification.streaks.lastActivityDate)
      : null;

    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Same day, no change to streak
        return student.gamification.streaks.current;
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        student.gamification.streaks.current += 1;

        // Update longest streak if needed
        if (student.gamification.streaks.current > student.gamification.streaks.longest) {
          student.gamification.streaks.longest = student.gamification.streaks.current;
        }
      } else {
        // Streak broken, reset to 1
        student.gamification.streaks.current = 1;
      }
    } else {
      // First activity ever
      student.gamification.streaks.current = 1;
      student.gamification.streaks.longest = 1;
    }

    student.gamification.streaks.lastActivityDate = new Date();
    await student.save();

    // Check for streak badges
    await checkStreakBadges(student);

    return student.gamification.streaks.current;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

/**
 * Award points to a student
 */
const awardPoints = async (studentId, points, reason) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    // Apply streak multiplier if applicable
    let finalPoints = points;
    if (student.gamification?.streaks?.current >= 3) {
      finalPoints = Math.floor(points * POINTS.STREAK_MULTIPLIER);
    }

    student.gamification.totalPoints += finalPoints;

    // Update level (every 100 points = 1 level)
    student.gamification.level = Math.floor(student.gamification.totalPoints / 100) + 1;

    // Add achievement
    student.gamification.achievements.push({
      category: 'points',
      title: reason,
      description: `Earned ${finalPoints} points`,
      pointsAwarded: finalPoints,
      earnedAt: new Date()
    });

    await student.save();

    return {
      pointsAwarded: finalPoints,
      totalPoints: student.gamification.totalPoints,
      level: student.gamification.level
    };
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
};

/**
 * Award a badge to a student
 */
const awardBadge = async (studentId, badgeKey) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    const badge = BADGES[badgeKey];
    if (!badge) throw new Error('Invalid badge key');

    // Check if badge already exists
    const hasBadge = student.gamification.badges.some(b => b.id === badge.id);
    if (hasBadge) {
      return null; // Badge already awarded
    }

    // Award the badge
    student.gamification.badges.push({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      earnedAt: new Date()
    });

    await student.save();

    return badge;
  } catch (error) {
    console.error('Error awarding badge:', error);
    throw error;
  }
};

/**
 * Check and award streak-based badges
 */
const checkStreakBadges = async (student) => {
  const currentStreak = student.gamification.streaks.current;

  if (currentStreak >= 30) {
    await awardBadge(student._id, 'THIRTY_STREAK');
  } else if (currentStreak >= 10) {
    await awardBadge(student._id, 'TEN_STREAK');
  } else if (currentStreak >= 5) {
    await awardBadge(student._id, 'FIVE_STREAK');
  }
};

/**
 * Process gamification after assessment completion
 */
const processAssessmentGamification = async (studentId, assessmentData) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    const { score, totalMarks, assessmentCount, previousScore } = assessmentData;
    const percentage = (score / totalMarks) * 100;

    let totalPointsEarned = 0;
    const awardsReceived = [];

    // Update streak
    const currentStreak = await updateStreak(studentId);
    awardsReceived.push({ type: 'streak', value: currentStreak });

    // Base points for completing assessment
    const basePoints = await awardPoints(
      studentId,
      POINTS.ASSESSMENT_COMPLETED,
      'Assessment Completed'
    );
    totalPointsEarned += basePoints.pointsAwarded;

    // Perfect score bonus
    if (percentage === 100) {
      const perfectPoints = await awardPoints(
        studentId,
        POINTS.PERFECT_SCORE_BONUS,
        'Perfect Score!'
      );
      totalPointsEarned += perfectPoints.pointsAwarded;

      const badge = await awardBadge(studentId, 'PERFECT_SCORE');
      if (badge) awardsReceived.push({ type: 'badge', value: badge });
    }
    // High score bonus (90%+)
    else if (percentage >= 90) {
      const highScorePoints = await awardPoints(
        studentId,
        POINTS.HIGH_SCORE_BONUS,
        'High Score!'
      );
      totalPointsEarned += highScorePoints.pointsAwarded;
    }

    // Improvement bonus
    if (previousScore && percentage > previousScore) {
      const improvementPoints = await awardPoints(
        studentId,
        POINTS.IMPROVEMENT_BONUS,
        'Score Improvement'
      );
      totalPointsEarned += improvementPoints.pointsAwarded;
    }

    // First assessment badge
    if (assessmentCount === 1) {
      const badge = await awardBadge(studentId, 'FIRST_ASSESSMENT');
      if (badge) awardsReceived.push({ type: 'badge', value: badge });
    }

    // Assessment count badges
    if (assessmentCount === 5) {
      const badge = await awardBadge(studentId, 'FIVE_ASSESSMENTS');
      if (badge) awardsReceived.push({ type: 'badge', value: badge });
    } else if (assessmentCount === 20) {
      const badge = await awardBadge(studentId, 'TWENTY_ASSESSMENTS');
      if (badge) awardsReceived.push({ type: 'badge', value: badge });
    } else if (assessmentCount === 50) {
      const badge = await awardBadge(studentId, 'FIFTY_ASSESSMENTS');
      if (badge) awardsReceived.push({ type: 'badge', value: badge });
    }

    // Quick learner badge (90%+ on first assessment)
    if (assessmentCount === 1 && percentage >= 90) {
      const badge = await awardBadge(studentId, 'QUICK_LEARNER');
      if (badge) awardsReceived.push({ type: 'badge', value: badge });
    }

    // Get updated student data
    const updatedStudent = await Student.findById(studentId);

    return {
      pointsEarned: totalPointsEarned,
      totalPoints: updatedStudent.gamification.totalPoints,
      level: updatedStudent.gamification.level,
      currentStreak: updatedStudent.gamification.streaks.current,
      awards: awardsReceived
    };
  } catch (error) {
    console.error('Error processing assessment gamification:', error);
    throw error;
  }
};

/**
 * Process gamification after quiz completion
 */
const processQuizGamification = async (studentId, quizData) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    const { score, totalMarks, percentage, quizCount, previousScore, timeTaken, timeLimit } = quizData;

    let totalPointsEarned = 0;
    const awardsReceived = [];

    // Update streak
    const currentStreak = await updateStreak(studentId);
    awardsReceived.push({ type: 'streak', value: currentStreak });

    // Base points for completing quiz
    const basePoints = await awardPoints(
      studentId,
      POINTS.QUIZ_COMPLETED,
      'Quiz Completed'
    );
    totalPointsEarned += basePoints.pointsAwarded;

    // Perfect score bonus
    if (percentage === 100) {
      const perfectPoints = await awardPoints(
        studentId,
        POINTS.QUIZ_PERFECT_BONUS,
        'Perfect Quiz Score!'
      );
      totalPointsEarned += perfectPoints.pointsAwarded;

      const badge = await awardBadge(studentId, 'QUIZ_PERFECTIONIST');
      if (badge) awardsReceived.push({ type: 'badge', value: badge });
    }
    // High score bonus (90%+)
    else if (percentage >= 90) {
      const highScorePoints = await awardPoints(
        studentId,
        POINTS.QUIZ_HIGH_SCORE_BONUS,
        'High Quiz Score!'
      );
      totalPointsEarned += highScorePoints.pointsAwarded;
    }

    // Speed bonus (finished in under half the time limit)
    if (timeTaken < timeLimit / 2) {
      const speedPoints = await awardPoints(
        studentId,
        POINTS.QUIZ_SPEED_BONUS,
        'Speed Quiz!'
      );
      totalPointsEarned += speedPoints.pointsAwarded;

      if (timeTaken < 60) {
        const badge = await awardBadge(studentId, 'SPEED_DEMON');
        if (badge) awardsReceived.push({ type: 'badge', value: badge });
      }
    }

    // Improvement bonus
    if (previousScore && percentage > previousScore) {
      const improvementPoints = await awardPoints(
        studentId,
        POINTS.IMPROVEMENT_BONUS,
        'Quiz Score Improvement'
      );
      totalPointsEarned += improvementPoints.pointsAwarded;
    }

    // First quiz badge
    if (quizCount === 1) {
      const badge = await awardBadge(studentId, 'FIRST_QUIZ');
      if (badge) awardsReceived.push({ type: 'badge', value: badge });
    }

    // Quiz master badge (10 quizzes)
    if (quizCount === 10) {
      const badge = await awardBadge(studentId, 'QUIZ_MASTER');
      if (badge) awardsReceived.push({ type: 'badge', value: badge });
    }

    // Get updated student data
    const updatedStudent = await Student.findById(studentId);

    return {
      pointsEarned: totalPointsEarned,
      totalPoints: updatedStudent.gamification.totalPoints,
      level: updatedStudent.gamification.level,
      currentStreak: updatedStudent.gamification.streaks.current,
      awards: awardsReceived
    };
  } catch (error) {
    console.error('Error processing quiz gamification:', error);
    throw error;
  }
};

/**
 * Get student's gamification summary
 */
const getGamificationSummary = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    return {
      totalPoints: student.gamification?.totalPoints || 0,
      level: student.gamification?.level || 1,
      badges: student.gamification?.badges || [],
      streaks: {
        current: student.gamification?.streaks?.current || 0,
        longest: student.gamification?.streaks?.longest || 0
      },
      recentAchievements: (student.gamification?.achievements || [])
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
        .slice(0, 5)
    };
  } catch (error) {
    console.error('Error getting gamification summary:', error);
    throw error;
  }
};

/**
 * Calculate student level based on total points
 */
const calculateLevel = (totalPoints) => {
  // Level thresholds
  if (totalPoints >= 10000) return 10;
  if (totalPoints >= 5000) return 9;
  if (totalPoints >= 2500) return 8;
  if (totalPoints >= 1000) return 7;
  if (totalPoints >= 500) return 6;
  if (totalPoints >= 250) return 5;
  if (totalPoints >= 100) return 4;
  if (totalPoints >= 50) return 3;
  if (totalPoints >= 20) return 2;
  return 1;
};

/**
 * Process gamification for game completion
 */
const processGameGamification = async (studentId, gameData) => {
  try {
    const { score, totalMarks, percentage, gameCount, previousScore, timeTaken, timeLimit, gameType } = gameData;

    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    const awards = [];
    let totalPointsEarned = 0;

    // Base points for completing game
    const gamePoints = POINTS.QUIZ_COMPLETED || 15;
    await awardPoints(studentId, gamePoints, 'Game Completed');
    totalPointsEarned += gamePoints;
    awards.push({ type: 'points', value: gamePoints, reason: 'Game Completed' });

    // Perfect score bonus
    if (percentage === 100) {
      const perfectBonus = POINTS.QUIZ_PERFECT_BONUS || 30;
      await awardPoints(studentId, perfectBonus, 'Perfect Game Score!');
      totalPointsEarned += perfectBonus;
      awards.push({ type: 'points', value: perfectBonus, reason: 'Perfect Score!' });
      await awardBadge(studentId, 'QUIZ_PERFECTIONIST');
    }

    // High score bonus (90%+)
    if (percentage >= 90 && percentage < 100) {
      const highScoreBonus = POINTS.QUIZ_HIGH_SCORE_BONUS || 15;
      await awardPoints(studentId, highScoreBonus, 'High Game Score!');
      totalPointsEarned += highScoreBonus;
      awards.push({ type: 'points', value: highScoreBonus, reason: 'High Score!' });
    }

    // Speed bonus (completed in less than half the time)
    if (timeTaken < timeLimit / 2) {
      const speedBonus = POINTS.QUIZ_SPEED_BONUS || 10;
      await awardPoints(studentId, speedBonus, 'Speed Master!');
      totalPointsEarned += speedBonus;
      awards.push({ type: 'points', value: speedBonus, reason: 'Speed Master!' });
    }

    // Improvement bonus
    if (previousScore !== null && percentage > previousScore) {
      const improvement = percentage - previousScore;
      if (improvement >= 20) {
        const improvementPoints = 20;
        await awardPoints(studentId, improvementPoints, 'Great Improvement!');
        totalPointsEarned += improvementPoints;
        awards.push({ type: 'points', value: improvementPoints, reason: 'Great Improvement!' });
      }
    }

    // Game count milestones
    if (gameCount === 1) {
      await awardBadge(studentId, 'FIRST_QUIZ');
      awards.push({ type: 'badge', value: 'FIRST_QUIZ', reason: 'First Game Completed!' });
    } else if (gameCount === 10) {
      await awardBadge(studentId, 'QUIZ_MASTER');
      awards.push({ type: 'badge', value: 'QUIZ_MASTER', reason: '10 Games Completed!' });
    } else if (gameCount === 50) {
      awards.push({ type: 'badge', value: 'GAME_LEGEND', reason: '50 Games Completed!' });
    }

    // Update streak
    await updateStreak(studentId);

    // Get updated student data
    const updatedStudent = await Student.findById(studentId);
    const level = calculateLevel(updatedStudent.gamification.totalPoints);

    if (level > updatedStudent.gamification.level) {
      updatedStudent.gamification.level = level;
      await updatedStudent.save();
      awards.push({ type: 'level_up', value: level, reason: `Level ${level} Achieved!` });
    }

    return {
      pointsEarned: totalPointsEarned,
      totalPoints: updatedStudent.gamification.totalPoints,
      level: updatedStudent.gamification.level,
      currentStreak: updatedStudent.gamification.streaks.current,
      awards
    };
  } catch (error) {
    console.error('Game gamification error:', error);
    throw error;
  }
};

/**
 * Process gamification for Historical Journey completion
 */
const processHistoricalJourneyGamification = async (studentId, journeyData) => {
  try {
    const {
      totalPoints,
      historicalAccuracyRate,
      engagementScore,
      chaptersCompleted,
      challengesCompleted,
      discoveriesCollected
    } = journeyData;

    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    const awards = [];
    let pointsAwarded = totalPoints;

    // Award the total points earned in the journey
    await awardPoints(studentId, totalPoints, 'Historical Journey Completed');
    awards.push({ type: 'points', value: totalPoints, reason: 'Journey Completed' });

    // Historical accuracy badge
    if (historicalAccuracyRate >= 90) {
      const badge = await awardBadge(studentId, 'HISTORY_EXPERT');
      if (badge) awards.push({ type: 'badge', value: 'HISTORY_EXPERT', reason: '90%+ Historical Accuracy' });
    }

    // High engagement badge
    if (engagementScore >= 80) {
      const badge = await awardBadge(studentId, 'ENGAGED_LEARNER');
      if (badge) awards.push({ type: 'badge', value: 'ENGAGED_LEARNER', reason: 'High Engagement Score' });
    }

    // Discovery collector badge
    if (discoveriesCollected >= 5) {
      const badge = await awardBadge(studentId, 'ARTIFACT_COLLECTOR');
      if (badge) awards.push({ type: 'badge', value: 'ARTIFACT_COLLECTOR', reason: 'Collected 5+ Artifacts' });
    }

    // Challenge master badge
    if (challengesCompleted >= 5) {
      const badge = await awardBadge(studentId, 'CHALLENGE_MASTER');
      if (badge) awards.push({ type: 'badge', value: 'CHALLENGE_MASTER', reason: 'Completed 5+ Challenges' });
    }

    // Update streak
    await updateStreak(studentId);

    // Get updated student data
    const updatedStudent = await Student.findById(studentId);
    const previousLevel = updatedStudent.gamification.level;
    const newLevel = calculateLevel(updatedStudent.gamification.totalPoints);

    if (newLevel > previousLevel) {
      updatedStudent.gamification.level = newLevel;
      await updatedStudent.save();
      awards.push({ type: 'level_up', value: newLevel, reason: `Level ${newLevel} Achieved!` });
    }

    return {
      pointsAwarded,
      totalPoints: updatedStudent.gamification.totalPoints,
      level: updatedStudent.gamification.level,
      currentStreak: updatedStudent.gamification.streaks.current,
      badgesEarned: awards.filter(a => a.type === 'badge'),
      achievementsUnlocked: [],
      levelProgression: {
        startLevel: previousLevel,
        endLevel: newLevel,
        levelsGained: newLevel - previousLevel
      }
    };
  } catch (error) {
    console.error('Historical Journey gamification error:', error);
    throw error;
  }
};

module.exports = {
  updateStreak,
  awardPoints,
  awardBadge,
  processAssessmentGamification,
  processQuizGamification,
  processGameGamification,
  processHistoricalJourneyGamification,
  getGamificationSummary,
  calculateLevel,
  BADGES,
  POINTS
};
