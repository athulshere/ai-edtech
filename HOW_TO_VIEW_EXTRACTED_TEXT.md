# How to View Google Vision AI Extracted Text

The text extracted by Google Vision AI from handwritten images is stored in the database and can now be viewed in multiple ways.

---

## Option 1: View in the Frontend (User-Friendly) ✨

### What I Just Added:

I created a complete **Assessment Details** page that displays:
- ✅ Overall score
- ✅ **Text recognized by Google Vision AI** (collapsible section)
- ✅ Questions and answers
- ✅ Identified mistakes with suggestions
- ✅ Personalized feedback
- ✅ Strengths and areas for improvement
- ✅ Recommended topics to study

### How to Access:

1. **Start your frontend** (if not already running):
   ```bash
   cd frontend
   npm start
   ```

2. **View an assessment**:
   - Go to your dashboard
   - Click on any completed assessment in the "Recent Assessments" section
   - You'll be taken to `/assessment/{id}` page

3. **Find the extracted text**:
   - Look for the section: **"📄 Text Recognized by Google Vision AI"**
   - Click to expand and view the raw text extracted from the handwriting
   - This is the exact text that Google Vision AI read from the image

---

## Option 2: View in Database (Quick Check) 🔍

Run this helper script I created:

```bash
cd backend
node check-extracted-text.js
```

This will show you:
- Recent 5 assessments
- Student names
- Extracted text from each assessment
- Status and dates

**Example Output:**
```
📝 Recent Assessments with Extracted Text:
================================================================================

1. Assessment ID: 6789abc...
   Student: John Doe
   Subject: Math | Topic: Algebra
   Status: completed
   Date: 1/8/2026, 10:30:00 AM

   📄 Extracted Text by Google Vision:
   ----------------------------------------------------------------------------
   Question 1: What is 2 + 2?
   Answer: 4

   Question 2: Solve for x: 2x + 5 = 13
   Answer: x = 4
   ----------------------------------------------------------------------------
```

---

## Option 3: View Directly in MongoDB Atlas 🗄️

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Browse Collections"**
3. Navigate to: `edtech_db` → `assessments`
4. Find any assessment document
5. Look for the `extractedText` field

---

## How the Workflow Works

```
┌─────────────────┐
│  Image Upload   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AWS S3 Store  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Google Vision API          │  ← Extracts handwritten text (OCR)
│  Returns: "Question 1: ..." │
└────────┬────────────────────┘
         │
         │ (Raw text saved to assessment.extractedText)
         │
         ▼
┌─────────────────────────────────────────────┐
│  OpenAI API                                 │  ← Analyzes text
│  Returns: Structured questions, mistakes,   │
│           feedback, scores                  │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Database Save  │
└─────────────────┘
```

---

## What's Stored in the Database

Each assessment document contains:

```javascript
{
  _id: "...",
  studentId: "...",
  subject: "Math",
  topic: "Algebra",

  // Raw image
  originalImage: {
    url: "https://s3.../image.jpg",
    s3Key: "..."
  },

  // ✅ THIS IS THE GOOGLE VISION OUTPUT
  extractedText: "Question 1: What is 2+2?\nAnswer: 4\n...",

  // ✅ THIS IS THE OPENAI OUTPUT (structured)
  questions: [
    {
      questionNumber: 1,
      studentAnswer: "4",
      isCorrect: true,
      score: 10,
      maxScore: 10
    }
  ],

  aiAnalysis: {
    overallScore: 95,
    mistakes: [...],
    personalizedFeedback: "...",
    ...
  }
}
```

---

## Testing the New Feature

### 1. **Upload a test assessment** (once OpenAI credits are added):
   ```
   Dashboard → Select Student → Upload New Assessment
   ```

### 2. **Wait for processing** (~30-60 seconds)

### 3. **Click on the assessment** to view details

### 4. **Expand the "Text Recognized by Google Vision AI" section**
   - This shows exactly what Google Vision extracted
   - Compare it with the original image to see OCR accuracy
   - Below it, you'll see how OpenAI structured this text into Q&A

---

## Files I Created/Modified

### New Files:
1. **`backend/check-extracted-text.js`** - Script to view extracted text in terminal
2. **`frontend/src/components/assessment/AssessmentDetails.tsx`** - Full assessment view page
3. **`frontend/src/components/assessment/AssessmentDetails.css`** - Styling for details page

### Modified Files:
1. **`frontend/src/App.tsx`** - Added route for `/assessment/:assessmentId`
2. **`frontend/src/services/api.ts`** - Added `getAssessmentById()` function

---

## Next Steps

1. **Add OpenAI billing credits** ($5-10 minimum):
   - Go to: https://platform.openai.com/settings/organization/billing
   - Add payment method
   - Add credits

2. **Test the full workflow**:
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev

   # Frontend (Terminal 2)
   cd frontend
   npm start
   ```

3. **Upload a handwritten assessment** and click to view details

4. **Verify extracted text** appears in the collapsible section

---

## Troubleshooting

### Text not showing?
- Check assessment status is "completed" not "processing" or "failed"
- Run `node check-extracted-text.js` to verify it's in the database
- Check browser console for errors

### Assessment stuck on "processing"?
- OpenAI credits might not be added yet
- Check backend logs: `cd backend && npm run dev`
- Look for error messages about quota or API keys

### Need to see what's in the database?
```bash
cd backend
node check-extracted-text.js
```

---

## Summary

**To see Google Vision AI extracted text:**
- **User-friendly**: Click on any assessment → Expand "📄 Text Recognized by Google Vision AI"
- **Quick terminal check**: `node check-extracted-text.js`
- **Database**: MongoDB Atlas → Browse Collections → assessments → extractedText field

The extracted text is the **raw OCR output** from Google Vision, showing exactly what it read from the handwriting before OpenAI structures it into questions/answers/feedback.
