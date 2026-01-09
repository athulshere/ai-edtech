# Database Schema Design - Complete School Management System

## 🗄️ Collection Overview

```
edtech_db/
├── users                    # All users (admin, teacher, parent, student)
├── schools                  # School information
├── students                 # Student profiles (existing + enhanced)
├── classes                  # Class/Grade information
├── sections                 # Sections within classes
├── subjects                 # Subject master data
├── attendance               # Daily attendance records
├── assessments              # AI-graded assessments (existing)
├── homework                 # Homework assignments
├── submissions              # Homework submissions
├── feeStructures            # Fee categories and amounts
├── feePayments              # Payment records
├── timetables               # Class schedules
├── periods                  # Period definitions
├── studyMaterials           # Uploaded study materials
├── announcements            # School/class announcements
├── messages                 # Direct messages
├── notifications            # User notifications
├── events                   # School calendar events
├── leaveRequests            # Student leave applications
└── analytics                # Cached analytics data
```

---

## 📋 Detailed Schemas

### 1. User Schema (Enhanced)

```javascript
const userSchema = new Schema({
  // Basic Info
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // hashed

  // Role & Permissions
  role: {
    type: String,
    enum: ['admin', 'teacher', 'parent', 'student'],
    required: true
  },

  // Contact
  phoneNumber: { type: String, trim: true },
  alternatePhone: { type: String, trim: true },

  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },

  // Profile
  profileImage: String, // S3 URL
  dateOfBirth: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },

  // School Association
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },

  // Role-Specific Data
  teacherData: {
    employeeId: String,
    qualification: String,
    specialization: [String],
    experience: Number, // years
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    classes: [{
      classId: { type: Schema.Types.ObjectId, ref: 'Class' },
      section: { type: Schema.Types.ObjectId, ref: 'Section' },
      subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
      isClassTeacher: Boolean
    }],
    joiningDate: Date,
    salary: Number // encrypted
  },

  parentData: {
    occupation: String,
    children: [{
      type: Schema.Types.ObjectId,
      ref: 'Student'
    }],
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    }
  },

  studentData: {
    studentProfile: { type: Schema.Types.ObjectId, ref: 'Student' }
  },

  // Account Status
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  lastLogin: Date,
  loginHistory: [{
    timestamp: Date,
    ipAddress: String,
    device: String
  }],

  // Preferences
  preferences: {
    language: { type: String, default: 'en' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1, schoolId: 1 });
userSchema.index({ 'parentData.children': 1 });
```

---

### 2. School Schema

```javascript
const schoolSchema = new Schema({
  // Basic Info
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // e.g., "SCH001"
  type: {
    type: String,
    enum: ['Primary', 'Secondary', 'Higher Secondary', 'K-12'],
    required: true
  },

  // Contact
  email: String,
  phone: String,
  website: String,

  // Address
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },

  // Admin Info
  principal: {
    name: String,
    email: String,
    phone: String
  },

  // Logo & Branding
  logo: String, // S3 URL
  primaryColor: { type: String, default: '#667eea' },
  secondaryColor: { type: String, default: '#764ba2' },

  // Academic
  establishedYear: Number,
  affiliation: String, // e.g., "CBSE", "ICSE", "State Board"
  affiliationNumber: String,

  // Configuration
  settings: {
    academicYearStart: { type: Number, default: 4 }, // April = 4
    academicYearEnd: { type: Number, default: 3 }, // March = 3
    weekStartDay: { type: Number, default: 1 }, // 1 = Monday
    workingDays: { type: [Number], default: [1,2,3,4,5,6] }, // Mon-Sat

    attendance: {
      markingTime: String, // e.g., "09:30"
      lateThreshold: Number, // minutes after which marked late
      autoNotifyParents: { type: Boolean, default: true }
    },

    fees: {
      lateFeeEnabled: { type: Boolean, default: true },
      lateFeeAmount: Number,
      lateFeePercentage: Number,
      gracePeriodDays: { type: Number, default: 3 }
    },

    homework: {
      maxFileSizeMB: { type: Number, default: 10 },
      allowedFileTypes: [String],
      autoGradingEnabled: { type: Boolean, default: true }
    }
  },

  // Status
  isActive: { type: Boolean, default: true },
  subscription: {
    plan: { type: String, enum: ['trial', 'basic', 'premium', 'enterprise'] },
    validUntil: Date,
    maxStudents: Number,
    maxTeachers: Number
  }
}, {
  timestamps: true
});
```

