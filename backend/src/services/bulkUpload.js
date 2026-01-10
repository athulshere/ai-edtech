const XLSX = require('xlsx');
const Student = require('../models/Student');
const User = require('../models/User');
const School = require('../models/School');
const Class = require('../models/Class');
const Section = require('../models/Section');

/**
 * Generate username from registerNumber and DOB
 * Format: registerNumber.ddmmyyyy
 * Example: 12345.15012010
 */
const generateUsername = (registerNumber, dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = dob.getFullYear();

  return `${registerNumber}.${day}${month}${year}`;
};

/**
 * Generate password from DOB
 * Format: ddmmyyyy
 * Example: 15012010
 */
const generatePassword = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = dob.getFullYear();

  return `${day}${month}${year}`;
};

/**
 * Parse Excel date serial number to JavaScript Date
 */
const parseExcelDate = (excelDate) => {
  if (excelDate instanceof Date) {
    return excelDate;
  }

  // Excel date serial number (days since 1900-01-01)
  if (typeof excelDate === 'number') {
    const excelEpoch = new Date(1900, 0, 1);
    const date = new Date(excelEpoch.getTime() + (excelDate - 2) * 24 * 60 * 60 * 1000);
    return date;
  }

  // String date format (dd/mm/yyyy or dd-mm-yyyy)
  if (typeof excelDate === 'string') {
    const parts = excelDate.split(/[/-]/);
    if (parts.length === 3) {
      // Assuming dd/mm/yyyy format
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
  }

  return new Date(excelDate);
};

/**
 * Find or create parent user by email/phone
 */
const findOrCreateParent = async (parentEmail, parentPhone, schoolId, firstName, lastName) => {
  let parent;

  // Try to find existing parent by email or phone
  if (parentEmail) {
    parent = await User.findOne({ email: parentEmail.toLowerCase(), role: 'parent' });
  }

  if (!parent && parentPhone) {
    parent = await User.findOne({ phoneNumber: parentPhone, role: 'parent' });
  }

  // Create new parent if not found
  if (!parent) {
    parent = await User.create({
      firstName: firstName || 'Parent',
      lastName: lastName || 'User',
      email: parentEmail ? parentEmail.toLowerCase() : undefined,
      phoneNumber: parentPhone,
      password: 'Parent@123', // Default password, should be changed on first login
      role: 'parent',
      schoolId,
      mustChangePassword: true,
      parentData: {
        children: []
      }
    });
  }

  return parent;
};

/**
 * Find or create class by name and grade
 */
const findOrCreateClass = async (className, grade, schoolId) => {
  const currentYear = new Date().getFullYear();
  const level = parseInt(grade) || 1;

  let classDoc = await Class.findOne({
    code: `CLASS-${className}-${grade}`,
    schoolId,
    'academicYear.start': currentYear
  });

  if (!classDoc) {
    classDoc = await Class.create({
      name: `Grade ${grade} - ${className}`,
      code: `CLASS-${className}-${grade}`,
      level,
      schoolId,
      academicYear: {
        start: currentYear,
        end: currentYear + 1
      },
      maxStudents: 50
    });
  }

  return classDoc;
};

/**
 * Find or create section by name
 */
const findOrCreateSection = async (sectionName, classId, schoolId) => {
  const sectionNameUpper = sectionName.toUpperCase();

  let section = await Section.findOne({
    name: sectionNameUpper,
    classId,
    schoolId
  });

  if (!section) {
    // Get class info for code generation
    const classDoc = await Class.findById(classId);

    section = await Section.create({
      name: sectionNameUpper,
      code: classDoc ? `${classDoc.code}-${sectionNameUpper}` : `SEC-${sectionNameUpper}`,
      classId,
      schoolId,
      maxStudents: 50,
      currentStudents: 0
    });
  }

  return section;
};

/**
 * Process Excel file and create student records
 * Expected columns: First Name, Last Name, DOB, Grade, Class, Section, Register Number, Parent Email, Parent Phone, Subjects
 */
const processStudentBulkUpload = async (fileBuffer, schoolId, adminId) => {
  const results = {
    success: [],
    errors: [],
    summary: {
      total: 0,
      created: 0,
      failed: 0,
      parentsCreated: 0
    }
  };

  try {
    // Parse Excel file
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      throw new Error('Excel file is empty');
    }

    results.summary.total = data.length;

    // Validate school exists
    const school = await School.findById(schoolId);
    if (!school) {
      throw new Error('School not found');
    }

    // Track created parents to avoid duplicates
    const parentCache = new Map();
    const createdParents = new Set();

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // Excel row number (1-based + header)

      try {
        // Validate required fields
        if (!row['First Name'] || !row['Last Name']) {
          throw new Error('First Name and Last Name are required');
        }
        if (!row['DOB']) {
          throw new Error('Date of Birth is required');
        }
        if (!row['Register Number']) {
          throw new Error('Register Number is required');
        }
        if (!row['Grade'] || !row['Class'] || !row['Section']) {
          throw new Error('Grade, Class, and Section are required');
        }
        if (!row['Parent Email'] && !row['Parent Phone']) {
          throw new Error('Either Parent Email or Parent Phone is required');
        }

        // Parse DOB
        const dateOfBirth = parseExcelDate(row['DOB']);

        // Generate credentials
        const registerNumber = String(row['Register Number']).trim();
        const username = generateUsername(registerNumber, dateOfBirth);
        const password = generatePassword(dateOfBirth);

        // Check if student already exists
        const existingStudent = await Student.findOne({ registerNumber });
        if (existingStudent) {
          throw new Error(`Student with register number ${registerNumber} already exists`);
        }

        // Find or create parent
        const parentEmail = row['Parent Email'] ? String(row['Parent Email']).trim() : null;
        const parentPhone = row['Parent Phone'] ? String(row['Parent Phone']).trim() : null;
        const cacheKey = parentEmail || parentPhone;

        let parent;
        if (parentCache.has(cacheKey)) {
          parent = parentCache.get(cacheKey);
        } else {
          parent = await findOrCreateParent(
            parentEmail,
            parentPhone,
            schoolId,
            row['Parent First Name'],
            row['Parent Last Name']
          );
          parentCache.set(cacheKey, parent);

          if (!createdParents.has(parent._id.toString())) {
            createdParents.add(parent._id.toString());
            results.summary.parentsCreated++;
          }
        }

        // Parse subjects
        let subjects = [];
        if (row['Subjects']) {
          subjects = String(row['Subjects']).split(',').map(s => s.trim());
        }

        // Get or create class and section
        const grade = String(row['Grade']).trim();
        const className = String(row['Class']).trim();
        const sectionName = String(row['Section']).trim();

        const classDoc = await findOrCreateClass(className, grade, schoolId);
        const section = await findOrCreateSection(sectionName, classDoc._id, schoolId);

        // Create student
        const student = await Student.create({
          firstName: String(row['First Name']).trim(),
          lastName: String(row['Last Name']).trim(),
          dateOfBirth,
          grade,
          registerNumber,
          rollNumber: row['Roll Number'] ? String(row['Roll Number']).trim() : undefined,
          admissionNumber: row['Admission Number'] ? String(row['Admission Number']).trim() : undefined,
          schoolId,
          classId: classDoc._id,
          sectionId: section._id,
          parentIds: [parent._id],
          subjects,
          profileImage: row['Profile Image URL'] || undefined
        });

        // Update section student count
        section.currentStudents = (section.currentStudents || 0) + 1;
        await section.save();

        // Add student to parent's children list
        if (!parent.parentData.children.includes(student._id)) {
          parent.parentData.children.push(student._id);
          await parent.save();
        }

        results.success.push({
          row: rowNumber,
          studentId: student.studentId,
          registerNumber: student.registerNumber,
          username,
          password,
          name: `${student.firstName} ${student.lastName}`,
          parentEmail: parent.email,
          parentPhone: parent.phoneNumber
        });

        results.summary.created++;

      } catch (error) {
        results.errors.push({
          row: rowNumber,
          data: row,
          error: error.message
        });
        results.summary.failed++;
      }
    }

    return results;

  } catch (error) {
    throw new Error(`Failed to process Excel file: ${error.message}`);
  }
};

/**
 * Generate Excel file with student credentials for distribution
 */
const generateCredentialsExcel = (studentsData) => {
  const worksheetData = studentsData.map(student => ({
    'Student ID': student.studentId,
    'Register Number': student.registerNumber,
    'Student Name': student.name,
    'Username': student.username,
    'Password': student.password,
    'Parent Email': student.parentEmail || '',
    'Parent Phone': student.parentPhone || '',
    'Status': 'Created'
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Credentials');

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};

module.exports = {
  processStudentBulkUpload,
  generateCredentialsExcel,
  generateUsername,
  generatePassword
};
