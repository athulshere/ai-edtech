require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./src/models/Quiz');
const { grade1Quizzes } = require('./src/seeds/quizSeeds');

const seedQuizzes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('🗑️  Cleared existing quizzes\n');

    // Insert Grade 1 quizzes
    const grade1Created = await Quiz.insertMany(grade1Quizzes);
    console.log(`✅ Created ${grade1Created.length} quizzes for Grade 1`);

    // Generate quizzes for Grades 2-12
    const allGrades = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    for (const grade of allGrades) {
      const gradeQuizzes = generateQuizzesForGrade(grade);
      const created = await Quiz.insertMany(gradeQuizzes);
      console.log(`✅ Created ${created.length} quizzes for Grade ${grade}`);
    }

    console.log('\n🎉 Quiz seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
    process.exit(1);
  }
};

function generateQuizzesForGrade(grade) {
  const gradeNum = parseInt(grade);
  const quizzes = [];

  // Mathematics Quizzes (3 quizzes per grade)
  const mathQuestions = generateMathQuestions(gradeNum, 10);
  quizzes.push({
    title: `Grade ${grade} - Arithmetic Challenge`,
    description: "Test your calculation skills",
    grade: grade,
    subject: "Mathematics",
    difficulty: gradeNum <= 4 ? 'easy' : gradeNum <= 8 ? 'medium' : 'hard',
    questions: mathQuestions,
    totalPoints: mathQuestions.reduce((sum, q) => sum + (q.points || 10), 0)
  });

  const patternQuestions = generatePatternQuestions(gradeNum, 10);
  quizzes.push({
    title: `Grade ${grade} - Number Patterns`,
    description: "Identify and complete number patterns",
    grade: grade,
    subject: "Mathematics",
    difficulty: gradeNum <= 4 ? 'easy' : gradeNum <= 8 ? 'medium' : 'hard',
    questions: patternQuestions,
    totalPoints: patternQuestions.reduce((sum, q) => sum + (q.points || 10), 0)
  });

  const wordProblems = generateWordProblems(gradeNum, 10);
  quizzes.push({
    title: `Grade ${grade} - Word Problems`,
    description: "Solve real-world math problems",
    grade: grade,
    subject: "Mathematics",
    difficulty: gradeNum <= 4 ? 'medium' : gradeNum <= 8 ? 'medium' : 'hard',
    questions: wordProblems,
    totalPoints: wordProblems.reduce((sum, q) => sum + (q.points || 10), 0)
  });

  // Science Quizzes (3 quizzes per grade)
  const scienceQuestions = generateScienceQuestions(gradeNum, 10);
  quizzes.push({
    title: `Grade ${grade} - Science Basics`,
    description: "Fundamental science concepts",
    grade: grade,
    subject: "Science",
    difficulty: gradeNum <= 4 ? 'easy' : gradeNum <= 8 ? 'medium' : 'hard',
    questions: scienceQuestions,
    totalPoints: scienceQuestions.reduce((sum, q) => sum + (q.points || 10), 0)
  });

  const biologyQuestions = generateBiologyQuestions(gradeNum, 10);
  quizzes.push({
    title: `Grade ${grade} - Living Things`,
    description: "Learn about plants and animals",
    grade: grade,
    subject: "Science",
    difficulty: gradeNum <= 4 ? 'easy' : gradeNum <= 8 ? 'medium' : 'hard',
    questions: biologyQuestions,
    totalPoints: biologyQuestions.reduce((sum, q) => sum + (q.points || 10), 0)
  });

  const environmentQuestions = generateEnvironmentQuestions(gradeNum, 10);
  quizzes.push({
    title: `Grade ${grade} - Our Environment`,
    description: "Understand the world around us",
    grade: grade,
    subject: "Science",
    difficulty: gradeNum <= 4 ? 'easy' : gradeNum <= 8 ? 'medium' : 'hard',
    questions: environmentQuestions,
    totalPoints: environmentQuestions.reduce((sum, q) => sum + (q.points || 10), 0)
  });

  // English Quizzes (2 quizzes per grade)
  const grammarQuestions = generateGrammarQuestions(gradeNum, 10);
  quizzes.push({
    title: `Grade ${grade} - Grammar Basics`,
    description: "Master English grammar",
    grade: grade,
    subject: "English",
    difficulty: gradeNum <= 4 ? 'easy' : gradeNum <= 8 ? 'medium' : 'hard',
    questions: grammarQuestions,
    totalPoints: grammarQuestions.reduce((sum, q) => sum + (q.points || 10), 0)
  });

  const vocabQuestions = generateVocabularyQuestions(gradeNum, 10);
  quizzes.push({
    title: `Grade ${grade} - Vocabulary Builder`,
    description: "Expand your word knowledge",
    grade: grade,
    subject: "English",
    difficulty: gradeNum <= 4 ? 'easy' : gradeNum <= 8 ? 'medium' : 'hard',
    questions: vocabQuestions,
    totalPoints: vocabQuestions.reduce((sum, q) => sum + (q.points || 10), 0)
  });

  // Social Studies (1 quiz per grade)
  const socialQuestions = generateSocialStudiesQuestions(gradeNum, 10);
  quizzes.push({
    title: `Grade ${grade} - World Around Us`,
    description: "Geography and culture",
    grade: grade,
    subject: "Social Studies",
    difficulty: gradeNum <= 4 ? 'easy' : gradeNum <= 8 ? 'medium' : 'hard',
    questions: socialQuestions,
    totalPoints: socialQuestions.reduce((sum, q) => sum + (q.points || 10), 0)
  });

  // General Knowledge (1 quiz per grade)
  const gkQuestions = generateGKQuestions(gradeNum, 10);
  quizzes.push({
    title: `Grade ${grade} - General Knowledge`,
    description: "Test your general awareness",
    grade: grade,
    subject: "General Knowledge",
    difficulty: gradeNum <= 4 ? 'easy' : gradeNum <= 8 ? 'medium' : 'hard',
    questions: gkQuestions,
    totalPoints: gkQuestions.reduce((sum, q) => sum + (q.points || 10), 0)
  });

  return quizzes;
}

