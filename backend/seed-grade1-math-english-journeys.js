/**
 * Seed Grade 1 Mathematics and English Journeys
 *
 * This script adds the comprehensive Math and English journeys to the database
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const HistoricalJourney = require('./src/models/HistoricalJourney');

const { grade1Journeys } = require('./src/seeds/grade1JourneysComplete');

async function seedGrade1Journeys() {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('🌟 SEEDING GRADE 1 MATH & ENGLISH JOURNEYS');
    console.log('='.repeat(70));

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check existing journeys
    const existingJourneys = await HistoricalJourney.find({ grade: '1' }).select('title');
    console.log(`📊 Existing Grade 1 Journeys: ${existingJourneys.length}`);
    existingJourneys.forEach(j => console.log(`   - ${j.title}`));

    console.log('\n📝 New Journeys to Add:');
    grade1Journeys.forEach((j, i) => {
      console.log(`   ${i + 1}. ${j.title} (${j.subject})`);
    });

    // Add each journey
    let addedCount = 0;
    let skippedCount = 0;

    for (const journeyData of grade1Journeys) {
      try {
        // Check if journey already exists
        const exists = await HistoricalJourney.findOne({
          title: journeyData.title,
          grade: journeyData.grade
        });

        if (exists) {
          console.log(`\n⚠️  Skipping "${journeyData.title}" - already exists`);
          skippedCount++;
          continue;
        }

        // Create new journey
        const journey = await HistoricalJourney.create(journeyData);
        console.log(`\n✅ Added: ${journey.title}`);
        console.log(`   Subject: ${journey.subject}`);
        console.log(`   Chapters: ${journey.story.chapters.length}`);
        console.log(`   Duration: ${journey.estimatedDuration} minutes`);
        addedCount++;

      } catch (error) {
        console.error(`\n❌ Error adding "${journeyData.title}":`, error.message);
      }
    }

    // Final summary
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 SEEDING COMPLETE');
    console.log('='.repeat(70));
    console.log(`✅ Journeys Added: ${addedCount}`);
    console.log(`⚠️  Journeys Skipped: ${skippedCount}`);

    // Show all Grade 1 journeys now
    const allGrade1 = await HistoricalJourney.find({ grade: '1' }).select('title subject');
    console.log(`\n📚 Total Grade 1 Journeys: ${allGrade1.length}`);

    const bySubject = {};
    allGrade1.forEach(j => {
      bySubject[j.subject] = (bySubject[j.subject] || 0) + 1;
    });

    console.log('\nBreakdown by Subject:');
    Object.entries(bySubject).forEach(([subject, count]) => {
      console.log(`   ${subject}: ${count} journeys`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('\n❌ Fatal Error:', error);
    process.exit(1);
  }
}

// Run the seeding
seedGrade1Journeys();
