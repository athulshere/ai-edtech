/**
 * Full-Scale Quiz Generation Script
 *
 * Generates comprehensive quiz content for entire grade/subject combinations
 * Use after validating sample quiz quality
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./src/models/Quiz');
const { generateQuizzesForSubject } = require('./src/utils/contentGenerator');
const { validateBatch, generateValidationReport } = require('./src/utils/contentValidator');
const { getSubjects } = require('./src/utils/cbseSyllabusData');

// Parse command line arguments
const args = process.argv.slice(2);
const gradeArg = args.find(arg => arg.startsWith('--grade='));
const subjectArg = args.find(arg => arg.startsWith('--subject='));
const countArg = args.find(arg => arg.startsWith('--count='));
const dryRunFlag = args.includes('--dry-run');
const saveFlag = args.includes('--save');

const targetGrade = gradeArg ? gradeArg.split('=')[1] : null;
const targetSubject = subjectArg ? subjectArg.split('=')[1] : null;
const minQuizzes = countArg ? parseInt(countArg.split('=')[1]) : 20;

const generateFullQuizzes = async () => {
  try {
    console.log('\n🚀 Full-Scale Quiz Generation');
    console.log('='.repeat(70));

    // Validate arguments
    if (!targetGrade) {
      console.log('❌ Error: --grade parameter is required');
      console.log('\nUsage:');
      console.log('  node backend/generate-quizzes-full.js --grade=1 --subject=Mathematics');
      console.log('  node backend/generate-quizzes-full.js --grade=6 --subject=Science --count=25');
      console.log('  node backend/generate-quizzes-full.js --grade=1 --subject=Mathematics --dry-run');
      console.log('\nOptions:');
      console.log('  --grade=N       Grade level (1-12)');
      console.log('  --subject=NAME  Subject name (Mathematics, Science, English, etc.)');
      console.log('  --count=N       Number of quizzes to generate (default: 20)');
      console.log('  --dry-run       Generate but don\'t save to database');
      console.log('  --save          Save to database (required if not dry-run)');
      process.exit(1);
    }

    // Connect to MongoDB if not dry-run
    if (!dryRunFlag) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edtech-assessment');
      console.log('✅ Connected to MongoDB');
    }

    // Get available subjects for grade if subject not specified
    let subjects = [];
    if (targetSubject) {
      subjects = [targetSubject];
    } else {
      subjects = getSubjects(targetGrade);
      console.log(`\n📚 Available subjects for Grade ${targetGrade}:`, subjects.join(', '));
      console.log('⚠️  No subject specified, will generate for all subjects');
      console.log('   This may take a long time and use significant API credits!');
      console.log('   Press Ctrl+C to cancel, or wait 10 seconds to continue...\n');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    console.log('\n📋 Generation Plan:');
    console.log('─'.repeat(70));
    console.log(`Grade: ${targetGrade}`);
    console.log(`Subjects: ${subjects.join(', ')}`);
    console.log(`Quizzes per subject: ${minQuizzes}`);
    console.log(`Total quizzes: ${subjects.length * minQuizzes}`);
    console.log(`Mode: ${dryRunFlag ? 'DRY RUN (no save)' : 'PRODUCTION (will save)'}`);
    console.log('─'.repeat(70));

    // Estimate time and cost
    const totalQuizzes = subjects.length * minQuizzes;
    const estimatedMinutes = Math.ceil(totalQuizzes * 0.5); // ~30 seconds per quiz
    const estimatedCost = (totalQuizzes * 0.05).toFixed(2); // ~$0.05 per quiz

    console.log('\n⏱️  Estimated time: ~' + estimatedMinutes + ' minutes');
    console.log('💰 Estimated cost: ~$' + estimatedCost);
    console.log('');

    const allGeneratedQuizzes = [];
    const allErrors = [];

    // Generate for each subject
    for (let subIndex = 0; subIndex < subjects.length; subIndex++) {
      const subject = subjects[subIndex];

      console.log('\n' + '='.repeat(70));
      console.log(`📚 Generating for Grade ${targetGrade} - ${subject}`);
      console.log(`   (Subject ${subIndex + 1} of ${subjects.length})`);
      console.log('='.repeat(70));

      try {
        const startTime = Date.now();

        const quizzes = await generateQuizzesForSubject({
          grade: targetGrade,
          subject: subject,
          minQuizzes: minQuizzes
        });

        const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

        console.log(`\n✅ Generated ${quizzes.length} quizzes in ${duration} minutes`);

        // Validate batch
        console.log('\n🔍 Validating generated quizzes...');
        const batchValidation = validateBatch(quizzes, 'quiz');

        console.log(`   Valid: ${batchValidation.validCount}/${batchValidation.totalCount} ✅`);
        console.log(`   Invalid: ${batchValidation.invalidCount} ❌`);
        console.log(`   With Warnings: ${batchValidation.warningCount} ⚠️`);

        // Show validation details if there are issues
        if (batchValidation.invalidCount > 0 || batchValidation.warningCount > 0) {
          console.log('\n' + generateValidationReport(batchValidation));
        }

        allGeneratedQuizzes.push(...quizzes);

        // Save to database if not dry-run
        if (!dryRunFlag && saveFlag) {
          console.log('\n💾 Saving to database...');
          let savedCount = 0;
          let failedCount = 0;

          for (const quiz of quizzes) {
            try {
              await Quiz.create(quiz);
              savedCount++;
            } catch (saveError) {
              console.log(`   ❌ Failed to save ${quiz.title}: ${saveError.message}`);
              failedCount++;
            }
          }

          console.log(`   ✅ Saved: ${savedCount}`);
          if (failedCount > 0) {
            console.log(`   ❌ Failed: ${failedCount}`);
          }
        }

      } catch (error) {
        console.log(`\n❌ Error generating quizzes for ${subject}: ${error.message}`);
        allErrors.push({ grade: targetGrade, subject, error: error.message });
      }

      // Delay between subjects
      if (subIndex < subjects.length - 1) {
        console.log('\n⏳ Waiting 5 seconds before next subject...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Final summary
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 GENERATION COMPLETE');
    console.log('='.repeat(70));
    console.log(`Total Quizzes Generated: ${allGeneratedQuizzes.length}`);
    console.log(`Subjects Completed: ${subjects.length}`);
    if (allErrors.length > 0) {
      console.log(`Errors: ${allErrors.length}`);
    }
    console.log('');

    if (allGeneratedQuizzes.length > 0) {
      // Group by difficulty
      const byDifficulty = {
        easy: allGeneratedQuizzes.filter(q => q.difficulty === 'easy').length,
        medium: allGeneratedQuizzes.filter(q => q.difficulty === 'medium').length,
        hard: allGeneratedQuizzes.filter(q => q.difficulty === 'hard').length
      };

      console.log('📈 By Difficulty:');
      console.log(`   Easy: ${byDifficulty.easy}`);
      console.log(`   Medium: ${byDifficulty.medium}`);
      console.log(`   Hard: ${byDifficulty.hard}`);
      console.log('');

      // Group by subject
      const bySubject = {};
      allGeneratedQuizzes.forEach(q => {
        bySubject[q.subject] = (bySubject[q.subject] || 0) + 1;
      });

      console.log('📚 By Subject:');
      Object.entries(bySubject).forEach(([subject, count]) => {
        console.log(`   ${subject}: ${count}`);
      });
      console.log('');

      if (dryRunFlag) {
        console.log('🔍 DRY RUN COMPLETE');
        console.log('   Quizzes were generated but NOT saved to database.');
        console.log('   To save, run again with --save flag:');
        console.log(`   node backend/generate-quizzes-full.js --grade=${targetGrade} --subject=${targetSubject || subjects[0]} --save`);
        console.log('');
      } else if (saveFlag) {
        console.log('✅ SAVED TO DATABASE');
        console.log('   Quizzes are now available in the system!');
        console.log('');
      } else {
        console.log('⚠️  NOT SAVED TO DATABASE');
        console.log('   Add --save flag to save to database.');
        console.log('');
      }
    }

    if (allErrors.length > 0) {
      console.log('❌ ERRORS:');
      allErrors.forEach((err, index) => {
        console.log(`${index + 1}. Grade ${err.grade} ${err.subject}: ${err.error}`);
      });
      console.log('');
    }

    console.log('='.repeat(70));
    console.log('✨ Process complete!');
    console.log('='.repeat(70));
    console.log('');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Show header
console.log('\n' + '='.repeat(70));
console.log('🎓 CBSE Quiz Generator - Full Scale Mode');
console.log('='.repeat(70));
console.log('');

// Start
generateFullQuizzes();
