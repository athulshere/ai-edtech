// Script to generate Excel file with 100 sample students
const XLSX = require('xlsx');

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Arnav', 'Ayaan', 'Krishna', 'Ishaan',
                    'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Reyansh', 'Aadhya', 'Ananya', 'Pari', 'Anika', 'Sara',
                    'Diya', 'Kiara', 'Ira', 'Navya', 'Saanvi', 'Myra', 'Aanya', 'Prisha', 'Avni', 'Ishita'];

const lastNames = ['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Nair', 'Iyer', 'Joshi',
                   'Rao', 'Chopra', 'Kapoor', 'Malhotra', 'Agarwal', 'Mehta', 'Desai', 'Kulkarni', 'Shetty', 'Menon'];

const subjects = ['Mathematics, Science, English, Social Studies, Hindi',
                  'Mathematics, Science, English, Computer Science, Physical Education',
                  'Physics, Chemistry, Biology, Mathematics, English',
                  'Mathematics, Physics, Chemistry, English, Computer Science'];

const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const classes = ['A', 'B', 'C', 'D'];
const sections = ['1', '2', '3'];

// Parent data pools
const parentFirstNames = ['Rajesh', 'Suresh', 'Amit', 'Rakesh', 'Vijay', 'Sunita', 'Priya', 'Kavita', 'Meera', 'Anjali'];
const parentLastNames = lastNames;

function generateDOB(minAge = 5, maxAge = 18) {
  const today = new Date();
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  const year = today.getFullYear() - age;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;

  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

function generatePhoneNumber() {
  return '98' + Math.floor(10000000 + Math.random() * 90000000);
}

function generateEmail(firstName, lastName) {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
}

const students = [];

for (let i = 1; i <= 100; i++) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const grade = grades[Math.floor(Math.random() * grades.length)];
  const classSection = classes[Math.floor(Math.random() * classes.length)];
  const section = sections[Math.floor(Math.random() * sections.length)];

  const parentFirstName = parentFirstNames[Math.floor(Math.random() * parentFirstNames.length)];
  const parentLastName = lastName; // Same last name as student

  const student = {
    'First Name': firstName,
    'Last Name': lastName,
    'DOB': generateDOB(5, 18),
    'Grade': grade,
    'Class': classSection,
    'Section': section,
    'Register Number': String(1000 + i),
    'Roll Number': String(i),
    'Admission Number': `ADM2024${String(i).padStart(3, '0')}`,
    'Parent Email': generateEmail(parentFirstName, parentLastName),
    'Parent Phone': generatePhoneNumber(),
    'Parent First Name': parentFirstName,
    'Parent Last Name': parentLastName,
    'Subjects': subjects[Math.floor(Math.random() * subjects.length)],
    'Profile Image URL': ''
  };

  students.push(student);
}

// Create worksheet
const worksheet = XLSX.utils.json_to_sheet(students);

// Set column widths
const columnWidths = [
  { wch: 15 }, // First Name
  { wch: 15 }, // Last Name
  { wch: 12 }, // DOB
  { wch: 8 },  // Grade
  { wch: 8 },  // Class
  { wch: 10 }, // Section
  { wch: 15 }, // Register Number
  { wch: 12 }, // Roll Number
  { wch: 18 }, // Admission Number
  { wch: 30 }, // Parent Email
  { wch: 15 }, // Parent Phone
  { wch: 18 }, // Parent First Name
  { wch: 18 }, // Parent Last Name
  { wch: 50 }, // Subjects
  { wch: 20 }  // Profile Image URL
];

worksheet['!cols'] = columnWidths;

// Create workbook
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

// Write to file
XLSX.writeFile(workbook, 'sample_students_100.xlsx');

console.log('✅ Excel file generated: sample_students_100.xlsx');
console.log(`📊 Total students: ${students.length}`);
console.log('\nSample student data:');
console.log(students[0]);
