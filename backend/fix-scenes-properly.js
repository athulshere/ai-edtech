/**
 * Properly fix missing scene data using markModified
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const HistoricalJourney = require('./src/models/HistoricalJourney');

async function fixScenesProperty() {
  try {
    console.log('🔧 Fixing scene data properly...\n');

    await mongoose.connect(process.env.MONGODB_URI);

    const journey = await HistoricalJourney.findOne({
      title: 'The Magical Shape Kingdom',
      grade: '1'
    });

    if (!journey) {
      console.log('❌ Journey not found!');
      process.exit(1);
    }

    // Add scene data to chapters that are missing it
    const scenesToAdd = [
      {
        chapterNumber: 2,
        scene: {
          location: "Square Town where everything has 4 equal sides and 4 corners",
          timeOfDay: "Late Morning",
          atmosphere: "Organized town with square buildings, square gardens, square windows",
          imageUrl: "/images/journeys/grade1/square-town.jpg",
          backgroundMusic: "/audio/journeys/town-theme.mp3"
        }
      },
      {
        chapterNumber: 3,
        scene: {
          location: "Triangle Peak - The highest mountain in Shape Kingdom",
          timeOfDay: "Afternoon",
          atmosphere: "Mountain air with triangular flags waving in the wind",
          imageUrl: "/images/journeys/grade1/triangle-peak.jpg",
          backgroundMusic: "/audio/journeys/mountain-theme.mp3"
        }
      },
      {
        chapterNumber: 4,
        scene: {
          location: "Rectangle Road - A long, straight path through the kingdom",
          timeOfDay: "Late Afternoon",
          atmosphere: "Busy road with rectangular buildings and doorways",
          imageUrl: "/images/journeys/grade1/rectangle-road.jpg",
          backgroundMusic: "/audio/journeys/travel-theme.mp3"
        }
      },
      {
        chapterNumber: 5,
        scene: {
          location: "Pattern Palace - A magnificent palace with repeating decorations",
          timeOfDay: "Early Evening",
          atmosphere: "Colorful palace with patterns everywhere you look",
          imageUrl: "/images/journeys/grade1/pattern-palace.jpg",
          backgroundMusic: "/audio/journeys/palace-theme.mp3"
        }
      },
      {
        chapterNumber: 6,
        scene: {
          location: "The Royal Workshop - A creative space filled with shapes",
          timeOfDay: "Evening",
          atmosphere: "Creative workshop with shapes, tools, and building materials",
          imageUrl: "/images/journeys/grade1/workshop.jpg",
          backgroundMusic: "/audio/journeys/creative-theme.mp3"
        }
      },
      {
        chapterNumber: 7,
        scene: {
          location: "The Grand Championship Arena",
          timeOfDay: "Sunset",
          atmosphere: "Excited crowd cheering as you take the final test",
          imageUrl: "/images/journeys/grade1/championship-arena.jpg",
          backgroundMusic: "/audio/journeys/victory-theme.mp3"
        }
      }
    ];

    let updatedCount = 0;

    for (const sceneData of scenesToAdd) {
      const chapterIndex = journey.story.chapters.findIndex(
        ch => ch.chapterNumber === sceneData.chapterNumber
      );

      if (chapterIndex !== -1) {
        console.log(`Updating Chapter ${sceneData.chapterNumber}...`);
        journey.story.chapters[chapterIndex].scene = sceneData.scene;
        updatedCount++;
      }
    }

    // IMPORTANT: Mark the Mixed type field as modified
    journey.markModified('story');

    await journey.save();

    console.log(`\n✅ Successfully updated ${updatedCount} chapters!\n`);

    // Verify by re-fetching
    const verified = await HistoricalJourney.findOne({
      title: 'The Magical Shape Kingdom',
      grade: '1'
    });

    console.log('Verification:');
    verified.story.chapters.forEach((ch) => {
      const hasScene = !!ch.scene && !!ch.scene.location;
      console.log(`  Chapter ${ch.chapterNumber}: ${hasScene ? '✅' : '❌'} ${ch.title}`);
      if (hasScene) {
        console.log(`     Location: ${ch.scene.location}`);
      }
    });

    await mongoose.disconnect();
    console.log('\n✅ Done! All chapters now have scene data.');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixScenesProperty();
