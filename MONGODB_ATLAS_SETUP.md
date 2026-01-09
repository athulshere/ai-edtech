# MongoDB Atlas Setup Guide

Since MongoDB is not installed locally, use MongoDB Atlas (cloud database) - it's free and takes 5 minutes!

## Step-by-Step Setup

### 1. Create MongoDB Atlas Account

Visit: **https://www.mongodb.com/cloud/atlas/register**

- Sign up with Google, GitHub, or email
- Verify your email

### 2. Create a Free Cluster

1. After login, click **"Build a Database"** (or "Create" if you see that)
2. Choose **FREE** tier (M0 Sandbox - always free)
3. Select cloud provider: **AWS** (recommended)
4. Select region: Choose closest to you (e.g., `us-east-1` for USA)
5. Cluster Name: Keep default or name it `edtech-cluster`
6. Click **"Create"** (this takes 1-3 minutes)

### 3. Create Database User

1. Go to **Security → Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `edtech_user`
5. Password: Click **"Autogenerate Secure Password"** and **COPY IT!**
   - Example: `MyP@ssw0rd123` (save this - you'll need it!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 4. Allow Network Access

1. Go to **Security → Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. For testing/development, click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (allows all IPs)
   - ⚠️ For production, restrict to specific IPs
4. Click **"Confirm"**

### 5. Get Connection String

1. Go back to **Database** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string:

```
mongodb+srv://edtech_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Update Your .env File

1. Open `backend/.env`
2. Replace the `MONGODB_URI` line with your connection string:

```env
MONGODB_URI=mongodb+srv://edtech_user:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/edtech-assessment?retryWrites=true&w=majority
```

**IMPORTANT Changes:**
- Replace `<password>` with the actual password you saved in Step 3
- Add `/edtech-assessment` before the `?` to specify the database name
- The `xxxxx` will be your actual cluster ID from Atlas

**Example:**
```env
# If your password is: MyP@ssw0rd123
# And your cluster is: cluster0.abc12.mongodb.net
MONGODB_URI=mongodb+srv://edtech_user:MyP@ssw0rd123@cluster0.abc12.mongodb.net/edtech-assessment?retryWrites=true&w=majority
```

### 7. Test the Connection

```bash
# Restart your backend server
cd backend
npm run dev
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server is running on port 5000 in development mode
```

✅ Success!

## Troubleshooting

### Error: "Authentication failed"
- Double-check username and password
- Make sure you replaced `<password>` with actual password
- Password might have special characters - URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`

### Error: "IP not whitelisted"
- Go back to Network Access
- Make sure `0.0.0.0/0` is added
- Wait 2-3 minutes for changes to propagate

### Error: "Could not connect to server"
- Check your internet connection
- Verify cluster is active (not paused)
- Check connection string is correct

## View Your Data

### Using MongoDB Compass (GUI)

1. Download: https://www.mongodb.com/try/download/compass
2. Install and open
3. Paste your connection string
4. Click "Connect"
5. Browse your databases visually!

### Using Atlas Web Interface

1. Go to your cluster in Atlas
2. Click **"Browse Collections"**
3. View data directly in browser

## Pricing

- **M0 (Free Tier):**
  - 512 MB storage
  - Shared RAM
  - Perfect for development and testing
  - **Always free!**

- You can upgrade later if needed, but M0 is enough for this project

## Alternative: Install MongoDB Locally (If You Prefer)

If you want to fix Homebrew permissions and install locally:

```bash
# Fix Homebrew permissions
sudo chown -R $(whoami) /opt/homebrew/Cellar
sudo chown -R $(whoami) /opt/homebrew/Library/Taps

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Then use this in .env:
MONGODB_URI=mongodb://127.0.0.1:27017/edtech-assessment
```

## Need Help?

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB University (free courses): https://university.mongodb.com/
- Ask in MongoDB Community Forums: https://www.mongodb.com/community/forums/

---

**Recommended:** Use MongoDB Atlas for now - it's easier, faster, and you can always switch to local later!
