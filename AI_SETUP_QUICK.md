# AI Services Setup - Quick Guide

Your assessment upload worked, but analysis failed because AI services aren't configured yet.

## ✅ What's Working:
- Image upload to AWS S3 ✓
- Database storage ✓
- User authentication ✓

## ❌ What's Missing:
- OpenAI API (for answer analysis)
- Google Vision API (for handwriting OCR)

---

## 🚀 Setup Instructions

### Step 1: OpenAI API (15 minutes)

**1. Create Account:**
- Go to: https://platform.openai.com/
- Sign up or login

**2. Add Billing:**
- Click "Billing" in left sidebar
- Add payment method
- Add $5-10 credits (starts at $5 minimum)
- Cost: ~$0.02 per assessment

**3. Create API Key:**
- Go to: https://platform.openai.com/api-keys
- Click "Create new secret key"
- Name: `edtech-assessment`
- Copy the key (starts with `sk-proj-...`)

**4. Add to .env:**
Open `backend/.env` and replace line 18:
```env
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
```

**5. Restart backend:**
The server will auto-restart with nodemon.

---

### Step 2: Google Vision API (20 minutes)

**1. Go to Google Cloud Console:**
- Visit: https://console.cloud.google.com/

**2. Create Project:**
- Click project dropdown (top left)
- Click "New Project"
- Name: `edtech-assessment`
- Click "Create"

**3. Enable Vision API:**
- Search "Cloud Vision API" in search bar
- Click on it
- Click "Enable"

**4. Create Service Account:**
- Go to: **IAM & Admin** → **Service Accounts**
- Click "Create Service Account"
- Name: `edtech-vision`
- Click "Create and Continue"
- Role: Select "Cloud Vision AI User"
- Click "Done"

**5. Create JSON Key:**
- Click on the service account you just created
- Click "Keys" tab
- Click "Add Key" → "Create new key"
- Choose "JSON"
- Click "Create"
- A JSON file will download automatically

**6. Save the Credentials File:**
```bash
# Move downloaded file to:
/Users/asatheesh/Documents/edtech/backend/src/config/google-vision-credentials.json
```

Or using Finder:
- Find your downloaded file (usually in Downloads/)
- Rename it to: `google-vision-credentials.json`
- Move to: `backend/src/config/`

**7. Update .env:**
Make sure line 15 in `backend/.env` says:
```env
GOOGLE_APPLICATION_CREDENTIALS=./src/config/google-vision-credentials.json
```

---

## ✅ Verify Setup

Run this command:
```bash
cd backend
node test-ai-setup.js
```

You should see:
```
✅ All AI services configured! Ready for assessment analysis.
```

---

## 🎯 Test Full Workflow

After configuring both APIs:

1. **Restart backend** (if not auto-restarted):
```bash
cd backend
npm run dev
```

2. **Upload Test Assessment:**
   - Go to your dashboard
   - Select a student
   - Click "Upload New Assessment"
   - Upload a handwritten image
   - Wait 30-60 seconds

3. **View Results:**
   - You'll see AI analysis with:
     - Extracted handwritten text
     - Identified mistakes
     - Personalized feedback
     - Recommended topics
     - Overall score

---

## 💰 Cost Estimates

**OpenAI (GPT-4 Turbo):**
- ~$0.01-0.03 per assessment
- $10/month for moderate use (100-300 assessments)

**Google Vision:**
- ~$0.005-0.01 per image
- First 1000 images/month: FREE!
- After that: $1.50 per 1000 images

**Total:** ~$10-20/month for development/testing

---

## 🐛 Troubleshooting

### OpenAI Errors:

**"Incorrect API key"**
- Check key starts with `sk-proj-` or `sk-`
- No extra spaces in .env file
- Key is copied completely

**"Insufficient credits"**
- Add credits in OpenAI billing dashboard

### Google Vision Errors:

**"Could not load credentials"**
- Check file path is correct
- File is in `backend/src/config/`
- File is named exactly: `google-vision-credentials.json`

**"API not enabled"**
- Go back to Google Cloud Console
- Search "Cloud Vision API"
- Make sure it shows "Enabled"

---

## 📁 Expected File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── google-vision-credentials.json  ← Put JSON file here
│   ├── services/
│   │   ├── googleVision.js
│   │   ├── openai.js
│   │   └── aws.js
│   └── ...
├── .env  ← Update OPENAI_API_KEY here
└── test-ai-setup.js  ← Run this to check
```

---

## 🎓 What Each Service Does

**Google Vision API:**
- Reads handwritten text from images (OCR)
- Extracts words, sentences, paragraphs
- Provides confidence scores

**OpenAI GPT-4:**
- Analyzes extracted text
- Identifies specific mistakes
- Categorizes errors (conceptual, calculation, etc.)
- Generates personalized feedback
- Suggests improvements
- Recommends topics to study

**Workflow:**
```
Image → S3 Storage → Google Vision (OCR) → OpenAI (Analysis) → Database
```

---

## ⚡ Quick Start (If you already have accounts)

1. **OpenAI:**
```bash
# Just add to .env
OPENAI_API_KEY=sk-proj-your-key-here
```

2. **Google Vision:**
```bash
# Download JSON from Google Cloud Console
# Move to: backend/src/config/google-vision-credentials.json
```

3. **Verify:**
```bash
node test-ai-setup.js
```

4. **Restart backend & test!**

---

Need help? Check:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [STATUS.md](STATUS.md) - Current status

**Once configured, your assessments will have full AI-powered analysis!** 🚀
