# Bulk Import System - Design Document

## Overview
This system allows schools to onboard their entire student and parent database via Excel import, with automatic username/password generation and efficient data processing.

---

## 1. Username Generation Strategy

### Best Practice: Deterministic, Readable, Unique

#### **Students**
```
Format: firstname.lastname.grade[counter]
Examples:
  - emma.smith.3
  - emma.smith.3.1 (if duplicate)
  - john.doe.5
  - john.doe.5.1 (if duplicate)

Logic:
  username = firstName.toLowerCase() + "." + lastName.toLowerCase() + "." + grade
  if duplicate: append counter (.1, .2, .3...)
```

**Advantages:**
- ✅ Readable and memorable
- ✅ Parents can easily remember
- ✅ Grade helps identify student
- ✅ No special characters needed

#### **Parents**
```
Format: parent.lastname.[first2letters][counter]
Examples:
  - parent.smith.sa (Sarah Smith)
  - parent.smith.mi (Michael Smith - if another Smith parent)
  - parent.doe.jo
  - parent.doe.ja (Jane Doe - if another Doe parent)

Logic:
  username = "parent." + lastName.toLowerCase() + "." + firstName.substring(0,2).toLowerCase()
  if duplicate: increment counter
```

**Advantages:**
- ✅ Clear role identification (parent prefix)
- ✅ Last name helps with family grouping
- ✅ First 2 letters differentiate between parents with same last name

#### **Teachers**
```
Format: teacher.lastname.[first2letters][counter]
Examples:
  - teacher.johnson.jo (John Johnson)
  - teacher.johnson.em (Emma Johnson)

Logic: Same as parents but with "teacher" prefix
```

#### **Admin**
```
Format: admin.lastname.[first2letters]
Examples:
  - admin.brown.sa (Sarah Brown - Principal)
  - admin.davis.mi (Michael Davis - Office Admin)

Logic: Simple and clear hierarchy
```

---

## 2. Password Generation Strategy

### Initial Password Format: Memorable but Secure

```
Format: [Firstname][LastInitial][Grade/Role][4RandomDigits]

Examples:
  Students:
    - EmmaS3#1234 (Emma Smith, Grade 3)
    - JohnD5#5678 (John Doe, Grade 5)

  Parents:
    - SarahS#8901 (Sarah Smith)
    - MichaelD#2345 (Michael Doe)

  Teachers:
    - JohnJ#6789 (John Johnson)

Rules:
  - First name (capitalized)
  - Last initial (capitalized)
  - Grade/# symbol for role
  - 4 random digits
  - Total: 10-12 characters
  - Must change on first login
```

**Advantages:**
- ✅ Personal (uses their name)
- ✅ Memorable enough to type once
- ✅ Secure enough for initial access
- ✅ Different for each user (random digits)
- ✅ Forces password change on first login

---

## 3. Excel Import Format

### Sheet 1: Students
```
| StudentID | FirstName | LastName | DateOfBirth | Grade | Class | Section | ParentEmail | ParentFirstName | ParentLastName | ParentPhone | ParentOccupation | Address | City | State | Pincode | EmergencyContact | EmergencyPhone |
|-----------|-----------|----------|-------------|-------|-------|---------|-------------|-----------------|----------------|-------------|------------------|---------|------|-------|---------|------------------|----------------|
| STU001    | Emma      | Smith    | 2015-05-15  | 3     | 3A    | A       | sarah@ex.com| Sarah           | Smith          | 5551234567  | Engineer         | 123 St  | NYC  | NY    | 10001   | John Smith       | 5559876543     |
```

