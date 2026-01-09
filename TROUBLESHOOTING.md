# Troubleshooting Guide

## MongoDB Connection Issues

### Error: `connect ECONNREFUSED ::1:27017` or `connect ECONNREFUSED 127.0.0.1:27017`

This means MongoDB is not running on your local machine.

#### Solution 1: Start MongoDB (Local Installation)

**macOS (using Homebrew):**
```bash
# Start MongoDB as a service
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf

# Check if it's running
brew services list
```

**Linux (Ubuntu/Debian):**
```bash
# Start MongoDB
sudo systemctl start mongod

# Enable to start on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

**Windows:**
```bash
# Start MongoDB as Windows Service
net start MongoDB

# Or run manually
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

#### Solution 2: Use MongoDB Atlas (Cloud)

If you don't want to install MongoDB locally:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster (M0)
4. Create a database user
5. Whitelist your IP (or use `0.0.0.0/0` for testing)
6. Get connection string
7. Update `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edtech-assessment?retryWrites=true&w=majority
```

**Replace:**
- `username` with your database username
- `password` with your database password
- `cluster` with your cluster name

#### Solution 3: Fix Connection String

In `backend/.env`, change from IPv6 to IPv4:

```env
# Change from localhost to 127.0.0.1
MONGODB_URI=mongodb://127.0.0.1:27017/edtech-assessment
```

#### Verify MongoDB is Running

```bash
# Try connecting with mongosh
mongosh

# Or check the port
lsof -i :27017
```

---

## AWS SDK Deprecation Warning

### Warning: `AWS SDK for JavaScript (v2) is deprecated`

**Fixed!** The codebase now uses AWS SDK v3.

**What was changed:**
- Replaced `aws-sdk` with `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`
- Updated [backend/src/services/aws.js](backend/src/services/aws.js) to use v3 syntax
- Updated [package.json](backend/package.json)

**If you see this warning, run:**
```bash
cd backend
npm uninstall aws-sdk
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

---

## Google Vision API Errors

### Error: `Could not load the default credentials`

**Causes:**
1. Credentials file doesn't exist
2. Wrong file path in `.env`
3. Incorrect permissions

**Solutions:**

1. **Check file exists:**
```bash
ls -la backend/src/config/google-vision-credentials.json
```

2. **Check path in .env:**
```env
GOOGLE_APPLICATION_CREDENTIALS=./src/config/google-vision-credentials.json
```

3. **Fix permissions:**
```bash
chmod 644 backend/src/config/google-vision-credentials.json
```

4. **Re-download credentials:**
   - Go to Google Cloud Console
   - IAM & Admin → Service Accounts
   - Find your service account
   - Keys → Add Key → Create new key → JSON
   - Save to `backend/src/config/google-vision-credentials.json`

---

## OpenAI API Errors

### Error: `401 Unauthorized`

**Solutions:**

1. **Check API key:**
```bash
# In backend/.env
OPENAI_API_KEY=sk-proj-...  # Should start with sk-
```

2. **Verify billing:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Check "Billing" → "Payment methods"
   - Ensure you have credits

3. **Check rate limits:**
   - Free tier has low limits
   - Consider upgrading to paid tier

### Error: `429 Too Many Requests`

**Solution:** You've hit rate limits. Wait a few minutes or upgrade your plan.

---

## AWS S3 Errors

### Error: `AccessDenied`

**Solutions:**

1. **Check IAM permissions:**
   - User needs: `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`, `s3:ListBucket`

2. **Verify credentials in .env:**
```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

3. **Check bucket exists:**
```bash
# Using AWS CLI
aws s3 ls s3://your-bucket-name
```

### Error: `NoSuchBucket`

**Solution:** Bucket name in `.env` doesn't match actual bucket name.

---

## Port Already in Use

### Error: `EADDRINUSE: address already in use :::5000`

**Solutions:**

**macOS/Linux:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in backend/.env
PORT=5001
```

**Windows:**
```bash
# Find process
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

---

## CORS Errors in Frontend

### Error: `Access-Control-Allow-Origin`

**Solutions:**

1. **Check backend .env:**
```env
CORS_ORIGIN=http://localhost:3000
```

