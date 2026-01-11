/**
 * AI Content Helper - OpenAI Integration
 *
 * Provides functions to generate educational content using OpenAI API
 */

const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate quiz questions for a specific topic
 * @param {object} params - Generation parameters
 * @param {string} params.grade - Grade level
 * @param {string} params.subject - Subject name
 * @param {string} params.topic - Topic name
 * @param {array} params.learningOutcomes - Learning outcomes for the topic
 * @param {string} params.difficulty - Difficulty level (easy/medium/hard)
 * @param {number} params.questionCount - Number of questions to generate
 * @returns {Promise<array>} Array of question objects
 */
const generateQuizQuestions = async ({
  grade,
  subject,
  topic,
  learningOutcomes = [],
  difficulty = 'medium',
  questionCount = 10
}) => {
  const difficultyInstructions = {
    easy: 'Focus on basic knowledge and understanding. Questions should test recall and simple comprehension.',
    medium: 'Focus on application and analysis. Questions should require students to apply concepts and analyze situations.',
    hard: 'Focus on synthesis and evaluation. Questions should require higher-order thinking, problem-solving, and critical analysis.'
  };

  const prompt = `Generate ${questionCount} multiple-choice questions for Grade ${grade} ${subject} on the topic "${topic}".

Difficulty Level: ${difficulty} - ${difficultyInstructions[difficulty]}

Learning Outcomes to Cover:
${learningOutcomes.map((lo, i) => `${i + 1}. ${lo}`).join('\n')}

Requirements:
1. Each question must have exactly 4 options (A, B, C, D)
2. Only ONE option should be correct
3. Questions should be age-appropriate for Grade ${grade}
4. Include clear explanations for correct answers
5. Questions should align with CBSE curriculum
6. Avoid ambiguous or trick questions
7. Make distractors (wrong options) plausible but clearly incorrect
8. Questions should progressively increase in difficulty within the set

Return ONLY a valid JSON array with this exact structure:
[
  {
    "questionText": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of why this is correct and what concept it tests",
    "points": 10
  }
]

IMPORTANT: Return ONLY the JSON array, no other text or markdown formatting.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Much cheaper: $0.150 per 1M input tokens, $0.600 per 1M output tokens
      messages: [
        {
          role: 'system',
          content: 'You are an expert CBSE curriculum educator specializing in creating high-quality, pedagogically sound assessment questions. You always return valid JSON without any markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const content = response.choices[0].message.content.trim();

    // Remove markdown code blocks if present
    let jsonContent = content;
    if (content.startsWith('```')) {
      jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const questions = JSON.parse(jsonContent);

    // Validate and sanitize
    return questions.map(q => ({
      questionText: q.questionText,
      options: q.options.slice(0, 4), // Ensure exactly 4 options
      correctAnswer: Math.max(0, Math.min(3, q.correctAnswer)), // Ensure 0-3
      explanation: q.explanation || '',
      points: q.points || 10
    }));

  } catch (error) {
    console.error('Error generating quiz questions:', error.message);
    throw new Error(`Failed to generate quiz questions: ${error.message}`);
  }
};

/**
 * Generate game configuration for a specific topic
 * @param {object} params - Generation parameters
 * @param {string} params.grade - Grade level
 * @param {string} params.subject - Subject name
 * @param {string} params.gameType - Type of game
 * @param {string} params.topic - Topic name
 * @param {array} params.learningObjectives - Learning objectives
 * @returns {Promise<object>} Game configuration object
 */
