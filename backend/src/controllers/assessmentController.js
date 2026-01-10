const Assessment = require('../models/Assessment');
const Student = require('../models/Student');
const googleVisionService = require('../services/googleVision');
const openaiService = require('../services/openai');
const awsService = require('../services/aws');
const gamificationService = require('../services/gamificationService');

const uploadAndAnalyze = async (req, res) => {
  try {
    const { studentId, subject, topic, grade, assessmentType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Authorization: Only parents can upload, and only for their own children
    if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to upload for this student' });
    }

    // Admins can upload for any student in their school
    if (req.user.role === 'admin' && student.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Not authorized to upload for this student' });
    }

    const assessment = await Assessment.create({
      studentId,
      subject,
      topic,
      grade: grade || student.grade,
      assessmentType: assessmentType || 'practice',
      status: 'processing'
    });

    const uploadResult = await awsService.uploadImage(req.file, studentId, assessment._id);

    if (!uploadResult.success) {
      assessment.status = 'failed';
      await assessment.save();
      return res.status(500).json({ message: 'Failed to upload image to S3', error: uploadResult.error });
    }

    assessment.originalImage = {
      url: uploadResult.url,
      s3Key: uploadResult.key,
      uploadedAt: new Date()
    };
    await assessment.save();

    res.status(202).json({
      message: 'Assessment uploaded successfully. Processing in progress...',
      assessmentId: assessment._id,
      status: 'processing'
    });

    processAssessment(assessment._id, req.file.buffer);

  } catch (error) {
    console.error('Upload and Analyze Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const processAssessment = async (assessmentId, imageBuffer) => {
  const startTime = Date.now();

  try {
    const assessment = await Assessment.findById(assessmentId).populate('studentId');

    const visionResult = await googleVisionService.detectHandwritingFromBuffer(imageBuffer);

    if (!visionResult.success) {
      assessment.status = 'failed';
      await assessment.save();
      return;
    }

    assessment.extractedText = visionResult.text;

    const studentHistory = await Assessment.find({
      studentId: assessment.studentId._id,
      status: 'completed'
    }).sort({ createdAt: -1 }).limit(5).lean();

    const aiResult = await openaiService.analyzeStudentAnswer(
      visionResult.text,
      assessment.subject,
      assessment.topic,
      assessment.grade,
      studentHistory
    );

    if (!aiResult.success) {
      assessment.status = 'failed';
      await assessment.save();
      return;
    }

    const analysis = aiResult.analysis;
    assessment.questions = analysis.questions || [];
    assessment.aiAnalysis = {
      overallScore: analysis.overallScore || 0,
      totalScore: analysis.questions?.reduce((sum, q) => sum + (q.maxScore || 0), 0) || 100,
      mistakes: analysis.mistakes || [],
      strengths: analysis.strengths || [],
      areasForImprovement: analysis.areasForImprovement || [],
      personalizedFeedback: analysis.personalizedFeedback || '',
      recommendedTopics: analysis.recommendedTopics || [],
      difficultyLevel: analysis.difficultyLevel || 'intermediate'
    };

    assessment.status = 'completed';
    assessment.processingTime = Date.now() - startTime;
    await assessment.save();

    const student = await Student.findById(assessment.studentId._id);
    if (student && analysis.mistakes) {
      for (const mistake of analysis.mistakes) {
        const existingPattern = student.learningProfile.commonMistakePatterns.find(
          p => p.subject === assessment.subject && p.pattern === mistake.mistakeType
        );

        if (existingPattern) {
          existingPattern.frequency += 1;
          existingPattern.lastOccurrence = new Date();
        } else {
          student.learningProfile.commonMistakePatterns.push({
            subject: assessment.subject,
            pattern: mistake.mistakeType,
            frequency: 1,
            lastOccurrence: new Date()
          });
        }
      }

      if (analysis.areasForImprovement) {
        student.learningProfile.weaknesses = [
          ...new Set([...student.learningProfile.weaknesses, ...analysis.areasForImprovement])
        ].slice(0, 10);
      }

      if (analysis.strengths) {
        student.learningProfile.strengths = [
          ...new Set([...student.learningProfile.strengths, ...analysis.strengths])
        ].slice(0, 10);
      }

      await student.save();
    }

    // Process Gamification
    try {
      const assessmentCount = await Assessment.countDocuments({
        studentId: assessment.studentId._id,
        status: 'completed'
      });

      // Get previous assessment score for improvement tracking
      const previousAssessments = await Assessment.find({
        studentId: assessment.studentId._id,
        status: 'completed',
        subject: assessment.subject
      }).sort({ createdAt: -1 }).skip(1).limit(1);

      const previousScore = previousAssessments.length > 0
        ? (previousAssessments[0].aiAnalysis.overallScore / previousAssessments[0].aiAnalysis.totalScore) * 100
        : null;

      const gamificationResult = await gamificationService.processAssessmentGamification(
        assessment.studentId._id,
        {
          score: assessment.aiAnalysis.overallScore,
          totalMarks: assessment.aiAnalysis.totalScore,
          assessmentCount,
          previousScore
        }
      );

      // Store gamification result in assessment
      assessment.gamificationRewards = gamificationResult;
      await assessment.save();

      console.log(`Gamification processed for student ${assessment.studentId._id}:`, gamificationResult);
    } catch (gamError) {
      console.error('Gamification processing error:', gamError);
      // Don't fail the entire assessment if gamification fails
    }

    console.log(`Assessment ${assessmentId} processed successfully in ${assessment.processingTime}ms`);

  } catch (error) {
    console.error('Process Assessment Error:', error);
    const assessment = await Assessment.findById(assessmentId);
    if (assessment) {
      assessment.status = 'failed';
      await assessment.save();
    }
  }
};

const getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('studentId', 'firstName lastName studentId grade');

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const student = await Student.findById(assessment.studentId._id);

    // Authorization: Parents can view their children's assessments
    if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view this assessment' });
    }

    // Admins can view any assessment in their school
    if (req.user.role === 'admin' && student.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this assessment' });
    }

    if (req.user.role === 'parent') {
      assessment.viewedByParent = true;
      await assessment.save();
    }

    res.json(assessment);
  } catch (error) {
    console.error('Get Assessment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStudentAssessments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject, status, limit = 20, page = 1 } = req.query;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Authorization: Parents can view their children's assessments
    if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Admins can view any student's assessments in their school
    if (req.user.role === 'admin' && student.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const query = { studentId };
    if (subject) query.subject = subject;
    if (status) query.status = status;

    const assessments = await Assessment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Assessment.countDocuments(query);

    res.json({
      assessments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get Student Assessments Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const generatePersonalizedTest = async (req, res) => {
  try {
    const { studentId, subject, difficulty } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.role === 'parent' && !student.parentIds.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const weakTopics = student.learningProfile.weaknesses || [];

    if (weakTopics.length === 0) {
      return res.status(400).json({
        message: 'Not enough data to generate personalized test. Complete more assessments first.'
      });
    }

    const testResult = await openaiService.generatePersonalizedTest(
      student,
      subject,
      weakTopics,
      difficulty || 'intermediate'
    );

    if (!testResult.success) {
      return res.status(500).json({ message: 'Failed to generate test', error: testResult.error });
    }

    res.json({
      test: testResult.test,
      studentName: `${student.firstName} ${student.lastName}`,
      targetedWeaknesses: weakTopics
    });
  } catch (error) {
    console.error('Generate Personalized Test Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadAndAnalyze,
  getAssessment,
  getStudentAssessments,
  generatePersonalizedTest
};