// Question generation functions
function generateMathQuestions(grade, count) {
  const questions = [];
  const maxNum = grade * 10;

  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * maxNum) + 1;
    const b = Math.floor(Math.random() * maxNum) + 1;
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * (grade <= 2 ? 2 : 3))];

    let answer, question;
    if (op === '+') {
      answer = a + b;
      question = `What is ${a} + ${b}?`;
    } else if (op === '-') {
      answer = Math.abs(a - b);
      question = `What is ${Math.max(a, b)} - ${Math.min(a, b)}?`;
    } else {
      answer = a * b;
      question = `What is ${a} × ${b}?`;
    }

    const correctIdx = Math.floor(Math.random() * 4);
    const options = [];
    for (let j = 0; j < 4; j++) {
      if (j === correctIdx) {
        options.push(answer.toString());
      } else {
        let wrongAnswer;
        do {
          wrongAnswer = answer + Math.floor(Math.random() * 10) - 5;
        } while (wrongAnswer === answer || wrongAnswer < 0 || options.includes(wrongAnswer.toString()));
        options.push(wrongAnswer.toString());
      }
    }

    questions.push({
      questionText: question,
      options: options,
      correctAnswer: correctIdx,
      points: 10,
      explanation: `${question.replace('What is ', '').replace('?', '')} = ${answer}`
    });
  }

  return questions;
}

function generatePatternQuestions(grade, count) {
  const questions = [];
  const patterns = [
    { start: 2, step: 2, name: "even numbers" },
    { start: 1, step: 2, name: "odd numbers" },
    { start: 5, step: 5, name: "multiples of 5" },
    { start: 10, step: 10, name: "multiples of 10" }
  ];

  for (let i = 0; i < count; i++) {
    const pattern = patterns[i % patterns.length];
    const sequence = [];
    for (let j = 0; j < 4; j++) {
      sequence.push(pattern.start + (j * pattern.step));
    }
    const missing = pattern.start + (4 * pattern.step);

    const correctIdx = Math.floor(Math.random() * 4);
    const options = [];
    for (let j = 0; j < 4; j++) {
      if (j === correctIdx) {
        options.push(missing.toString());
      } else {
        options.push((missing + ((j - correctIdx) * pattern.step)).toString());
      }
    }

    questions.push({
      questionText: `What comes next? ${sequence.join(', ')}, __`,
      options: options,
      correctAnswer: correctIdx,
      points: 10,
      explanation: `This is a pattern of ${pattern.name}`
    });
  }

  return questions;
}

