# AI-Powered Student Assessment Platform

An intelligent educational platform that uses AI to analyze student handwriting, identify mistakes, provide personalized feedback, and track learning progress over time.

## Features

### Phase 1 (Current Implementation)
- **User Authentication**: Separate login for parents and teachers
- **Handwriting Recognition**: Google Vision API integration for OCR
- **AI Analysis**: OpenAI GPT-4 for mistake identification and personalized feedback
- **Image Storage**: AWS S3 for secure assessment storage
- **Student Profiles**: Track learning patterns and progress
- **Parent Dashboard**: Monitor individual child's progress
- **Teacher Dashboard**: Manage multiple students
- **Real-time Processing**: Asynchronous assessment analysis

### Future Phases (Planned)
- Machine Learning pattern recognition across historical data
- Personalized test generation based on weaknesses
- Progress analytics and visualization
- Predictive insights for learning outcomes
- Multi-language support
- Mobile application
- Collaborative features for teachers and parents

## Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Services**:
  - Google Cloud Vision API (Handwriting OCR)
  - OpenAI GPT-4 (Answer analysis)
- **Cloud Storage**: AWS S3
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React.js with TypeScript
- **Routing**: React Router
- **State Management**: Context API
- **HTTP Client**: Axios
- **UI/Notifications**: React Toastify
- **Charts**: Recharts (for future analytics)

## Project Structure

```
edtech/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── studentController.js
│   │   │   └── assessmentController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Student.js
│   │   │   └── Assessment.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── students.js
│   │   │   └── assessments.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── services/
│   │   │   ├── googleVision.js
│   │   │   ├── openai.js
│   │   │   └── aws.js
│   │   └── server.js
│   ├── uploads/
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   ├── Login.tsx
    │   │   │   ├── Register.tsx
    │   │   │   └── Auth.css
    │   │   ├── dashboard/
    │   │   │   ├── ParentDashboard.tsx
    │   │   │   ├── TeacherDashboard.tsx
    │   │   │   └── Dashboard.css
    │   │   └── assessment/
    │   │       ├── AssessmentUpload.tsx
    │   │       └── Assessment.css
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   ├── App.css
    │   └── index.tsx
    ├── package.json
    └── .env.example
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Cloud Platform account (for Vision API)
- OpenAI API account
- AWS account (for S3)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update `.env` with your credentials:
```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/edtech-assessment

# JWT
JWT_SECRET=your_very_secure_random_secret_key
JWT_EXPIRE=7d

# Google Cloud Vision API
GOOGLE_APPLICATION_CREDENTIALS=./config/google-vision-credentials.json

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=edtech-assessment-images

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp

# CORS
CORS_ORIGIN=http://localhost:3000
```

4. **Google Cloud Vision Setup**

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing
- Enable Cloud Vision API
- Create a service account
- Download the JSON credentials file
- Save as `backend/src/config/google-vision-credentials.json`

5. **AWS S3 Setup**

- Create an S3 bucket in AWS Console
- Configure IAM user with S3 permissions
- Note the Access Key ID and Secret Access Key
- Update `.env` with your AWS credentials

6. **Start the backend server**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update if needed:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

4. **Start the development server**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Students
- `POST /api/students` - Create student (parent/teacher)
- `GET /api/students` - Get all students (filtered by role)
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `GET /api/students/:studentId/progress` - Get student progress

### Assessments
- `POST /api/assessments/upload` - Upload and analyze assessment
- `GET /api/assessments/:id` - Get assessment details
- `GET /api/assessments/student/:studentId` - Get student assessments
- `POST /api/assessments/personalized-test` - Generate personalized test

## Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: ['parent', 'teacher', 'admin'],
  phoneNumber: String,
  profileImage: String,
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Student Model
```javascript
{
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  grade: String,
  parentId: ObjectId (ref: User),
  teacherIds: [ObjectId (ref: User)],
  studentId: String (unique, auto-generated),
  profileImage: String,
  subjects: [String],
  learningProfile: {
    strengths: [String],
    weaknesses: [String],
    learningStyle: String,
    commonMistakePatterns: [{
      subject: String,
      pattern: String,
      frequency: Number,
      lastOccurrence: Date
    }]
  },
  isActive: Boolean,
  timestamps: true
}
```

### Assessment Model
```javascript
{
  studentId: ObjectId (ref: Student),
  subject: String,
  topic: String,
  grade: String,
  assessmentType: ['exam', 'quiz', 'homework', 'practice'],
  originalImage: {
    url: String,
    s3Key: String,
    uploadedAt: Date
  },
  extractedText: String,
  questions: [{
    questionNumber: Number,
    questionText: String,
    studentAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    score: Number,
    maxScore: Number
  }],
  aiAnalysis: {
    overallScore: Number,
    totalScore: Number,
    mistakes: [{
      questionNumber: Number,
      mistakeType: String,
      description: String,
      suggestion: String,
      relatedConcepts: [String]
    }],
    strengths: [String],
    areasForImprovement: [String],
    personalizedFeedback: String,
    recommendedTopics: [String],
    difficultyLevel: String
  },
  teacherId: ObjectId (ref: User),
  status: ['pending', 'processing', 'completed', 'failed'],
  processingTime: Number,
  viewedByParent: Boolean,
  viewedByTeacher: Boolean,
  timestamps: true
}
```

## How It Works

### Assessment Processing Flow

1. **Upload**: Parent/teacher uploads handwritten assessment image
2. **Storage**: Image saved to AWS S3 with secure access
3. **OCR**: Google Vision API extracts text from handwriting
4. **AI Analysis**: OpenAI analyzes the extracted text:
   - Identifies questions and answers
   - Detects mistakes and categorizes them
   - Generates personalized feedback
   - Suggests improvement areas
5. **Pattern Learning**: Updates student learning profile
6. **Notification**: Results available in dashboard

### AI Analysis Categories

**Mistake Types:**
- Conceptual: Misunderstanding of core concepts
- Calculation: Mathematical/computational errors
- Formatting: Presentation or structure issues
- Incomplete: Missing parts or incomplete answers
- Misunderstanding: Misinterpretation of questions

**Feedback Includes:**
- Specific mistake identification
- Clear explanations of errors
- Actionable improvement suggestions
- Related concepts to study
- Personalized recommendations

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Role-based access control
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation
- File type and size restrictions

## Future Enhancements

### Phase 2: Advanced Analytics
- Progress visualization with charts
- Comparative analysis across time periods
- Subject-wise performance metrics
- Peer comparison (anonymized)

### Phase 3: Machine Learning
- Custom ML models for pattern recognition
- Predictive analytics for learning outcomes
- Automated difficulty adjustment
- Smart question generation

### Phase 4: Collaboration
- Teacher-parent messaging
- Assignment creation and distribution
- Class-wide analytics for teachers
- Group study recommendations

### Phase 5: Gamification
- Achievement badges
- Learning streaks
- Progress milestones
- Leaderboards (optional)

## Contributing

This is a Phase 1 implementation. Contributions for bug fixes and enhancements are welcome.

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for better education through AI**
