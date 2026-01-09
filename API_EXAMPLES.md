# API Examples & Test Cases

This document provides example API requests for testing the platform.

## Authentication

### Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Parent",
    "email": "john.parent@example.com",
    "password": "password123",
    "role": "parent",
    "phoneNumber": "+1234567890"
  }'
```

**Response:**
```json
{
  "_id": "64abc123...",
  "firstName": "John",
  "lastName": "Parent",
  "email": "john.parent@example.com",
  "role": "parent",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.parent@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "_id": "64abc123...",
  "firstName": "John",
  "lastName": "Parent",
  "email": "john.parent@example.com",
  "role": "parent",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Get Profile

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Students Management

### Create Student

```bash
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Emma",
    "lastName": "Smith",
    "dateOfBirth": "2012-05-15",
    "grade": "6",
    "subjects": ["Mathematics", "Science", "English"]
  }'
```

**Response:**
```json
{
  "_id": "64xyz789...",
  "firstName": "Emma",
  "lastName": "Smith",
  "studentId": "STU000001",
  "grade": "6",
  "parentId": "64abc123...",
  "subjects": ["Mathematics", "Science", "English"],
  "learningProfile": {
    "strengths": [],
    "weaknesses": [],
    "commonMistakePatterns": []
  },
  "createdAt": "2024-01-08T...",
  "updatedAt": "2024-01-08T..."
}
```

### Get All Students (Parent View)

```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "_id": "64xyz789...",
    "firstName": "Emma",
    "lastName": "Smith",
    "studentId": "STU000001",
    "grade": "6",
    "parentId": {
      "_id": "64abc123...",
      "firstName": "John",
      "lastName": "Parent",
      "email": "john.parent@example.com"
    },
    "subjects": ["Mathematics", "Science", "English"],
    "learningProfile": {...}
  }
]
```

### Get Student Progress

```bash
curl -X GET "http://localhost:5000/api/students/64xyz789/progress?subject=Mathematics&timeframe=30" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "totalAssessments": 5,
  "averageScore": "78.50",
  "scoresTrend": [
    {
      "date": "2024-01-01T...",
      "score": 75,
      "subject": "Mathematics"
    },
    {
      "date": "2024-01-05T...",
      "score": 82,
      "subject": "Mathematics"
    }
  ],
  "mistakesByType": {
    "calculation": 8,
    "conceptual": 3,
    "formatting": 2
  },
  "topWeaknesses": ["Fractions", "Word Problems"],
  "topStrengths": ["Geometry", "Basic Arithmetic"],
  "subjectPerformance": {
    "Mathematics": {
      "count": 5,
      "totalScore": 392,
      "averageScore": "78.40"
    }
  }
}
```

## Assessment Upload & Analysis

### Upload Assessment (Using Form Data)

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/assessments/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/handwritten-test.jpg" \
  -F "studentId=64xyz789" \
  -F "subject=Mathematics" \
  -F "topic=Algebra - Linear Equations" \
  -F "assessmentType=homework"
```

**Using JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('studentId', '64xyz789');
formData.append('subject', 'Mathematics');
formData.append('topic', 'Algebra - Linear Equations');
formData.append('assessmentType', 'homework');

fetch('http://localhost:5000/api/assessments/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

**Response:**
```json
{
  "message": "Assessment uploaded successfully. Processing in progress...",
  "assessmentId": "64def456...",
  "status": "processing"
}
```

### Get Assessment Details

```bash
curl -X GET http://localhost:5000/api/assessments/64def456 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (After Processing):**
```json
{
  "_id": "64def456...",
  "studentId": {
    "_id": "64xyz789...",
    "firstName": "Emma",
    "lastName": "Smith",
    "studentId": "STU000001",
    "grade": "6"
  },
  "subject": "Mathematics",
  "topic": "Algebra - Linear Equations",
  "grade": "6",
  "assessmentType": "homework",
  "originalImage": {
    "url": "https://s3.amazonaws.com/...",
    "s3Key": "assessments/64xyz789/64def456/...",
    "uploadedAt": "2024-01-08T..."
  },
  "extractedText": "1. Solve for x: 2x + 5 = 13\n   Student answer: x = 9\n...",
  "questions": [
    {
      "questionNumber": 1,
      "questionText": "Solve for x: 2x + 5 = 13",
      "studentAnswer": "x = 9",
      "correctAnswer": "x = 4",
      "isCorrect": false,
      "score": 0,
      "maxScore": 10
    }
  ],
  "aiAnalysis": {
    "overallScore": 65,
    "totalScore": 100,
    "mistakes": [
      {
        "questionNumber": 1,
        "mistakeType": "calculation",
        "description": "Incorrect subtraction: 13 - 5 should equal 8, not 18",
        "suggestion": "Review subtraction of single-digit numbers. Practice: 13 - 5 = ?",
        "relatedConcepts": ["Basic Arithmetic", "Subtraction"]
      }
    ],
    "strengths": [
      "Good understanding of equation structure",
      "Proper notation and formatting"
    ],
    "areasForImprovement": [
      "Basic arithmetic accuracy",
      "Double-checking calculations"
    ],
    "personalizedFeedback": "Emma shows good understanding of algebraic concepts and proper mathematical notation. However, there are calculation errors in basic arithmetic that affect final answers. Focus on double-checking arithmetic operations, especially subtraction. Consider practicing mental math for single-digit operations.",
    "recommendedTopics": [
      "Basic Arithmetic Review",
      "Order of Operations",
      "Multi-step Equations"
    ],
    "difficultyLevel": "intermediate"
  },
  "status": "completed",
  "processingTime": 45230,
  "viewedByParent": false,
  "viewedByTeacher": false,
  "createdAt": "2024-01-08T...",
  "updatedAt": "2024-01-08T..."
}
```

### Get Student Assessments

```bash
curl -X GET "http://localhost:5000/api/assessments/student/64xyz789?subject=Mathematics&status=completed&limit=10&page=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "assessments": [
    {
      "_id": "64def456...",
      "subject": "Mathematics",
      "topic": "Algebra - Linear Equations",
      "assessmentType": "homework",
      "aiAnalysis": {
        "overallScore": 65
      },
      "status": "completed",
      "createdAt": "2024-01-08T..."
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 2
  }
}
```

### Generate Personalized Test

```bash
curl -X POST http://localhost:5000/api/assessments/personalized-test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "64xyz789",
    "subject": "Mathematics",
    "difficulty": "intermediate"
  }'
```

**Response:**
```json
{
  "test": {
    "testTitle": "Personalized Mathematics Practice - Focusing on Fractions and Word Problems",
    "questions": [
      {
        "questionNumber": 1,
        "question": "Sarah has 3/4 of a pizza. She gives 1/3 of what she has to her friend. How much pizza does Sarah have left?",
        "type": "problem-solving",
        "difficulty": "medium",
        "targetedWeakness": "Fractions",
        "hints": [
          "First, find 1/3 of 3/4",
          "Then subtract from the original amount"
        ],
        "correctAnswer": "1/2 of a pizza"
      },
      {
        "questionNumber": 2,
        "question": "A rectangular garden is 12 feet long and 8 feet wide. If you walk around the entire perimeter, how far have you walked?",
        "type": "problem-solving",
        "difficulty": "medium",
        "targetedWeakness": "Word Problems",
        "hints": [
          "Perimeter = sum of all sides",
          "Rectangle has 2 lengths and 2 widths"
        ],
        "correctAnswer": "40 feet"
      }
    ]
  },
  "studentName": "Emma Smith",
  "targetedWeaknesses": ["Fractions", "Word Problems"]
}
```

## Error Responses

### Authentication Error (401)
```json
{
  "message": "Not authorized, token failed"
}
```

### Validation Error (400)
```json
{
  "message": "Please fill in all required fields"
}
```

### Not Found (404)
```json
{
  "message": "Student not found"
}
```

### Server Error (500)
```json
{
  "message": "Server error during registration",
  "error": "Detailed error message"
}
```

## Testing Workflow

### Complete Test Scenario

1. **Register Parent**
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"Parent","email":"test@example.com","password":"test123","role":"parent"}' \
  | jq -r '.token')
```

2. **Create Student**
```bash
STUDENT_ID=$(curl -s -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Child","lastName":"One","dateOfBirth":"2012-01-01","grade":"6","subjects":["Math"]}' \
  | jq -r '._id')
```

3. **Upload Assessment**
```bash
ASSESSMENT_ID=$(curl -s -X POST http://localhost:5000/api/assessments/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@test.jpg" \
  -F "studentId=$STUDENT_ID" \
  -F "subject=Mathematics" \
  -F "topic=Test Topic" \
  | jq -r '.assessmentId')
```

4. **Wait and Check Results**
```bash
# Wait 60 seconds for processing
sleep 60

# Get assessment
curl -s -X GET "http://localhost:5000/api/assessments/$ASSESSMENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

## Postman Collection

You can import these as a Postman collection. Create a new collection with:

- **Variables**:
  - `base_url`: `http://localhost:5000/api`
  - `token`: (set after login)
  - `student_id`: (set after creating student)

- **Pre-request Scripts** (for authenticated requests):
```javascript
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.collectionVariables.get('token')
});
```

---

Happy testing! 🧪
