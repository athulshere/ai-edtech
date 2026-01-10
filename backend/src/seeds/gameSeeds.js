/**
 * Educational Games Seeds
 * 10 different games per subject for grades 1-12
 */

const games = {
  // GRADE 1 - MATHEMATICS (10 games)
  grade1Math: [
    {
      title: 'Number Race 1-20',
      description: 'Race to arrange numbers from 1 to 20 in correct order',
      gameType: 'sorting_game',
      subject: 'Mathematics',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Number Recognition',
      timeLimit: 180,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        categories: [
          {
            name: 'Arrange in Order',
            items: ['5', '12', '3', '18', '7', '1', '15', '9', '20', '4']
          }
        ]
      }
    },
    {
      title: 'Shape Matcher',
      description: 'Match shapes with their names',
      gameType: 'matching_pairs',
      subject: 'Mathematics',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Shapes',
      timeLimit: 200,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        pairs: [
          { left: '🔴 Circle', right: 'Round shape with no corners' },
          { left: '🔷 Square', right: 'Four equal sides and corners' },
          { left: '🔺 Triangle', right: 'Three sides and three corners' },
          { left: '📐 Rectangle', right: 'Four sides, opposite sides equal' },
          { left: '⭐ Star', right: 'Shape with pointed edges' }
        ]
      }
    },
    {
      title: 'Addition Adventure',
      description: 'Solve simple addition problems',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Addition',
      timeLimit: 240,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        questions: [
          { question: '2 + 3 = ?', options: ['4', '5', '6', '7'], correctAnswer: 1, points: 10 },
          { question: '5 + 2 = ?', options: ['6', '7', '8', '9'], correctAnswer: 1, points: 10 },
          { question: '4 + 4 = ?', options: ['7', '8', '9', '10'], correctAnswer: 1, points: 10 },
          { question: '1 + 6 = ?', options: ['5', '6', '7', '8'], correctAnswer: 2, points: 10 },
          { question: '3 + 5 = ?', options: ['6', '7', '8', '9'], correctAnswer: 2, points: 10 },
          { question: '7 + 2 = ?', options: ['8', '9', '10', '11'], correctAnswer: 1, points: 10 },
          { question: '6 + 3 = ?', options: ['8', '9', '10', '11'], correctAnswer: 1, points: 10 },
          { question: '2 + 8 = ?', options: ['9', '10', '11', '12'], correctAnswer: 1, points: 10 },
          { question: '5 + 5 = ?', options: ['9', '10', '11', '12'], correctAnswer: 1, points: 10 },
          { question: '4 + 6 = ?', options: ['9', '10', '11', '12'], correctAnswer: 1, points: 10 }
        ]
      }
    },
    {
      title: 'Subtraction Safari',
      description: 'Practice subtraction with fun animal themes',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Subtraction',
      timeLimit: 240,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        questions: [
          { question: '5 - 2 = ?', options: ['2', '3', '4', '5'], correctAnswer: 1, points: 10 },
          { question: '8 - 3 = ?', options: ['4', '5', '6', '7'], correctAnswer: 1, points: 10 },
          { question: '10 - 4 = ?', options: ['5', '6', '7', '8'], correctAnswer: 1, points: 10 },
          { question: '7 - 5 = ?', options: ['1', '2', '3', '4'], correctAnswer: 1, points: 10 },
          { question: '9 - 3 = ?', options: ['5', '6', '7', '8'], correctAnswer: 1, points: 10 },
          { question: '6 - 2 = ?', options: ['3', '4', '5', '6'], correctAnswer: 1, points: 10 },
          { question: '10 - 5 = ?', options: ['4', '5', '6', '7'], correctAnswer: 1, points: 10 },
          { question: '8 - 6 = ?', options: ['1', '2', '3', '4'], correctAnswer: 1, points: 10 },
          { question: '7 - 4 = ?', options: ['2', '3', '4', '5'], correctAnswer: 1, points: 10 },
          { question: '9 - 7 = ?', options: ['1', '2', '3', '4'], correctAnswer: 1, points: 10 }
        ]
      }
    },
    {
      title: 'Count the Objects',
      description: 'Count items and choose the correct number',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Counting',
      timeLimit: 200,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        questions: [
          { question: 'How many apples? 🍎🍎🍎', options: ['2', '3', '4', '5'], correctAnswer: 1, points: 10 },
          { question: 'How many stars? ⭐⭐⭐⭐⭐', options: ['4', '5', '6', '7'], correctAnswer: 1, points: 10 },
          { question: 'How many hearts? ❤️❤️❤️❤️❤️❤️❤️', options: ['6', '7', '8', '9'], correctAnswer: 1, points: 10 },
          { question: 'How many balloons? 🎈🎈🎈🎈', options: ['3', '4', '5', '6'], correctAnswer: 1, points: 10 },
          { question: 'How many flowers? 🌸🌸🌸🌸🌸🌸', options: ['5', '6', '7', '8'], correctAnswer: 1, points: 10 },
          { question: 'How many cars? 🚗🚗🚗🚗🚗🚗🚗🚗', options: ['7', '8', '9', '10'], correctAnswer: 1, points: 10 },
          { question: 'How many books? 📚📚📚📚📚', options: ['4', '5', '6', '7'], correctAnswer: 1, points: 10 },
          { question: 'How many pencils? ✏️✏️✏️✏️✏️✏️✏️✏️✏️', options: ['8', '9', '10', '11'], correctAnswer: 1, points: 10 },
          { question: 'How many trees? 🌳🌳🌳', options: ['2', '3', '4', '5'], correctAnswer: 1, points: 10 },
          { question: 'How many suns? ☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️', options: ['9', '10', '11', '12'], correctAnswer: 1, points: 10 }
        ]
      }
    },
    {
      title: 'Pattern Detective',
      description: 'Find the next item in the pattern',
      gameType: 'pattern_finder',
      subject: 'Mathematics',
      grade: '1',
      difficulty: 'medium',
      syllabusTopic: 'Patterns',
      timeLimit: 300,
      maxScore: 100,
      pointsReward: 25,
      gameConfig: {
        patterns: [
          { sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'], nextItems: ['🔴', '🔵', '🟢', '🟡'], correctNext: 1 },
          { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], nextItems: ['⭐', '🌙', '☀️', '🔴'], correctNext: 1 },
          { sequence: ['1', '2', '3', '1', '2'], nextItems: ['1', '2', '3', '4'], correctNext: 2 },
          { sequence: ['🍎', '🍌', '🍎', '🍌', '🍎'], nextItems: ['🍎', '🍌', '🍇', '🍊'], correctNext: 1 },
          { sequence: ['A', 'B', 'A', 'B', 'A'], nextItems: ['A', 'B', 'C', 'D'], correctNext: 1 }
        ]
      }
    },
    {
      title: 'Big or Small?',
      description: 'Compare numbers and choose the bigger one',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Comparison',
      timeLimit: 180,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        questions: [
          { question: 'Which is bigger: 5 or 3?', options: ['3', '5', 'Same', 'Neither'], correctAnswer: 1, points: 10 },
          { question: 'Which is bigger: 8 or 10?', options: ['8', '10', 'Same', 'Neither'], correctAnswer: 1, points: 10 },
          { question: 'Which is smaller: 12 or 7?', options: ['12', '7', 'Same', 'Neither'], correctAnswer: 1, points: 10 },
          { question: 'Which is bigger: 15 or 9?', options: ['9', '15', 'Same', 'Neither'], correctAnswer: 1, points: 10 },
          { question: 'Which is smaller: 4 or 6?', options: ['6', '4', 'Same', 'Neither'], correctAnswer: 1, points: 10 },
          { question: 'Which is bigger: 11 or 14?', options: ['11', '14', 'Same', 'Neither'], correctAnswer: 1, points: 10 },
          { question: 'Which is smaller: 20 or 18?', options: ['20', '18', 'Same', 'Neither'], correctAnswer: 1, points: 10 },
          { question: 'Which is bigger: 7 or 7?', options: ['First 7', 'Second 7', 'Same', 'Neither'], correctAnswer: 2, points: 10 },
          { question: 'Which is smaller: 13 or 16?', options: ['16', '13', 'Same', 'Neither'], correctAnswer: 1, points: 10 },
          { question: 'Which is bigger: 19 or 17?', options: ['17', '19', 'Same', 'Neither'], correctAnswer: 1, points: 10 }
        ]
      }
    },
    {
      title: 'Money Matters',
      description: 'Count coins and identify money values',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '1',
      difficulty: 'medium',
      syllabusTopic: 'Money',
      timeLimit: 300,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        questions: [
          { question: 'How much: 1 rupee + 1 rupee?', options: ['1 rupee', '2 rupees', '3 rupees', '4 rupees'], correctAnswer: 1, points: 10 },
          { question: 'How much: 2 rupees + 3 rupees?', options: ['4 rupees', '5 rupees', '6 rupees', '7 rupees'], correctAnswer: 1, points: 10 },
          { question: 'How much: 5 rupees + 5 rupees?', options: ['8 rupees', '9 rupees', '10 rupees', '11 rupees'], correctAnswer: 2, points: 10 },
          { question: 'How much: 10 rupees - 2 rupees?', options: ['6 rupees', '7 rupees', '8 rupees', '9 rupees'], correctAnswer: 2, points: 10 },
          { question: 'How much: 10 rupees - 5 rupees?', options: ['4 rupees', '5 rupees', '6 rupees', '7 rupees'], correctAnswer: 1, points: 10 }
        ]
      }
    },
    {
      title: 'Time Teller',
      description: 'Learn to read simple clock times',
      gameType: 'matching_pairs',
      subject: 'Mathematics',
      grade: '1',
      difficulty: 'medium',
      syllabusTopic: 'Time',
      timeLimit: 250,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        pairs: [
          { left: '1 o\'clock', right: 'Small hand on 1, big hand on 12' },
          { left: '3 o\'clock', right: 'Small hand on 3, big hand on 12' },
          { left: '6 o\'clock', right: 'Small hand on 6, big hand on 12' },
          { left: '9 o\'clock', right: 'Small hand on 9, big hand on 12' },
          { left: '12 o\'clock', right: 'Both hands on 12' }
        ]
      }
    },
    {
      title: 'Length Learner',
      description: 'Compare lengths - longer or shorter',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Measurement',
      timeLimit: 200,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        questions: [
          { question: 'Which is longer: A pencil or a ruler?', options: ['Pencil', 'Ruler', 'Same', 'Neither'], correctAnswer: 1, points: 10 },
          { question: 'Which is shorter: A book or a notebook?', options: ['Book', 'Notebook', 'Same', 'Can\'t tell'], correctAnswer: 1, points: 10 },
          { question: 'Which is longer: A bus or a car?', options: ['Car', 'Bus', 'Same', 'Neither'], correctAnswer: 1, points: 10 },
          { question: 'Which is shorter: Your finger or your arm?', options: ['Arm', 'Finger', 'Same', 'Neither'], correctAnswer: 1, points: 10 },
          { question: 'Which is longer: A train or a bicycle?', options: ['Bicycle', 'Train', 'Same', 'Neither'], correctAnswer: 1, points: 10 }
        ]
      }
    }
  ],

  // GRADE 1 - ENGLISH (10 games)
  grade1English: [
    {
      title: 'Alphabet Adventure',
      description: 'Match uppercase and lowercase letters',
      gameType: 'matching_pairs',
      subject: 'English',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Alphabets',
      timeLimit: 200,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        pairs: [
          { left: 'A', right: 'a' },
          { left: 'B', right: 'b' },
          { left: 'C', right: 'c' },
          { left: 'D', right: 'd' },
          { left: 'E', right: 'e' },
          { left: 'F', right: 'f' },
          { left: 'G', right: 'g' },
          { left: 'H', right: 'h' }
        ]
      }
    },
    {
      title: 'Vowel Hunter',
      description: 'Find the vowels in words',
      gameType: 'multiple_choice_race',
      subject: 'English',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Vowels',
      timeLimit: 180,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        questions: [
          { question: 'Which is a vowel in "CAT"?', options: ['C', 'A', 'T', 'None'], correctAnswer: 1, points: 10 },
          { question: 'Which is a vowel in "DOG"?', options: ['D', 'O', 'G', 'None'], correctAnswer: 1, points: 10 },
          { question: 'Which is a vowel in "PEN"?', options: ['P', 'E', 'N', 'None'], correctAnswer: 1, points: 10 },
          { question: 'Which is a vowel in "SUN"?', options: ['S', 'U', 'N', 'None'], correctAnswer: 1, points: 10 },
          { question: 'Which is a vowel in "BAT"?', options: ['B', 'A', 'T', 'None'], correctAnswer: 1, points: 10 },
          { question: 'How many vowels in "APPLE"?', options: ['1', '2', '3', '4'], correctAnswer: 1, points: 10 },
          { question: 'Which is a vowel in "FISH"?', options: ['F', 'I', 'S', 'H'], correctAnswer: 1, points: 10 },
          { question: 'Which is a vowel in "EGG"?', options: ['E', 'G', 'Both', 'None'], correctAnswer: 0, points: 10 },
          { question: 'How many vowels in "UMBRELLA"?', options: ['2', '3', '4', '5'], correctAnswer: 1, points: 10 },
          { question: 'Which is NOT a vowel?', options: ['A', 'E', 'I', 'B'], correctAnswer: 3, points: 10 }
        ]
      }
    },
    {
      title: 'Rhyme Time',
      description: 'Match words that rhyme',
      gameType: 'matching_pairs',
      subject: 'English',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Rhyming Words',
      timeLimit: 220,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        pairs: [
          { left: 'Cat', right: 'Hat' },
          { left: 'Dog', right: 'Log' },
          { left: 'Sun', right: 'Run' },
          { left: 'Ball', right: 'Wall' },
          { left: 'Tree', right: 'Bee' },
          { left: 'Book', right: 'Cook' }
        ]
      }
    },
    {
      title: 'Spelling Bee Junior',
      description: 'Spell simple three-letter words correctly',
      gameType: 'spelling_bee',
      subject: 'English',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Spelling',
      timeLimit: 300,
      maxScore: 100,
      pointsReward: 25,
      gameConfig: {
        questions: [
          { question: 'Spell the word for 🐱', options: ['CAT', 'CET', 'KAT', 'COT'], correctAnswer: 0, explanation: 'CAT is spelled C-A-T', points: 10 },
          { question: 'Spell the word for 🐕', options: ['DAG', 'DOG', 'DUG', 'DOK'], correctAnswer: 1, explanation: 'DOG is spelled D-O-G', points: 10 },
          { question: 'Spell the word for ☀️', options: ['SAN', 'SUN', 'SON', 'SIN'], correctAnswer: 1, explanation: 'SUN is spelled S-U-N', points: 10 },
          { question: 'Spell the word for 🎩', options: ['HAT', 'HET', 'HIT', 'HOT'], correctAnswer: 0, explanation: 'HAT is spelled H-A-T', points: 10 },
          { question: 'Spell the word for ✏️', options: ['PAN', 'PEN', 'PIN', 'PUN'], correctAnswer: 1, explanation: 'PEN is spelled P-E-N', points: 10 }
        ]
      }
    },
    {
      title: 'Sentence Builder',
      description: 'Arrange words to make a sentence',
      gameType: 'sentence_builder',
      subject: 'English',
      grade: '1',
      difficulty: 'medium',
      syllabusTopic: 'Sentence Formation',
      timeLimit: 240,
      maxScore: 100,
      pointsReward: 25,
      gameConfig: {
        words: ['I', 'am', 'a', 'student', 'good'],
        sentences: ['I am a good student', 'The cat is big', 'I like to play'],
        correctOrder: [0, 1, 2, 4, 3]
      }
    },
    {
      title: 'Opposite Pairs',
      description: 'Match words with their opposites',
      gameType: 'matching_pairs',
      subject: 'English',
      grade: '1',
      difficulty: 'medium',
      syllabusTopic: 'Opposites',
      timeLimit: 200,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        pairs: [
          { left: 'Big', right: 'Small' },
          { left: 'Hot', right: 'Cold' },
          { left: 'Happy', right: 'Sad' },
          { left: 'Day', right: 'Night' },
          { left: 'Up', right: 'Down' },
          { left: 'Good', right: 'Bad' }
        ]
      }
    },
    {
      title: 'Word Picture Match',
      description: 'Match words to their pictures',
      gameType: 'matching_pairs',
      subject: 'English',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Vocabulary',
      timeLimit: 180,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        pairs: [
          { left: 'Apple 🍎', right: 'A red fruit' },
          { left: 'Ball ⚽', right: 'A round toy' },
          { left: 'Car 🚗', right: 'A vehicle with wheels' },
          { left: 'Doll 🎎', right: 'A toy to play with' },
          { left: 'Elephant 🐘', right: 'A big animal with trunk' }
        ]
      }
    },
    {
      title: 'Capital Letter Champion',
      description: 'Identify which words need capital letters',
      gameType: 'multiple_choice_race',
      subject: 'English',
      grade: '1',
      difficulty: 'medium',
      syllabusTopic: 'Capital Letters',
      timeLimit: 240,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        questions: [
          { question: 'Which needs a capital letter?', options: ['cat', 'tom (name)', 'ball', 'run'], correctAnswer: 1, points: 10 },
          { question: 'Which is correct?', options: ['i am happy', 'I am happy', 'i Am happy', 'i am Happy'], correctAnswer: 1, points: 10 },
          { question: 'Name of a day needs capital?', options: ['Yes', 'No', 'Sometimes', 'Never'], correctAnswer: 0, points: 10 },
          { question: 'Which is correct?', options: ['monday', 'Monday', 'monDay', 'MONDAY'], correctAnswer: 1, points: 10 },
          { question: 'First word of sentence needs capital?', options: ['Yes', 'No', 'Sometimes', 'Never'], correctAnswer: 0, points: 10 }
        ]
      }
    },
    {
      title: 'Noun Detective',
      description: 'Find the naming words (nouns)',
      gameType: 'multiple_choice_race',
      subject: 'English',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Nouns',
      timeLimit: 200,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        questions: [
          { question: 'Which is a noun (naming word)?', options: ['Run', 'Book', 'Happy', 'Quickly'], correctAnswer: 1, points: 10 },
          { question: 'Which names a person?', options: ['Eat', 'Teacher', 'Fast', 'Jump'], correctAnswer: 1, points: 10 },
          { question: 'Which names a place?', options: ['School', 'Play', 'Tall', 'Sing'], correctAnswer: 0, points: 10 },
          { question: 'Which names an animal?', options: ['Walk', 'Dog', 'Small', 'Sleep'], correctAnswer: 1, points: 10 },
          { question: 'Which names a thing?', options: ['Beautiful', 'Chair', 'Dance', 'Loud'], correctAnswer: 1, points: 10 }
        ]
      }
    },
    {
      title: 'Action Words',
      description: 'Identify action words (verbs)',
      gameType: 'multiple_choice_race',
      subject: 'English',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Verbs',
      timeLimit: 200,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        questions: [
          { question: 'Which is an action word?', options: ['Cat', 'Run', 'Big', 'Table'], correctAnswer: 1, points: 10 },
          { question: 'Which shows an action?', options: ['Book', 'Jump', 'Red', 'Chair'], correctAnswer: 1, points: 10 },
          { question: 'What action: The bird ___', options: ['tree', 'flies', 'blue', 'small'], correctAnswer: 1, points: 10 },
          { question: 'Which is an action?', options: ['Sleep', 'Bed', 'Night', 'Dark'], correctAnswer: 0, points: 10 },
          { question: 'What can you do?', options: ['Table', 'Eat', 'Plate', 'Food'], correctAnswer: 1, points: 10 }
        ]
      }
    }
  ],

  // GRADE 1 - SCIENCE (10 games)
  grade1Science: [
    {
      title: 'Living or Non-Living?',
      description: 'Classify things as living or non-living',
      gameType: 'sorting_game',
      subject: 'Science',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Living Things',
      timeLimit: 180,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        categories: [
          { name: 'Living', items: ['Dog', 'Tree', 'Bird', 'Fish', 'Cat'] },
          { name: 'Non-Living', items: ['Rock', 'Chair', 'Book', 'Car', 'Toy'] }
        ]
      }
    },
    {
      title: 'Body Parts Explorer',
      description: 'Match body parts with their functions',
      gameType: 'matching_pairs',
      subject: 'Science',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Human Body',
      timeLimit: 200,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        pairs: [
          { left: 'Eyes 👁️', right: 'Used for seeing' },
          { left: 'Ears 👂', right: 'Used for hearing' },
          { left: 'Nose 👃', right: 'Used for smelling' },
          { left: 'Tongue 👅', right: 'Used for tasting' },
          { left: 'Hands 🖐️', right: 'Used for touching and holding' }
        ]
      }
    },
    {
      title: 'Animal Homes',
      description: 'Match animals to their homes',
      gameType: 'matching_pairs',
      subject: 'Science',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Animals',
      timeLimit: 220,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        pairs: [
          { left: 'Bird 🐦', right: 'Nest' },
          { left: 'Bee 🐝', right: 'Hive' },
          { left: 'Dog 🐕', right: 'Kennel' },
          { left: 'Fish 🐠', right: 'Water/Aquarium' },
          { left: 'Lion 🦁', right: 'Den' },
          { left: 'Cow 🐄', right: 'Shed' }
        ]
      }
    },
    {
      title: 'Plant Parts',
      description: 'Identify different parts of a plant',
      gameType: 'multiple_choice_race',
      subject: 'Science',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Plants',
      timeLimit: 180,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        questions: [
          { question: 'Which part is under the ground?', options: ['Leaf', 'Root', 'Flower', 'Fruit'], correctAnswer: 1, points: 10 },
          { question: 'Which part makes food?', options: ['Root', 'Stem', 'Leaf', 'Flower'], correctAnswer: 2, points: 10 },
          { question: 'Which part becomes fruit?', options: ['Root', 'Leaf', 'Flower', 'Stem'], correctAnswer: 2, points: 10 },
          { question: 'Which carries water up?', options: ['Leaf', 'Stem', 'Flower', 'Fruit'], correctAnswer: 1, points: 10 },
          { question: 'Which part is green?', options: ['Root', 'Leaf', 'Flower (usually)', 'All parts'], correctAnswer: 1, points: 10 }
        ]
      }
    },
    {
      title: 'Weather Watcher',
      description: 'Identify different types of weather',
      gameType: 'multiple_choice_race',
      subject: 'Science',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Weather',
      timeLimit: 180,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        questions: [
          { question: 'When is it hottest?', options: ['Morning', 'Noon', 'Evening', 'Night'], correctAnswer: 1, points: 10 },
          { question: 'What do you see when it rains?', options: ['Sun', 'Clouds and water', 'Stars', 'Rainbow only'], correctAnswer: 1, points: 10 },
          { question: 'What comes after rain?', options: ['More rain', 'Lightning', 'Rainbow (sometimes)', 'Snow'], correctAnswer: 2, points: 10 },
          { question: 'When is it coldest?', options: ['Summer', 'Winter', 'Spring', 'Autumn'], correctAnswer: 1, points: 10 },
          { question: 'What provides heat and light?', options: ['Moon', 'Sun', 'Stars', 'Clouds'], correctAnswer: 1, points: 10 }
        ]
      }
    },
    {
      title: 'Food Groups',
      description: 'Sort foods into healthy and unhealthy',
      gameType: 'sorting_game',
      subject: 'Science',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Nutrition',
      timeLimit: 200,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        categories: [
          { name: 'Healthy', items: ['Apple', 'Milk', 'Vegetables', 'Fruits', 'Nuts'] },
          { name: 'Eat Less', items: ['Candy', 'Chips', 'Soda', 'Ice Cream', 'Cookies'] }
        ]
      }
    },
    {
      title: 'Day and Night',
      description: 'Identify day and night activities',
      gameType: 'sorting_game',
      subject: 'Science',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Day and Night',
      timeLimit: 180,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        categories: [
          { name: 'Day', items: ['School', 'Play in park', 'Breakfast', 'Lunch', 'Sunshine'] },
          { name: 'Night', items: ['Sleep', 'Dinner', 'Moon', 'Stars', 'Bedtime story'] }
        ]
      }
    },
    {
      title: 'Senses Quiz',
      description: 'Match senses with what they detect',
      gameType: 'matching_pairs',
      subject: 'Science',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Five Senses',
      timeLimit: 200,
      maxScore: 100,
      pointsReward: 15,
      gameConfig: {
        pairs: [
          { left: 'Sight', right: 'Colors and shapes' },
          { left: 'Hearing', right: 'Sounds and music' },
          { left: 'Smell', right: 'Perfume and flowers' },
          { left: 'Taste', right: 'Sweet and sour' },
          { left: 'Touch', right: 'Hot and cold' }
        ]
      }
    },
    {
      title: 'Water Cycle Basics',
      description: 'Learn where water comes from',
      gameType: 'multiple_choice_race',
      subject: 'Science',
      grade: '1',
      difficulty: 'medium',
      syllabusTopic: 'Water',
      timeLimit: 200,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        questions: [
          { question: 'Where does rain come from?', options: ['Trees', 'Clouds', 'Ground', 'Moon'], correctAnswer: 1, points: 10 },
          { question: 'What happens when water is heated?', options: ['Freezes', 'Evaporates', 'Nothing', 'Turns green'], correctAnswer: 1, points: 10 },
          { question: 'Where is water found?', options: ['Rivers', 'Lakes', 'Ocean', 'All of these'], correctAnswer: 3, points: 10 },
          { question: 'What is ice?', options: ['Hot water', 'Frozen water', 'Steam', 'Rain'], correctAnswer: 1, points: 10 },
          { question: 'Do plants need water?', options: ['Yes', 'No', 'Sometimes', 'Never'], correctAnswer: 0, points: 10 }
        ]
      }
    },
    {
      title: 'Seasons Sorting',
      description: 'Match activities to seasons',
      gameType: 'sorting_game',
      subject: 'Science',
      grade: '1',
      difficulty: 'easy',
      syllabusTopic: 'Seasons',
      timeLimit: 220,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        categories: [
          { name: 'Summer', items: ['Swimming', 'Ice cream', 'Hot weather', 'Beach'] },
          { name: 'Winter', items: ['Sweater', 'Cold weather', 'Warm clothes', 'Fireplace'] },
          { name: 'Rainy', items: ['Umbrella', 'Raincoat', 'Puddles', 'Clouds'] }
        ]
      }
    }
  ]
};

module.exports = games;
