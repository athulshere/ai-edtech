/**
 * Content Validator
 *
 * Validates generated content (quizzes, games, journeys) for quality and correctness
 */

/**
 * Validate quiz questions
 * @param {array} questions - Array of question objects
 * @returns {object} Validation result { valid: boolean, errors: array, warnings: array }
 */
const validateQuizQuestions = (questions) => {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(questions)) {
    return { valid: false, errors: ['Questions must be an array'], warnings: [] };
  }

  if (questions.length === 0) {
    return { valid: false, errors: ['At least one question is required'], warnings: [] };
  }

  questions.forEach((q, index) => {
    const questionNum = index + 1;

    // Required fields
    if (!q.questionText || q.questionText.trim().length === 0) {
      errors.push(`Question ${questionNum}: questionText is required`);
    }

    if (!Array.isArray(q.options)) {
      errors.push(`Question ${questionNum}: options must be an array`);
    } else {
      // Validate options
      if (q.options.length !== 4) {
        errors.push(`Question ${questionNum}: exactly 4 options required, got ${q.options.length}`);
      }

      q.options.forEach((opt, optIndex) => {
        if (!opt || opt.trim().length === 0) {
          errors.push(`Question ${questionNum}, Option ${optIndex + 1}: empty option`);
        }
      });

      // Check for duplicate options
      const uniqueOptions = new Set(q.options.map(o => o.toLowerCase().trim()));
      if (uniqueOptions.size !== q.options.length) {
        warnings.push(`Question ${questionNum}: duplicate or similar options detected`);
      }
    }

    // Validate correctAnswer
    if (typeof q.correctAnswer !== 'number') {
      errors.push(`Question ${questionNum}: correctAnswer must be a number`);
    } else if (q.correctAnswer < 0 || q.correctAnswer > 3) {
      errors.push(`Question ${questionNum}: correctAnswer must be 0-3, got ${q.correctAnswer}`);
    }

    // Validate points
    if (q.points && (typeof q.points !== 'number' || q.points < 0)) {
      errors.push(`Question ${questionNum}: invalid points value`);
    }

    // Check explanation
    if (!q.explanation || q.explanation.trim().length === 0) {
      warnings.push(`Question ${questionNum}: missing explanation`);
    }

    // Check question length
    if (q.questionText && q.questionText.length > 500) {
      warnings.push(`Question ${questionNum}: question text is very long (${q.questionText.length} chars)`);
    }

    // Check if question ends with question mark
    if (q.questionText && !q.questionText.trim().endsWith('?')) {
      warnings.push(`Question ${questionNum}: question should end with '?'`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate complete quiz object
 * @param {object} quiz - Quiz object
 * @returns {object} Validation result
 */
const validateQuiz = (quiz) => {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!quiz.title || quiz.title.trim().length === 0) {
    errors.push('Quiz title is required');
  }

  if (!quiz.grade) {
    errors.push('Grade is required');
  }

  if (!quiz.subject) {
    errors.push('Subject is required');
  }

  if (!quiz.difficulty || !['easy', 'medium', 'hard'].includes(quiz.difficulty)) {
    errors.push('Valid difficulty level is required (easy/medium/hard)');
  }

  // Validate questions
  if (!quiz.questions || !Array.isArray(quiz.questions)) {
    errors.push('Questions array is required');
  } else {
    const questionValidation = validateQuizQuestions(quiz.questions);
    errors.push(...questionValidation.errors);
    warnings.push(...questionValidation.warnings);

    // Check question count
    if (quiz.questions.length < 5) {
      warnings.push(`Quiz has only ${quiz.questions.length} questions (minimum 5 recommended)`);
    }
    if (quiz.questions.length > 50) {
      warnings.push(`Quiz has ${quiz.questions.length} questions (maximum 50 recommended)`);
    }
  }

  // Validate syllabus mapping if present
  if (quiz.syllabusMapping) {
    if (!quiz.syllabusMapping.cbseGrade) {
      warnings.push('Syllabus mapping missing cbseGrade');
    }
    if (!quiz.syllabusMapping.cbseSubject) {
      warnings.push('Syllabus mapping missing cbseSubject');
    }
    if (!quiz.syllabusMapping.cbseTopic) {
      warnings.push('Syllabus mapping missing cbseTopic');
    }
  } else {
    warnings.push('Quiz missing syllabusMapping');
  }

  // Validate total points
  if (quiz.questions && Array.isArray(quiz.questions)) {
    const calculatedTotal = quiz.questions.reduce((sum, q) => sum + (q.points || 10), 0);
    if (quiz.totalPoints && quiz.totalPoints !== calculatedTotal) {
      warnings.push(`totalPoints (${quiz.totalPoints}) doesn't match calculated sum (${calculatedTotal})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate game configuration
 * @param {object} game - Game object
 * @returns {object} Validation result
 */
const validateGame = (game) => {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!game.title || game.title.trim().length === 0) {
    errors.push('Game title is required');
  }

  if (!game.grade) {
    errors.push('Grade is required');
  }

  if (!game.subject) {
    errors.push('Subject is required');
  }

  if (!game.gameType) {
    errors.push('Game type is required');
  }

  if (!game.difficulty || !['easy', 'medium', 'hard'].includes(game.difficulty)) {
    errors.push('Valid difficulty level is required (easy/medium/hard)');
  }

  // Validate game config
  if (!game.gameConfig || typeof game.gameConfig !== 'object') {
    errors.push('gameConfig object is required');
  } else {
    // Check if gameConfig has content
    const hasContent = Object.keys(game.gameConfig).length > 0;
    if (!hasContent) {
      errors.push('gameConfig is empty');
    }

    // Validate based on game type
    const configErrors = validateGameConfig(game.gameType, game.gameConfig);
    errors.push(...configErrors);
  }

  // Validate syllabus mapping
  if (game.syllabusMapping) {
    if (!game.syllabusMapping.cbseGrade) {
      warnings.push('Syllabus mapping missing cbseGrade');
    }
    if (!game.syllabusMapping.cbseSubject) {
      warnings.push('Syllabus mapping missing cbseSubject');
    }
    if (!game.syllabusMapping.cbseTopics || game.syllabusMapping.cbseTopics.length === 0) {
      warnings.push('Syllabus mapping missing cbseTopics');
    }
  } else {
    warnings.push('Game missing syllabusMapping');
  }

  // Validate scoring
  if (!game.maxScore || typeof game.maxScore !== 'number' || game.maxScore <= 0) {
    warnings.push('Invalid maxScore');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate game config based on game type
 */
const validateGameConfig = (gameType, config) => {
  const errors = [];

  switch (gameType) {
    case 'multiple_choice_race':
      if (!config.questions || !Array.isArray(config.questions)) {
        errors.push('multiple_choice_race requires questions array');
      } else if (config.questions.length < 5) {
        errors.push('multiple_choice_race needs at least 5 questions');
      }
      break;

    case 'matching_pairs':
      if (!config.pairs || !Array.isArray(config.pairs)) {
        errors.push('matching_pairs requires pairs array');
      } else if (config.pairs.length < 5) {
        errors.push('matching_pairs needs at least 5 pairs');
      }
      break;

    case 'math_race':
    case 'equation_solver':
      if (!config.equations || !Array.isArray(config.equations)) {
        errors.push(`${gameType} requires equations array`);
      } else if (config.equations.length < 5) {
        errors.push(`${gameType} needs at least 5 equations`);
      }
      break;

    case 'pattern_finder':
      if (!config.patterns || !Array.isArray(config.patterns)) {
        errors.push('pattern_finder requires patterns array');
      } else if (config.patterns.length < 5) {
        errors.push('pattern_finder needs at least 5 patterns');
      }
      break;

    case 'sorting_game':
      if (!config.categories || !Array.isArray(config.categories)) {
        errors.push('sorting_game requires categories array');
      } else if (config.categories.length < 2) {
        errors.push('sorting_game needs at least 2 categories');
      }
      break;

    case 'timeline_builder':
      if (!config.events || !Array.isArray(config.events)) {
        errors.push('timeline_builder requires events array');
      } else if (config.events.length < 5) {
        errors.push('timeline_builder needs at least 5 events');
      }
      break;

    default:
      // Generic validation for other types
      if (Object.keys(config).length === 0) {
        errors.push(`${gameType} gameConfig is empty`);
      }
  }

  return errors;
};

/**
 * Validate historical journey
 * @param {object} journey - Journey object
 * @returns {object} Validation result
 */
const validateHistoricalJourney = (journey) => {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!journey.title || journey.title.trim().length === 0) {
    errors.push('Journey title is required');
  }

  if (!journey.era) {
    errors.push('Era is required');
  }

  if (!journey.grade) {
    errors.push('Grade is required');
  }

  // Validate story structure
  if (!journey.story || typeof journey.story !== 'object') {
    errors.push('Story object is required');
  } else {
    // Check for introduction
    if (!journey.story.introduction) {
      warnings.push('Story missing introduction');
    }

    // Check for chapters
    if (!journey.story.chapters || !Array.isArray(journey.story.chapters)) {
      errors.push('Story must have chapters array');
    } else if (journey.story.chapters.length < 3) {
      warnings.push(`Story has only ${journey.story.chapters.length} chapters (minimum 3 recommended)`);
    }

    // Check for conclusion
    if (!journey.story.conclusion) {
      warnings.push('Story missing conclusion');
    }

    // Validate each chapter
    if (journey.story.chapters) {
      journey.story.chapters.forEach((chapter, index) => {
        const chNum = index + 1;
        if (!chapter.title) {
          warnings.push(`Chapter ${chNum}: missing title`);
        }
        if (!chapter.narrative) {
          errors.push(`Chapter ${chNum}: missing narrative content`);
        }
        if (!chapter.learningPoint) {
          warnings.push(`Chapter ${chNum}: missing learning point`);
        }
      });
    }
  }

  // Validate syllabus mapping
  if (journey.syllabusMapping) {
    if (!journey.syllabusMapping.cbseGrade) {
      warnings.push('Syllabus mapping missing cbseGrade');
    }
    if (!journey.syllabusMapping.historicalPeriod) {
      warnings.push('Syllabus mapping missing historicalPeriod');
    }
    if (!journey.syllabusMapping.cbseChapters || journey.syllabusMapping.cbseChapters.length === 0) {
      warnings.push('Syllabus mapping missing cbseChapters');
    }
  } else {
    warnings.push('Journey missing syllabusMapping');
  }

  // Validate time period
  if (journey.timePeriod) {
    if (journey.timePeriod.start && journey.timePeriod.end) {
      if (journey.timePeriod.start > journey.timePeriod.end) {
        errors.push('Invalid time period: start year is after end year');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate batch of content items
 * @param {array} items - Array of content items
 * @param {string} type - Content type (quiz/game/journey)
 * @returns {object} Batch validation result
 */
const validateBatch = (items, type) => {
  const results = {
    totalCount: items.length,
    validCount: 0,
    invalidCount: 0,
    warningCount: 0,
    items: []
  };

  const validators = {
    quiz: validateQuiz,
    game: validateGame,
    journey: validateHistoricalJourney
  };

  const validator = validators[type];
  if (!validator) {
    return { error: `Unknown content type: ${type}` };
  }

  items.forEach((item, index) => {
    const validation = validator(item);

    results.items.push({
      index,
      title: item.title || `Item ${index + 1}`,
      valid: validation.valid,
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length,
      errors: validation.errors,
      warnings: validation.warnings
    });

    if (validation.valid) {
      results.validCount++;
    } else {
      results.invalidCount++;
    }

    if (validation.warnings.length > 0) {
      results.warningCount++;
    }
  });

  return results;
};

/**
 * Generate validation report
 * @param {object} batchValidation - Result from validateBatch
 * @returns {string} Formatted report
 */
const generateValidationReport = (batchValidation) => {
  if (batchValidation.error) {
    return `ERROR: ${batchValidation.error}`;
  }

  let report = '\n=== VALIDATION REPORT ===\n\n';
  report += `Total Items: ${batchValidation.totalCount}\n`;
  report += `Valid: ${batchValidation.validCount} ✅\n`;
  report += `Invalid: ${batchValidation.invalidCount} ❌\n`;
  report += `With Warnings: ${batchValidation.warningCount} ⚠️\n`;
  report += '\n';

  // Show invalid items
  const invalidItems = batchValidation.items.filter(item => !item.valid);
  if (invalidItems.length > 0) {
    report += '=== INVALID ITEMS ===\n';
    invalidItems.forEach(item => {
      report += `\n${item.title} (Index: ${item.index})\n`;
      item.errors.forEach(err => {
        report += `  ❌ ${err}\n`;
      });
    });
    report += '\n';
  }

  // Show items with warnings
  const itemsWithWarnings = batchValidation.items.filter(item => item.warningCount > 0);
  if (itemsWithWarnings.length > 0) {
    report += '=== ITEMS WITH WARNINGS ===\n';
    itemsWithWarnings.forEach(item => {
      report += `\n${item.title} (Index: ${item.index})\n`;
      item.warnings.forEach(warn => {
        report += `  ⚠️  ${warn}\n`;
      });
    });
  }

  return report;
};

module.exports = {
  validateQuizQuestions,
  validateQuiz,
  validateGame,
  validateHistoricalJourney,
  validateBatch,
  generateValidationReport
};
