const HistoricalJourney = require('../models/HistoricalJourney');
const HistoricalJourneyAttempt = require('../models/HistoricalJourneyAttempt');
const Student = require('../models/Student');
const gamificationService = require('../services/gamificationService');

// Get all journeys by grade
exports.getJourneysByGrade = async (req, res) => {
  try {
    const { grade } = req.params;

    console.log('Fetching journeys for grade:', grade);

    const journeys = await HistoricalJourney.find({
      grade,
      isActive: true
    });

    console.log('Found journeys:', journeys.length);

    res.json({
      success: true,
      count: journeys.length,
      data: journeys
    });
  } catch (error) {
    console.error('Error fetching journeys:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get specific journey details
exports.getJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;

    const journey = await HistoricalJourney.findById(journeyId);

    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    res.json({
      success: true,
      data: journey
    });
  } catch (error) {
    console.error('Error fetching journey:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Start a new journey
exports.startJourney = async (req, res) => {
  try {
    const { journeyId, studentId } = req.body;

    // Verify student exists and belongs to parent
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check authorization
    if (req.user.role === 'parent') {
      const isAuthorized = student.parentIds.some(
        parentId => parentId.toString() === req.user._id.toString()
      );
      if (!isAuthorized) {
        return res.status(403).json({ message: 'Not authorized to access this student' });
      }
    }

    // Verify journey exists
    const journey = await HistoricalJourney.findById(journeyId);
    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    // Check if there's an existing in-progress attempt
    let attempt = await HistoricalJourneyAttempt.findOne({
      studentId,
      journeyId,
      status: 'in_progress'
    });

    if (attempt) {
      // Resume existing attempt
      return res.json({
        success: true,
        message: 'Resuming existing journey',
        data: attempt
      });
    }

    // Create new attempt
    attempt = await HistoricalJourneyAttempt.create({
      studentId,
      journeyId,
      currentChapter: 0,
      startedAt: new Date()
    });

    // Update journey stats
    await HistoricalJourney.findByIdAndUpdate(journeyId, {
      $inc: { 'stats.timesPlayed': 1 }
    });

    res.json({
      success: true,
      message: 'Journey started',
      data: attempt
    });
  } catch (error) {
    console.error('Error starting journey:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Record a decision
exports.recordDecision = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { chapterNumber, decisionIndex, optionChosen } = req.body;

    const attempt = await HistoricalJourneyAttempt.findById(attemptId).populate('journeyId');

    if (!attempt) {
      return res.status(404).json({ message: 'Journey attempt not found' });
    }

    // Verify authorization
    if (req.user.role === 'parent') {
      const student = await Student.findById(attempt.studentId);
      const isAuthorized = student.parentIds.some(
        parentId => parentId.toString() === req.user._id.toString()
      );
      if (!isAuthorized) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const journey = attempt.journeyId;
    // chapterNumber from frontend is 0-indexed, but journey chapters use 1-indexed chapterNumber
    const chapter = journey.story.chapters.find(ch => ch.chapterNumber === chapterNumber + 1);

    if (!chapter) {
      return res.status(404).json({ message: `Chapter not found for chapterNumber ${chapterNumber}` });
    }

    const decision = chapter.decisions[decisionIndex];
    const chosenOption = decision.options[optionChosen];

    // Record the decision
    attempt.decisionsRecord.push({
      chapterNumber,
      decisionIndex,
      optionChosen,
      wasHistoricallyAccurate: chosenOption.historicalAccuracy,
      pointsEarned: chosenOption.pointsAwarded || 0,
      timestamp: new Date()
    });

    // Update total points
    attempt.totalPoints += chosenOption.pointsAwarded || 0;
    attempt.breakdown.decisionPoints += chosenOption.pointsAwarded || 0;

    // Update narrative path
    if (!attempt.narrativePath.includes(chapterNumber)) {
      attempt.narrativePath.push(chapterNumber);
    }

    // If decision leads to a new chapter, update current chapter
    if (chosenOption.leadsToChapter !== undefined) {
      attempt.currentChapter = chosenOption.leadsToChapter;
    }

    await attempt.save();

    res.json({
      success: true,
      data: {
        attempt,
        consequence: chosenOption.consequence,
        learningPoint: chosenOption.learningPoint,
        nextChapter: chosenOption.leadsToChapter
      }
    });
  } catch (error) {
    console.error('Error recording decision:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit challenge result
exports.submitChallenge = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { chapterNumber, challengeIndex, success, timeSpent, attempts } = req.body;

    const attempt = await HistoricalJourneyAttempt.findById(attemptId).populate('journeyId');

    if (!attempt) {
      return res.status(404).json({ message: 'Journey attempt not found' });
    }

    // Verify authorization
    if (req.user.role === 'parent') {
      const student = await Student.findById(attempt.studentId);
      const isAuthorized = student.parentIds.some(
        parentId => parentId.toString() === req.user._id.toString()
      );
      if (!isAuthorized) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const journey = attempt.journeyId;
    // chapterNumber from frontend is 0-indexed, but journey chapters use 1-indexed chapterNumber
    const chapter = journey.story.chapters.find(ch => ch.chapterNumber === chapterNumber + 1);

    if (!chapter) {
      return res.status(404).json({ message: `Chapter not found for chapterNumber ${chapterNumber}` });
    }

    const challenge = chapter.challenges[challengeIndex];

    let pointsEarned = 0;
    if (success) {
      pointsEarned = challenge.onSuccess.points || 0;
    }

    // Record challenge result
    attempt.challengeResults.push({
      chapterNumber,
      challengeIndex,
      challengeType: challenge.type,
      success,
      attempts,
      pointsEarned,
      timeSpent
    });

    attempt.totalPoints += pointsEarned;
    attempt.breakdown.challengePoints += pointsEarned;
    attempt.totalTimeTaken += timeSpent;

    await attempt.save();

    res.json({
      success: true,
      data: {
        attempt,
        pointsEarned,
        narrative: success ? challenge.onSuccess.narrative : challenge.onFailure.narrative,
        reward: success ? challenge.onSuccess.reward : null
      }
    });
  } catch (error) {
    console.error('Error submitting challenge:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Record discovery
exports.recordDiscovery = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { chapterNumber, discoveryIndex } = req.body;

    const attempt = await HistoricalJourneyAttempt.findById(attemptId).populate('journeyId');

    if (!attempt) {
      return res.status(404).json({ message: 'Journey attempt not found' });
    }

    const journey = attempt.journeyId;
    // chapterNumber from frontend is 0-indexed, but journey chapters use 1-indexed chapterNumber
    const chapter = journey.story.chapters.find(ch => ch.chapterNumber === chapterNumber + 1);

    if (!chapter) {
      return res.status(404).json({ message: `Chapter not found for chapterNumber ${chapterNumber}` });
    }

    const discovery = chapter.discoveries[discoveryIndex];

    // Check if already collected
    const alreadyCollected = attempt.discoveriesCollected.some(
      d => d.chapterNumber === chapterNumber && d.discoveryIndex === discoveryIndex
    );

    if (!alreadyCollected) {
      attempt.discoveriesCollected.push({
        chapterNumber,
        discoveryIndex,
        discoveredAt: new Date(),
        type: discovery.type,
        name: discovery.name
      });

      await attempt.save();
    }

    res.json({
      success: true,
      data: {
        discovery,
        alreadyCollected
      }
    });
  } catch (error) {
    console.error('Error recording discovery:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update chapter progress
exports.updateChapterProgress = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { chapterNumber, timeSpent } = req.body;

    const attempt = await HistoricalJourneyAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ message: 'Journey attempt not found' });
    }

    // Check if chapter already visited
    const existingVisit = attempt.chaptersVisited.find(
      ch => ch.chapterNumber === chapterNumber
    );

    if (!existingVisit) {
      attempt.chaptersVisited.push({
        chapterNumber,
        visitedAt: new Date(),
        timeSpent
      });
    } else {
      existingVisit.timeSpent += timeSpent;
    }

    attempt.currentChapter = chapterNumber;
    attempt.totalTimeTaken += timeSpent;

    await attempt.save();

    res.json({
      success: true,
      data: attempt
    });
  } catch (error) {
    console.error('Error updating chapter progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Complete journey
exports.completeJourney = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await HistoricalJourneyAttempt.findById(attemptId)
      .populate('journeyId')
      .populate('studentId');

    if (!attempt) {
      return res.status(404).json({ message: 'Journey attempt not found' });
    }

    // Verify authorization
    if (req.user.role === 'parent') {
      const isAuthorized = attempt.studentId.parentIds.some(
        parentId => parentId.toString() === req.user._id.toString()
      );
      if (!isAuthorized) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    attempt.status = 'completed';
    attempt.completedAt = new Date();

    // Calculate completion bonus
    const completionBonus = 100;
    attempt.breakdown.completionBonus = completionBonus;
    attempt.totalPoints += completionBonus;

    // Calculate accuracy bonus
    attempt.historicalAccuracyRate = attempt.calculateHistoricalAccuracy();
    if (attempt.historicalAccuracyRate >= 80) {
      const accuracyBonus = 50;
      attempt.breakdown.accuracyBonus = accuracyBonus;
      attempt.totalPoints += accuracyBonus;
    }

    // Calculate engagement score
    attempt.engagementScore = attempt.calculateEngagementScore();

    // Process gamification
    const gamificationResult = await gamificationService.processHistoricalJourneyGamification(
      attempt.studentId._id,
      {
        totalPoints: attempt.totalPoints,
        historicalAccuracyRate: attempt.historicalAccuracyRate,
        engagementScore: attempt.engagementScore,
        chaptersCompleted: attempt.chaptersVisited.length,
        challengesCompleted: attempt.challengeResults.filter(c => c.success).length,
        discoveriesCollected: attempt.discoveriesCollected.length
      }
    );

    attempt.gamificationRewards = gamificationResult;

    await attempt.save();

    // Update journey stats
    const journey = attempt.journeyId;
    const avgCompletionTime = journey.stats.averageCompletionTime || 0;
    const timesCompleted = journey.stats.completionRate * journey.stats.timesPlayed;
    const newCompletionRate = (timesCompleted + 1) / journey.stats.timesPlayed;

    await HistoricalJourney.findByIdAndUpdate(journey._id, {
      $set: {
        'stats.averageCompletionTime':
          (avgCompletionTime * timesCompleted + attempt.totalTimeTaken) / (timesCompleted + 1),
        'stats.completionRate': newCompletionRate,
        'stats.averageEngagementScore':
          ((journey.stats.averageEngagementScore * timesCompleted) + attempt.engagementScore) /
          (timesCompleted + 1)
      }
    });

    res.json({
      success: true,
      message: 'Journey completed!',
      data: attempt
    });
  } catch (error) {
    console.error('Error completing journey:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student's journey attempts
exports.getStudentJourneyAttempts = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Verify authorization
    if (req.user.role === 'parent') {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const isAuthorized = student.parentIds.some(
        parentId => parentId.toString() === req.user._id.toString()
      );
      if (!isAuthorized) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const attempts = await HistoricalJourneyAttempt.find({ studentId })
      .populate('journeyId', 'title era grade subject')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get journey attempt details
exports.getJourneyAttemptDetails = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await HistoricalJourneyAttempt.findById(attemptId)
      .populate('studentId', 'firstName lastName grade')
      .populate('journeyId');

    if (!attempt) {
      return res.status(404).json({ message: 'Journey attempt not found' });
    }

    // Verify authorization
    if (req.user.role === 'parent') {
      const student = await Student.findById(attempt.studentId._id);
      const isAuthorized = student.parentIds.some(
        parentId => parentId.toString() === req.user._id.toString()
      );
      if (!isAuthorized) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    res.json({
      success: true,
      data: attempt
    });
  } catch (error) {
    console.error('Error fetching attempt details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