function generateWordProblems(grade, count) {
  const questions = [];
  const scenarios = [
    "Sarah has {a} apples. Her friend gives her {b} more. How many does she have now?",
    "There are {a} birds on a tree. {b} more birds join them. How many birds are there in total?",
    "A basket has {a} oranges. {b} oranges are eaten. How many are left?",
    "John had {a} marbles. He lost {b} marbles. How many does he have left?",
    "A box contains {a} chocolates. If {b} more are added, how many are there?",
    "There were {a} students in class. {b} students went home. How many remain?",
    "A farmer has {a} chickens. He buys {b} more. How many chickens does he have?",
    "A library has {a} books. {b} books are returned. How many books now?",
    "Mom baked {a} cookies. She baked {b} more. How many cookies in total?",
    "A pond has {a} fish. {b} fish swim away. How many fish are left?"
  ];

  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * (grade * 5)) + 5;
    const b = Math.floor(Math.random() * (grade * 3)) + 2;
    const scenario = scenarios[i % scenarios.length];
    const isAddition = scenario.includes('more') || scenario.includes('join') || scenario.includes('added') || scenario.includes('returned') || scenario.includes('total');

    const question = scenario.replace('{a}', a).replace('{b}', b);
    const answer = isAddition ? a + b : a - b;

    const correctIdx = Math.floor(Math.random() * 4);
    const options = [];
    for (let j = 0; j < 4; j++) {
      if (j === correctIdx) {
        options.push(answer.toString());
      } else {
        let wrongAnswer = answer + ((j - correctIdx) * 3);
        if (wrongAnswer < 0) wrongAnswer = Math.abs(wrongAnswer);
        options.push(wrongAnswer.toString());
      }
    }

    questions.push({
      questionText: question,
      options: options,
      correctAnswer: correctIdx,
      points: 10,
      explanation: `${isAddition ? a + ' + ' + b : a + ' - ' + b} = ${answer}`
    });
  }

  return questions;
}

function generateScienceQuestions(grade, count) {
  const scienceTopics = [
    { q: "What do plants need to grow?", opts: ["Only water", "Sunlight, water, and soil", "Only soil", "Only air"], correct: 1 },
    { q: "What is the largest planet?", opts: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 2 },
    { q: "What do we call animals that eat only plants?", opts: ["Carnivores", "Herbivores", "Omnivores", "Insectivores"], correct: 1 },
    { q: "What is the center of an atom called?", opts: ["Electron", "Proton", "Nucleus", "Neutron"], correct: 2 },
    { q: "What is the process by which plants make food?", opts: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"], correct: 1 },
    { q: "What is water made of?", opts: ["Hydrogen only", "Oxygen only", "Hydrogen and Oxygen", "Carbon"], correct: 2 },
    { q: "What is the hardest natural substance?", opts: ["Gold", "Iron", "Diamond", "Steel"], correct: 2 },
    { q: "Which gas do plants give out?", opts: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], correct: 2 },
    { q: "What is the boiling point of water?", opts: ["0°C", "50°C", "100°C", "150°C"], correct: 2 },
    { q: "What force pulls things to the ground?", opts: ["Magnetism", "Gravity", "Friction", "Electricity"], correct: 1 }
  ];

  return scienceTopics.slice(0, count).map(topic => ({
    questionText: topic.q,
    options: topic.opts,
    correctAnswer: topic.correct,
    points: 10
  }));
}

