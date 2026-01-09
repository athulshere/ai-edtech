# Commands Reference - EdTech School Management System

## Quick Commands

### Start Everything
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

---

## Backend Commands

### Setup
```bash
cd backend
npm install                    # Install dependencies
node migrate-to-new-schema.js  # Run migration
```

### Development
```bash
npm run dev                    # Start with nodemon (auto-reload)
npm start                      # Start production server
```

### Database Operations
```bash
# Run migration
node migrate-to-new-schema.js

# Check MongoDB connection
mongo "mongodb+srv://your-connection-string"
```

---

## Frontend Commands

### Setup
```bash
cd frontend
npm install                    # Install dependencies
```

### Development
```bash
npm start                      # Start dev server (port 3000)
npm run build                  # Build for production
npm test                       # Run tests
```

---

## MongoDB Commands

### Using MongoDB Shell
```javascript
// Connect to database
use edtech_db

// View collections
show collections

// Find users
db.users.find().pretty()

// Update user to admin
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)

// Find schools
db.schools.find().pretty()

// Find classes
db.classes.find().pretty()

// Find sections with student counts
db.sections.find({}, { name: 1, code: 1, currentStudents: 1 }).pretty()

// Count documents
db.users.countDocuments({ role: "admin" })
db.classes.countDocuments()
db.sections.countDocuments()
db.students.countDocuments()
```

---

## API Testing with cURL

### Get JWT Token
```bash
# Login and extract token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.token'
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get Classes
```bash
curl http://localhost:5000/api/classes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Class
```bash
curl -X POST http://localhost:5000/api/classes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grade 5",
    "code": "G5",
    "level": 5,
    "capacity": 50,
    "academicYear": {
      "start": 2024,
      "end": 2025
    }
  }'
```

### Get Sections
```bash
curl http://localhost:5000/api/sections \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Section
```bash
curl -X POST http://localhost:5000/api/sections \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "classId": "CLASS_ID_HERE",
    "name": "A",
    "roomNumber": "101",
    "floor": "First",
    "capacity": 50
  }'
```

### Get School
```bash
curl http://localhost:5000/api/schools/SCHOOL_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Git Commands

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit - Phase 1 complete"
```

### Daily Workflow
```bash
git status                     # Check status
git add .                      # Stage all changes
git commit -m "Description"    # Commit changes
git push origin main           # Push to remote
```

### Branching
```bash
git checkout -b feature-name   # Create new branch
git checkout main              # Switch to main
git merge feature-name         # Merge branch
```

---

## Docker Commands (Optional)

### Backend Dockerfile
```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Frontend Dockerfile
```dockerfile
FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```bash
docker-compose up              # Start all services
docker-compose down            # Stop all services
docker-compose logs            # View logs
```

---

## Useful npm Scripts

### Add to package.json
```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest",
    "migrate": "node migrate-to-new-schema.js",
    "seed": "node scripts/seed-data.js"
  }
}
```

---

## Environment Variables

### Backend .env
```bash
# Check if variable is set
echo $PORT

# Set temporary variable
export PORT=5000

# Use in command
PORT=5000 npm run dev
```

### Frontend .env
```bash
# React requires REACT_APP_ prefix
echo $REACT_APP_API_URL

# Set for development
export REACT_APP_API_URL=http://localhost:5000
```

---

## Debugging Commands

### Check Running Processes
```bash
# Find process on port
lsof -i :5000
lsof -i :3000

# Kill process
kill -9 PROCESS_ID

# Check Node processes
ps aux | grep node
```

### View Logs
```bash
# Backend logs
tail -f backend/logs/app.log

# Frontend build
npm run build -- --verbose

# Check npm cache
npm cache clean --force
```

### Network Debugging
```bash
# Test MongoDB connection
nc -zv cluster.mongodb.net 27017

# Test API endpoint
curl -v http://localhost:5000/api/health

# Check DNS
nslookup cluster.mongodb.net

# Ping server
ping cluster.mongodb.net
```

---

## Useful One-Liners

### Backend
```bash
# Find all TODO comments
grep -r "TODO" backend/src/

# Count lines of code
find backend/src -name "*.js" | xargs wc -l

# Find large files
find backend -size +1M

# Check package versions
npm list --depth=0
```

### Frontend
```bash
# Find unused dependencies
npm-check

# Update all dependencies
npm update

# Audit security
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy to Heroku (Example)
```bash
# Backend
cd backend
heroku create your-app-name
git push heroku main

# Frontend (separate app)
cd frontend
heroku create your-frontend-name
heroku buildpacks:set mars/create-react-app
git push heroku main
```

### Environment Setup
```bash
# Heroku config
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set OPENAI_API_KEY=your_key

# View config
heroku config

# View logs
heroku logs --tail
```

---

## Backup & Restore

### MongoDB Backup
```bash
# Dump database
mongodump --uri="mongodb+srv://..." --out=./backup

# Restore database
mongorestore --uri="mongodb+srv://..." ./backup
```

### Code Backup
```bash
# Create tarball
tar -czf edtech-backup-$(date +%Y%m%d).tar.gz edtech/

# Extract tarball
tar -xzf edtech-backup-20240108.tar.gz
```

---

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test endpoint
ab -n 1000 -c 10 http://localhost:5000/api/health

# With authentication
ab -n 1000 -c 10 -H "Authorization: Bearer TOKEN" \
   http://localhost:5000/api/classes
```

### Monitor Resource Usage
```bash
# CPU and memory
top

# Node process memory
node --max-old-space-size=4096 src/server.js

# Check disk usage
df -h
```

---

## Quick Fixes

### Clear npm Cache
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Reset Database (Development Only)
```bash
# Drop database
mongo "mongodb://localhost/edtech_db" --eval "db.dropDatabase()"

# Run migration again
node migrate-to-new-schema.js
```

### Fix Port Already in Use
```bash
# Kill process on port 5000
kill -9 $(lsof -t -i:5000)

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)
```

---

## Maintenance Commands

### Update Dependencies
```bash
# Check outdated packages
npm outdated

# Update to latest minor versions
npm update

# Update to latest major versions
npm install package-name@latest
```

### Security Audit
```bash
# Check vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (may break)
npm audit fix --force
```

---

## Aliases (Add to .bashrc or .zshrc)

```bash
# Backend
alias be='cd ~/edtech/backend && npm run dev'

# Frontend
alias fe='cd ~/edtech/frontend && npm start'

# Both
alias start-edtech='cd ~/edtech && (cd backend && npm run dev &) && (cd frontend && npm start)'

# Migration
alias migrate='cd ~/edtech/backend && node migrate-to-new-schema.js'

# Logs
alias logs='tail -f ~/edtech/backend/logs/app.log'
```

---

## Keyboard Shortcuts (VS Code)

```
Ctrl + `        - Toggle terminal
Ctrl + Shift + ` - New terminal
Ctrl + P        - Quick open file
Ctrl + Shift + F - Search in files
Ctrl + B        - Toggle sidebar
F5              - Start debugging
```

---

**Remember:** Always test commands in development before running in production!
