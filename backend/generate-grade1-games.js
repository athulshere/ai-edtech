/**
 * Generate Games for Grade 1
 *
 * Generates educational games for Grade 1 subjects
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Game = require('./src/models/Game');
const { generateGamesForSubject } = require('./src/utils/contentGenerator');
const { validateBatch, generateValidationReport } = require('./src/utils/contentValidator');

const generateGrade1Games = async () => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('🎮 GRADE 1 GAME GENERATION');
    console.log('='.repeat(70));
    console.log('\nGenerating 20 games for each Grade 1 subject');
    console.log('Subjects: Mathematics, English, EVS');
    console.log('Using GPT-4o-mini for cost-effective generation (~$0.10 total)');
    console.log('\n⏱️  Estimated time: 15-20 minutes\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const subjects = ['Mathematics', 'English', 'EVS'];
    const allGeneratedGames = [];
    const allErrors = [];

    for (let subIndex = 0; subIndex < subjects.length; subIndex++) {
      const subject = subjects[subIndex];

      console.log('='.repeat(70));
      console.log(`🎮 Generating Games for Grade 1 - ${subject}`);
      console.log(`   (Subject ${subIndex + 1} of ${subjects.length})`);
      console.log('='.repeat(70));

      try {
        const startTime = Date.now();

        const games = await generateGamesForSubject({
          grade: '1',
          subject: subject,
          minGames: 20
        });

        const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

        console.log(`\n✅ Generated ${games.length} games in ${duration} minutes`);

        // Validate batch
        console.log('\n🔍 Validating generated games...');
        const batchValidation = validateBatch(games, 'game');

        console.log(`   Valid: ${batchValidation.validCount}/${batchValidation.totalCount} ✅`);
        console.log(`   Invalid: ${batchValidation.invalidCount} ❌`);
        console.log(`   With Warnings: ${batchValidation.warningCount} ⚠️`);

        // Show validation details if there are issues
        if (batchValidation.invalidCount > 0 || batchValidation.warningCount > 0) {
          console.log('\n' + generateValidationReport(batchValidation));
        }

        allGeneratedGames.push(...games);

        // Save to database
        console.log('\n💾 Saving to database...');
        let savedCount = 0;
        let failedCount = 0;

        for (const game of games) {
          try {
            await Game.create(game);
            savedCount++;
          } catch (saveError) {
            console.log(`   ❌ Failed to save ${game.title}: ${saveError.message}`);
            failedCount++;
          }
        }

        console.log(`   ✅ Saved: ${savedCount}`);
        if (failedCount > 0) {
          console.log(`   ❌ Failed: ${failedCount}`);
        }

      } catch (error) {
        console.log(`\n❌ Error generating games for ${subject}: ${error.message}`);
        allErrors.push({ grade: '1', subject, error: error.message });
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
    console.log(`Total Games Generated: ${allGeneratedGames.length}`);
    console.log(`Subjects Completed: ${subjects.length}`);
    if (allErrors.length > 0) {
      console.log(`Errors: ${allErrors.length}`);
    }
    console.log('');

    if (allGeneratedGames.length > 0) {
      // Group by game type
      const byGameType = {};
      allGeneratedGames.forEach(g => {
        byGameType[g.gameType] = (byGameType[g.gameType] || 0) + 1;
      });

      console.log('🎮 By Game Type:');
      Object.entries(byGameType).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
      console.log('');

      // Group by subject
      const bySubject = {};
      allGeneratedGames.forEach(g => {
        bySubject[g.subject] = (bySubject[g.subject] || 0) + 1;
      });

      console.log('📚 By Subject:');
      Object.entries(bySubject).forEach(([subject, count]) => {
        console.log(`   ${subject}: ${count}`);
      });
      console.log('');

      console.log('✅ SAVED TO DATABASE');
      console.log('   Games are now available in the system!');
      console.log('');
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

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Start
generateGrade1Games();