**Columns:**
- `StudentID` (Optional - School's internal ID)
- `FirstName` * (Required)
- `LastName` * (Required)
- `DateOfBirth` * (Required - Format: YYYY-MM-DD)
- `Grade` * (Required - 1-12 or K)
- `Class` (Optional - e.g., "3A", will auto-create if missing)
- `Section` (Optional - e.g., "A", will auto-create if missing)
- `ParentEmail` * (Required - Used for parent account)
- `ParentFirstName` * (Required)
- `ParentLastName` * (Required)
- `ParentPhone` (Optional)
- `ParentOccupation` (Optional)
- `Address` (Optional)
- `City` (Optional)
- `State` (Optional)
- `Pincode` (Optional)
- `EmergencyContact` (Optional)
- `EmergencyPhone` (Optional)

### Sheet 2: Teachers (Optional)
```
| EmployeeID | FirstName | LastName | Email | Phone | Qualification | Specialization | Experience | Subjects | JoiningDate |
|------------|-----------|----------|-------|-------|---------------|----------------|------------|----------|-------------|
| TCH001     | John      | Johnson  | john@school.com | 5551111111 | M.Ed | Mathematics | 5 | Math,Physics | 2020-06-01 |
```

### Sheet 3: Admin (Optional)
```
| FirstName | LastName | Email | Phone | Designation |
|-----------|----------|-------|-------|-------------|
| Sarah     | Brown    | sarah.brown@school.com | 5552222222 | Principal |
```

---

## 4. Import Process Flow

```
1. School Admin (Initial User) logs in
   ↓
2. Goes to "Bulk Import" section
   ↓
3. Downloads Excel template
   ↓
4. School fills template with student/parent data
   ↓
5. Uploads filled Excel file
   ↓
6. System validates data:
   - Required fields present
   - Email format valid
   - Dates valid
   - No duplicate emails
   - Grades are valid
   ↓
7. System shows preview:
   - X students will be created
   - Y parents will be created (excluding duplicates)
   - Z classes will be auto-created
   - List of any errors/warnings
   ↓
8. Admin confirms import
   ↓
9. System processes:
   - Creates/updates classes and sections
   - Creates parent accounts (deduplicates by email)
   - Generates usernames and passwords
   - Creates student accounts
   - Links students to parents
   - Links students to classes/sections
   ↓
10. System generates credentials file:
    - Excel with all usernames/passwords
    - Grouped by class/section
    - Separate sheets for students, parents, teachers
   ↓
11. Admin downloads credentials
   ↓
12. School distributes credentials to parents/students
```

---

## 5. Database Schema Changes

### Enhanced User Model
```javascript
{
  // Add username field
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  // Keep email for parents (can be non-unique for students without email)
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true,  // Changed: Allow null, unique only if present
    index: true
  },

  // Student-specific data
  studentData: {
    studentProfile: ObjectId,
    schoolStudentId: String,  // NEW: School's internal ID
    admissionNumber: String,  // NEW: School's admission number
    admissionDate: Date       // NEW: When student joined
  },

  // Parent data enhanced
  parentData: {
    occupation: String,
    children: [ObjectId],
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    },
    address: {              // NEW: Family address
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    }
  },

  // NEW: Import tracking
  importBatch: {
    batchId: String,        // UUID for import batch
    importedAt: Date,       // When imported
    importedBy: ObjectId    // Admin who imported
  }
}
```

### New ImportBatch Model
```javascript
{
  batchId: String (UUID),
  schoolId: ObjectId,
  importedBy: ObjectId,
  importedAt: Date,
  fileName: String,

  statistics: {
    studentsCreated: Number,
    parentsCreated: Number,
    teachersCreated: Number,
    classesCreated: Number,
    sectionsCreated: Number,
    errors: Number
  },

  credentialsFile: {
    s3Key: String,          // Store credentials in S3
    downloadUrl: String,
    expiresAt: Date         // Auto-delete after 7 days
  },

  errors: [{
    row: Number,
    field: String,
    message: String,
    data: Object
  }],

  status: {
    type: String,
    enum: ['processing', 'completed', 'failed']
  }
}
```

---

## 6. Validation Rules

### Student Validation
```javascript
- FirstName: Required, 2-50 chars, letters only
- LastName: Required, 2-50 chars, letters only
- DateOfBirth: Required, valid date, age 3-20 years
- Grade: Required, K or 1-12
- ParentEmail: Required, valid email format
- ParentFirstName: Required, 2-50 chars
- ParentLastName: Required, 2-50 chars
- ParentPhone: Optional, valid phone format (10-15 digits)
```

### Duplicate Detection
```javascript
Parent Deduplication:
  - By email (primary)
  - If email matches: Link to existing parent
  - Create new parent only if email is unique

Student Deduplication:
  - By firstName + lastName + dateOfBirth
  - Warn if duplicate found
  - Option to skip or create with counter
```

---

## 7. Username Collision Handling

### Strategy: Auto-increment counter

```javascript
function generateUniqueUsername(base, role) {
  let username = base;
  let counter = 0;

  while (await User.exists({ username })) {
    counter++;
    username = `${base}.${counter}`;
  }

  return username;
}

Examples:
  john.doe.5 (first)
  john.doe.5.1 (second John Doe in grade 5)
  john.doe.5.2 (third John Doe in grade 5)
```

---

## 8. Credentials Distribution Strategies

### Option 1: Excel Download (Current Implementation)
```
Credentials.xlsx
  - Sheet 1: Students (Class-wise)
  - Sheet 2: Parents
  - Sheet 3: Teachers

Each row:
  Name | Username | Password | Role | Class/Section
```

### Option 2: Individual PDFs (Future)
```
Generate PDF for each student with:
  - Student credentials
  - Parent credentials
  - QR code for quick login
  - School logo and instructions
```

### Option 3: Email Distribution (Future)
```
Send automated emails to:
  - Parents (with their credentials + child credentials)
  - Teachers (with their credentials)
```

### Option 4: SMS Distribution (Future)
```
Send SMS to parent phone:
  "Welcome to [School]! Your username: parent.smith.sa Password: SarahS#1234
  Student username: emma.smith.3 Password: EmmaS3#5678
  Login: school.edu/login Change password on first login."
```

---

## 9. API Endpoints

### Bulk Import
```
POST   /api/bulk-import/validate        // Validate Excel, return preview
POST   /api/bulk-import/execute         // Execute import after validation
GET    /api/bulk-import/batches         // List all import batches
GET    /api/bulk-import/:batchId        // Get batch details
GET    /api/bulk-import/:batchId/credentials  // Download credentials
GET    /api/bulk-import/template        // Download Excel template
```

---

## 10. Security Considerations

1. **Credential Storage**:
   - Credentials file stored in S3 with expiry (7 days)
   - Encrypted at rest
   - Only accessible by admin who imported

2. **Password Policy**:
   - Initial passwords must be changed
   - `mustChangePassword: true` for all imported users
   - Passwords not stored in plain text anywhere

3. **Audit Trail**:
   - Track who imported
   - Track when imported
   - Track what was imported
   - Cannot be deleted (soft delete only)

4. **Access Control**:
   - Only admin can bulk import
   - Only admin of same school can see import history
   - Credentials download requires authentication

---

## 11. Error Handling

### Validation Errors (Block Import)
```
- Missing required fields
- Invalid email format
- Invalid date format
- Invalid grade
- Age out of range (< 3 or > 20)
```

### Warnings (Allow Import with Confirmation)
```
- Duplicate student name + DOB
- Missing optional fields
- Phone number format unusual
- Class doesn't exist (will be created)
```

### Partial Failures (Continue Import)
```
- If one student fails: Skip, continue with rest
- Log error with row number
- Show summary at end
```

---

## 12. Performance Optimization

### Batch Processing
```javascript
- Process 100 records at a time
- Use bulkWrite for database operations
- Index on username, email
- Progress bar during import
```

### Transaction Safety
```javascript
- Use MongoDB transactions
- Rollback on critical failures
- Partial import allowed (with error log)
```

---

## 13. Testing Scenarios

1. **Happy Path**: 500 students, 350 unique parents
2. **Duplicate Parents**: 20 students with same parent email
3. **Missing Fields**: Skip rows with errors
4. **Invalid Data**: Wrong email format, invalid dates
5. **Username Collisions**: Multiple "John Smith Grade 3"
6. **Large Import**: 5000 students (performance test)

---

## 14. Implementation Priority

### Phase 1 (MVP - MUST HAVE)
- ✅ Excel template generation
- ✅ Bulk import API with validation
- ✅ Username generation logic
- ✅ Password generation logic
- ✅ Parent deduplication by email
- ✅ Credentials Excel export
- ✅ Basic error handling

### Phase 2 (ENHANCEMENT)
- Individual PDF generation
- Email distribution
- SMS distribution
- Import history UI
- Batch deletion/rollback

### Phase 3 (ADVANCED)
- QR code generation
- Mobile app integration
- Real-time import progress
- Data migration tools

---

**Next Steps**: Implement Phase 1 starting with User model updates and bulk import API.
