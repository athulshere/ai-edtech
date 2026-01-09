# Quick Start Guide

Get the AI-Powered Student Assessment Platform running in 15 minutes!

## Prerequisites Checklist

Before starting, ensure you have:
- ✅ Node.js (v16+) installed
- ✅ MongoDB running (local or Atlas account)
- ✅ Google Cloud account with Vision API enabled
- ✅ OpenAI API key
- ✅ AWS account with S3 bucket created

## Step 1: Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
# Required fields:
# - MONGODB_URI
# - JWT_SECRET (any random 32+ character string)
# - GOOGLE_APPLICATION_CREDENTIALS
# - OPENAI_API_KEY
# - AWS credentials and bucket name
```

**Critical**: Place your Google Vision credentials JSON file at:
```
backend/src/config/google-vision-credentials.json
```

## Step 2: Frontend Setup (3 minutes)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Default configuration should work:
# REACT_APP_API_URL=http://localhost:5000/api
```

## Step 3: Start the Application (2 minutes)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Wait for: `MongoDB Connected` and `Server is running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Browser opens automatically at `http://localhost:3000`

## Step 4: Create Your First Account (3 minutes)

1. Click "Register here" on the login page
2. Fill in your details:
   - Name: Your name
   - Email: your@email.com
   - Password: minimum 6 characters
   - Role: Choose "Parent" or "Teacher"
3. Click "Create Account"

You're automatically logged in!

## Step 5: Test the System (2 minutes)

### For Parents:
1. Click "Add Your First Student"
2. Fill in student details
3. Click "Upload New Assessment"
4. Upload a clear image of handwritten work
5. Wait 30-60 seconds for AI processing
6. View the detailed analysis!

### For Teachers:
1. Create a student (assign to a parent email)
2. View all students in your dashboard
3. Click on a student to see their progress
4. Upload assessments for any student

## What You Get

After uploading an assessment, the AI will:

✅ **Extract handwriting** using Google Vision OCR
✅ **Analyze answers** using GPT-4
✅ **Identify mistakes** by type (conceptual, calculation, etc.)
✅ **Provide specific feedback** for each error
✅ **Suggest improvements** with actionable advice
✅ **Track learning patterns** over time
✅ **Generate personalized insights**

## Common Issues & Quick Fixes

### "Cannot connect to MongoDB"
```bash
# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### "Google Vision API error"
- Check credentials file path in `.env`
- Verify Vision API is enabled in Google Cloud Console
- Ensure credentials JSON file is in correct location

### "OpenAI API error"
- Verify your API key is correct
- Check you have billing set up
- Ensure you have credits available

### "AWS S3 upload failed"
- Verify bucket name is correct
- Check IAM user has S3 permissions
- Ensure AWS credentials are valid

### Port already in use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

## Next Steps

1. **Explore Features**:
   - Upload multiple assessments
   - Watch learning patterns emerge
   - Generate personalized tests

2. **Add More Students**:
   - Parents can add multiple children
   - Teachers can manage entire classrooms

3. **Customize**:
   - Modify AI prompts in `backend/src/services/openai.js`
   - Adjust UI in frontend components
   - Add new subjects or assessment types

4. **Plan for Production**:
   - Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for deployment
   - Set up proper security measures
   - Configure monitoring and backups

## API Quick Reference

All endpoints require authentication (except login/register).

**Base URL**: `http://localhost:5000/api`

**Headers**:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Key Endpoints**:
- `POST /auth/register` - Create account
- `POST /auth/login` - Get JWT token
- `POST /students` - Create student
- `POST /assessments/upload` - Upload image (multipart/form-data)
- `GET /assessments/student/:studentId` - Get all assessments

## Development Tips

### Backend Development
```bash
# Watch mode with auto-reload
npm run dev

# Check logs for errors
# All AI processing is logged to console
```

### Frontend Development
```bash
# Auto-reloads on save
npm start

# Build for production
npm run build
```

### Database Access
```bash
# MongoDB Shell
mongosh

# Use the database
use edtech-assessment

# View collections
show collections

# Find users
db.users.find()

# Find assessments
db.assessments.find()
```

## Cost Estimates (Phase 1)

Based on moderate usage (100 assessments/month):

- **OpenAI GPT-4**: $10-20/month
- **Google Vision API**: $5-10/month
- **AWS S3**: $1-3/month
- **MongoDB Atlas**: $0 (free tier)

**Total**: ~$15-35/month for testing

## Support & Documentation

- **Detailed Setup**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Architecture**: See [README.md](README.md)
- **API Docs**: See backend route files

## Getting Help

If you're stuck:
1. Check error messages in terminal
2. Review environment variables
3. Verify all services are running
4. Check API credentials are valid
5. Review troubleshooting section in SETUP_GUIDE.md

---

**Ready to revolutionize education with AI!** 🚀

Happy coding! If you have questions, check the documentation or create an issue.
