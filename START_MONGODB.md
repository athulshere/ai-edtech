# How to Start MongoDB

## Quick Commands

### macOS

```bash
# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community

# Restart MongoDB
brew services restart mongodb-community

# Check status
brew services list | grep mongodb
```

### Linux (Ubuntu/Debian)

```bash
# Start MongoDB
sudo systemctl start mongod

# Stop MongoDB
sudo systemctl stop mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check status
sudo systemctl status mongod

# Enable auto-start on boot
sudo systemctl enable mongod
```

### Windows

**Using Services:**
1. Press `Win + R`
2. Type `services.msc`
3. Find "MongoDB Server"
4. Right-click → Start

**Using Command Line (as Administrator):**
```bash
# Start
net start MongoDB

# Stop
net stop MongoDB
```

## Verify MongoDB is Running

```bash
# Test connection
mongosh

# Or check the port
netstat -an | grep 27017  # Linux/Mac
netstat -an | findstr 27017  # Windows
```

Expected output when connected:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/
Using MongoDB: 7.0.x
```

## First Time Setup

### macOS

```bash
# Install MongoDB (if not installed)
brew tap mongodb/brew
brew install mongodb-community

# Create data directory
sudo mkdir -p /usr/local/var/mongodb
sudo chown -R $(whoami) /usr/local/var/mongodb

# Start MongoDB
brew services start mongodb-community
```

### Linux (Ubuntu)

```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Windows

1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run installer
3. Choose "Complete" installation
4. Install as Windows Service ✓
5. Install MongoDB Compass (optional GUI) ✓

## Using MongoDB Atlas (Cloud Alternative)

If you don't want to install MongoDB locally:

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a free M0 cluster
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (for testing)
6. Get connection string
7. Update `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edtech-assessment?retryWrites=true&w=majority
```

## Troubleshooting

### MongoDB won't start

**macOS:**
```bash
# Check logs
tail -f /usr/local/var/log/mongodb/mongo.log

# Fix permissions
sudo chown -R $(whoami) /usr/local/var/mongodb
sudo chown -R $(whoami) /usr/local/var/log/mongodb
```

**Linux:**
```bash
# Check logs
sudo journalctl -u mongod -f

# Or
tail -f /var/log/mongodb/mongod.log
```

### Port 27017 already in use

```bash
# Find process using port
lsof -i :27017

# Kill the process
kill -9 <PID>

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod  # Linux
```

### Can't connect to MongoDB

1. **Check if running:**
```bash
ps aux | grep mongod
```

2. **Check firewall (Linux):**
```bash
sudo ufw allow 27017
```

3. **Try IPv4 instead of localhost:**
In `backend/.env`:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/edtech-assessment
```

## MongoDB Compass (GUI)

For a visual interface:

1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Connect to: `mongodb://localhost:27017`
3. Browse databases and collections visually

## Basic MongoDB Commands

```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use our database
use edtech-assessment

# Show collections
show collections

# View users
db.users.find()

# View students
db.students.find()

# View assessments
db.assessments.find()

# Count documents
db.assessments.countDocuments()

# Clear a collection (careful!)
db.assessments.deleteMany({})

# Drop database (very careful!)
db.dropDatabase()

# Exit
exit
```

## Quick Health Check

Run this to verify everything is working:

```bash
# 1. Check MongoDB is running
mongosh --eval "db.version()"

# 2. Should output version like: 7.0.x
```

---

**Now start your backend server:**
```bash
cd backend
npm run dev
```

You should see:
```
MongoDB Connected: 127.0.0.1
Server is running on port 5000
```

✅ Ready to go!
