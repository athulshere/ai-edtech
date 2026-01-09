# Detailed Setup Guide

This guide will walk you through setting up the AI-Powered Student Assessment Platform from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Google Cloud Vision API Setup](#google-cloud-vision-api-setup)
3. [OpenAI API Setup](#openai-api-setup)
4. [AWS S3 Setup](#aws-s3-setup)
5. [MongoDB Setup](#mongodb-setup)
6. [Backend Configuration](#backend-configuration)
7. [Frontend Configuration](#frontend-configuration)
8. [Running the Application](#running-the-application)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Node.js**: Version 16.x or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version` and `npm --version`

- **MongoDB**: Version 5.x or higher
  - Option 1: [Local installation](https://www.mongodb.com/try/download/community)
  - Option 2: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud, free tier available)
  - Verify: `mongod --version`

- **Git**: For version control
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

### Required Accounts
- Google Cloud Platform account
- OpenAI account
- AWS account

## Google Cloud Vision API Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `edtech-assessment`
4. Click "Create"

### Step 2: Enable Vision API

1. In the Cloud Console, navigate to "APIs & Services" → "Library"
2. Search for "Cloud Vision API"
3. Click on it and press "Enable"

### Step 3: Create Service Account

1. Navigate to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Enter details:
   - Name: `edtech-vision-api`
   - Description: `Service account for handwriting recognition`
4. Click "Create and Continue"
5. Grant role: "Cloud Vision AI User"
6. Click "Done"

### Step 4: Create and Download Credentials

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" format
5. Click "Create"
6. The JSON file will download automatically
7. Rename it to `google-vision-credentials.json`
8. Move it to `backend/src/config/google-vision-credentials.json`

**Important**: Never commit this file to version control!

### Step 5: Set Environment Variable

Add to your `backend/.env`:
```env
GOOGLE_APPLICATION_CREDENTIALS=./config/google-vision-credentials.json
```

## OpenAI API Setup

### Step 1: Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API section

### Step 2: Generate API Key

1. Click on your profile → "View API keys"
2. Click "Create new secret key"
3. Give it a name: `edtech-assessment`
4. Copy the key immediately (you won't see it again!)
5. Add to `backend/.env`:
```env
OPENAI_API_KEY=sk-your-actual-key-here
```

### Step 3: Add Credits

1. Go to "Billing" → "Payment methods"
2. Add a payment method
3. Set up billing limits (recommended: $20/month for testing)

**Cost Estimates** (Phase 1):
- GPT-4 Turbo: ~$0.01-0.03 per assessment
- Expected: $10-30/month for moderate usage

## AWS S3 Setup

### Step 1: Create AWS Account

1. Go to [AWS Console](https://aws.amazon.com/)
2. Sign up or log in
3. Navigate to S3 service

### Step 2: Create S3 Bucket

1. Click "Create bucket"
2. Bucket name: `edtech-assessment-images-[your-unique-id]`
   - Must be globally unique
   - Use lowercase, no spaces
3. Region: Choose closest to your users (e.g., `us-east-1`)
4. Block all public access: ✓ (Keep enabled for security)
5. Enable bucket versioning: ✓ (Recommended)
6. Click "Create bucket"

### Step 3: Create IAM User

1. Navigate to IAM → Users
2. Click "Add users"
3. Username: `edtech-s3-user`
4. Select "Access key - Programmatic access"
5. Click "Next: Permissions"
6. Click "Attach existing policies directly"
7. Search and select: `AmazonS3FullAccess` (or create custom policy)
8. Click through to "Create user"
9. **Important**: Copy Access Key ID and Secret Access Key

### Step 4: Configure Environment Variables

Add to `backend/.env`:
```env
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=edtech-assessment-images-your-unique-id
```

## MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB**
   - macOS: `brew install mongodb-community`
   - Windows: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Linux: Follow [installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB**
   ```bash
   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   # Run as Windows service or from MongoDB Compass
   ```

3. **Configure Environment**
   ```env
   MONGODB_URI=mongodb://localhost:27017/edtech-assessment
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Click "Build a Database"
4. Choose "Free" tier (M0 Sandbox)
5. Select cloud provider and region
6. Click "Create Cluster"
7. **Security Setup**:
   - Database Access: Create user with password
   - Network Access: Add your IP (or `0.0.0.0/0` for testing)
8. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

9. **Configure Environment**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edtech-assessment?retryWrites=true&w=majority
   ```

## Backend Configuration

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Create .env File

```bash
cp .env.example .env
```

### Step 3: Configure All Environment Variables

Your `backend/.env` should look like:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/edtech-assessment

# JWT Secret (generate a random string)
JWT_SECRET=your_very_secure_random_secret_minimum_32_characters
JWT_EXPIRE=7d

# Google Cloud Vision API
GOOGLE_APPLICATION_CREDENTIALS=./config/google-vision-credentials.json

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here

# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=edtech-assessment-images-your-bucket

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Generate Secure JWT Secret

```bash
# macOS/Linux
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator (not recommended for production)
```

### Step 5: Verify Configuration

Create a test script `backend/test-config.js`:

```javascript
require('dotenv').config();

console.log('Environment Variables Check:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✓ Set' : '✗ Missing');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing');
console.log('AWS_S3_BUCKET:', process.env.AWS_S3_BUCKET ? '✓ Set' : '✗ Missing');
```

Run: `node test-config.js`

## Frontend Configuration

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Create .env File

```bash
cp .env.example .env
```

Your `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 5000 in development mode
MongoDB Connected: localhost
```

### Start Frontend Development Server

```bash
cd frontend
npm start
```

Browser will open automatically at `http://localhost:3000`

## Testing

### Test Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "EdTech Assessment API is running"
}
```

### Create Test User

1. Open browser to `http://localhost:3000/register`
2. Fill in the form:
   - First Name: Test
   - Last Name: Parent
   - Email: parent@test.com
   - Password: password123
   - Role: Parent
3. Click "Create Account"

### Test Assessment Upload

1. Login with test credentials
2. Create a student first
3. Upload a sample handwritten assessment image
4. Wait for AI processing (30-60 seconds)
5. View results

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solutions**:
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env`
- For Atlas: Verify network access allows your IP

### Google Vision API Error

**Error**: `Could not load the default credentials`

**Solutions**:
- Verify credentials file exists at correct path
- Check file permissions: `chmod 644 google-vision-credentials.json`
- Ensure `GOOGLE_APPLICATION_CREDENTIALS` path is correct

### OpenAI API Error

**Error**: `401 Unauthorized`

**Solutions**:
- Verify API key is correct
- Check billing status on OpenAI platform
- Ensure you have credits available

### AWS S3 Upload Error

**Error**: `AccessDenied`

**Solutions**:
- Verify IAM user has S3 permissions
- Check bucket name matches environment variable
- Ensure AWS credentials are correct

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solutions**:
```bash
# Find process using port
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### CORS Error in Frontend

**Error**: `Access-Control-Allow-Origin`

**Solutions**:
- Verify `CORS_ORIGIN` in backend `.env` matches frontend URL
- Restart backend server after changes

## Production Deployment

### Environment Variables

Never commit `.env` files! Use platform-specific secrets:
- Heroku: `heroku config:set KEY=value`
- AWS: Use AWS Secrets Manager
- Vercel: Project Settings → Environment Variables

### Security Checklist

- [ ] Change `JWT_SECRET` to strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Restrict CORS to actual domain
- [ ] Set up proper IAM roles with minimal permissions
- [ ] Enable MongoDB authentication
- [ ] Set up monitoring and logging
- [ ] Regular security audits

### Performance Optimization

- Enable compression middleware
- Implement caching (Redis)
- Use CDN for static assets
- Optimize images before upload
- Set up database indexes
- Implement request queuing for AI processing

---

Need help? Check the main README.md or create an issue!
