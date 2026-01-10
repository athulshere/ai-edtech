require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('./src/models/Game');
const gameSeeds = require('./src/seeds/gameSeeds');

const seedGames = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing games
    await Game.deleteMany({});
    console.log('Cleared existing games');

    // Insert Grade 1 games
    const grade1Games = [
      ...gameSeeds.grade1Math,
      ...gameSeeds.grade1English,
      ...gameSeeds.grade1Science
    ];

    await Game.insertMany(grade1Games);
    console.log(`Inserted ${grade1Games.length} games for Grade 1`);

    console.log('\nGame seeding completed successfully!');
    console.log('Summary:');
    console.log(`- Mathematics: ${gameSeeds.grade1Math.length} games`);
    console.log(`- English: ${gameSeeds.grade1English.length} games`);
    console.log(`- Science: ${gameSeeds.grade1Science.length} games`);
    console.log(`Total: ${grade1Games.length} games`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding games:', error);
    process.exit(1);
  }
};

seedGames();
