/**
 * Clean up orphaned journey attempts
 *
 * After regenerating journeys, old attempts reference journeys that no longer exist.
 * This script deletes those orphaned attempts.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const HistoricalJourneyAttempt = require('./src/models/HistoricalJourneyAttempt');
const HistoricalJourney = require('./src/models/HistoricalJourney');

const cleanupOrphanedAttempts = async () => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('🧹 CLEANING UP ORPHANED JOURNEY ATTEMPTS');
    console.log('='.repeat(70));
    console.log('');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all attempts
    const allAttempts = await HistoricalJourneyAttempt.find();
    console.log(`Found ${allAttempts.length} total journey attempts\n`);

    // Get all valid journey IDs
    const validJourneys = await HistoricalJourney.find({}, '_id');
    const validJourneyIds = new Set(validJourneys.map(j => j._id.toString()));
    console.log(`Found ${validJourneyIds.size} valid journeys\n`);

    // Find orphaned attempts
    const orphanedAttempts = allAttempts.filter(
      attempt => !validJourneyIds.has(attempt.journeyId.toString())
    );

    if (orphanedAttempts.length === 0) {
      console.log('✅ No orphaned attempts found - database is clean!\n');
    } else {
      console.log(`Found ${orphanedAttempts.length} orphaned attempts:\n`);

      orphanedAttempts.forEach((attempt, idx) => {
        console.log(`${idx + 1}. Attempt ID: ${attempt._id}`);
        console.log(`   Journey ID: ${attempt.journeyId} (deleted)`);
        console.log(`   Student ID: ${attempt.studentId}`);
        console.log(`   Status: ${attempt.status}`);
        console.log('');
      });

      console.log('🗑️  Deleting orphaned attempts...\n');

      const deleteResult = await HistoricalJourneyAttempt.deleteMany({
        journeyId: { $in: orphanedAttempts.map(a => a.journeyId) }
      });

      console.log(`✅ Deleted ${deleteResult.deletedCount} orphaned attempts\n`);
    }

    console.log('='.repeat(70));
    console.log('✨ Cleanup complete!');
    console.log('='.repeat(70));
    console.log('');

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

cleanupOrphanedAttempts();
