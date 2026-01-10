const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeStudentAnswer(extractedText, subject, topic, grade, studentHistory = null) {
    try {
      const systemPrompt = `You are an expert educational AI assistant specializing in analyzing student assessments.

IMPORTANT INSTRUCTIONS:
- The text you receive is extracted from handwritten work using OCR, so there may be recognition errors
- Look for the FINAL ANSWER at the end of the solution (often marked as "Answer:", "Ans:", or underlined)
- Focus on whether the final answer and methodology are correct, not formatting issues caused by OCR
- Be generous with partial credit for correct reasoning even if there are minor notation errors
- Consider that symbols like "^", "n", "x" may be misread by OCR
- If the final answer is clearly correct, the student deserves full credit

Your role is to:
1. Identify the final answer first, then work backward to check the methodology
2. Distinguish between actual student mistakes vs OCR/handwriting recognition errors
3. Provide constructive, personalized feedback
4. Be encouraging and focus on what the student did RIGHT
5. Consider the student's grade level and learning history

Be fair, encouraging, specific, and actionable in your feedback.`;

      const userPrompt = `
Subject: ${subject}
Topic: ${topic}
Grade Level: ${grade}

Student's Handwritten Answer (extracted via OCR - may contain recognition errors):
${extractedText}

${studentHistory ? `Student's Learning History:
${JSON.stringify(studentHistory, null, 2)}` : ''}

CRITICAL: This text was extracted from handwriting, so there may be OCR errors. Focus on:
1. The FINAL ANSWER (look for "Answer:", "Ans:", or underlined conclusion)
2. The overall approach and methodology
3. Whether the mathematical reasoning is sound

Please analyze this student's work and provide:
1. A breakdown of each question/answer (if multiple questions present)
2. Identification of ACTUAL mistakes (not OCR errors) with their type
3. Detailed explanation of what went wrong (if anything)
4. Recognition of what the student did correctly
5. Specific suggestions for improvement
6. Related concepts the student should review
7. Overall strengths demonstrated
8. Personalized recommendations based on their level

GRADING RULES (CRITICAL - FOLLOW STRICTLY):
1. If you see "Answer: [value]" or "Ans: [value]" at the end, treat that as the final answer
2. OCR may convert "^n" to "\"" or similar - interpret context carefully
3. If the final answer is mathematically correct, score should be 8-10 points
4. If methodology is correct but answer is slightly wrong, give 5-7 points
5. Only give 0-4 points if both answer AND method are fundamentally wrong
6. Do NOT penalize for messy handwriting or OCR errors - focus on mathematical correctness
7. Look for mathematical patterns: if student shows work leading to correct answer, they understand the concept

EXAMPLE GRADING:
- Student writes clear solution, answer correct → 10 points, isCorrect: true
- Student has right approach, minor calculation error → 7 points, isCorrect: false
- Student completely wrong approach → 0-3 points, isCorrect: false

Format your response as JSON with this structure:
{
  "questions": [
    {
      "questionNumber": 1,
      "questionText": "Brief description of what the question asks",
      "studentAnswer": "The final answer the student provided",
      "correctAnswer": "What the correct answer should be (if you can determine it)",
      "isCorrect": true/false,
      "score": 0-10,
      "maxScore": 10
    }
  ],
  "mistakes": [
    {
      "questionNumber": 1,
      "mistakeType": "conceptual|calculation|formatting|incomplete|misunderstanding|other",
      "description": "specific mistake description (ONLY if there's an ACTUAL mathematical error, not OCR issues)",
      "suggestion": "how to correct it",
      "relatedConcepts": ["concept1", "concept2"]
    }
  ],
  "overallScore": 0-100,
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "personalizedFeedback": "detailed personalized feedback",
  "recommendedTopics": ["topic1", "topic2"],
  "difficultyLevel": "beginner|intermediate|advanced"
}

IMPORTANT: Empty mistakes array is fine if the answer is correct! Don't invent problems that don't exist.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,  // Lower temperature for more consistent, accurate grading
        max_tokens: 3000   // More tokens for detailed analysis
      });

      const analysis = JSON.parse(completion.choices[0].message.content);

      // Log the analysis for debugging
      console.log('OpenAI Analysis Summary:', {
        questionsCount: analysis.questions?.length || 0,
        overallScore: analysis.overallScore,
        mistakesCount: analysis.mistakes?.length || 0,
        tokensUsed: completion.usage.total_tokens
      });

      return {
        success: true,
        analysis,
        tokensUsed: completion.usage.total_tokens
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      console.error('Error details:', {
        message: error.message,
        type: error.constructor.name,
        code: error.code
      });
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generatePersonalizedTest(studentProfile, subject, weakTopics, difficulty = 'intermediate') {
    try {
      const systemPrompt = `You are an expert educational content creator. Generate personalized test questions based on student's weak areas.`;

      const userPrompt = `
Generate a personalized test for:
Subject: ${subject}
Weak Topics: ${weakTopics.join(', ')}
Difficulty Level: ${difficulty}
Grade: ${studentProfile.grade}

Student's Common Mistake Patterns:
${JSON.stringify(studentProfile.learningProfile?.commonMistakePatterns || [], null, 2)}

Create 5-10 targeted questions that will help the student improve in these weak areas.
Include a mix of question types and difficulty levels.

Format as JSON:
{
  "testTitle": "Personalized Practice Test",
  "questions": [
    {
      "questionNumber": 1,
      "question": "question text",
      "type": "multiple-choice|short-answer|problem-solving",
      "difficulty": "easy|medium|hard",
      "targetedWeakness": "specific weakness this addresses",
      "hints": ["hint1", "hint2"],
      "correctAnswer": "answer"
    }
  ]
}`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 2000
      });

      const test = JSON.parse(completion.choices[0].message.content);

      return {
        success: true,
        test,
        tokensUsed: completion.usage.total_tokens
      };
    } catch (error) {
      console.error('OpenAI Test Generation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async identifyLearningPatterns(assessmentHistory) {
    try {
      const systemPrompt = `You are an educational data analyst. Analyze student assessment history to identify learning patterns, trends, and personalized insights.`;

      const userPrompt = `
Analyze this student's assessment history:
${JSON.stringify(assessmentHistory, null, 2)}

Identify:
1. Recurring mistake patterns
2. Learning trends (improving/declining areas)
3. Optimal learning style indicators
4. Specific conceptual gaps
5. Strengths to leverage
6. Personalized learning path recommendations

Format as JSON with detailed insights.`;

      const completion = await this.openai.chat.completions.create({
        model: "GPT-5 mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
        max_tokens: 1500
      });

      const patterns = JSON.parse(completion.choices[0].message.content);

      return {
        success: true,
        patterns,
        tokensUsed: completion.usage.total_tokens
      };
    } catch (error) {
      console.error('OpenAI Pattern Analysis Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new OpenAIService();
