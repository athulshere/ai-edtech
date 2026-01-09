# Quick Start Guide - EdTech School Management System

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- AWS S3 account (for image uploads)
- Google Cloud Platform account (for Vision API)
- OpenAI API key

---

## Step 1: Backend Setup

### 1.1 Install Dependencies
```bash
cd backend
npm install
```

### 1.2 Run Database Migration
```bash
cd backend
node migrate-to-new-schema.js
```

### 1.3 Start Backend Server
```bash
npm run dev
```

Server should start on `http://localhost:5000`

---

## Step 2: Frontend Setup

### 2.1 Install Dependencies
```bash
cd frontend
npm install
```

### 2.2 Start Frontend
```bash
npm start
```

Frontend should open at `http://localhost:3000`

---

## Step 3: Create Admin User

Update an existing user to admin role in MongoDB:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

---

## Step 4: Test the Application

1. Login at `http://localhost:3000/login`
2. Should see Admin Dashboard
3. Click "Manage Classes"
4. Create classes and sections

---

**Ready to go!** 🚀
