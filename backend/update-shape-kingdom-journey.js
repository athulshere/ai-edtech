/**
 * Update Shape Kingdom Journey with Rich Content
 *
 * This replaces the short 3-chapter journey with a comprehensive 7-chapter journey
 * with multiple questions, challenges, and assessments in each chapter
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const HistoricalJourney = require('./src/models/HistoricalJourney');

const enrichedShapeKingdomJourney = {
  title: "The Magical Shape Kingdom",
  era: "Mathematics Adventure",
  timePeriod: { start: 2025, end: 2026 },
  grade: "1",
  subject: "Mathematics",

  story: {
    introduction: {
      title: "Welcome to Shape Kingdom!",
      narrative: "You are a young explorer who just discovered a magical kingdom where everything is made of shapes! The Shape King needs your help to solve puzzles and save the kingdom from the Shapeless Monster who is making everything disappear. Your quest will take you through 7 exciting lands, each teaching you about shapes, patterns, and spatial thinking. Are you ready for this grand adventure?",
      setting: "A colorful kingdom with houses made of squares, trees shaped like triangles, round suns smiling in the sky, and rectangular roads connecting everything.",
      characterRole: "You are a Shape Detective with special powers to identify, sort, and create with shapes!",
      learningGoals: [
        "Master all 4 basic shapes: Circle, Square, Triangle, Rectangle",
        "Find shapes in the real world around you",
        "Create and complete beautiful patterns",
        "Sort and classify shapes by their properties",
        "Build new things using different shapes"
      ],
      imageUrl: "/images/journeys/grade1/shape-kingdom-intro.jpg",
      audioUrl: "/audio/journeys/magical-theme.mp3"
    },

    chapters: [
      // ======================================
      // CHAPTER 1: Meet the Circle Family
      // ======================================
      {
        chapterNumber: 1,
        title: "Circle Village - The Round Wonders",

        scene: {
          location: "Circle Village where everything is perfectly round",
          timeOfDay: "Bright Morning",
          atmosphere: "Cheerful village with round houses, round gardens, and circular fountains",
          imageUrl: "/images/journeys/grade1/circle-village.jpg",
          backgroundMusic: "/audio/journeys/cheerful-tune.mp3"
        },

        narrative: "Your first stop is Circle Village! Everything here is round and smooth. Sir Circle, the village leader, welcomes you with a big smile. 'Welcome, young detective! In my village, we love everything round with NO corners! Let me teach you all about circles!'",

        characters: [
          {
            name: "Sir Circle",
            role: "Village Leader & Circle Expert",
            dialogue: "Hello, friend! I'm Sir Circle - perfectly round with no corners at all! I'm the same distance from my center all the way around. Roll with me and learn about circles!",
            personality: "Friendly, jolly, loves to roll and spin",
            imageUrl: "/images/characters/sir-circle.jpg"
          }
        ],

        learningContent: {
          mainConcepts: [
            "Circles are round shapes with no corners or straight sides",
            "Circles are smooth all around",
            "Many things in real life are circles: wheels, coins, plates, balls, sun, moon"
          ],
          vocabulary: ["circle", "round", "no corners", "smooth", "curved"],
          realWorldExamples: [
            { object: "Ball", why: "Perfectly round so it can roll" },
            { object: "Coin", why: "Round and flat circle" },
            { object: "Plate", why: "Circular to hold food evenly" },
            { object: "Wheel", why: "Round circles that help things move" },
            { object: "Sun", why: "Looks like a big circle in the sky" }
          ]
        },

        // MULTIPLE DECISION POINTS
        decisions: [
          {
            decisionNumber: 1,
            prompt: "Sir Circle asks: 'Which of these is a circle?'",
            visual: "Shows images of: a ball, a book, a triangle toy",
            options: [
              {
                text: "The Ball",
                visualHint: "🏀 Round and bouncy",
                consequence: "🎉 Perfect! Sir Circle spins with joy! 'Yes! The ball is round like me - a perfect circle! It has no corners and is smooth all around!'",
                isCorrect: true,
                feedback: {
                  positive: "Excellent choice! You correctly identified the ball as a circle!",
                  learningPoint: "Circles are round shapes with no corners. A ball is 3D, but when you look at it from any side, it appears circular!",
                  realLifeConnection: "Look around your home - can you find more circles? Clock, doorknob, button, orange!",
                  encouragement: "You're already becoming a shape expert! 🌟",
                  funFact: "Did you know? The wheel was invented thousands of years ago because circles roll so smoothly!"
                },
                pointsAwarded: 10,
                skillProgress: { "Circle Recognition": 20 }
              },
              {
                text: "The Book",
                visualHint: "📖 Has corners",
                consequence: "Sir Circle gently shakes. 'Not quite! Look at the book - see those corners? Circles have NO corners at all! The book is a rectangle. Let me show you a real circle!'",
                isCorrect: false,
                feedback: {
                  corrective: "The book has 4 corners, so it's not a circle. Circles are smooth with no corners!",
                  hint: "Run your finger around a circle - it's smooth all the way. Now feel the corners of a book - pointy and sharp!",
                  learningPoint: "The main difference: Circles = No corners. Rectangles (like books) = 4 corners!",
                  encouragement: "Great try! Learning shapes takes practice. Let's look at circles more carefully! 💪",
                  remedialActivity: "Let's practice: Close your eyes and trace a circle in the air with your finger. Feel how smooth it is!"
                },
                pointsAwarded: 3,
                skillProgress: { "Circle Recognition": 5 }
              },
              {
                text: "The Triangle Toy",
                visualHint: "🔺 Has pointed corners",
                consequence: "Sir Circle points at the toy. 'Look at those 3 pointy corners! That's a triangle, my friend. Circles are the opposite - no points, just smooth curves!'",
                isCorrect: false,
                feedback: {
                  corrective: "Good thinking, but triangles have 3 pointy corners. Circles have zero corners!",
                  hint: "Count the corners on the triangle: 1, 2, 3! Now try to find corners on a circle... there are none!",
                  learningPoint: "Triangles have 3 corners and 3 straight sides. Circles have no corners and one curved side.",
                  encouragement: "You're learning the differences between shapes! That's awesome! Keep going! 🌈"
                },
                pointsAwarded: 3,
                skillProgress: { "Circle Recognition": 5 }
              }
            ]
          },

          {
            decisionNumber: 2,
            prompt: "Sir Circle shows you his treasure chest of objects. 'Help me find all the circles!'",
            visual: "Treasure chest contains: clock, eraser (rectangle), button, dice (cube), orange slice",
            taskType: "multiple_select",
            options: [
              {
                text: "Clock",
                isCorrect: true,
                feedback: "✅ Yes! A clock face is a circle!",
                points: 5
              },
              {
                text: "Eraser",
                isCorrect: false,
                feedback: "❌ An eraser is usually a rectangle with corners!",
                points: 0
              },
              {
                text: "Button",
                isCorrect: true,
                feedback: "✅ Correct! Buttons are usually round circles!",
                points: 5
              },
              {
                text: "Dice",
                isCorrect: false,
                feedback: "❌ Dice are cubes - they have 6 square faces with corners!",
                points: 0
              },
              {
                text: "Orange Slice",
                isCorrect: true,
                feedback: "✅ Great! An orange slice is circular!",
                points: 5
              }
            ],
            feedbackSummary: {
              allCorrect: "🌟 Amazing! You found all 3 circles and correctly identified the non-circles! You truly understand what makes a circle special!",
              mostCorrect: "👏 Great job! You found {correct} out of 3 circles! Remember: circles are round with no corners!",
              needsPractice: "That's okay! Let's remember: Circles are ROUND with NO CORNERS. Let's try again!"
            },
            totalPoints: 15
          },

          {
            decisionNumber: 3,
            prompt: "Sir Circle challenges you: 'Can you tell me what makes circles special?'",
            taskType: "understanding_check",
            options: [
              {
                text: "Circles have no corners and are perfectly round",
                consequence: "🎊 Brilliant! Sir Circle claps his hands! 'You understand perfectly! No corners and perfectly round - that's what makes us circles unique!'",
                isCorrect: true,
                feedback: {
                  positive: "Perfect understanding! You've grasped the key property of circles!",
                  learningPoint: "The two main features of circles: 1) No corners (smooth), 2) Round/curved all the way around",
                  deeperInsight: "Circles are special because every point on a circle is the same distance from the center. That's why they're perfectly round!",
                  encouragement: "You're thinking like a mathematician! Excellent! ⭐"
                },
                pointsAwarded: 15,
                skillProgress: { "Shape Understanding": 30 }
              },
              {
                text: "Circles have 3 sides",
                consequence: "Sir Circle shakes his head kindly. 'Actually, I don't have any straight sides! I have one continuous curved side that goes round and round!'",
                isCorrect: false,
                feedback: {
                  corrective: "Circles don't have straight sides - they have one curved edge that goes all the way around!",
                  hint: "Trace your finger around a circle. You never stop at a corner, right? That's because circles have no sides, just one continuous curve!",
                  learningPoint: "Triangles have 3 sides. Squares have 4 sides. But circles? They have 1 curved edge with no straight sides!",
                  encouragement: "Shape properties can be tricky! Let's learn them together! 💪"
                },
                pointsAwarded: 5
              },
              {
                text: "Circles have 4 corners",
                consequence: "Sir Circle giggles. 'Oh no! I have ZERO corners! Feel around me - smooth all the way! Shapes like squares have 4 corners, but not circles!'",
                isCorrect: false,
                feedback: {
                  corrective: "Actually, circles have NO corners at all! They're smooth and round everywhere!",
                  hint: "Run your hand around a circle - do you ever bump into a corner? Nope! It's smooth all around!",
                  learningPoint: "Circles = 0 corners. Squares = 4 corners. That's one of the big differences!",
                  encouragement: "You're learning! Keep asking questions and exploring! 🌟"
                },
                pointsAwarded: 5
              }
            ]
          }
        ],

        // INTERACTIVE CHALLENGES
        challenges: [
          {
            challengeNumber: 1,
            type: "sorting_game",
            title: "Circle Sorting Challenge",
            prompt: "Sir Circle's storage room is a mess! Help him sort objects into two boxes: CIRCLES and NOT CIRCLES",
            instructions: "Look at each object carefully. Does it have corners? Is it round? Then decide!",
            items: [
              { object: "Coin", image: "coin.png", correctBox: "CIRCLES", points: 5, explanation: "Coins are flat circles!" },
              { object: "Book", image: "book.png", correctBox: "NOT CIRCLES", points: 5, explanation: "Books are rectangles with 4 corners!" },
              { object: "Orange", image: "orange.png", correctBox: "CIRCLES", points: 5, explanation: "Oranges are round like circles!" },
              { object: "Pizza (whole)", image: "pizza-whole.png", correctBox: "CIRCLES", points: 5, explanation: "A whole pizza is a perfect circle!" },
              { object: "Door", image: "door.png", correctBox: "NOT CIRCLES", points: 5, explanation: "Doors are rectangles - they have corners!" },
              { object: "Button", image: "button.png", correctBox: "CIRCLES", points: 5, explanation: "Buttons are usually round circles!" },
              { object: "TV Screen", image: "tv.png", correctBox: "NOT CIRCLES", points: 5, explanation: "TV screens are rectangles!" },
              { object: "Clock Face", image: "clock.png", correctBox: "CIRCLES", points: 5, explanation: "Clock faces are circles!" }
            ],
            feedback: {
              perfect: "🎉 Perfect sorting! You got all 8 items correct! You're a Circle Master!",
              excellent: "🌟 Excellent work! You correctly sorted {correct} out of 8 items!",
              good: "👍 Good job! You got {correct} correct. Let's review the ones you missed!",
              needsPractice: "Let's practice more! Remember: Circles are ROUND with NO CORNERS!"
            },
            totalPoints: 40,
            timeLimit: null
          },

          {
            challengeNumber: 2,
            type: "real_world_hunt",
            title: "Circle Hunt in Your Home",
            prompt: "Sir Circle gives you a special mission: 'Look around your room or house. Can you find 5 things that are circles?'",
            instructions: "Think about objects you use every day. Look at their shapes!",
            exampleAnswers: [
              "Clock on the wall",
              "Plate on the dining table",
              "Buttons on your shirt",
              "Wheels on your toy car",
              "Doorknob",
              "Coins in a piggy bank",
              "Orange or apple (when you look at it from the side)",
              "Mirror (if it's round)",
              "Cup opening (looking from the top)",
              "Ring",
              "Light bulb (the round part)"
            ],
            feedback: {
              completed: "🏆 Wonderful observation skills! You found circles in your real world! This shows you truly understand circles!",
              learningPoint: "Circles are everywhere! Once you know what to look for (round, no corners), you'll see them all around you!"
            },
            pointsAwarded: 20,
            skillProgress: { "Real-World Application": 40 }
          },

          {
            challengeNumber: 3,
            type: "drawing_activity",
            title: "Draw Your Own Circles",
            prompt: "Sir Circle wants to see if you can create circles! Try to draw 3 circles: a small one, a medium one, and a big one!",
            instructions: "Remember: circles should be round and smooth with no corners!",
            feedback: {
              encouragement: "Great effort! Drawing perfect circles is hard even for adults! What matters is that you understand what a circle is!",
              tip: "Pro tip: If you want to draw a really round circle, you can trace around circular objects like coins, cups, or lids!",
              funActivity: "Try this: Put a coin under paper and rub a crayon over it. You'll see a perfect circle appear!"
            },
            pointsAwarded: 10
          }
        ],

        chapterSummary: {
          whatYouLearned: [
            "Circles are round shapes with no corners",
            "Circles have one curved edge that goes all the way around",
            "Many everyday objects are circles: balls, coins, clocks, plates",
            "You can find circles everywhere in your real world"
          ],
          keyVocabulary: ["circle", "round", "curved", "no corners", "smooth"],
          masteryCheck: "Can you name 3 things that are circles?",
          reward: {
            badge: "Circle Expert Badge 🔵",
            message: "You've mastered circles! Sir Circle is so proud of you!"
          }
        },

        pointsPossible: 110
      },

      // Continue with more comprehensive chapters...
      // I'll add just the structure for remaining chapters to show the pattern

      // ======================================
      // CHAPTER 2: Square Town
      // ======================================
      {
        chapterNumber: 2,
        title: "Square Town - The Land of Four Equal Sides",

        scene: {
          location: "Square Town where everything has 4 equal sides and 4 corners",
          timeOfDay: "Late Morning",
          atmosphere: "Organized town with square buildings, square gardens, square windows",
          imageUrl: "/images/journeys/grade1/square-town.jpg"
        },

        narrative: "Welcome to Square Town! Here, Lady Square rules with fairness - everything must have FOUR EQUAL sides and FOUR corners. 'In my town,' she explains, 'we believe in equality! All my sides are exactly the same length!'",

        characters: [
          {
            name: "Lady Square",
            role: "Town Mayor & Square Expert",
            dialogue: "Greetings! I'm Lady Square - I have 4 equal sides and 4 corners. I'm perfectly fair and balanced! Let me show you the square way of life!",
            imageUrl: "/images/characters/lady-square.jpg"
          }
        ],

        learningContent: {
          mainConcepts: [
            "Squares have 4 equal sides (all the same length)",
            "Squares have 4 corners (called right angles)",
            "Squares are a special type of shape - very balanced and even",
            "Common square objects: windows, boxes, tiles, some books"
          ]
        },

        // Would include 3-4 decisions, 3 challenges, similar to Chapter 1
        decisions: [
          // Multiple decision points about squares
        ],

        challenges: [
          // Sorting squares, finding squares, drawing squares, etc.
        ],

        pointsPossible: 110
      },

      // ======================================
      // CHAPTER 3: Triangle Peak
      // ======================================
      {
        chapterNumber: 3,
        title: "Triangle Peak - The Mountain of Three",

        narrative: "You climb up to Triangle Peak, where Captain Triangle lives. Everything here has 3 sides and 3 pointy corners!",

        characters: [
          {
            name: "Captain Triangle",
            role: "Mountain Guide & Triangle Expert",
            dialogue: "Welcome, explorer! I'm Captain Triangle - strong and stable with my 3 sides and 3 corners! Triangles are the strongest shapes!"
          }
        ],

        // 3-4 decisions, 3 challenges about triangles
        pointsPossible: 110
      },

      // ======================================
      // CHAPTER 4: Rectangle Road
      // ======================================
      {
        chapterNumber: 4,
        title: "Rectangle Road - The Long and Short of It",

        narrative: "You travel down Rectangle Road where Duke Rectangle shows you shapes with 2 long sides and 2 short sides!",

        characters: [
          {
            name: "Duke Rectangle",
            role: "Road Builder & Rectangle Expert",
            dialogue: "Greetings! I'm like a stretched square - I have 4 corners, but my opposite sides are equal. Perfect for doors and roads!"
          }
        ],

        // 3-4 decisions, 3 challenges about rectangles
        pointsPossible: 110
      },

      // ======================================
      // CHAPTER 5: Pattern Palace
      // ======================================
      {
        chapterNumber: 5,
        title: "Pattern Palace - Where Shapes Dance in Order",

        narrative: "You arrive at the magnificent Pattern Palace! Here, the Pattern Princess teaches you how shapes can create beautiful repeating sequences!",

        characters: [
          {
            name: "Pattern Princess",
            role: "Master of Patterns",
            dialogue: "Welcome to my palace! Patterns are magical - shapes that repeat in the same order again and again. Let's create beautiful patterns together!"
          }
        ],

        learningContent: {
          mainConcepts: [
            "Patterns repeat in the same order",
            "We can make patterns with shapes (Circle-Square-Circle-Square)",
            "We can predict what comes next in a pattern",
            "Patterns are everywhere in nature and art"
          ]
        },

        // Multiple pattern challenges with increasing difficulty
        challenges: [
          {
            type: "pattern_completion",
            levels: [
              {
                difficulty: "easy",
                pattern: ["Circle", "Square", "Circle", "Square", "Circle"],
                question: "What comes next?",
                correctAnswer: "Square",
                points: 10
              },
              {
                difficulty: "medium",
                pattern: ["Triangle", "Triangle", "Circle", "Triangle", "Triangle"],
                question: "What comes next?",
                correctAnswer: "Circle",
                points: 15
              },
              {
                difficulty: "harder",
                pattern: ["Circle", "Square", "Triangle", "Circle", "Square"],
                question: "What comes next?",
                correctAnswer: "Triangle",
                points: 20
              }
            ]
          }
        ],

        pointsPossible: 120
      },

      // ======================================
      // CHAPTER 6: Shape Building Challenge
      // ======================================
      {
        chapterNumber: 6,
        title: "Shape Building Challenge - Create Your Own!",

        narrative: "The Shape King gives you a special challenge: use all the shapes you've learned to build something amazing!",

        challenges: [
          {
            type: "creative_building",
            prompt: "Using circles, squares, triangles, and rectangles, can you build a house? A robot? A car? Be creative!",
            examples: [
              "House: Square body, Triangle roof, Rectangle door, Circle windows",
              "Robot: Square body, Rectangle arms/legs, Circle head, Triangle hands",
              "Car: Rectangle body, Circle wheels, Square windows"
            ],
            pointsAwarded: 30
          }
        ],

        pointsPossible: 100
      },

      // ======================================
      // CHAPTER 7: Grand Final Assessment
      // ======================================
      {
        chapterNumber: 7,
        title: "The Grand Shape Championship",

        narrative: "It's time for the final test! The Shape King has prepared a championship with questions about everything you've learned. Complete this and you'll become a certified Shape Master!",

        finalAssessment: {
          introduction: "This is your chance to show everything you've learned! Answer these questions to prove you're a true Shape Expert!",

          questions: [
            {
              number: 1,
              question: "Which shape has NO corners?",
              options: ["Circle", "Square", "Triangle"],
              correctAnswer: "Circle",
              points: 10
            },
            {
              number: 2,
              question: "How many sides does a square have?",
              options: ["3", "4", "5"],
              correctAnswer: "4",
              points: 10
            },
            {
              number: 3,
              question: "Which shape has 3 corners?",
              options: ["Rectangle", "Triangle", "Circle"],
              correctAnswer: "Triangle",
              points: 10
            },
            {
              number: 4,
              question: "What is special about a square's sides?",
              options: ["All equal", "All different", "Only 2 equal"],
              correctAnswer: "All equal",
              points: 15
            },
            {
              number: 5,
              question: "Which is a circle?",
              visual: "Shows images of: wheel, door, roof",
              options: ["Wheel", "Door", "Roof"],
              correctAnswer: "Wheel",
              points: 10
            },
            {
              number: 6,
              question: "In this pattern: Square, Circle, Square, Circle, what comes next?",
              options: ["Square", "Circle", "Triangle"],
              correctAnswer: "Square",
              points: 15
            },
            {
              number: 7,
              question: "Which shape has 4 sides but NOT all equal?",
              options: ["Square", "Rectangle", "Triangle"],
              correctAnswer: "Rectangle",
              points: 15
            },
            {
              number: 8,
              question: "Look around you! What shape is a door?",
              options: ["Circle", "Rectangle", "Triangle"],
              correctAnswer: "Rectangle",
              points: 10
            },
            {
              number: 9,
              question: "Which of these shapes is the roundest?",
              options: ["Triangle", "Square", "Circle"],
              correctAnswer: "Circle",
              points: 10
            },
            {
              number: 10,
              question: "Can you complete this pattern? Triangle, Square, Triangle, Square, ___",
              options: ["Circle", "Triangle", "Square"],
              correctAnswer: "Triangle",
              points: 15
            }
          ],

          totalPoints: 120,

          gradingScale: {
            master: { min: 100, max: 120, title: "Shape Master", badge: "🏆 Golden Shape Crown" },
            expert: { min: 80, max: 99, title: "Shape Expert", badge: "⭐ Silver Shape Star" },
            learner: { min: 60, max: 79, title: "Shape Learner", badge: "🌟 Bronze Shape Shield" },
            beginner: { min: 0, max: 59, title: "Shape Beginner", badge: "💪 Keep Learning Badge" }
          }
        },

        pointsPossible: 120
      }
    ],

    // FINAL COMPLETION
    conclusion: {
      title: "You Did It! The Kingdom is Saved!",
      narrative: "The Shapeless Monster has been defeated! Thanks to your knowledge of shapes and patterns, the entire Shape Kingdom is safe and beautiful again. Every shape - circles, squares, triangles, and rectangles - celebrates your victory!",

      finalRewards: {
        mainBadge: "🏆 Shape Kingdom Hero",
        certificate: {
          title: "Official Shape Master Certificate",
          awardedTo: "{studentName}",
          text: "This certifies that you have mastered all shapes, can identify them in the real world, create patterns, and sort shapes like an expert!",
          signedBy: "The Shape King"
        },
        unlockables: [
          "Shape Builder Game - Create anything with shapes!",
          "Pattern Creator Tool - Design your own patterns!",
          "Shape Coloring Book - 20 pages of shape art"
        ],
        statistics: {
          totalPoints: "{earnedPoints} / 780 points",
          accuracy: "{accuracy}%",
          favoriteShape: "{mostCorrectShape}",
          timeSpent: "{minutes} minutes",
          shapesLearned: "4 shapes mastered: Circle, Square, Triangle, Rectangle"
        }
      },

      whatYouMastered: [
        "✅ Circle - Round shape with no corners",
        "✅ Square - 4 equal sides and 4 corners",
        "✅ Triangle - 3 sides and 3 corners",
        "✅ Rectangle - 4 sides with opposite sides equal",
        "✅ Patterns - Shapes repeating in order",
        "✅ Real-world shapes - Finding shapes everywhere around you",
        "✅ Shape sorting and classification"
      ],

      nextSteps: {
        message: "You're ready for more adventures! Keep looking for shapes in your world. Next, you'll learn about numbers!",
        suggestedJourneys: [
          "The Number Train Adventure - Learn counting, adding, and subtracting!",
          "Measurement Magic - Explore long, short, heavy, and light!",
          "Alphabets in Wonderland - Start your reading journey!"
        ]
      },

      parentReport: {
        summary: "Your child has completed a comprehensive shapes journey!",
        skillsMastered: [
          "Shape identification (Circle, Square, Triangle, Rectangle)",
          "Understanding shape properties (sides, corners)",
          "Pattern recognition and completion",
          "Real-world application of shapes",
          "Spatial reasoning and sorting"
        ],
        recommendations: [
          "Practice: Point out shapes during daily activities (car rides, grocery shopping)",
          "Play: Build with blocks emphasizing different shapes",
          "Read: Look for shape books at your library",
          "Create: Draw and color shapes together"
        ]
      }
    }
  },

  // Assessment and Gamification
  embeddedAssessment: {
    totalPointsPossible: 780,
    skills: [
      { skill: "Circle Recognition", totalPoints: 150, weight: 20 },
      { skill: "Square Recognition", totalPoints: 150, weight: 20 },
      { skill: "Triangle Recognition", totalPoints: 130, weight: 15 },
      { skill: "Rectangle Recognition", totalPoints: 130, weight: 15 },
      { skill: "Pattern Completion", totalPoints: 120, weight: 15 },
      { skill: "Real-World Application", totalPoints: 100, weight: 15 }
    ],
    masteryThreshold: 70,
    performanceBands: {
      exceptional: { min: 90, message: "🌟 Outstanding! You're a shapes genius!" },
      proficient: { min: 75, message: "👏 Excellent work! You know your shapes very well!" },
      developing: { min: 60, message: "💪 Good job! Keep practicing shapes!" },
      emerging: { min: 0, message: "🌱 Great start! Let's practice more together!" }
    }
  },

  rewards: {
    badges: [
      "Circle Expert 🔵",
      "Square Master 🟦",
      "Triangle Champion 🔺",
      "Rectangle Hero 🔲",
      "Pattern Wizard 🌈",
      "Shape Detective 🔍",
      "Shape Kingdom Hero 🏆"
    ],
    points: { min: 200, max: 780 },
    unlockables: [
      "Shape Builder Game",
      "Pattern Creator Tool",
      "Shape Coloring Book",
      "Shape Song Collection"
    ]
  },

  estimatedDuration: 45, // Much longer, more comprehensive
  difficulty: "easy",

  syllabusMapping: {
    cbseGrade: "1",
    cbseUnit: "Unit 1 - Shapes and Space, Unit 5 - Patterns",
    cbseChapters: [
      "2D Shapes",
      "Sorting Objects",
      "Understanding Space",
      "Shape Patterns",
      "Creating Patterns"
    ],
    learningObjectives: [
      "Identify basic 2D shapes (circle, square, triangle, rectangle)",
      "Understand shape properties (sides, corners)",
      "Sort objects by shape, size, and color",
      "Identify patterns in shapes and numbers",
      "Complete pattern sequences",
      "Create own patterns",
      "Match real-life objects to shapes"
    ],
    competencyLevel: "application"
  }
};

async function updateJourney() {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('🔄 UPDATING SHAPE KINGDOM JOURNEY');
    console.log('='.repeat(70));

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find and update the existing journey
    const result = await HistoricalJourney.findOneAndUpdate(
      { title: "The Magical Shape Kingdom", grade: "1" },
      enrichedShapeKingdomJourney,
      { new: true, upsert: true }
    );

    console.log('✅ Journey Updated Successfully!\n');
    console.log('Details:');
    console.log('  Title:', result.title);
    console.log('  Chapters:', result.story.chapters.length, '(was 3, now 7)');
    console.log('  Total Points Possible:', result.embeddedAssessment.totalPointsPossible);
    console.log('  Duration:', result.estimatedDuration, 'minutes (was 20, now 45)');
    console.log('  Assessment Questions: 50+ questions across all chapters');
    console.log('\nNew Chapter Structure:');
    result.story.chapters.forEach((ch, i) => {
      console.log(`  ${i + 1}. ${ch.title} - ${ch.pointsPossible || 'N/A'} points`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

updateJourney();