function generateBiologyQuestions(grade, count) {
  const bioTopics = [
    { q: "What is the largest organ in human body?", opts: ["Heart", "Brain", "Skin", "Liver"], correct: 2 },
    { q: "How many bones does an adult have?", opts: ["106", "206", "306", "406"], correct: 1 },
    { q: "What do red blood cells carry?", opts: ["Water", "Oxygen", "Food", "Waste"], correct: 1 },
    { q: "What is the smallest unit of life?", opts: ["Atom", "Cell", "Organ", "Tissue"], correct: 1 },
    { q: "Where is DNA found?", opts: ["Blood", "Skin", "Nucleus of cells", "Bones"], correct: 2 },
    { q: "What type of animal is a whale?", opts: ["Fish", "Reptile", "Mammal", "Amphibian"], correct: 2 },
    { q: "What do insects use to breathe?", opts: ["Lungs", "Gills", "Spiracles", "Skin"], correct: 2 },
    { q: "What is the main function of roots?", opts: ["Photosynthesis", "Reproduction", "Absorb water", "Make seeds"], correct: 2 },
    { q: "What is pollination?", opts: ["Making seeds", "Transfer of pollen", "Growing flowers", "Making food"], correct: 1 },
    { q: "Which animal lays eggs?", opts: ["Dog", "Cat", "Bird", "Cow"], correct: 2 }
  ];

  return bioTopics.slice(0, count).map(topic => ({
    questionText: topic.q,
    options: topic.opts,
    correctAnswer: topic.correct,
    points: 10
  }));
}

function generateEnvironmentQuestions(grade, count) {
  const envTopics = [
    { q: "What is recycling?", opts: ["Throwing waste", "Burning waste", "Reusing materials", "Burying waste"], correct: 2 },
    { q: "Which gas causes global warming?", opts: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correct: 2 },
    { q: "What is the main source of energy on Earth?", opts: ["Moon", "Sun", "Stars", "Wind"], correct: 1 },
    { q: "What is deforestation?", opts: ["Planting trees", "Cutting down forests", "Growing forests", "Protecting trees"], correct: 1 },
    { q: "What is renewable energy?", opts: ["Coal", "Oil", "Solar power", "Gas"], correct: 2 },
    { q: "Where does rain come from?", opts: ["Rivers", "Clouds", "Ocean", "Trees"], correct: 1 },
    { q: "What is pollution?", opts: ["Clean air", "Fresh water", "Harmful substances", "Pure soil"], correct: 2 },
    { q: "What is conservation?", opts: ["Using everything", "Wasting resources", "Protecting nature", "Destroying habitat"], correct: 2 },
    { q: "What creates wind?", opts: ["Trees", "Air pressure differences", "Rain", "Clouds"], correct: 1 },
    { q: "What is the greenhouse effect?", opts: ["Growing plants", "Trapping heat", "Making oxygen", "Cleaning air"], correct: 1 }
  ];

  return envTopics.slice(0, count).map(topic => ({
    questionText: topic.q,
    options: topic.opts,
    correctAnswer: topic.correct,
    points: 10
  }));
}

function generateGrammarQuestions(grade, count) {
  const grammarTopics = [
    { q: "Which is a noun?", opts: ["Run", "Happy", "Dog", "Quickly"], correct: 2 },
    { q: "Which is a verb?", opts: ["Table", "Jump", "Red", "Beautiful"], correct: 1 },
    { q: "What is the plural of 'child'?", opts: ["Childs", "Children", "Childes", "Childrens"], correct: 1 },
    { q: "Which is an adjective?", opts: ["Eat", "Beautiful", "House", "Sing"], correct: 1 },
    { q: "What is the past tense of 'go'?", opts: ["Goed", "Gone", "Went", "Going"], correct: 2 },
    { q: "Which sentence is correct?", opts: ["He go to school", "He goes to school", "He going school", "He gone school"], correct: 1 },
    { q: "What is a pronoun?", opts: ["Name word", "Action word", "Replaces noun", "Describing word"], correct: 2 },
    { q: "Which is correct?", opts: ["I is happy", "I am happy", "I are happy", "I be happy"], correct: 1 },
    { q: "What is the opposite of 'big'?", opts: ["Huge", "Large", "Small", "Tall"], correct: 2 },
    { q: "Which needs a capital letter?", opts: ["dog", "cat", "india", "book"], correct: 2 }
  ];

  return grammarTopics.slice(0, count).map(topic => ({
    questionText: topic.q,
    options: topic.opts,
    correctAnswer: topic.correct,
    points: 10
  }));
}