---

### 3. Class Schema

```javascript
const classSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },

  // Class Info
  name: { type: String, required: true }, // e.g., "Grade 5", "Class 10"
  code: { type: String, required: true }, // e.g., "G5", "C10"
  level: { type: Number, required: true }, // 1-12

  // Academic Year
  academicYear: {
    start: { type: Number, required: true }, // 2025
    end: { type: Number, required: true }    // 2026
  },

  // Capacity
  maxStudents: { type: Number, default: 40 },

  // Status
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
classSchema.index({ schoolId: 1, code: 1, academicYear: 1 }, { unique: true });
```

---

### 4. Section Schema

```javascript
const sectionSchema = new Schema({
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },

  // Section Info
  name: { type: String, required: true }, // A, B, C
  code: { type: String, required: true }, // G5-A, G5-B

  // Class Teacher
  classTeacher: { type: Schema.Types.ObjectId, ref: 'User' },

  // Capacity
  maxStudents: { type: Number, default: 40 },
  currentStudents: { type: Number, default: 0 },

  // Room
  roomNumber: String,
  floor: String,

  // Status
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
sectionSchema.index({ classId: 1, name: 1 }, { unique: true });
```

---

### 5. Student Schema (Enhanced)

```javascript
const studentSchema = new Schema({
  // Basic Info (existing)
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },

  // IDs
  studentId: { type: String, unique: true }, // Auto-generated
  admissionNumber: { type: String, unique: true },
  rollNumber: String, // Section-specific

  // School & Class
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },

  // Parents
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fathersName: String,
  mothersName: String,
  guardianName: String,
  guardianRelation: String,

  // Contact
  primaryContact: { type: String, required: true },
  secondaryContact: String,
  email: String,

  // Address (inherit from parent or separate)
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },

  // Medical
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  allergies: [String],
  medicalConditions: [String],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },

  // Academic
  admissionDate: Date,
  previousSchool: String,

  // Transport
  transport: {
    required: { type: Boolean, default: false },
    routeNumber: String,
    pickupPoint: String,
    dropPoint: String
  },

  // Profile
  profileImage: String, // S3 URL
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],

  // Learning Profile (existing + enhanced)
  learningProfile: {
    strengths: [String],
    weaknesses: [String],
    learningStyle: String,
    commonMistakePatterns: [{
      subject: String,
      pattern: String,
      frequency: Number,
      lastOccurrence: Date
    }],
    overallGrade: String, // A+, A, B+, etc.
    overallPercentage: Number,
    attendance: {
      thisMonth: Number,
      overall: Number
    }
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'transferred', 'graduated'],
    default: 'active'
  },
  isActive: { type: Boolean, default: true },

  // Teacher Assignment (multiple teachers)
  teacherIds: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

// Indexes
studentSchema.index({ studentId: 1 });
studentSchema.index({ schoolId: 1, classId: 1, sectionId: 1 });
studentSchema.index({ parentId: 1 });
studentSchema.index({ admissionNumber: 1 });
```

---

### 6. Attendance Schema

```javascript
const attendanceSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },

  // Date & Time
  date: { type: Date, required: true },
  period: { type: String }, // "Period 1", "Period 2", or null for full day

  // Status
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'leave', 'holiday'],
    required: true
  },

  // Details
  markedAt: Date,
  markedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Teacher

  // For Late
  arrivalTime: String,

  // For Absent/Leave
  reason: String,
  isApproved: Boolean,
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  leaveRequestId: { type: Schema.Types.ObjectId, ref: 'LeaveRequest' },

  // Parent Notification
  parentNotified: { type: Boolean, default: false },
  notifiedAt: Date,
  notificationMethod: { type: String, enum: ['sms', 'email', 'push', 'all'] },

  // Notes
  notes: String
}, {
  timestamps: true
});

// Indexes
attendanceSchema.index({ studentId: 1, date: 1, period: 1 }, { unique: true });
attendanceSchema.index({ classId: 1, sectionId: 1, date: 1 });
attendanceSchema.index({ date: 1, status: 1 });
```

