# Testing Checklist - AI Grading Fixes

## ✅ Pre-Test Requirements

- [ ] **OpenAI billing credits added** ($5-10 minimum)
  - URL: https://platform.openai.com/settings/organization/billing
  - Wait 2-3 minutes after adding credits

- [ ] **Backend server running**
  ```bash
  cd backend
  npm run dev
  ```

- [ ] **Frontend server running**
  ```bash
  cd frontend
  npm start
  ```

---

## 🧪 Test 1: Run Automated Test Script

```bash
cd backend
node test-ai-grading.js
```

### Expected Results:
- ✅ Overall Score: **80-100%** (not 0%)
- ✅ Is Correct: **true** (not false)
- ✅ Score: **8-10/10 points** (not 0/10)
- ✅ Quality Check: **PASS** messages

### If Test Fails:
- Check OpenAI credits are available
- Check API key is correct
- Check backend console for errors
- Verify `gpt-4o-mini` model is being used

---

## 🖼️ Test 2: Upload Real Assessment

### Steps:
1. Go to http://localhost:3001/dashboard
2. Select student: Virat Kohli
3. Click "Upload New Assessment"
4. Fill in:
   - Subject: Mathematics
   - Topic: Algebra
   - Grade: 5
   - Assessment Type: Practice
5. Upload the math problem image (n=2 answer)
6. Wait 30-60 seconds
7. Click on the assessment to view details

### Expected Results:

#### ✅ PASS Criteria:
- **Overall Score**: 75-100%
- **Question Marked**: ✅ Correct
- **Points**: 7-10 / 10
- **Strengths**: Lists positive achievements
- **Feedback**: Encouraging, mentions correct answer
- **Mistakes**: Empty or only minor formatting notes

#### ❌ FAIL Criteria (Old Behavior):
- Overall Score: 0-30%
- Question Marked: ✗ Incorrect
- Points: 0-3 / 10
- Strengths: None identified
- Feedback: Negative, says "facing challenges"
- Mistakes: Conceptual, calculation errors listed

---

## 📊 Test 3: Check Backend Logs

Look for this in backend console:

```
OpenAI Analysis Summary: {
  questionsCount: 1,
  overallScore: 90,      ← Should be HIGH
  mistakesCount: 0,      ← Should be LOW/ZERO for correct answers
  tokensUsed: ~1500
}
```

---

## 🔍 Test 4: Verify Extracted Text

1. Click on assessment
2. Expand "📄 Text Recognized by Google Vision AI"
3. Verify it shows:
   - The question
   - The solution work
   - **"Answer: n=2"** at the end

---

## 🎯 Test 5: Compare Before/After

### Test with OLD assessment (ID: 695f882e...):
```bash
cd backend
node check-extracted-text.js
```

- This will still show **0/10** (old grading)
- Cannot be re-graded (already processed)

### Test with NEW upload:
- Should show **8-10/10** (new grading)
- Proper recognition of correct answer

---

## 🐛 Troubleshooting

### Issue: Still getting 0/10 scores

**Check:**
1. Are you looking at OLD assessment or NEW upload?
   - Old assessments won't change
   - Upload a fresh one to test

2. OpenAI credits available?
   ```bash
   node test-ai-grading.js
   ```

3. Backend restarted after code changes?
   - Stop server (Ctrl+C)
   - Run: `npm run dev`

### Issue: "Processing" never completes

**Check:**
1. Backend console for errors
2. OpenAI quota error?
3. Network connectivity

**Fix:**
- Refresh browser
- Wait full 60 seconds
- Check backend logs

### Issue: Test script fails

**Error: "quota exceeded"**
- Add OpenAI credits
- Wait 2-3 minutes

**Error: "API key invalid"**
- Check `.env` file
- Verify `OPENAI_API_KEY` is correct

**Error: "model not found"**
- Should be using `gpt-4o-mini`
- NOT `GPT-5 mini` or `gpt-4-turbo-preview`

---

## 📝 Success Criteria Summary

| Metric | Old (Wrong) | New (Fixed) | Status |
|--------|-------------|-------------|--------|
| Overall Score | 0% | 80-100% | ✅ Fixed |
| Question Correct | false | true | ✅ Fixed |
| Points | 0/10 | 8-10/10 | ✅ Fixed |
| Strengths | Empty | Listed | ✅ Fixed |
| Mistakes | Many wrong | None/minor | ✅ Fixed |
| Feedback | Negative | Encouraging | ✅ Fixed |

---

## 🚀 Quick Test Commands

```bash
# 1. Test AI grading logic
cd backend
node test-ai-grading.js

# 2. Check recent assessments
node check-extracted-text.js

# 3. Check for stuck assessments
node check-processing-assessments.js

# 4. Restart backend (if needed)
# Press Ctrl+C, then:
npm run dev

# 5. Check if all services configured
node test-ai-setup.js
```

---

## 📞 If All Tests Pass

You're done! The system is working correctly:
- ✅ Google Vision extracting text
- ✅ OpenAI analyzing correctly
- ✅ Proper scoring (high for correct answers)
- ✅ Good feedback
- ✅ Frontend displaying results

---

## 📞 If Tests Fail

1. **Run test script first** - shows if OpenAI is working:
   ```bash
   node test-ai-grading.js
   ```

2. **Check backend logs** - look for errors

3. **Verify changes applied**:
   ```bash
   grep -n "GRADING RULES" backend/src/services/openai.js
   ```
   Should show the new rules at line ~57

4. **Upload fresh assessment** - don't test with old ones

5. **Check [AI_GRADING_IMPROVEMENTS.md](AI_GRADING_IMPROVEMENTS.md)** for details

---

## ⏱️ Expected Timeline

1. **Add OpenAI credits**: 5 minutes + 2-3 min wait
2. **Run test script**: 30 seconds
3. **Upload new assessment**: 1 minute
4. **Wait for processing**: 30-60 seconds
5. **View results**: Immediate

**Total: ~10 minutes** to fully verify the fix is working.

---

## 🎉 Success Message

When everything works, you should see:

**In test script:**
```
✅ PASS: AI correctly identified the answer is correct (90%)
✅ PASS: Question marked as correct
```

**In frontend:**
- Score card showing **90%** or higher
- Question 1: **9/10 points** ✅ Correct
- Strengths identified
- Positive, encouraging feedback
- Extracted text visible and accurate

**In backend console:**
```
OpenAI Analysis Summary: {
  questionsCount: 1,
  overallScore: 90,
  mistakesCount: 0
}
```

---

**Everything is ready to test once you add OpenAI credits!** 🚀
