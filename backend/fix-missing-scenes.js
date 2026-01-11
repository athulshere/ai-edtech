/**
 * Fix missing scene data in chapters 3-7
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const HistoricalJourney = require('./src/models/HistoricalJourney');

async function fixScenes() {
  try {
    console.log('Fixing missing scene data...\n');

    await mongoose.connect(process.env.MONGODB_URI);

    const journey = await HistoricalJourney.findOne({
      title: 'The Magical Shape Kingdom',
      grade: '1'
    });

    if (!journey) {
      console.log('Journey not found!');
      process.exit(1);
    }

    // Add scene data to chapters 3-7
    const chapters = journey.story.chapters;

    // Chapter 3 - Triangle Peak
    if (chapters[2]) {
      chapters[2].scene = {
        location: "Triangle Peak - The highest mountain in Shape Kingdom",
        timeOfDay: "Afternoon",
        atmosphere: "Mountain air with triangular flags waving in the wind",
        imageUrl: "/images/journeys/grade1/triangle-peak.jpg",
        backgroundMusic: "/audio/journeys/mountain-theme.mp3"
      };
    }

    // Chapter 4 - Rectangle Road
    if (chapters[3]) {
      chapters[3].scene = {
        location: "Rectangle Road - A long, straight path through the kingdom",
        timeOfDay: "Late Afternoon",
        atmosphere: "Busy road with rectangular buildings and doorways",
        imageUrl: "/images/journeys/grade1/rectangle-road.jpg",
        backgroundMusic: "/audio/journeys/travel-theme.mp3"
      };
    }

    // Chapter 5 - Pattern Palace
    if (chapters[4]) {
      chapters[4].scene = {
        location: "Pattern Palace - A magnificent palace with repeating decorations",
        timeOfDay: "Early Evening",
        atmosphere: "Colorful palace with patterns everywhere you look",
        imageUrl: "/images/journeys/grade1/pattern-palace.jpg",
        backgroundMusic: "/audio/journeys/palace-theme.mp3"
      };
    }

    // Chapter 6 - Shape Building Challenge
    if (chapters[5]) {
      chapters[5].scene = {
        location: "The Royal Workshop - A creative space filled with shapes",
        timeOfDay: "Evening",
        atmosphere: "Creative workshop with shapes, tools, and building materials",
        imageUrl: "/images/journeys/grade1/workshop.jpg",
        backgroundMusic: "/audio/journeys/creative-theme.mp3"
      };
    }

    // Chapter 7 - Grand Championship
    if (chapters[6]) {
      chapters[6].scene = {
        location: "The Grand Championship Arena",
        timeOfDay: "Sunset",
        atmosphere: "Excited crowd cheering as you take the final test",
        imageUrl: "/images/journeys/grade1/championship-arena.jpg",
        backgroundMusic: "/audio/journeys/victory-theme.mp3"
      };
    }

    // Save the updated journey
    journey.story.chapters = chapters;
    await journey.save();

    console.log('✅ Successfully added scene data to all chapters!\n');

    // Verify
    console.log('Verification:');
    journey.story.chapters.forEach((ch, i) => {
      const hasScene = !!ch.scene && !!ch.scene.location;
      console.log(`  Chapter ${ch.chapterNumber}: ${hasScene ? '✅' : '❌'} ${ch.title}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixScenes();