const generateGameConfig = async ({
  grade,
  subject,
  gameType,
  topic,
  learningObjectives = []
}) => {
  const gameTypePrompts = {
    'math_race': 'Generate mathematical problems with answers for a fast-paced calculation game.',
    'pattern_finder': 'Generate number/shape patterns for pattern recognition.',
    'word_puzzle': 'Generate vocabulary words and clues for word puzzles.',
    'molecule_matcher': 'Generate chemistry molecule pairs for matching.',
    'map_conquest': 'Generate geography questions about locations and regions.',
    'timeline_builder': 'Generate historical events with years for timeline construction.',
    'equation_solver': 'Generate equations to solve step by step.',
    'spelling_bee': 'Generate grade-appropriate spelling words.',
    'sentence_builder': 'Generate scrambled sentences to rearrange.',
    'memory_match': 'Generate concept pairs for memory matching.',
    'multiple_choice_race': 'Generate quick multiple-choice questions.',
    'sorting_game': 'Generate items to sort into categories.',
    'matching_pairs': 'Generate concept pairs for matching.'
  };

  const specificInstruction = gameTypePrompts[gameType] || 'Generate appropriate content for this game type.';

  const prompt = `Create a game configuration for Grade ${grade} ${subject} - "${topic}".

Game Type: ${gameType}
Instruction: ${specificInstruction}

Learning Objectives:
${learningObjectives.map((lo, i) => `${i + 1}. ${lo}`).join('\n')}

Generate appropriate content based on the game type. Return ONLY valid JSON without markdown formatting.

For ${gameType}, return:
${getGameConfigStructure(gameType)}

IMPORTANT: Return ONLY the JSON object, no other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Much cheaper: $0.150 per 1M input tokens, $0.600 per 1M output tokens
      messages: [
        {
          role: 'system',
          content: 'You are an expert game designer for educational content. Create engaging, pedagogically sound game configurations. Always return valid JSON without markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2500
    });

    const content = response.choices[0].message.content.trim();

    // Remove markdown code blocks if present
    let jsonContent = content;
    if (content.startsWith('```')) {
      jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    return JSON.parse(jsonContent);

  } catch (error) {
    console.error('Error generating game config:', error.message);
    throw new Error(`Failed to generate game config: ${error.message}`);
  }
};

/**
 * Generate historical journey story
 * @param {object} params - Generation parameters
 * @param {string} params.grade - Grade level
 * @param {string} params.era - Historical era
 * @param {string} params.title - Journey title
 * @param {array} params.chapters - CBSE chapters covered
 * @param {array} params.keyFigures - Historical figures
 * @returns {Promise<object>} Journey story object
 */
