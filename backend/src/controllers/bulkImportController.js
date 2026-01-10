const Excel = require('exceljs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Section = require('../models/Section');
const ImportBatch = require('../models/ImportBatch');
const { generateCredentials } = require('../utils/credentialsGenerator');

/**
 * Download Excel template for bulk import
 */
const downloadTemplate = async (req, res) => {
  try {
    const workbook = new Excel.Workbook();

    // Sheet 1: Students
    const studentSheet = workbook.addWorksheet('Students');

    // Define columns
    studentSheet.columns = [
      { header: 'StudentID', key: 'studentId', width: 15 },
      { header: 'FirstName*', key: 'firstName', width: 15 },
      { header: 'LastName*', key: 'lastName', width: 15 },
      { header: 'DateOfBirth*', key: 'dateOfBirth', width: 15 },
      { header: 'Grade*', key: 'grade', width: 10 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Class', key: 'class', width: 10 },
      { header: 'Section', key: 'section', width: 10 },
      { header: 'RollNumber', key: 'rollNumber', width: 12 },
      { header: 'ParentEmail*', key: 'parentEmail', width: 25 },
      { header: 'ParentFirstName*', key: 'parentFirstName', width: 15 },
      { header: 'ParentLastName*', key: 'parentLastName', width: 15 },
      { header: 'ParentPhone', key: 'parentPhone', width: 15 },
      { header: 'ParentOccupation', key: 'parentOccupation', width: 15 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'Pincode', key: 'pincode', width: 10 },
      { header: 'EmergencyContactName', key: 'emergencyName', width: 20 },
      { header: 'EmergencyContactPhone', key: 'emergencyPhone', width: 15 },
      { header: 'EmergencyRelationship', key: 'emergencyRelationship', width: 15 }
    ];

    // Style header row
    studentSheet.getRow(1).font = { bold: true };
    studentSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    studentSheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add sample data
    studentSheet.addRow({
      studentId: 'STU001',
      firstName: 'Emma',
      lastName: 'Smith',
      dateOfBirth: '2015-05-15',
      grade: '3',
      gender: 'Female',
      class: '3A',
      section: 'A',
      rollNumber: '1',
      parentEmail: 'sarah.smith@example.com',
      parentFirstName: 'Sarah',
      parentLastName: 'Smith',
      parentPhone: '5551234567',
      parentOccupation: 'Engineer',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      emergencyName: 'John Smith',
      emergencyPhone: '5559876543',
      emergencyRelationship: 'Father'
    });

    studentSheet.addRow({
      studentId: 'STU002',
      firstName: 'Oliver',
      lastName: 'Smith',
      dateOfBirth: '2017-08-20',
      grade: '1',
      gender: 'Male',
      class: '1A',
      section: 'A',
      rollNumber: '2',
      parentEmail: 'sarah.smith@example.com',  // Same parent
      parentFirstName: 'Sarah',
      parentLastName: 'Smith',
      parentPhone: '5551234567',
      parentOccupation: 'Engineer',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      emergencyName: 'John Smith',
      emergencyPhone: '5559876543',
      emergencyRelationship: 'Father'
    });

    // Add instructions sheet
    const instructionsSheet = workbook.addWorksheet('Instructions');
    instructionsSheet.getColumn(1).width = 100;

    instructionsSheet.addRow(['BULK IMPORT INSTRUCTIONS']).font = { bold: true, size: 16 };
    instructionsSheet.addRow([]);
    instructionsSheet.addRow(['Required Fields (marked with *):']).font = { bold: true };
    instructionsSheet.addRow(['  - FirstName, LastName, DateOfBirth, Grade']);
    instructionsSheet.addRow(['  - ParentEmail, ParentFirstName, ParentLastName']);
    instructionsSheet.addRow([]);
    instructionsSheet.addRow(['Date Format:']).font = { bold: true };
    instructionsSheet.addRow(['  - DateOfBirth must be in YYYY-MM-DD format (e.g., 2015-05-15)']);
    instructionsSheet.addRow([]);
    instructionsSheet.addRow(['Grade Format:']).font = { bold: true };
    instructionsSheet.addRow(['  - Use numbers: 1, 2, 3, ... 12']);
    instructionsSheet.addRow(['  - Or use K for Kindergarten']);
    instructionsSheet.addRow([]);
    instructionsSheet.addRow(['Gender:']).font = { bold: true };
    instructionsSheet.addRow(['  - Male, Female, or Other']);
    instructionsSheet.addRow([]);
    instructionsSheet.addRow(['Parent Deduplication:']).font = { bold: true };
    instructionsSheet.addRow(['  - If multiple students have the same ParentEmail, only one parent account will be created']);
    instructionsSheet.addRow(['  - All children will be linked to the same parent']);
    instructionsSheet.addRow([]);
    instructionsSheet.addRow(['Class/Section:']).font = { bold: true };
    instructionsSheet.addRow(['  - Leave blank to auto-assign based on grade']);
    instructionsSheet.addRow(['  - Or specify: e.g., Class=3A, Section=A']);
    instructionsSheet.addRow([]);
    instructionsSheet.addRow(['After Import:']).font = { bold: true };
    instructionsSheet.addRow(['  - System will generate usernames and passwords']);
    instructionsSheet.addRow(['  - You will receive an Excel file with all credentials']);
    instructionsSheet.addRow(['  - Distribute credentials to parents and students']);
    instructionsSheet.addRow(['  - Users must change password on first login']);

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=BulkImportTemplate.xlsx'
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Template Download Error:', error);
    res.status(500).json({ message: 'Failed to generate template', error: error.message });
  }
};

/**
 * Validate uploaded Excel file
 */
const validateImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const studentSheet = workbook.getWorksheet('Students');
    if (!studentSheet) {
      return res.status(400).json({ message: 'Missing "Students" sheet in Excel file' });
    }

    const errors = [];
    const warnings = [];
    const validRows = [];
    const parentEmails = new Map();  // Track parent deduplication

    // Skip header row
    for (let rowNumber = 2; rowNumber <= studentSheet.rowCount; rowNumber++) {
      const row = studentSheet.getRow(rowNumber);

      // Skip empty rows
      if (!row.getCell(2).value) continue;

      const rowData = {
        row: rowNumber,
        studentId: row.getCell(1).value,
        firstName: row.getCell(2).value,
        lastName: row.getCell(3).value,
        dateOfBirth: row.getCell(4).value,
        grade: row.getCell(5).value,
        gender: row.getCell(6).value,
        class: row.getCell(7).value,
        section: row.getCell(8).value,
        rollNumber: row.getCell(9).value,
        parentEmail: row.getCell(10).value,
        parentFirstName: row.getCell(11).value,
        parentLastName: row.getCell(12).value,
        parentPhone: row.getCell(13).value,
        parentOccupation: row.getCell(14).value,
        address: row.getCell(15).value,
        city: row.getCell(16).value,
        state: row.getCell(17).value,
        pincode: row.getCell(18).value,
        emergencyName: row.getCell(19).value,
        emergencyPhone: row.getCell(20).value,
        emergencyRelationship: row.getCell(21).value
      };

      // Validate required fields
      const rowErrors = [];

      if (!rowData.firstName) rowErrors.push('FirstName is required');
      if (!rowData.lastName) rowErrors.push('LastName is required');
      if (!rowData.dateOfBirth) rowErrors.push('DateOfBirth is required');
      if (!rowData.grade) rowErrors.push('Grade is required');
      if (!rowData.parentEmail) rowErrors.push('ParentEmail is required');
      if (!rowData.parentFirstName) rowErrors.push('ParentFirstName is required');
      if (!rowData.parentLastName) rowErrors.push('ParentLastName is required');

      // Validate email format
      if (rowData.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rowData.parentEmail)) {
        rowErrors.push('Invalid ParentEmail format');
      }

      // Validate date format
      if (rowData.dateOfBirth) {
        const dateStr = String(rowData.dateOfBirth);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          rowErrors.push('DateOfBirth must be in YYYY-MM-DD format');
        } else {
          const date = new Date(dateStr);
          const age = (new Date() - date) / (365.25 * 24 * 60 * 60 * 1000);
          if (age < 3 || age > 20) {
            warnings.push({ row: rowNumber, message: `Age (${Math.floor(age)}) seems unusual` });
          }
        }
      }

      // Validate grade
      if (rowData.grade && !['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].includes(String(rowData.grade))) {
        rowErrors.push('Grade must be K or 1-12');
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: rowNumber,
          errors: rowErrors,
          data: rowData
        });
      } else {
        validRows.push(rowData);

        // Track parent email for deduplication
        if (rowData.parentEmail) {
          if (parentEmails.has(rowData.parentEmail)) {
            parentEmails.get(rowData.parentEmail).count++;
          } else {
            parentEmails.set(rowData.parentEmail, {
              count: 1,
              firstName: rowData.parentFirstName,
              lastName: rowData.parentLastName
            });
          }
        }
      }
    }

    // Calculate statistics
    const uniqueParents = parentEmails.size;
    const duplicateParents = Array.from(parentEmails.values()).filter(p => p.count > 1).length;

    // Check for existing parent emails in database
    const existingParents = await User.find({
      email: { $in: Array.from(parentEmails.keys()) },
      role: 'parent',
      schoolId: req.user.schoolId
    }).select('email');

    const parentsToCreate = uniqueParents - existingParents.length;

    res.json({
      success: true,
      validation: {
        totalRows: studentSheet.rowCount - 1,  // Exclude header
        validRows: validRows.length,
        invalidRows: errors.length,
        errors,
        warnings
      },
      summary: {
        studentsToCreate: validRows.length,
        parentsToCreate: parentsToCreate,
        parentsToReuse: existingParents.length,
        duplicateParentEmails: duplicateParents
      }
    });
  } catch (error) {
    console.error('Validation Error:', error);
    res.status(500).json({ message: 'Validation failed', error: error.message });
  }
};

// PART 2 continues in next message due to length...

module.exports = {
  downloadTemplate,
  validateImport
};
