/**
 * Comprehensive Google Vision API Diagnostics
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const vision = require('@google-cloud/vision');

async function diagnoseGoogleVision() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 GOOGLE VISION API COMPREHENSIVE DIAGNOSTICS');
  console.log('='.repeat(80));
  console.log('');

  let allChecksPass = true;

  // Check 1: Environment Variable
  console.log('📋 CHECK 1: Environment Variable');
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath) {
    console.log('   ❌ GOOGLE_APPLICATION_CREDENTIALS not set in environment');
    allChecksPass = false;
  } else {
    console.log('   ✅ Environment variable is set');
    console.log(`   Path: ${credPath}`);
  }
  console.log('');

  // Check 2: File Existence
  console.log('📋 CHECK 2: Service Account Key File');
  if (!fs.existsSync(credPath)) {
    console.log(`   ❌ File not found at: ${credPath}`);
    allChecksPass = false;
  } else {
    console.log('   ✅ File exists');
    const stats = fs.statSync(credPath);
    console.log(`   File size: ${stats.size} bytes`);
    console.log(`   Last modified: ${stats.mtime}`);
  }
  console.log('');

  // Check 3: JSON Validity
  console.log('📋 CHECK 3: Service Account Key Content');
  try {
    const keyContent = fs.readFileSync(credPath, 'utf8');
    const keyData = JSON.parse(keyContent);

    console.log('   ✅ Valid JSON format');
    console.log(`   Type: ${keyData.type}`);
    console.log(`   Project ID: ${keyData.project_id}`);
    console.log(`   Service Account: ${keyData.client_email}`);
    console.log(`   Private Key ID: ${keyData.private_key_id.substring(0, 20)}...`);

    if (keyData.type !== 'service_account') {
      console.log('   ⚠️  Type is not "service_account"');
      allChecksPass = false;
    }
    if (!keyData.private_key || !keyData.private_key.includes('BEGIN PRIVATE KEY')) {
      console.log('   ❌ Private key is missing or invalid');
      allChecksPass = false;
    } else {
      console.log('   ✅ Private key format looks valid');
    }
  } catch (err) {
    console.log(`   ❌ Failed to parse JSON: ${err.message}`);
    allChecksPass = false;
  }
  console.log('');

  // Check 4: Client Initialization
  console.log('📋 CHECK 4: Vision API Client Initialization');
  let client;
  try {
    client = new vision.ImageAnnotatorClient({
      keyFilename: credPath
    });
    console.log('   ✅ Client initialized successfully');
  } catch (err) {
    console.log(`   ❌ Failed to initialize client: ${err.message}`);
    allChecksPass = false;
    return;
  }
  console.log('');

  // Check 5: API Call Test
  console.log('📋 CHECK 5: Vision API Call Test');
  console.log('   Testing with a simple text detection...');

  // Create a minimal test image (1x1 white pixel)
  const testImageBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
    0x42, 0x60, 0x82
  ]);

  try {
    const [result] = await client.textDetection(testImageBuffer);
    console.log('   ✅ API call succeeded!');
    console.log('   Vision API is working correctly');

    if (result.error) {
      console.log(`   ⚠️  API returned error: ${result.error.message}`);
    } else {
      console.log('   ✅ No errors in response');
    }
  } catch (err) {
    console.log('   ❌ API call failed');
    console.log(`   Error code: ${err.code}`);
    console.log(`   Error message: ${err.message}`);
    console.log('');

    if (err.code === 7) {
      console.log('   🔍 Error Code 7 = PERMISSION_DENIED');
      console.log('   Cause: Service account lacks required permissions');
      console.log('');
      console.log('   Fix:');
      console.log('   1. Go to: https://console.cloud.google.com/iam-admin/iam');
      console.log('   2. Find service account: edtech-vision-id@festive-rarity-430419-i1.iam.gserviceaccount.com');
      console.log('   3. Click "Edit" (pencil icon)');
      console.log('   4. Add role: "Cloud Vision API User"');
      console.log('   5. Save changes');
    } else if (err.code === 16) {
      console.log('   🔍 Error Code 16 = UNAUTHENTICATED');
      console.log('   Cause: API not enabled OR invalid credentials');
      console.log('');
      console.log('   Fix Option A - Enable API:');
      console.log('   1. Go to: https://console.cloud.google.com/apis/library/vision.googleapis.com?project=festive-rarity-430419-i1');
      console.log('   2. Click "Enable"');
      console.log('   3. Wait 1-2 minutes for propagation');
      console.log('');
      console.log('   Fix Option B - Verify Billing:');
      console.log('   1. Go to: https://console.cloud.google.com/billing');
      console.log('   2. Ensure billing account is linked');
      console.log('   3. Vision API requires billing (has free tier)');
    } else {
      console.log(`   🔍 Unexpected error code: ${err.code}`);
      console.log('   Check Google Cloud Console for project status');
    }

    allChecksPass = false;
  }
  console.log('');

  // Final Summary
  console.log('='.repeat(80));
  if (allChecksPass) {
    console.log('✅ ALL CHECKS PASSED - Vision API is configured correctly!');
  } else {
    console.log('❌ SOME CHECKS FAILED - See details above');
    console.log('');
    console.log('Most Common Issue: Vision API not enabled');
    console.log('Quick Fix: https://console.cloud.google.com/apis/library/vision.googleapis.com?project=festive-rarity-430419-i1');
  }
  console.log('='.repeat(80));
  console.log('');
}

diagnoseGoogleVision().catch(console.error);
