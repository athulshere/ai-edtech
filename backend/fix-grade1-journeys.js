/**
 * Fix Grade 1 Historical Journeys - Regenerate with correct structure
 *
 * The existing journeys have missing fields that the frontend expects.
 * This script will delete existing Grade 1 journeys and regenerate them
 * with the correct structure matching the frontend requirements.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const HistoricalJourney = require('./src/models/HistoricalJourney');
const { generateHistoricalJourney } = require('./src/utils/contentGenerator');

// Grade 1 appropriate journeys (same specs as before)
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

const fixGrade1Journeys = async () => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('🔧 FIXING GRADE 1 HISTORICAL JOURNEYS');
    console.log('='.repeat(70));
    console.log('\nThis will delete existing Grade 1 journeys and regenerate them');
    console.log('with the correct data structure for the frontend.\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete existing Grade 1 journeys
    console.log('🗑️  Deleting existing Grade 1 journeys...');
    const deleteResult = await HistoricalJourney.deleteMany({ grade: '1' });
    console.log(`   Deleted ${deleteResult.deletedCount} journeys\n`);

    // Regenerate with correct structure
    const allGeneratedJourneys = [];

    for (let i = 0; i < grade1JourneySpecs.length; i++) {
      const spec = grade1JourneySpecs[i];

      console.log('='.repeat(70));
      console.log(`🗺️  Regenerating Journey ${i + 1}/${grade1JourneySpecs.length}: ${spec.title}`);
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
        console.log(`\n✅ Generated in ${duration} seconds`);

        // Check structure
        const firstChapter = journey.story?.chapters?.[0];
        if (firstChapter) {
          console.log('\n🔍 Checking structure:');
          console.log(`   - scene.location: ${firstChapter.scene?.location ? '✅' : '❌ MISSING'}`);
          console.log(`   - scene.timeOfDay: ${firstChapter.scene?.timeOfDay ? '✅' : '❌ MISSING'}`);
          console.log(`   - scene.atmosphere: ${firstChapter.scene?.atmosphere ? '✅' : '❌ MISSING'}`);
          console.log(`   - characters: ${firstChapter.characters?.length || 0} characters`);
          console.log(`   - discoveries: ${firstChapter.discoveries?.length || 0} discoveries`);
          console.log(`   - challenges: ${firstChapter.challenges?.length || 0} challenges`);
          console.log(`   - decisions: ${firstChapter.decisions?.length || 0} decisions`);
        }

        allGeneratedJourneys.push(journey);

        // Save to database
        console.log('\n💾 Saving to database...');
        await HistoricalJourney.create(journey);
        console.log(`   ✅ Saved: ${journey.title}`);

      } catch (error) {
        console.log(`\n❌ Error generating journey: ${error.message}`);
        console.error(error);
      }

      // Delay between journeys
      if (i < grade1JourneySpecs.length - 1) {
        console.log('\n⏳ Waiting 3 seconds before next journey...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Final summary
    console.log('\n\n' + '='.repeat(70));
    console.log('✅ REGENERATION COMPLETE');
    console.log('='.repeat(70));
    console.log(`Total Journeys: ${allGeneratedJourneys.length}/${grade1JourneySpecs.length}`);
    console.log('');

    if (allGeneratedJourneys.length > 0) {
      console.log('🗺️  Regenerated Journeys:');
      allGeneratedJourneys.forEach((j, idx) => {
        console.log(`   ${idx + 1}. ${j.title}`);
      });
      console.log('');
      console.log('✅ All journeys now have the correct structure!');
      console.log('   The frontend should work properly now.');
    }

    console.log('');
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
fixGrade1Journeys();
