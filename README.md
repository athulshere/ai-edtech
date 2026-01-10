# AI-Powered Educational Assessment & Analytics Platform

A comprehensive EdTech solution that uses advanced AI to analyze student answer sheets, provide intelligent grading and feedback, track long-term learning patterns, and deliver actionable insights. Built for schools to understand each student's historical learning traits and provide personalized educational experiences at scale.

## Features

### Core Features
- **AI-Powered Grading**: Automated assessment evaluation with intelligent mistake detection and analysis
- **Historical Learning Analytics**: Long-term tracking of each student's learning patterns, strengths, and weaknesses across time
- **Personalized Feedback**: Context-aware feedback based on individual student's learning history and patterns
- **Multi-User System**: Dedicated interfaces for parents, teachers, and administrators
- **Answer Sheet Analysis**: Computer vision-powered text extraction from handwritten or printed answer sheets
- **Pattern Recognition**: Identifies recurring mistake patterns and learning gaps across assessments
- **Smart Dashboards**: Comprehensive analytics for progress monitoring and decision-making
- **Bulk Upload**: Efficient processing of multiple assessments for large classrooms
- **Interactive Games**: Educational games integrated with learning profiles for engagement
- **Student Profiles**: Detailed learning profiles tracking historical performance, behavioral traits, and growth metrics
- **Secure Storage**: Cloud-based storage with AWS S3 for assessment images and data

### Advanced Capabilities
- **Longitudinal Analysis**: Track student performance trajectories over months and years
- **Predictive Insights**: Identify potential learning challenges before they become critical
- **Personalized Learning Paths**: Recommendations based on historical data and learning patterns
- **Cross-Subject Correlation**: Understand connections between performance in different subjects
- **Cohort Analytics**: Compare student progress within grade levels while maintaining privacy
- **Real-time Processing**: Asynchronous processing for immediate feedback delivery
- **Scalable Architecture**: Built to handle hundreds of students across multiple classes and grades

## Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM for scalable data storage
- **Authentication**: JWT (JSON Web Tokens) with role-based access control
- **AI Services**:
  - Google Cloud Vision API (Text extraction from answer sheets)
  - OpenAI GPT-4 (Intelligent grading, analysis, and feedback generation)
- **Cloud Storage**: AWS S3 for secure image storage
- **Security**: Helmet, CORS, Rate Limiting, bcrypt password hashing

### Frontend
- **Framework**: React.js with modern hooks and context patterns
- **Routing**: React Router for multi-page navigation
- **State Management**: Context API for global state
- **HTTP Client**: Axios for API communication
- **UI/Notifications**: React Toastify for user feedback
- **Styling**: Modern CSS with responsive design and animations
- **Charts**: Recharts for data visualization and analytics

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

1. **Upload**: Teachers or parents upload answer sheet images (individual or bulk upload)
2. **Secure Storage**: Images stored in AWS S3 with encryption and access control
3. **Text Extraction**: Google Vision API extracts text from handwritten or printed answer sheets
4. **AI-Powered Analysis**: OpenAI GPT-4 performs intelligent grading:
   - Evaluates answers against expected responses
   - Identifies mistakes and categorizes error types
   - Analyzes reasoning and partial credit scenarios
   - Generates constructive, personalized feedback
   - Suggests targeted improvement areas
5. **Historical Pattern Analysis**: System updates student's long-term learning profile:
   - Tracks recurring mistake patterns across subjects
   - Identifies knowledge gaps and strengths
   - Updates behavioral learning traits
   - Builds comprehensive academic history
6. **Dashboard Updates**: Results immediately available with:
   - Detailed grading breakdown
   - Visual analytics and progress charts
   - Personalized recommendations
   - Historical performance comparisons

### Intelligent Grading System

**What Makes Our Grading Different:**
- **Context-Aware**: Understands partial credit and partial understanding
- **Historical Context**: Considers student's past performance and learning patterns
- **Nuanced Analysis**: Goes beyond right/wrong to understand why mistakes happen
- **Constructive Feedback**: Provides actionable guidance, not just corrections
- **Pattern Recognition**: Identifies systematic issues vs. one-off mistakes
- **Personalized**: Adapts feedback style based on student's learning profile

**Mistake Categories:**
- **Conceptual**: Fundamental misunderstanding of core concepts
- **Calculation**: Mathematical or computational errors
- **Procedural**: Correct concept but wrong method or steps
- **Formatting**: Presentation or structural issues
- **Incomplete**: Missing components or insufficient detail
- **Misinterpretation**: Question misunderstanding
- **Careless**: Simple errors despite understanding

**Comprehensive Feedback:**
- Specific identification of each mistake with explanations
- Why the answer is incorrect and what the correct approach is
- Related concepts to review for deeper understanding
- Personalized study recommendations based on history
- Encouragement and recognition of improvements
- Actionable next steps for mastery

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

## Use Cases

### For Large Schools
- **Scalable Assessment**: Process hundreds of answer sheets efficiently
- **Historical Tracking**: Maintain comprehensive records of every student's learning journey
- **Early Intervention**: Identify struggling students before it's too late
- **Resource Optimization**: Focus teaching efforts where they're most needed
- **Data-Driven Decisions**: Make informed decisions about curriculum and teaching methods

### For Teachers
- **Time Savings**: Automate grading while maintaining quality feedback
- **Deeper Insights**: Understand each student's unique learning patterns
- **Personalized Teaching**: Adapt teaching strategies based on data
- **Progress Monitoring**: Track class-wide and individual progress effortlessly
- **Parent Communication**: Share detailed, data-backed progress reports

### For Parents
- **Transparency**: Complete visibility into child's academic performance
- **Early Awareness**: Know about learning challenges immediately
- **Engagement**: Stay involved with detailed progress tracking
- **Personalized Support**: Understand exactly where to help at home

## Future Enhancements

### Advanced Analytics & Visualization
- Interactive progress charts and trend analysis
- Comparative analysis across time periods and cohorts
- Subject-wise and topic-wise performance heat maps
- Predictive models for learning outcome forecasting
- Custom report generation for parent-teacher meetings

### Machine Learning Integration
- Custom ML models trained on school-specific data
- Automated difficulty level adjustment per student
- Intelligent question bank generation
- Learning style detection and adaptation
- Early warning systems for at-risk students

### Collaboration Features
- Teacher-parent-student messaging system
- Assignment creation and digital distribution
- Class-wide analytics dashboards for administrators
- Collaborative study group recommendations
- Peer learning insights and pairing

### Gamification & Engagement
- Achievement badges and milestone celebrations
- Learning streaks and consistency tracking
- Progress challenges and goal setting
- Optional leaderboards (with privacy controls)
- Reward systems integrated with learning objectives

### Extended Capabilities
- Multi-language support for diverse schools
- Mobile applications (iOS & Android)
- Offline mode for assessment uploads
- Integration with existing school management systems
- Export capabilities for external reporting

## Why This Platform?

Traditional assessment systems focus on grades. This platform focuses on **understanding learning**.

- **Beyond Grades**: We don't just tell you what score a student got; we explain why, identify patterns, and predict future challenges
- **Long-Term Vision**: Built for longitudinal analysis across years, not just individual tests
- **Scale Meets Personalization**: Handles hundreds of students while maintaining individual attention
- **Actionable Intelligence**: Every insight is designed to drive better teaching and learning decisions
- **Historical Context**: Every assessment is viewed in the context of the student's complete learning history

## Contributing

Contributions for bug fixes, features, and enhancements are welcome. This is an evolving platform designed to grow with educational needs.

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.

---

**Transforming education through intelligent assessment and long-term learning analytics**