---

### 7. Homework Schema

```javascript
const homeworkSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },

  // Assignment Details
  title: { type: String, required: true },
  description: { type: String, required: true },

  // Subject & Class
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section' }], // Can assign to multiple sections

  // Created By
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Type
  type: {
    type: String,
    enum: ['written', 'project', 'presentation', 'online', 'reading'],
    default: 'written'
  },

  // Dates
  assignedDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },

  // Attachments
  attachments: [{
    name: String,
    url: String, // S3 URL
    type: String, // pdf, doc, image
    size: Number  // in bytes
  }],

  // Settings
  allowLateSubmission: { type: Boolean, default: true },
  lateSubmissionPenalty: Number, // percentage deduction
  maxMarks: { type: Number, default: 10 },

  // AI Grading
  enableAIGrading: { type: Boolean, default: false },
  rubric: String, // Grading criteria

  // Stats
  totalStudents: Number,
  submittedCount: { type: Number, default: 0 },
  gradedCount: { type: Number, default: 0 },
  averageScore: Number,

  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Indexes
homeworkSchema.index({ classId: 1, sectionIds: 1, dueDate: 1 });
homeworkSchema.index({ teacherId: 1, status: 1 });
homeworkSchema.index({ dueDate: 1 });
```

---

### 8. Submission Schema

```javascript
const submissionSchema = new Schema({
  homeworkId: { type: Schema.Types.ObjectId, ref: 'Homework', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },

  // Submission
  submittedAt: { type: Date, default: Date.now },
  isLate: Boolean,

  // Files
  files: [{
    name: String,
    url: String, // S3 URL
    type: String,
    size: Number
  }],

  // Comments
  studentComments: String,

  // Grading
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'graded', 'returned'],
    default: 'submitted'
  },

  marksObtained: Number,
  maxMarks: Number,
  grade: String, // A, B, C or percentage

  teacherComments: String,
  teacherFeedback: [{
    comment: String,
    timestamp: Date,
    teacherId: { type: Schema.Types.ObjectId, ref: 'User' }
  }],

  // AI Analysis (if enabled)
  aiAnalysis: {
    score: Number,
    feedback: String,
    strengths: [String],
    improvements: [String],
    processed: Boolean
  },

  // Graded By
  gradedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  gradedAt: Date,

  // Resubmission
  allowResubmit: Boolean,
  resubmittedCount: { type: Number, default: 0 },
  originalSubmissionId: { type: Schema.Types.ObjectId, ref: 'Submission' }
}, {
  timestamps: true
});

// Indexes
submissionSchema.index({ homeworkId: 1, studentId: 1 });
submissionSchema.index({ studentId: 1, status: 1 });
```

---

### 9. Fee Structure Schema

```javascript
const feeStructureSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },

  // Academic Year
  academicYear: {
    start: Number,
    end: Number
  },

  // Applicable To
  classIds: [{ type: Schema.Types.ObjectId, ref: 'Class' }],

  // Fee Components
  feeComponents: [{
    name: { type: String, required: true }, // Tuition, Transport, Library, etc.
    code: String,
    amount: { type: Number, required: true },
    frequency: {
      type: String,
      enum: ['one-time', 'monthly', 'quarterly', 'half-yearly', 'yearly'],
      default: 'quarterly'
    },
    isOptional: { type: Boolean, default: false },
    description: String
  }],

  // Payment Schedule
  installments: [{
    installmentNumber: Number,
    dueDate: Date,
    amount: Number,
    components: [String] // Component names included
  }],

  // Discounts
  discounts: [{
    name: String,
    type: { type: String, enum: ['percentage', 'fixed'] },
    value: Number,
    applicableOn: [String], // Component codes
    criteria: String // "Sibling", "Merit", "Staff Ward", etc.
  }],

  // Late Fee
  lateFee: {
    enabled: Boolean,
    type: { type: String, enum: ['fixed', 'percentage', 'daily'] },
    amount: Number,
    gracePeriodDays: Number
  },

  // Total
  totalAmount: Number,

  // Status
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});
```

