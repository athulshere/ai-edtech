require('dotenv').config();
const mongoose = require('mongoose');
const HistoricalJourney = require('../models/HistoricalJourney');
const journeys = require('./historicalJourneys');

const seedHistoricalJourneys = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding historical journeys');

    // Clear existing journeys
    await HistoricalJourney.deleteMany({});
    console.log('Cleared existing historical journeys');

    // Insert new journeys
    const inserted = await HistoricalJourney.insertMany(journeys);
    console.log(`✅ Successfully seeded ${inserted.length} historical journey(s)`);

    inserted.forEach(journey => {
      console.log(`  - ${journey.title} (Grade ${journey.grade})`);
      console.log(`    Chapters: ${journey.story.chapters.length}`);
      console.log(`    Era: ${journey.era}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding historical journeys:', error);
    process.exit(1);
  }
};

seedHistoricalJourneys();