const generateHistoricalJourneyStory = async ({
  grade,
  era,
  title,
  chapters = [],
  keyFigures = []
}) => {
  const prompt = `Create an immersive historical journey for Grade ${grade} students about "${era}".

Title: ${title}
CBSE Chapters Covered: ${chapters.join(', ')}
Key Historical Figures: ${keyFigures.join(', ')}

Create an engaging narrative journey with:
1. Introduction that sets the scene with title, setting, narrative, and character role
2. 5-7 interactive chapters with scenes, characters, discoveries, challenges, and decisions
3. Historical facts integrated naturally into the story
4. Age-appropriate content for Grade ${grade}

Return ONLY valid JSON with this EXACT structure:
{
  "introduction": {
    "title": "${title}",
    "setting": "Brief setting description (1 sentence)",
    "narrative": "Engaging opening paragraph that sets the historical context (2-3 sentences)",
    "characterRole": "What role the student plays in this journey"
  },
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "Chapter title",
      "scene": {
        "location": "Physical location (e.g., 'The Royal Palace', 'Ancient Marketplace')",
        "timeOfDay": "Morning",
        "atmosphere": "bustling and lively"
      },
      "narrative": "Story content with historical facts (2-3 paragraphs)",
      "characters": [
        {
          "name": "Character name",
          "role": "Their role/title",
          "dialogue": "What they say to you"
        }
      ],
      "discoveries": [
        {
          "type": "artifact",
          "name": "Discovery name",
          "content": "Description of what you found",
          "historicalSignificance": "Why this discovery matters historically",
          "year": 1947
        }
      ],
      "challenges": [
        {
          "type": "timeline-order",
          "description": "Challenge description",
          "interactiveElement": {
            "events": ["Event 1", "Event 2", "Event 3"],
            "correctAnswer": 0
          },
          "reward": 10
        }
      ],
      "decisions": [
        {
          "prompt": "What should you do?",
          "options": [
            {
              "text": "Option 1 text",
              "consequence": "Result of choosing option 1",
              "pointsAwarded": 10,
              "nextChapter": 2
            },
            {
              "text": "Option 2 text",
              "consequence": "Result of choosing option 2",
              "pointsAwarded": 10,
              "nextChapter": 2
            }
          ]
        }
      ],
      "learningPoint": "Key historical insight from this chapter"
    }
  ],
  "conclusion": "Wrapping up the journey and summarizing key learnings",
  "achievements": [
    {"name": "Achievement name", "description": "What they learned"}
  ]
}

CRITICAL REQUIREMENTS:
- scene.location, scene.timeOfDay, scene.atmosphere are REQUIRED for EVERY chapter
- timeOfDay must be: Morning, Afternoon, Evening, or Night
- characters array should have 1-2 characters per chapter with name, role, dialogue
- discoveries type must be: artifact, letter, scroll, document, or photograph
- challenges.type must be: timeline-order, artifact-identify, map-navigate, or decode-message
- decisions.options MUST include nextChapter (chapter index, 0-based) or null if journey ends
- Make engaging, historically accurate, age-appropriate for Grade ${grade}
- Return ONLY the JSON object, NO markdown formatting`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Much cheaper: $0.150 per 1M input tokens, $0.600 per 1M output tokens
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational storyteller specializing in historical narratives for children. Create engaging, accurate, and pedagogically sound historical journeys. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 4000
    });

    const content = response.choices[0].message.content.trim();

    // Remove markdown code blocks if present
    let jsonContent = content;
    if (content.startsWith('```')) {
      jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    return JSON.parse(jsonContent);

  } catch (error) {
    console.error('Error generating journey story:', error.message);
    throw new Error(`Failed to generate journey story: ${error.message}`);
  }
};

/**
 * Helper to get game config structure based on game type
 */
function getGameConfigStructure(gameType) {
  const structures = {
    'math_race': `{
  "equations": [
    {"problem": "5 + 3", "answer": "8", "steps": ["Add 5 and 3"]},
    ...10-15 problems
  ]
}`,
    'pattern_finder': `{
  "patterns": [
    {"sequence": ["2", "4", "6", "8"], "nextItems": ["10", "12", "14"], "correctNext": 0},
    ...10 patterns
  ]
}`,
    'multiple_choice_race': `{
  "questions": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct",
      "points": 10
    },
    ...15-20 questions
  ]
}`,
    'matching_pairs': `{
  "pairs": [
    {"left": "Concept A", "right": "Definition A"},
    ...10-12 pairs
  ]
}`,
    'sorting_game': `{
  "categories": [
    {"name": "Category 1", "items": ["item1", "item2", "item3"]},
    {"name": "Category 2", "items": ["item4", "item5", "item6"]}
  ]
}`,
    'timeline_builder': `{
  "events": [
    {"event": "Event description", "year": 1947, "description": "Details"},
    ...10-12 events
  ]
}`
  };

  return structures[gameType] || `{ "content": "appropriate game content" }`;
}

/**
 * Retry mechanism for API calls
 */
async function retryWithDelay(fn, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1}/${retries} after error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

/**
 * Batch generation with rate limiting
 */
async function generateBatch(items, generatorFn, batchSize = 5, delayMs = 1000) {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`);

    const batchPromises = batch.map(item =>
      retryWithDelay(() => generatorFn(item))
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Delay between batches to avoid rate limits
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

module.exports = {
  generateQuizQuestions,
  generateGameConfig,
  generateHistoricalJourneyStory,
  retryWithDelay,
  generateBatch
};