---

### 10. Fee Payment Schema

```javascript
const feePaymentSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  feeStructureId: { type: Schema.Types.ObjectId, ref: 'FeeStructure' },

  // Payment Details
  receiptNumber: { type: String, unique: true }, // Auto-generated
  paymentDate: { type: Date, default: Date.now },

  // Amount
  amount: { type: Number, required: true },
  feeComponents: [{
    name: String,
    amount: Number
  }],
  lateFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: Number,

  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'netbanking', 'cheque', 'online'],
    required: true
  },

  // Transaction Details
  transactionId: String,
  transactionStatus: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'success'
  },

  // For Cheque
  chequeNumber: String,
  chequeDate: Date,
  bankName: String,

  // For Online
  paymentGateway: String, // razorpay, stripe
  gatewayTransactionId: String,
  gatewayResponse: Schema.Types.Mixed,

  // Receipt
  receiptUrl: String, // PDF S3 URL

  // Collected By
  collectedBy: { type: Schema.Types.ObjectId, ref: 'User' },

  // Accounting
  academicYear: {
    start: Number,
    end: Number
  },
  financialYear: String,

  // Notes
  notes: String,

  // Parent
  paidBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Parent

  // Notification
  receiptSent: Boolean,
  receiptSentAt: Date
}, {
  timestamps: true
});

// Indexes
feePaymentSchema.index({ studentId: 1, paymentDate: -1 });
feePaymentSchema.index({ receiptNumber: 1 });
feePaymentSchema.index({ transactionId: 1 });
```

---

### 11. Timetable Schema

```javascript
const timetableSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },

  // Academic Year
  academicYear: {
    start: Number,
    end: Number
  },

  // Effective Period
  effectiveFrom: Date,
  effectiveTo: Date,

  // Schedule
  schedule: [{
    day: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7] // Monday to Sunday
    },
    periods: [{
      periodNumber: Number,
      startTime: String, // "09:00"
      endTime: String,   // "10:00"

      subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
      teacherId: { type: Schema.Types.ObjectId, ref: 'User' },

      roomNumber: String,
      type: {
        type: String,
        enum: ['theory', 'practical', 'lab', 'activity', 'break', 'lunch'],
        default: 'theory'
      },

      // For breaks
      isBreak: Boolean,
      breakType: String // "Short Break", "Lunch", "Assembly"
    }]
  }],

  // Substitutions (temporary changes)
  substitutions: [{
    date: Date,
    day: Number,
    periodNumber: Number,
    originalTeacherId: { type: Schema.Types.ObjectId, ref: 'User' },
    substituteTeacherId: { type: Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],

  // Status
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
timetableSchema.index({ classId: 1, sectionId: 1, academicYear: 1 });
```

---

### 12. Announcement Schema

```javascript
const announcementSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },

  // Content
  title: { type: String, required: true },
  message: { type: String, required: true },

  // Created By
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Target Audience
  targetType: {
    type: String,
    enum: ['all', 'teachers', 'parents', 'students', 'class', 'section', 'custom'],
    required: true
  },

  // If targetType is 'class' or 'section'
  classIds: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section' }],

  // If targetType is 'custom'
  specificUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  // Priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },

  // Attachments
  attachments: [{
    name: String,
    url: String,
    type: String
  }],

  // Publishing
  publishNow: { type: Boolean, default: true },
  scheduledFor: Date,
  expiresAt: Date,

  // Stats
  viewCount: { type: Number, default: 0 },
  readBy: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: Date
  }],

  // Notification
  sendNotification: { type: Boolean, default: true },
  notificationSent: Boolean,
  notificationSentAt: Date,

  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'expired'],
    default: 'published'
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
announcementSchema.index({ schoolId: 1, status: 1, createdAt: -1 });
announcementSchema.index({ targetType: 1, classIds: 1, sectionIds: 1 });
```

---

This is Part 1 of the database schema. Would you like me to continue with:
- Part 2: Remaining schemas (Messages, Notifications, Events, Study Materials, Leave Requests, Analytics)
- API Endpoint specifications
- User Flow Diagrams
- Component Wireframes

Let me know which one you'd like next!
