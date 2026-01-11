/**
 * Generate Historical Journeys for Grade 1
 *
 * Generates age-appropriate historical/educational journeys for Grade 1
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const HistoricalJourney = require('./src/models/HistoricalJourney');
const { generateHistoricalJourney } = require('./src/utils/contentGenerator');
const { validateHistoricalJourney, generateValidationReport } = require('./src/utils/contentValidator');

// Grade 1 appropriate journeys (simple, educational, age-appropriate)
const grade1JourneySpecs = [
  {
    title: 'Journey Through the Four Seasons',
    era: 'Nature and Environment',
    timePeriod: { start: 2020, end: 2025 },
    chapters: ['Spring Adventures', 'Summer Fun', 'Autumn Colors', 'Winter Wonders'],
    keyFigures: [],
    difficulty: 'easy',
    estimatedDuration: 15
  },
  {
    title: 'My School Day Adventure',
    era: 'Everyday Life',
    timePeriod: { start: 2020, end: 2025 },
    chapters: ['Morning Routine', 'Classroom Activities', 'Playground Time', 'Learning Together'],
    keyFigures: [],
    difficulty: 'easy',
    estimatedDuration: 15
  },
  {
    title: 'Journey of Healthy Foods',
    era: 'Health and Nutrition',
    timePeriod: { start: 2020, end: 2025 },
    chapters: ['Fruits Garden', 'Vegetable Farm', 'Dairy Products', 'Balanced Meal'],
    keyFigures: [],
    difficulty: 'easy',
    estimatedDuration: 15
  },
  {
    title: 'Animals Around Us',
    era: 'Nature and Wildlife',
    timePeriod: { start: 2020, end: 2025 },
    chapters: ['Farm Animals', 'Pet Animals', 'Wild Animals', 'Birds'],
    keyFigures: [],
    difficulty: 'easy',
    estimatedDuration: 15
  },
  {
    title: 'My Family Tree',
    era: 'Family and Society',
    timePeriod: { start: 2020, end: 2025 },
    chapters: ['Parents', 'Grandparents', 'Siblings', 'Family Love'],
    keyFigures: [],
    difficulty: 'easy',
    estimatedDuration: 15
  }
];

const generateGrade1Journeys = async () => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('🗺️  GRADE 1 HISTORICAL JOURNEY GENERATION');
    console.log('='.repeat(70));
    console.log(`\nGenerating ${grade1JourneySpecs.length} educational journeys for Grade 1`);
    console.log('Topics: Seasons, School Life, Healthy Foods, Animals, Family');
    console.log('Using GPT-4o-mini for cost-effective generation (~$0.02 total)');
    console.log('\n⏱️  Estimated time: 5-10 minutes\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const allGeneratedJourneys = [];
    const allErrors = [];

    for (let i = 0; i < grade1JourneySpecs.length; i++) {
      const spec = grade1JourneySpecs[i];

      console.log('='.repeat(70));
      console.log(`🗺️  Generating Journey ${i + 1}/${grade1JourneySpecs.length}: ${spec.title}`);
      console.log('='.repeat(70));

      try {
        const startTime = Date.now();

        const journey = await generateHistoricalJourney({
          grade: '1',
          era: spec.era,
          title: spec.title,
          chapters: spec.chapters,
          keyFigures: spec.keyFigures,
          timePeriod: spec.timePeriod,
          difficulty: spec.difficulty,
          estimatedDuration: spec.estimatedDuration
        });

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        console.log(`\n✅ Generated journey in ${duration} seconds`);

        // Validate
        console.log('\n🔍 Validating journey...');
        const validation = validateHistoricalJourney(journey);

        if (validation.valid) {
          console.log('   ✅ Valid');
        } else {
          console.log('   ❌ Invalid');
          console.log('   Errors:', validation.errors);
        }

        if (validation.warnings.length > 0) {
          console.log('   ⚠️  Warnings:', validation.warnings);
        }

        allGeneratedJourneys.push(journey);

        // Save to database
        if (validation.valid) {
          console.log('\n💾 Saving to database...');
          try {
            await HistoricalJourney.create(journey);
            console.log(`   ✅ Saved: ${journey.title}`);
          } catch (saveError) {
            console.log(`   ❌ Failed to save: ${saveError.message}`);
          }
        }

      } catch (error) {
        console.log(`\n❌ Error generating journey: ${error.message}`);
        allErrors.push({ title: spec.title, error: error.message });
      }

      // Delay between journeys
      if (i < grade1JourneySpecs.length - 1) {
        console.log('\n⏳ Waiting 3 seconds before next journey...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Final summary
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 GENERATION COMPLETE');
    console.log('='.repeat(70));
    console.log(`Total Journeys Generated: ${allGeneratedJourneys.length}`);
    if (allErrors.length > 0) {
      console.log(`Errors: ${allErrors.length}`);
    }
    console.log('');

    if (allGeneratedJourneys.length > 0) {
      console.log('🗺️  Generated Journeys:');
      allGeneratedJourneys.forEach((j, idx) => {
        console.log(`   ${idx + 1}. ${j.title} (${j.story.chapters?.length || 0} chapters)`);
      });
      console.log('');

      console.log('✅ SAVED TO DATABASE');
      console.log('   Journeys are now available in the system!');
      console.log('');
    }

    if (allErrors.length > 0) {
      console.log('❌ ERRORS:');
      allErrors.forEach((err, index) => {
        console.log(`${index + 1}. ${err.title}: ${err.error}`);
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
generateGrade1Journeys();
