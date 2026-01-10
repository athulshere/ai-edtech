const quizData = [
  // GRADE 1 QUIZZES (10 quizzes)
  {
    title: "Basic Addition",
    description: "Practice adding single-digit numbers",
    grade: "1",
    subject: "Mathematics",
    difficulty: "easy",
    totalPoints: 100,
    questions: [
      { questionText: "What is 2 + 3?", options: ["4", "5", "6", "7"], correctAnswer: 1, points: 10, explanation: "2 + 3 = 5" },
      { questionText: "What is 1 + 1?", options: ["1", "2", "3", "4"], correctAnswer: 1, points: 10, explanation: "1 + 1 = 2" },
      { questionText: "What is 4 + 2?", options: ["5", "6", "7", "8"], correctAnswer: 1, points: 10, explanation: "4 + 2 = 6" },
      { questionText: "What is 3 + 3?", options: ["5", "6", "7", "8"], correctAnswer: 1, points: 10, explanation: "3 + 3 = 6" },
      { questionText: "What is 5 + 1?", options: ["5", "6", "7", "8"], correctAnswer: 1, points: 10, explanation: "5 + 1 = 6" },
      { questionText: "What is 2 + 2?", options: ["2", "3", "4", "5"], correctAnswer: 2, points: 10, explanation: "2 + 2 = 4" },
      { questionText: "What is 1 + 4?", options: ["4", "5", "6", "7"], correctAnswer: 1, points: 10, explanation: "1 + 4 = 5" },
      { questionText: "What is 3 + 2?", options: ["4", "5", "6", "7"], correctAnswer: 1, points: 10, explanation: "3 + 2 = 5" },
      { questionText: "What is 4 + 4?", options: ["6", "7", "8", "9"], correctAnswer: 2, points: 10, explanation: "4 + 4 = 8" },
      { questionText: "What is 5 + 3?", options: ["7", "8", "9", "10"], correctAnswer: 1, points: 10, explanation: "5 + 3 = 8" }
    ]
  },
  {
    title: "Counting Fun",
    description: "Learn to count objects",
    grade: "1",
    subject: "Mathematics",
    difficulty: "easy",
    totalPoints: 100,
    questions: [
      { questionText: "How many fingers on one hand?", options: ["3", "4", "5", "6"], correctAnswer: 2, points: 10 },
      { questionText: "Count: 🍎🍎🍎", options: ["2", "3", "4", "5"], correctAnswer: 1, points: 10 },
      { questionText: "How many days in a week?", options: ["5", "6", "7", "8"], correctAnswer: 2, points: 10 },
      { questionText: "Count: ⭐⭐⭐⭐", options: ["3", "4", "5", "6"], correctAnswer: 1, points: 10 },
      { questionText: "How many wheels on a car?", options: ["2", "3", "4", "5"], correctAnswer: 2, points: 10 },
      { questionText: "Count: 🌸🌸", options: ["1", "2", "3", "4"], correctAnswer: 1, points: 10 },
      { questionText: "How many sides on a triangle?", options: ["2", "3", "4", "5"], correctAnswer: 1, points: 10 },
      { questionText: "Count: 🐕🐕🐕🐕🐕", options: ["4", "5", "6", "7"], correctAnswer: 1, points: 10 },
      { questionText: "How many months in a year?", options: ["10", "11", "12", "13"], correctAnswer: 2, points: 10 },
      { questionText: "Count: 🎈🎈🎈🎈🎈🎈", options: ["5", "6", "7", "8"], correctAnswer: 1, points: 10 }
    ]
  },
  {
    title: "Animal Friends",
    description: "Learn about animals",
    grade: "1",
    subject: "Science",
    difficulty: "easy",
    totalPoints: 100,
    questions: [
      { questionText: "Which animal says 'Meow'?", options: ["Dog", "Cat", "Cow", "Bird"], correctAnswer: 1, points: 10 },
      { questionText: "Which animal lives in water?", options: ["Lion", "Fish", "Elephant", "Rabbit"], correctAnswer: 1, points: 10 },
      { questionText: "Which animal has a trunk?", options: ["Horse", "Zebra", "Elephant", "Giraffe"], correctAnswer: 2, points: 10 },
      { questionText: "Which bird cannot fly?", options: ["Sparrow", "Eagle", "Penguin", "Parrot"], correctAnswer: 2, points: 10 },
      { questionText: "What do cows give us?", options: ["Eggs", "Milk", "Honey", "Wool"], correctAnswer: 1, points: 10 },
      { questionText: "Which animal is known as the king of the jungle?", options: ["Tiger", "Lion", "Bear", "Wolf"], correctAnswer: 1, points: 10 },
      { questionText: "What does a bee make?", options: ["Silk", "Milk", "Honey", "Eggs"], correctAnswer: 2, points: 10 },
      { questionText: "Which animal has stripes?", options: ["Lion", "Elephant", "Zebra", "Cow"], correctAnswer: 2, points: 10 },
      { questionText: "What do chickens lay?", options: ["Milk", "Eggs", "Wool", "Honey"], correctAnswer: 1, points: 10 },
      { questionText: "Which animal hops?", options: ["Dog", "Cat", "Rabbit", "Cow"], correctAnswer: 2, points: 10 }
    ]
  },
  {
    title: "Colors and Shapes",
    description: "Identify colors and basic shapes",
    grade: "1",
    subject: "General Knowledge",
    difficulty: "easy",
    totalPoints: 100,
    questions: [
      { questionText: "What color is the sky?", options: ["Red", "Blue", "Green", "Yellow"], correctAnswer: 1, points: 10 },
      { questionText: "How many sides does a square have?", options: ["3", "4", "5", "6"], correctAnswer: 1, points: 10 },
      { questionText: "What color is grass?", options: ["Blue", "Red", "Green", "Yellow"], correctAnswer: 2, points: 10 },
      { questionText: "What shape is a ball?", options: ["Square", "Circle", "Triangle", "Rectangle"], correctAnswer: 1, points: 10 },
      { questionText: "What color is a ripe banana?", options: ["Green", "Yellow", "Red", "Blue"], correctAnswer: 1, points: 10 },
      { questionText: "How many corners does a triangle have?", options: ["2", "3", "4", "5"], correctAnswer: 1, points: 10 },
      { questionText: "What color is the sun?", options: ["Blue", "Yellow", "Green", "Purple"], correctAnswer: 1, points: 10 },
      { questionText: "What shape is a pizza slice?", options: ["Circle", "Square", "Triangle", "Rectangle"], correctAnswer: 2, points: 10 },
      { questionText: "What color is a tomato?", options: ["Green", "Yellow", "Red", "Blue"], correctAnswer: 2, points: 10 },
      { questionText: "How many sides does a circle have?", options: ["0", "1", "2", "4"], correctAnswer: 0, points: 10 }
    ]
  },
  {
    title: "Letter Recognition",
    description: "Identify letters and sounds",
    grade: "1",
    subject: "English",
    difficulty: "easy",
    totalPoints: 100,
    questions: [
      { questionText: "Which letter comes after A?", options: ["C", "B", "D", "E"], correctAnswer: 1, points: 10 },
      { questionText: "What is the first letter of 'Dog'?", options: ["C", "D", "E", "F"], correctAnswer: 1, points: 10 },
      { questionText: "Which letter comes before C?", options: ["A", "B", "D", "E"], correctAnswer: 1, points: 10 },
      { questionText: "What is the first letter of 'Cat'?", options: ["B", "C", "D", "A"], correctAnswer: 1, points: 10 },
      { questionText: "How many letters in the word 'Hi'?", options: ["1", "2", "3", "4"], correctAnswer: 1, points: 10 },
      { questionText: "Which letter comes after M?", options: ["L", "N", "O", "P"], correctAnswer: 1, points: 10 },
      { questionText: "What is the last letter of 'Sun'?", options: ["M", "N", "O", "P"], correctAnswer: 1, points: 10 },
      { questionText: "Which is a vowel?", options: ["B", "C", "A", "D"], correctAnswer: 2, points: 10 },
      { questionText: "What letter does 'Apple' start with?", options: ["B", "A", "C", "D"], correctAnswer: 1, points: 10 },
      { questionText: "How many vowels are there?", options: ["3", "4", "5", "6"], correctAnswer: 2, points: 10 }
    ]
  },
  {
    title: "My Family",
    description: "Learn about family relationships",
    grade: "1",
    subject: "Social Studies",
    difficulty: "easy",
    totalPoints: 100,
    questions: [
      { questionText: "Who is your father's father?", options: ["Uncle", "Grandfather", "Brother", "Cousin"], correctAnswer: 1, points: 10 },
      { questionText: "Who is your mother's sister?", options: ["Aunt", "Cousin", "Sister", "Niece"], correctAnswer: 0, points: 10 },
      { questionText: "How many parents do most children have?", options: ["1", "2", "3", "4"], correctAnswer: 1, points: 10 },
      { questionText: "What do you call your father's brother?", options: ["Cousin", "Uncle", "Nephew", "Brother"], correctAnswer: 1, points: 10 },
      { questionText: "Who is your mother's mother?", options: ["Sister", "Aunt", "Grandmother", "Cousin"], correctAnswer: 2, points: 10 },
      { questionText: "What do you call your aunt's children?", options: ["Siblings", "Cousins", "Nephews", "Brothers"], correctAnswer: 1, points: 10 },
      { questionText: "Who are your father and mother?", options: ["Friends", "Parents", "Teachers", "Siblings"], correctAnswer: 1, points: 10 },
      { questionText: "What do you call your brother and sister together?", options: ["Cousins", "Friends", "Siblings", "Parents"], correctAnswer: 2, points: 10 },
      { questionText: "Who takes care of you at home?", options: ["Teacher", "Family", "Doctor", "Police"], correctAnswer: 1, points: 10 },
      { questionText: "What is a family member who lives with you?", options: ["Stranger", "Neighbor", "Household member", "Classmate"], correctAnswer: 2, points: 10 }
    ]
  },
  {
    title: "Basic Subtraction",
    description: "Practice subtracting single-digit numbers",
    grade: "1",
    subject: "Mathematics",
    difficulty: "easy",
    totalPoints: 100,
    questions: [
      { questionText: "What is 5 - 2?", options: ["2", "3", "4", "5"], correctAnswer: 1, points: 10 },
      { questionText: "What is 4 - 1?", options: ["2", "3", "4", "5"], correctAnswer: 1, points: 10 },
      { questionText: "What is 6 - 3?", options: ["2", "3", "4", "5"], correctAnswer: 1, points: 10 },
      { questionText: "What is 8 - 4?", options: ["3", "4", "5", "6"], correctAnswer: 1, points: 10 },
      { questionText: "What is 7 - 2?", options: ["4", "5", "6", "7"], correctAnswer: 1, points: 10 },
      { questionText: "What is 9 - 5?", options: ["3", "4", "5", "6"], correctAnswer: 1, points: 10 },
      { questionText: "What is 10 - 3?", options: ["6", "7", "8", "9"], correctAnswer: 1, points: 10 },
      { questionText: "What is 5 - 5?", options: ["0", "1", "2", "5"], correctAnswer: 0, points: 10 },
      { questionText: "What is 6 - 2?", options: ["3", "4", "5", "6"], correctAnswer: 1, points: 10 },
      { questionText: "What is 8 - 3?", options: ["4", "5", "6", "7"], correctAnswer: 1, points: 10 }
    ]
  },
  {
    title: "Our Body Parts",
    description: "Learn about human body",
    grade: "1",
    subject: "Science",
    difficulty: "easy",
    totalPoints: 100,
    questions: [
      { questionText: "How many eyes do we have?", options: ["1", "2", "3", "4"], correctAnswer: 1, points: 10 },
      { questionText: "What do we use to see?", options: ["Nose", "Eyes", "Ears", "Mouth"], correctAnswer: 1, points: 10 },
      { questionText: "What do we use to hear?", options: ["Eyes", "Nose", "Ears", "Hands"], correctAnswer: 2, points: 10 },
      { questionText: "How many fingers on both hands?", options: ["5", "10", "15", "20"], correctAnswer: 1, points: 10 },
      { questionText: "What do we use to smell?", options: ["Eyes", "Ears", "Nose", "Mouth"], correctAnswer: 2, points: 10 },
      { questionText: "What do we use to taste food?", options: ["Nose", "Ears", "Eyes", "Tongue"], correctAnswer: 3, points: 10 },
      { questionText: "How many legs do we have?", options: ["1", "2", "3", "4"], correctAnswer: 1, points: 10 },
      { questionText: "What covers our body?", options: ["Feathers", "Skin", "Scales", "Fur"], correctAnswer: 1, points: 10 },
      { questionText: "What helps us walk?", options: ["Hands", "Ears", "Legs", "Eyes"], correctAnswer: 2, points: 10 },
      { questionText: "What do we use to eat?", options: ["Hands", "Mouth", "Nose", "Ears"], correctAnswer: 1, points: 10 }
    ]
  },
  {
    title: "Simple Words",
    description: "Read and understand simple words",
    grade: "1",
    subject: "English",
    difficulty: "easy",
    totalPoints: 100,
    questions: [
      { questionText: "What is the opposite of 'Big'?", options: ["Huge", "Small", "Large", "Tall"], correctAnswer: 1, points: 10 },
      { questionText: "What is the opposite of 'Hot'?", options: ["Warm", "Cool", "Cold", "Spicy"], correctAnswer: 2, points: 10 },
      { questionText: "What is the opposite of 'Up'?", options: ["High", "Down", "Top", "Over"], correctAnswer: 1, points: 10 },
      { questionText: "What is the opposite of 'Day'?", options: ["Morning", "Evening", "Night", "Noon"], correctAnswer: 2, points: 10 },
      { questionText: "What is the opposite of 'Happy'?", options: ["Glad", "Sad", "Joy", "Smile"], correctAnswer: 1, points: 10 },
      { questionText: "What is the opposite of 'Old'?", options: ["New", "Ancient", "Aged", "Elderly"], correctAnswer: 0, points: 10 },
      { questionText: "What is the opposite of 'Fast'?", options: ["Quick", "Slow", "Speed", "Swift"], correctAnswer: 1, points: 10 },
      { questionText: "What is the opposite of 'Good'?", options: ["Great", "Nice", "Bad", "Fine"], correctAnswer: 2, points: 10 },
      { questionText: "What is the opposite of 'In'?", options: ["Inside", "Out", "Enter", "Within"], correctAnswer: 1, points: 10 },
      { questionText: "What is the opposite of 'Yes'?", options: ["Sure", "No", "Okay", "Right"], correctAnswer: 1, points: 10 }
    ]
  },
  {
    title: "Days and Seasons",
    description: "Learn about time and weather",
    grade: "1",
    subject: "General Knowledge",
    difficulty: "easy",
    totalPoints: 100,
    questions: [
      { questionText: "How many seasons are there?", options: ["2", "3", "4", "5"], correctAnswer: 2, points: 10 },
      { questionText: "Which season is very hot?", options: ["Winter", "Summer", "Spring", "Autumn"], correctAnswer: 1, points: 10 },
      { questionText: "Which season is very cold?", options: ["Summer", "Winter", "Spring", "Monsoon"], correctAnswer: 1, points: 10 },
      { questionText: "What comes after Monday?", options: ["Sunday", "Tuesday", "Wednesday", "Friday"], correctAnswer: 1, points: 10 },
      { questionText: "What is the first day of the week?", options: ["Monday", "Sunday", "Saturday", "Tuesday"], correctAnswer: 1, points: 10 },
      { questionText: "Which season do flowers bloom?", options: ["Winter", "Summer", "Spring", "Autumn"], correctAnswer: 2, points: 10 },
      { questionText: "What day comes before Sunday?", options: ["Monday", "Friday", "Saturday", "Thursday"], correctAnswer: 2, points: 10 },
      { questionText: "In which season do leaves fall?", options: ["Spring", "Summer", "Autumn", "Winter"], correctAnswer: 2, points: 10 },
      { questionText: "How many days in a week?", options: ["5", "6", "7", "8"], correctAnswer: 2, points: 10 },
      { questionText: "When does the sun shine brightest?", options: ["Night", "Morning", "Noon", "Evening"], correctAnswer: 2, points: 10 }
    ]
  }
];

// Export for Grade 1
module.exports = { grade1Quizzes: quizData };
