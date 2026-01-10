export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'parent' | 'teacher' | 'admin' | 'student';
  phoneNumber?: string;
  alternatePhone?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  schoolId?: string | School;
  teacherData?: {
    employeeId?: string;
    qualification?: string;
    specialization?: string[];
    experience?: number;
    subjects?: string[];
    classes?: Array<{
      classId: string;
      sectionId: string;
      subject: string;
      isClassTeacher: boolean;
    }>;
    joiningDate?: string;
  };
  parentData?: {
    occupation?: string;
    children?: string[];
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  studentData?: {
    studentProfile?: string;
  };
  preferences?: {
    language: string;
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  isActive?: boolean;
  isEmailVerified?: boolean;
  lastLogin?: string;
  token?: string;
}

export interface School {
  _id: string;
  name: string;
  code: string;
  type: 'Primary' | 'Secondary' | 'Higher Secondary' | 'K-12';
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contactEmail: string;
  contactPhone: string;
  principal?: {
    name: string;
    email: string;
    phone: string;
  };
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  settings: {
    academicYearStart: number;
    academicYearEnd: number;
    workingDays: string[];
    attendance: {
      markingTime: string;
      lateArrivalTime: string;
      autoNotifyParents: boolean;
    };
    fees: {
      lateFeeEnabled: boolean;
      lateFeePercentage: number;
      gracePeriodDays: number;
    };
    homework: {
      maxPerDay: number;
      submissionReminderTime: string;
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  _id: string;
  schoolId: string;
  name: string;
  code: string;
  level: number;
  description?: string;
  academicYear: {
    start: number;
    end: number;
  };
  capacity?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  _id: string;
  schoolId: string;
  classId: string | Class;
  name: string;
  code: string;
  classTeacher?: string | User;
  roomNumber?: string;
  floor?: string;
  capacity?: number;
  currentStudents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  parentId: string | User;
  teacherIds: string[] | User[];
  studentId: string;
  profileImage?: string;
  subjects: string[];
  learningProfile: {
    strengths: string[];
    weaknesses: string[];
    learningStyle?: string;
    commonMistakePatterns: MistakePattern[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MistakePattern {
  subject: string;
  pattern: string;
  frequency: number;
  lastOccurrence: string;
}

export interface Assessment {
  _id: string;
  studentId: string | Student;
  subject: string;
  topic: string;
  grade: string;
  assessmentType: 'exam' | 'quiz' | 'homework' | 'practice';
  originalImage: {
    url: string;
    s3Key: string;
    uploadedAt: string;
  };
  extractedText?: string;
  questions: Question[];
  aiAnalysis: AIAnalysis;
  teacherId?: string | User;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingTime?: number;
  viewedByParent: boolean;
  viewedByTeacher: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer?: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
}

export interface Mistake {
  questionNumber: number;
  mistakeType: 'conceptual' | 'calculation' | 'formatting' | 'incomplete' | 'misunderstanding' | 'other';
  description: string;
  suggestion: string;
  relatedConcepts: string[];
}

export interface AIAnalysis {
  overallScore: number;
  totalScore: number;
  mistakes: Mistake[];
  strengths: string[];
  areasForImprovement: string[];
  personalizedFeedback: string;
  recommendedTopics: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface ProgressData {
  totalAssessments: number;
  averageScore: number;
  scoresTrend: ScoreTrend[];
  mistakesByType: { [key: string]: number };
  topWeaknesses: string[];
  topStrengths: string[];
  subjectPerformance: { [subject: string]: SubjectPerformance };
}

export interface ScoreTrend {
  date: string;
  score: number;
  subject: string;
}

export interface SubjectPerformance {
  count: number;
  totalScore: number;
  averageScore: string;
}

export interface PersonalizedTest {
  testTitle: string;
  questions: TestQuestion[];
}

export interface TestQuestion {
  questionNumber: number;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'problem-solving';
  difficulty: 'easy' | 'medium' | 'hard';
  targetedWeakness: string;
  hints: string[];
  correctAnswer: string;
}