function generateVocabularyQuestions(grade, count) {
  const vocabTopics = [
    { q: "What is a synonym for 'happy'?", opts: ["Sad", "Joyful", "Angry", "Tired"], correct: 1 },
    { q: "What does 'enormous' mean?", opts: ["Tiny", "Very large", "Average", "Small"], correct: 1 },
    { q: "What is an antonym for 'hot'?", opts: ["Warm", "Cold", "Spicy", "Burning"], correct: 1 },
    { q: "What does 'brave' mean?", opts: ["Scared", "Courageous", "Weak", "Shy"], correct: 1 },
    { q: "What is a synonym for 'quick'?", opts: ["Slow", "Fast", "Lazy", "Tired"], correct: 1 },
    { q: "What does 'ancient' mean?", opts: ["New", "Modern", "Very old", "Recent"], correct: 2 },
    { q: "What is an antonym for 'difficult'?", opts: ["Hard", "Tough", "Easy", "Complex"], correct: 2 },
    { q: "What does 'gentle' mean?", opts: ["Rough", "Harsh", "Kind and soft", "Strong"], correct: 2 },
    { q: "What is a synonym for 'beautiful'?", opts: ["Ugly", "Plain", "Lovely", "Bad"], correct: 2 },
    { q: "What does 'curious' mean?", opts: ["Bored", "Wanting to learn", "Tired", "Scared"], correct: 1 }
  ];

  return vocabTopics.slice(0, count).map(topic => ({
    questionText: topic.q,
    options: topic.opts,
    correctAnswer: topic.correct,
    points: 10
  }));
}

function generateSocialStudiesQuestions(grade, count) {
  const socialTopics = [
    { q: "What is the capital of India?", opts: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], correct: 1 },
    { q: "How many continents are there?", opts: ["5", "6", "7", "8"], correct: 2 },
    { q: "Which is the largest ocean?", opts: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
    { q: "What is a map?", opts: ["A book", "A picture of Earth", "A globe", "A compass"], correct: 1 },
    { q: "Who is the father of our nation (India)?", opts: ["Nehru", "Gandhi", "Patel", "Ambedkar"], correct: 1 },
    { q: "What is democracy?", opts: ["Rule by one", "Rule by people", "Rule by king", "No rules"], correct: 1 },
    { q: "What is a community?", opts: ["One person", "Group of people", "A building", "A road"], correct: 1 },
    { q: "Which direction does the sun rise?", opts: ["North", "South", "East", "West"], correct: 2 },
    { q: "What is culture?", opts: ["Food only", "Way of life", "Language only", "Clothes only"], correct: 1 },
    { q: "What is a citizen?", opts: ["Tourist", "Member of country", "Visitor", "Guest"], correct: 1 }
  ];

  return socialTopics.slice(0, count).map(topic => ({
    questionText: topic.q,
    options: topic.opts,
    correctAnswer: topic.correct,
    points: 10
  }));
}

function generateGKQuestions(grade, count) {
  const gkTopics = [
    { q: "How many colors in a rainbow?", opts: ["5", "6", "7", "8"], correct: 2 },
    { q: "What is the national bird of India?", opts: ["Parrot", "Peacock", "Eagle", "Sparrow"], correct: 1 },
    { q: "How many hours in a day?", opts: ["12", "24", "36", "48"], correct: 1 },
    { q: "Which planet is known as the Red Planet?", opts: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
    { q: "What is the national game of India?", opts: ["Cricket", "Football", "Hockey", "Tennis"], correct: 2 },
    { q: "How many sides does a hexagon have?", opts: ["4", "5", "6", "7"], correct: 2 },
    { q: "What is the largest land animal?", opts: ["Lion", "Elephant", "Giraffe", "Rhino"], correct: 1 },
    { q: "Which festival is called festival of lights?", opts: ["Holi", "Diwali", "Eid", "Christmas"], correct: 1 },
    { q: "What is the tallest mountain?", opts: ["K2", "Everest", "Kilimanjaro", "Alps"], correct: 1 },
    { q: "How many minutes in an hour?", opts: ["30", "45", "60", "90"], correct: 2 }
  ];

  return gkTopics.slice(0, count).map(topic => ({
    questionText: topic.q,
    options: topic.opts,
    correctAnswer: topic.correct,
    points: 10
  }));
}

seedQuizzes();