2. **If frontend runs on different port:**
```env
CORS_ORIGIN=http://localhost:3001
```

3. **Restart backend server** after changing .env

---

## Module Not Found Errors

### Error: `Cannot find module 'xyz'`

**Solution:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

---

## Frontend Build Errors

### Error: `Module not found: Can't resolve 'react-router-dom'`

**Solution:**
```bash
cd frontend
npm install react-router-dom @types/react-router-dom axios react-toastify recharts
```

---

## JWT Token Errors

### Error: `jwt malformed` or `invalid signature`

**Solutions:**

1. **Clear browser localStorage:**
```javascript
// In browser console
localStorage.clear()
```

2. **Check JWT_SECRET in backend/.env:**
```env
JWT_SECRET=your_very_secure_random_secret_minimum_32_characters
```

3. **Re-login** to get new token

---

## Database Migration Issues

### Need to reset database?

**WARNING: This deletes all data!**

```bash
# Connect to MongoDB
mongosh

# Switch to database
use edtech-assessment

# Drop all collections
db.dropDatabase()

# Restart backend server
```

---

## Environment Variables Not Loading

### Symptoms: `undefined` values, connection errors

**Solutions:**

1. **Check .env file exists:**
```bash
ls -la backend/.env
```

2. **Copy from example:**
```bash
cp backend/.env.example backend/.env
```

3. **Verify dotenv is loaded in server.js:**
```javascript
require('dotenv').config();  // Should be first line
```

4. **Restart server** after changing .env

---

## File Upload Errors

### Error: `File too large`

**Solution:** File exceeds 10MB limit.

**Options:**
1. Use smaller image
2. Compress image before upload
3. Increase limit in `backend/.env`:
```env
MAX_FILE_SIZE=20971520  # 20MB
```

### Error: `Invalid file type`

**Solution:** Only image files allowed.

**Check allowed types in .env:**
```env
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp
```

---

## Cannot Access Backend API

### Error: Network request failed

**Checklist:**

1. ✅ Backend server running? (`npm run dev`)
2. ✅ Correct URL in `frontend/.env`?
```env
REACT_APP_API_URL=http://localhost:5000/api
```
3. ✅ Test backend directly:
```bash
curl http://localhost:5000/api/health
```

---

## Production Deployment Issues

### Error: Modules not found in production

**Solution:**
```bash
# Ensure devDependencies are not used in production
# Check package.json - nodemon should be in devDependencies

# Install only production dependencies
npm ci --only=production
```

### Error: Environment variables not set

**Solution:** Use platform-specific secrets:
- **Heroku:** `heroku config:set KEY=value`
- **Vercel:** Project Settings → Environment Variables
- **AWS:** Use AWS Secrets Manager or Parameter Store

---

## Still Having Issues?

### Debug Steps:

1. **Check all services are running:**
```bash
# MongoDB
mongosh

# Backend
curl http://localhost:5000/api/health

# Frontend
# Open http://localhost:3000 in browser
```

2. **Check logs:**
```bash
# Backend logs show detailed errors
npm run dev

# Look for red error messages
```

3. **Verify all credentials:**
```bash
# Create test script
node backend/test-config.js
```

4. **Test each API separately:**
   - See [API_EXAMPLES.md](API_EXAMPLES.md) for curl commands

5. **Check versions:**
```bash
node --version  # Should be v16+
npm --version
mongosh --version
```

---

## Quick Reset (Last Resort)

**If everything is broken:**

```bash
# 1. Delete node_modules
rm -rf backend/node_modules frontend/node_modules

# 2. Delete package-lock.json
rm backend/package-lock.json frontend/package-lock.json

# 3. Reinstall
cd backend && npm install
cd ../frontend && npm install

# 4. Reset database
mongosh
> use edtech-assessment
> db.dropDatabase()
> exit

# 5. Check .env files
cat backend/.env
cat frontend/.env

# 6. Restart everything
cd backend && npm run dev
# In another terminal:
cd frontend && npm start
```

---

Need more help? Check the [SETUP_GUIDE.md](SETUP_GUIDE.md) or create an issue!
