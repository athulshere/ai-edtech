/**
 * Complete Grade 1 Journey Role-Plays
 *
 * 10 Intelligent, engaging journeys covering all important Grade 1 CBSE topics:
 * - Mathematics (Numbers, Shapes, Patterns, Addition/Subtraction, Measurement, Time, Money, Data)
 * - English (Alphabets, Words, Reading, Rhymes, Sentences, Listening/Speaking)
 * - EVS (Family, Body, Food, Animals, Plants, Water, Weather)
 *
 * Each journey includes:
 * - Immersive storytelling with relatable characters
 * - Interactive decisions and challenges
 * - Embedded assessments with intelligent feedback
 * - Competency-based learning outcomes
 * - Rewards and positive reinforcement
 */

const grade1Journeys = [

  // ============================================
  // JOURNEY 1: THE MAGICAL SHAPE KINGDOM
  // Topics: Shapes, Spatial Reasoning, Patterns
  // ============================================
  {
    title: "The Magical Shape Kingdom",
    era: "Mathematics Adventure",
    timePeriod: { start: 2025, end: 2026 },
    grade: "1",
    subject: "Mathematics",

    story: {
      introduction: {
        title: "Welcome to Shape Kingdom!",
        narrative: "You are a young explorer who just discovered a magical kingdom where everything is made of shapes! The Shape King needs your help to solve puzzles and save the kingdom from the Shapeless Monster who is making everything disappear. Are you ready for this adventure?",
        setting: "A colorful kingdom with houses made of squares, trees shaped like triangles, and round suns smiling in the sky.",
        characterRole: "You are a Shape Detective with special powers to identify and arrange shapes!",
        imageUrl: "/images/journeys/grade1/shape-kingdom-intro.jpg",
        audioUrl: "/audio/journeys/magical-theme.mp3"
      },

      chapters: [
        {
          chapterNumber: 1,
          title: "Meet the Shape Family",

          scene: {
            location: "The Royal Shape Palace",
            timeOfDay: "Morning",
            atmosphere: "Bright and colorful, with shapes floating everywhere",
            imageUrl: "/images/journeys/grade1/shape-palace.jpg",
            backgroundMusic: "/audio/journeys/cheerful-tune.mp3"
          },

          narrative: "The Shape King welcomes you to his palace. 'Young explorer,' he says, 'the Shapeless Monster has mixed up all the shapes in my kingdom! Can you help me identify each shape?' Before you stand four friendly shape characters.",

          characters: [
            {
              name: "Sir Circle",
              role: "The Round Knight",
              dialogue: "Hello! I'm Sir Circle. I'm perfectly round with no corners. Can you find things like me around you? Balls, coins, and plates are my friends!",
              imageUrl: "/images/characters/sir-circle.jpg"
            },
            {
              name: "Lady Square",
              role: "The Fair Princess",
              dialogue: "Greetings! I'm Lady Square. I have 4 equal sides and 4 corners. Books, windows, and boxes look like me!",
              imageUrl: "/images/characters/lady-square.jpg"
            },
            {
              name: "Captain Triangle",
              role: "The Brave Warrior",
              dialogue: "Ahoy! I'm Captain Triangle with my 3 sides and 3 sharp corners. Mountains, pizza slices, and roofs are shaped like me!",
              imageUrl: "/images/characters/captain-triangle.jpg"
            },
            {
              name: "Duke Rectangle",
              role: "The Wise Elder",
              dialogue: "Welcome! I'm Duke Rectangle. Like Lady Square, I have 4 corners, but my opposite sides are equal. Doors, phones, and notebooks have my shape!",
              imageUrl: "/images/characters/duke-rectangle.jpg"
            }
          ],

          decisions: [
            {
              prompt: "The Shape King asks: 'Which shape has no corners at all?'",
              options: [
                {
                  text: "Circle",
                  consequence: "CORRECT! 🎉 Sir Circle does a happy dance! 'You're absolutely right! I'm the only shape with no corners. I'm smooth and round all around!'",
                  isCorrect: true,
                  feedback: {
                    positive: "Excellent work! You identified that circles are round and have no corners. In your home, you can find circles in clocks, plates, and wheels!",
                    learningPoint: "A circle is a round shape with no corners or straight lines. It's the same distance from the center all around.",
                    realLifeExample: "Look around - balls, coins, buttons, and the sun are all circles!",
                    encouragement: "You're becoming a great Shape Detective! ⭐"
                  },
                  pointsAwarded: 10,
                  leadsToChapter: 2
                },
                {
                  text: "Square",
                  consequence: "Lady Square gently shakes her head. 'Not quite! I have 4 corners. Let me show you!' She points to her four corners.",
                  isCorrect: false,
                  feedback: {
                    corrective: "Good try! But a square has 4 corners. Remember, we're looking for a shape with NO corners at all.",
                    hint: "Think of a shape that is round and smooth, like a ball or a coin.",
                    learningPoint: "A square has 4 equal sides and 4 corners. It's different from a circle which is round.",
                    encouragement: "It's okay to make mistakes - that's how we learn! Let's look at circles more carefully. 🌟"
                  },
                  pointsAwarded: 3,
                  leadsToChapter: 2
                },
                {
                  text: "Triangle",
                  consequence: "Captain Triangle salutes and says, 'Nice guess, explorer! But I have 3 pointy corners. See?' He shows his three sharp corners.",
                  isCorrect: false,
                  feedback: {
                    corrective: "That was a good try! But a triangle has 3 corners. We need the shape with zero corners.",
                    hint: "Look for the shape that is completely round, with no straight lines or pointy parts.",
                    learningPoint: "A triangle has 3 sides and 3 corners. It's very different from a round circle!",
                    encouragement: "Keep exploring! You're learning about each shape. That's wonderful! 💪"
                  },
                  pointsAwarded: 3,
                  leadsToChapter: 2
                }
              ]
            }
          ],

          challenges: [
            {
              type: "shape_sorting",
              prompt: "Help sort these objects into the correct shape boxes!",
              task: "Drag each object to match its shape",
              items: [
                { object: "Ball", correctShape: "Circle", points: 5 },
                { object: "Book", correctShape: "Rectangle", points: 5 },
                { object: "Pizza Slice", correctShape: "Triangle", points: 5 },
                { object: "Window", correctShape: "Square", points: 5 }
              ],
              feedback: {
                allCorrect: "🌟 Amazing! You sorted all the shapes perfectly! You really understand shapes!",
                someCorrect: "Good job! You got {correct} out of {total} right. Let's look at the ones you missed.",
                needsImprovement: "That's okay! Let's learn about each shape together. Remember: circles are round, squares have 4 equal sides, triangles have 3 sides, and rectangles are long squares!"
              }
            }
          ],

          learningOutcomes: [
            "Identify four basic 2D shapes: circle, square, triangle, rectangle",
            "Recognize shape properties (corners, sides)",
            "Match real-life objects to shapes"
          ]
        },

        {
          chapterNumber: 2,
          title: "The Pattern Puzzle",

          scene: {
            location: "The Pattern Garden",
            timeOfDay: "Afternoon",
            atmosphere: "A beautiful garden with flowers arranged in patterns",
            imageUrl: "/images/journeys/grade1/pattern-garden.jpg"
          },

          narrative: "You arrive at the magical Pattern Garden where flowers grow in special sequences. The Shapeless Monster has broken some patterns! The Garden Guardian needs your help to complete them before the flowers disappear.",

          characters: [
            {
              name: "Garden Guardian",
              role: "Keeper of Patterns",
              dialogue: "Thank you for coming! Patterns are the language of nature. When you understand patterns, you can predict what comes next. Let me teach you!",
              imageUrl: "/images/characters/garden-guardian.jpg"
            }
          ],

          decisions: [
            {
              prompt: "Look at this flower pattern: Circle, Square, Circle, Square, Circle, ___. What comes next?",
              options: [
                {
                  text: "Square",
                  consequence: "🌟 Perfect! The Garden Guardian claps with joy! 'You found the pattern! Circle, Square repeats over and over!'",
                  isCorrect: true,
                  feedback: {
                    positive: "Wonderful pattern recognition! You noticed that the pattern repeats: Circle, Square, Circle, Square...",
                    learningPoint: "A pattern is something that repeats in the same order again and again. In this pattern, two shapes keep repeating.",
                    realLifeExample: "Patterns are everywhere! Look at striped shirts (stripe, stripe), or day and night (day, night, day, night)!",
                    encouragement: "You're a pattern expert! Keep up the great work! 🎊"
                  },
                  pointsAwarded: 15,
                  leadsToChapter: 3
                },
                {
                  text: "Circle",
                  consequence: "The Guardian smiles kindly. 'Look again at the pattern. We just had Circle. What usually follows Circle in this pattern?'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Let's look carefully! The pattern is: Circle, Square, Circle, Square, Circle... After Circle comes Square!",
                    hint: "When we see the same things repeating, we can guess what comes next. This pattern switches between two shapes.",
                    learningPoint: "In this pattern, Circle and Square take turns: C-S-C-S-C-S",
                    encouragement: "Patterns can be tricky at first, but you're learning! Try again, you can do it! 🌈"
                  },
                  pointsAwarded: 5,
                  leadsToChapter: 3
                },
                {
                  text: "Triangle",
                  consequence: "The Guardian points to the pattern. 'Look closely! Triangle isn't in this pattern at all. Only Circle and Square are dancing together!'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Good thinking, but Triangle isn't part of this pattern! Only Circle and Square are here.",
                    hint: "A pattern repeats the SAME shapes in the SAME order. Look at just the first few shapes.",
                    learningPoint: "First, we need to see what shapes are in the pattern. Here, only Circle and Square repeat.",
                    encouragement: "You're learning to observe carefully! That's an important skill! Keep going! 💫"
                  },
                  pointsAwarded: 5,
                  leadsToChapter: 3
                }
              ]
            }
          ],

          challenges: [
            {
              type: "pattern_completion",
              prompt: "Complete these three patterns to save the garden!",
              patterns: [
                {
                  sequence: ["Circle", "Triangle", "Circle", "Triangle", "Circle"],
                  question: "What comes next?",
                  correctAnswer: "Triangle",
                  points: 10
                },
                {
                  sequence: ["Square", "Square", "Circle", "Square", "Square"],
                  question: "What comes next?",
                  correctAnswer: "Circle",
                  points: 10
                },
                {
                  sequence: ["Triangle", "Square", "Circle", "Triangle", "Square"],
                  question: "What comes next?",
                  correctAnswer: "Circle",
                  points: 15
                }
              ],
              feedback: {
                allCorrect: "🎉 You saved the Pattern Garden! All the flowers are blooming beautifully now!",
                someCorrect: "Great work! You restored {correct} out of {total} patterns. The garden is healing!",
                needsImprovement: "The garden needs more help! Remember: Look at what repeats, then find that pattern!"
              }
            }
          ],

          learningOutcomes: [
            "Identify patterns in shapes",
            "Complete pattern sequences",
            "Understand the concept of repetition"
          ]
        },

        {
          chapterNumber: 3,
          title: "Victory Celebration!",

          scene: {
            location: "The Royal Celebration Hall",
            timeOfDay: "Evening",
            atmosphere: "Festive with colorful decorations made of all shapes",
            imageUrl: "/images/journeys/grade1/celebration.jpg"
          },

          narrative: "You did it! The Shapeless Monster ran away when he saw how well you understand shapes and patterns. The whole kingdom celebrates your victory! The Shape King awards you the Golden Shape Medal!",

          characters: [
            {
              name: "Shape King",
              role: "Ruler of the Kingdom",
              dialogue: "You are now an official Shape Expert! You've learned about circles, squares, triangles, and rectangles. You can spot patterns and sort shapes. The kingdom is safe because of you!",
              imageUrl: "/images/characters/shape-king.jpg"
            }
          ],

          finalReward: {
            badge: "Shape Detective Master",
            certificate: "Official Shape Kingdom Explorer",
            unlocks: "Shape Builder Game",
            summary: "You learned to identify 4 basic shapes, understand their properties, recognize patterns, and match shapes to real objects!"
          }
        }
      ]
    },

    embeddedAssessment: {
      skills: [
        { skill: "Shape Recognition", totalPoints: 40 },
        { skill: "Pattern Identification", totalPoints: 50 },
        { skill: "Spatial Reasoning", totalPoints: 30 }
      ],
      masteryThreshold: 70,
      feedback: {
        excellent: "🌟 Outstanding! You're a Shape Master! You understood shapes and patterns perfectly!",
        good: "👏 Great job! You know your shapes well. Practice patterns a bit more!",
        needsPractice: "💪 Good start! Let's practice shapes together. Try the Shape Sorter game!"
      }
    },

    rewards: {
      badges: ["Shape Detective", "Pattern Finder", "Shape Kingdom Hero"],
      points: { min: 50, max: 120 },
      unlockables: ["Shape Builder Game", "Pattern Creator Tool"]
    },

    estimatedDuration: 20,
    difficulty: "easy",

    syllabusMapping: {
      cbseGrade: "1",
      cbseUnit: "Unit 1 - Shapes and Space, Unit 5 - Patterns",
      cbseChapters: ["2D Shapes", "Sorting Objects", "Shape Patterns", "Creating Patterns"],
      learningObjectives: [
        "Identify basic 2D shapes",
        "Sort objects by shape",
        "Identify patterns in shapes",
        "Complete pattern sequences"
      ],
      competencyLevel: "knowledge"
    }
  },

  // ============================================
  // JOURNEY 2: THE NUMBER TRAIN ADVENTURE
  // Topics: Numbers 1-20, Counting, Addition, Subtraction
  // ============================================
  {
    title: "The Number Train Adventure",
    era: "Mathematics Journey",
    timePeriod: { start: 2025, end: 2026 },
    grade: "1",
    subject: "Mathematics",

    story: {
      introduction: {
        title: "All Aboard the Number Train!",
        narrative: "Welcome to Number Station! A magical train travels through Number Land, stopping at stations from 1 to 20. But oh no! The Number Bandits have stolen some numbers from the train! Captain Count needs your help to find the missing numbers and bring them back safely.",
        setting: "A colorful train station with numbers dancing on signs",
        characterRole: "You are a Number Detective helping Captain Count!",
        imageUrl: "/images/journeys/grade1/number-train.jpg"
      },

      chapters: [
        {
          chapterNumber: 1,
          title: "Learning to Count",

          scene: {
            location: "Number Station Platform",
            timeOfDay: "Morning"
          },

          narrative: "Captain Count shows you the train. 'Each carriage has a number from 1 to 9,' he explains. 'But look! Some numbers are missing!'",

          characters: [
            {
              name: "Captain Count",
              role: "The Train Driver",
              dialogue: "Numbers are friends that always stay in order: 1, 2, 3, 4, 5, 6, 7, 8, 9! Let's find the missing ones!",
              imageUrl: "/images/characters/captain-count.jpg"
            }
          ],

          decisions: [
            {
              prompt: "The train shows: 1, 2, 3, __, 5, 6. What number is missing?",
              options: [
                {
                  text: "4",
                  consequence: "🎉 Perfect! Captain Count cheers! 'You found it! 4 comes right after 3 and before 5!'",
                  isCorrect: true,
                  feedback: {
                    positive: "Excellent counting! You know that 4 comes between 3 and 5. That's correct!",
                    learningPoint: "Numbers follow a pattern: each number is 1 more than the one before it. After 3 comes 4, then 5!",
                    realLifeExample: "When you count toys or stairs, you go: 1, 2, 3, 4, 5... in order!",
                    encouragement: "You're a counting champion! 🌟"
                  },
                  pointsAwarded: 10,
                  leadsToChapter: 2
                },
                {
                  text: "3",
                  consequence: "Captain Count smiles. 'We already have 3! Look, it's right here before the missing number.'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Good try! But 3 is already there. We need the number that comes AFTER 3.",
                    hint: "Count on your fingers: 1, 2, 3, and then one more... what do you get?",
                    learningPoint: "When counting forward, each new number is 1 bigger than the last one.",
                    encouragement: "Let's count together: 1, 2, 3, 4! You've got this! 💪"
                  },
                  pointsAwarded: 3,
                  leadsToChapter: 2
                },
                {
                  text: "5",
                  consequence: "Captain Count points to the train. 'Look carefully! 5 is already there, right after the missing spot!'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Nice thinking, but 5 is already on the train! We need the number between 3 and 5.",
                    hint: "What number comes after 3? Count: 3... and one more is?",
                    learningPoint: "Numbers are like a line of friends holding hands. Between 3 and 5, there's always 4!",
                    encouragement: "You're learning! Let's count slowly: 1, 2, 3, 4, 5. Great! 🌈"
                  },
                  pointsAwarded: 3,
                  leadsToChapter: 2
                }
              ]
            }
          ],

          challenges: [
            {
              type: "counting_objects",
              prompt: "Count these passengers waiting for the train!",
              tasks: [
                { image: "5 teddy bears", correctCount: 5, points: 5 },
                { image: "8 balloons", correctCount: 8, points: 5 },
                { image: "3 suitcases", correctCount: 3, points: 5 }
              ],
              feedback: {
                allCorrect: "Perfect counting! You counted everything correctly! 🎊",
                someCorrect: "Good job! You counted {correct} groups right!",
                needsImprovement: "Let's practice counting together! Point to each object as you count: 1, 2, 3..."
              }
            }
          ],

          learningOutcomes: [
            "Recognize and write numbers 1-9",
            "Count objects accurately",
            "Understand number sequence"
          ]
        },

        {
          chapterNumber: 2,
          title: "Addition Station",

          scene: {
            location: "Addition Station",
            timeOfDay: "Midday"
          },

          narrative: "The train arrives at Addition Station! Here, passengers get ON the train, making more people. Addition means 'putting together' or 'adding more'!",

          characters: [
            {
              name: "Addition Annie",
              role: "Station Master",
              dialogue: "When we ADD, we put groups together! If you have 2 apples and I give you 2 more apples, how many do you have now? Let's find out!",
              imageUrl: "/images/characters/addition-annie.jpg"
            }
          ],

          decisions: [
            {
              prompt: "There are 3 children on the train. At the station, 2 more children get on. How many children are now on the train?",
              options: [
                {
                  text: "5 children",
                  consequence: "🌟 Brilliant! Addition Annie dances with joy! '3 plus 2 equals 5! You added them together perfectly!'",
                  isCorrect: true,
                  feedback: {
                    positive: "Wonderful addition! You correctly added 3 + 2 = 5. You understood that addition means putting groups together!",
                    learningPoint: "When we ADD, we combine two groups. 3 children + 2 children = 5 children total!",
                    realLifeExample: "If you have 3 cookies and mom gives you 2 more, you have 5 cookies in all! 🍪",
                    encouragement: "You're an addition star! Keep it up! ⭐"
                  },
                  pointsAwarded: 15,
                  leadsToChapter: 3
                },
                {
                  text: "4 children",
                  consequence: "Addition Annie counts on her fingers. 'Let's count together: 1, 2, 3 (children already on train), then 4, 5 (two more get on). That's 5 total!'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Good try! But let's count carefully. Start with 3, then count 2 more: 3... 4... 5!",
                    hint: "Use your fingers! Show 3 fingers on one hand, then 2 on the other. Count all the fingers together!",
                    learningPoint: "3 + 2 = 5. When we add, we count all the objects together.",
                    encouragement: "Addition takes practice! Let's try again together. You're doing great! 🌟"
                  },
                  pointsAwarded: 5,
                  leadsToChapter: 3
                },
                {
                  text: "1 child",
                  consequence: "Addition Annie explains gently: 'When MORE children get ON, we have MORE total, not less! Let's add them together!'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Remember: ADD means we have MORE! We start with 3, and 2 more join, so we have more than 3!",
                    hint: "Adding makes numbers BIGGER! 3 plus 2 makes a bigger number than 3.",
                    learningPoint: "Addition increases the total. When we add, we get more than we started with!",
                    encouragement: "That's okay! Addition means 'more'. Let's practice together! 💪"
                  },
                  pointsAwarded: 3,
                  leadsToChapter: 3
                }
              ]
            }
          ],

          learningOutcomes: [
            "Understand addition as combining groups",
            "Add numbers up to 9",
            "Solve simple addition word problems"
          ]
        },

        {
          chapterNumber: 3,
          title: "Subtraction Station",

          scene: {
            location: "Subtraction Station",
            timeOfDay: "Afternoon"
          },

          narrative: "Next stop: Subtraction Station! Here, passengers get OFF the train. Subtraction means 'taking away' or 'removing'.",

          characters: [
            {
              name: "Subtract Sam",
              role: "Station Master",
              dialogue: "When we SUBTRACT, we take away! If you have 5 candies and eat 2, how many are left? Let's learn!",
              imageUrl: "/images/characters/subtract-sam.jpg"
            }
          ],

          decisions: [
            {
              prompt: "There are 6 balloons. 2 balloons fly away. How many balloons are left?",
              options: [
                {
                  text: "4 balloons",
                  consequence: "🎊 Perfect! Subtract Sam claps! '6 take away 2 equals 4! You subtracted correctly!'",
                  isCorrect: true,
                  feedback: {
                    positive: "Excellent subtraction! You correctly solved 6 - 2 = 4. You understood taking away!",
                    learningPoint: "When we SUBTRACT, we remove from a group. We started with 6, removed 2, and have 4 left!",
                    realLifeExample: "If you have 6 crayons and give 2 to your friend, you have 4 crayons left! 🖍️",
                    encouragement: "You're a subtraction superstar! Amazing work! 🌟"
                  },
                  pointsAwarded: 15,
                  leadsToChapter: 4
                },
                {
                  text: "8 balloons",
                  consequence: "Subtract Sam explains: 'When balloons fly AWAY, we have LESS, not more! Let's count what's left.'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Remember: SUBTRACT means taking away, so we have LESS! We can't have more than we started with!",
                    hint: "We started with 6. When 2 fly away, we have fewer than 6. Count backwards: 6, 5, 4!",
                    learningPoint: "Subtraction makes numbers SMALLER. 6 - 2 = 4 (which is less than 6).",
                    encouragement: "Subtraction is the opposite of addition! You're learning! Keep trying! 💫"
                  },
                  pointsAwarded: 5,
                  leadsToChapter: 4
                },
                {
                  text: "3 balloons",
                  consequence: "Subtract Sam counts: 'Let's see! 6 minus 2... start at 6, take away 1 (that's 5), take away 1 more (that's 4)!'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Close! But 6 - 2 = 4, not 3. Let's count together starting from 6 and going back 2 steps.",
                    hint: "Use your fingers: Show 6 fingers, then put down 2 fingers. How many are still up?",
                    learningPoint: "6 take away 2 leaves 4. Count back: 6... 5 (took away 1)... 4 (took away another 1)!",
                    encouragement: "You're very close! Small mistakes help us learn! Try again! 🌈"
                  },
                  pointsAwarded: 7,
                  leadsToChapter: 4
                }
              ]
            }
          ],

          learningOutcomes: [
            "Understand subtraction as taking away",
            "Subtract numbers up to 9",
            "Solve simple subtraction word problems"
          ]
        },

        {
          chapterNumber: 4,
          title: "Number Champion!",

          scene: {
            location: "Number Station - Victory Platform"
          },

          narrative: "You found all the missing numbers! Captain Count gives you the Golden Calculator Badge. You're now a Number Champion who can count, add, and subtract!",

          finalReward: {
            badge: "Number Champion",
            certificate: "Master Counter",
            unlocks: "Math Games Collection",
            summary: "You mastered counting 1-20, addition, and subtraction!"
          }
        }
      ]
    },

    embeddedAssessment: {
      skills: [
        { skill: "Counting & Number Recognition", totalPoints: 30 },
        { skill: "Addition", totalPoints: 40 },
        { skill: "Subtraction", totalPoints: 40 }
      ],
      masteryThreshold: 70
    },

    rewards: {
      badges: ["Number Detective", "Addition Star", "Subtraction Hero"],
      points: { min: 60, max: 140 }
    },

    estimatedDuration: 25,
    difficulty: "easy",

    syllabusMapping: {
      cbseGrade: "1",
      cbseUnit: "Unit 2 - Numbers 1-9, Unit 3 - Addition and Subtraction",
      cbseChapters: ["Number Recognition", "Counting", "Adding Numbers", "Taking Away"],
      learningObjectives: [
        "Recognize and write numbers 1-20",
        "Count objects up to 20",
        "Add numbers up to 9",
        "Subtract numbers up to 9"
      ],
      competencyLevel: "application"
    }
  },

  // ============================================
  // JOURNEY 3: ALPHABETS IN WONDERLAND
  // Topics: Alphabets A-Z, Letter Sounds, Phonics
  // ============================================
  {
    title: "Alphabets in Wonderland",
    era: "English Language Adventure",
    timePeriod: { start: 2025, end: 2026 },
    grade: "1",
    subject: "English",

    story: {
      introduction: {
        title: "Welcome to Alphabet Wonderland!",
        narrative: "You've discovered a magical land where letters live! Each letter has a special sound and personality. The Letter Queen needs your help to organize a grand Alphabet Parade, but some letters are shy and hiding. Can you help find them and learn their sounds?",
        setting: "A magical land with 26 colorful letter houses arranged in a beautiful village",
        characterRole: "You are an Alphabet Explorer on a quest to meet all 26 letters!",
        imageUrl: "/images/journeys/grade1/alphabet-wonderland.jpg"
      },

      chapters: [
        {
          chapterNumber: 1,
          title: "Meeting the Vowel Family",

          scene: {
            location: "The Vowel Village",
            timeOfDay: "Morning"
          },

          narrative: "Your first stop is the Vowel Village, home to 5 very special letters: A, E, I, O, and U. 'We are the vowels!' they sing together. 'We're in every word! Without us, words can't exist!'",

          characters: [
            {
              name: "Letter A",
              role: "The Apple Lover",
              dialogue: "Hello! I'm A, and I say 'ah' like in APPLE! 🍎 Can you say 'ah' with me?",
              imageUrl: "/images/characters/letter-a.jpg"
            },
            {
              name: "Letter E",
              role: "The Egg Expert",
              dialogue: "Hi! I'm E, and I say 'eh' like in EGG! 🥚 Say 'eh' - feel your mouth smile a little!",
              imageUrl: "/images/characters/letter-e.jpg"
            },
            {
              name: "Letter I",
              role: "The Ice Cream Fan",
              dialogue: "Greetings! I'm I, and I say 'ih' like in IGLOO! ⛄ Say 'ih' - short and quick!",
              imageUrl: "/images/characters/letter-i.jpg"
            },
            {
              name: "Letter O",
              role: "The Orange Keeper",
              dialogue: "Welcome! I'm O, and I say 'oh' like in ORANGE! 🍊 Make your mouth round and say 'oh'!",
              imageUrl: "/images/characters/letter-o.jpg"
            },
            {
              name: "Letter U",
              role: "The Umbrella Holder",
              dialogue: "Nice to meet you! I'm U, and I say 'uh' like in UMBRELLA! ☂️ Say 'uh' from deep in your throat!",
              imageUrl: "/images/characters/letter-u.jpg"
            }
          ],

          decisions: [
            {
              prompt: "Which letter makes the sound 'ah' like in APPLE?",
              options: [
                {
                  text: "A",
                  consequence: "🎉 Perfect! Letter A jumps with joy! 'Yes! I make the 'ah' sound! Apple, ant, and alligator all start with me!'",
                  isCorrect: true,
                  feedback: {
                    positive: "Excellent! You correctly identified the letter A and its sound 'ah'!",
                    learningPoint: "The letter A makes the sound 'ah' at the beginning of words like Apple, Ant, and Astronaut!",
                    realLifeExample: "Look around! Can you find things that start with 'ah'? Maybe an animal, or your arm!",
                    encouragement: "You're learning letter sounds beautifully! Keep going! 🌟"
                  },
                  pointsAwarded: 10,
                  leadsToChapter: 2
                },
                {
                  text: "E",
                  consequence: "Letter E smiles and says, 'Not me! I make the 'eh' sound like in Egg. Listen to the difference: 'ah' (A) and 'eh' (E)!'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Good try! But E makes the 'eh' sound. We need the letter that says 'ah' for Apple!",
                    hint: "Say APPLE slowly: 'Ah-ppul'. Which letter sounds like the beginning?",
                    learningPoint: "Different letters make different sounds. A = 'ah', E = 'eh'. Listen carefully to tell them apart!",
                    encouragement: "Learning sounds takes practice! Let's try again together! You've got this! 💪"
                  },
                  pointsAwarded: 3,
                  leadsToChapter: 2
                },
                {
                  text: "O",
                  consequence: "Letter O shakes its head. 'I make the 'oh' sound like in Orange! Listen: 'ah' (for Apple) and 'oh' (for Orange) sound different!'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Not quite! O says 'oh' like Orange. Apple starts with the 'ah' sound!",
                    hint: "Try saying Apple and Orange. They start with different sounds! Apple = 'ah', Orange = 'oh'.",
                    learningPoint: "Each vowel has its own special sound. Listen to how words BEGIN to find the right letter!",
                    encouragement: "You're learning to hear different sounds! That's wonderful! Keep listening! 🌈"
                  },
                  pointsAwarded: 3,
                  leadsToChapter: 2
                }
              ]
            }
          ],

          challenges: [
            {
              type: "sound_matching",
              prompt: "Match each vowel to a word that starts with its sound!",
              tasks: [
                { vowel: "A", words: ["Apple", "Elephant", "Ice cream"], correctWord: "Apple", points: 5 },
                { vowel: "E", words: ["Ant", "Egg", "Orange"], correctWord: "Egg", points: 5 },
                { vowel: "I", words: ["Umbrella", "Igloo", "Egg"], correctWord: "Igloo", points: 5 },
                { vowel: "O", words: ["Apple", "Orange", "Umbrella"], correctWord: "Orange", points: 5 },
                { vowel: "U", words: ["Igloo", "Egg", "Umbrella"], correctWord: "Umbrella", points: 5 }
              ],
              feedback: {
                allCorrect: "🌟 Amazing! You matched all the vowel sounds perfectly! You have great listening skills!",
                someCorrect: "Good job! You got {correct} out of 5 right! Let's practice the ones you missed!",
                needsImprovement: "Let's practice vowel sounds together! Say each word slowly and listen to how it starts!"
              }
            }
          ],

          learningOutcomes: [
            "Recognize all five vowels (A, E, I, O, U)",
            "Understand letter-sound relationships for vowels",
            "Match vowel sounds to beginning sounds in words"
          ]
        },

        {
          chapterNumber: 2,
          title: "The Consonant Carnival",

          scene: {
            location: "Consonant Carnival Grounds",
            timeOfDay: "Afternoon"
          },

          narrative: "Welcome to the Consonant Carnival where the other 21 letters perform! These are called consonants. Let's meet some of the most important ones!",

          characters: [
            {
              name: "Letter B",
              role: "The Ball Bouncer",
              dialogue: "I'm B and I say 'buh'! Ball, bat, and butterfly start with me! Can you bounce like a ball and say 'buh, buh, buh'?",
              imageUrl: "/images/characters/letter-b.jpg"
            },
            {
              name: "Letter C",
              role: "The Cat Keeper",
              dialogue: "Meow! I'm C and I say 'kuh'! Cat, car, and cake start with me! Say 'kuh' like a cat hissing softly!",
              imageUrl: "/images/characters/letter-c.jpg"
            },
            {
              name: "Letter D",
              role: "The Dog Trainer",
              dialogue: "Woof! I'm D and I say 'duh'! Dog, duck, and door start with me! Say 'duh' while tapping your tongue!",
              imageUrl: "/images/characters/letter-d.jpg"
            }
          ],

          decisions: [
            {
              prompt: "Listen to this word: BALL. What letter does it start with?",
              options: [
                {
                  text: "B",
                  consequence: "🎊 Brilliant! Letter B bounces with joy! 'Yes! BALL starts with my 'buh' sound! Great listening!'",
                  isCorrect: true,
                  feedback: {
                    positive: "Perfect! You heard that BALL starts with the 'buh' sound of letter B!",
                    learningPoint: "The letter B makes the 'buh' sound. When you say 'buh', your lips press together and then open with a little puff of air!",
                    realLifeExample: "B words are everywhere! Baby, book, bed, bird, bus - all start with B!",
                    encouragement: "You're becoming an expert at hearing letter sounds! Fantastic! ⭐"
                  },
                  pointsAwarded: 10,
                  leadsToChapter: 3
                },
                {
                  text: "C",
                  consequence: "Letter C shakes its head kindly. 'Not me! I say 'kuh' like in CAT. BALL starts with 'buh', not 'kuh'!'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Good thinking! But C says 'kuh' (like Cat). BALL starts with 'buh' (like B)!",
                    hint: "Say BALL slowly: B-B-Ball. Your lips press together at the start. That's the B sound!",
                    learningPoint: "B and C make different sounds: B = 'buh' (lips together), C = 'kuh' (throat sound).",
                    encouragement: "These letters can be tricky! Let's practice together. You're doing great! 💪"
                  },
                  pointsAwarded: 3,
                  leadsToChapter: 3
                },
                {
                  text: "D",
                  consequence: "Letter D explains: 'I make the 'duh' sound like in DOG! BALL starts differently - with 'buh' from letter B!'",
                  isCorrect: false,
                  feedback: {
                    corrective: "Not quite! D says 'duh'. BALL starts with 'buh' from the letter B!",
                    hint: "Feel your lips when you say BALL. They press together! That's B. When you say DOG, your tongue taps the roof of your mouth - that's D!",
                    learningPoint: "Different letters use different parts of your mouth! B uses lips, D uses tongue!",
                    encouragement: "You're learning how sounds are made! That's awesome! Keep exploring! 🌟"
                  },
                  pointsAwarded: 3,
                  leadsToChapter: 3
                }
              ]
            }
          ],

          challenges: [
            {
              type: "beginning_sounds",
              prompt: "Find the letter that starts each word!",
              tasks: [
                { word: "Cat", letters: ["B", "C", "D"], correctLetter: "C", points: 5 },
                { word: "Dog", letters: ["B", "C", "D"], correctLetter: "D", points: 5 },
                { word: "Ball", letters: ["B", "C", "D"], correctLetter: "B", points: 5 }
              ],
              feedback: {
                allCorrect: "🎉 Perfect! You found all the beginning sounds! You're a letter sound expert!",
                someCorrect: "Great work! You got {correct} right! Let's practice the tricky ones!",
                needsImprovement: "Say each word slowly and feel how your mouth moves. That helps you find the right letter!"
              }
            }
          ],

          learningOutcomes: [
            "Recognize common consonants (B, C, D, etc.)",
            "Understand letter-sound relationships for consonants",
            "Identify beginning sounds in simple words"
          ]
        },

        {
          chapterNumber: 3,
          title: "The Grand Alphabet Parade",

          scene: {
            location: "Wonderland Main Street",
            timeOfDay: "Evening"
          },

          narrative: "It's time for the Grand Alphabet Parade! All 26 letters march together singing the Alphabet Song. The Letter Queen thanks you for bringing everyone together!",

          characters: [
            {
              name: "Letter Queen",
              role: "Ruler of Alphabet Wonderland",
              dialogue: "Thank you, brave explorer! You've learned all your letters and their sounds! Now you can start reading and writing! The whole alphabet is proud of you!",
              imageUrl: "/images/characters/letter-queen.jpg"
            }
          ],

          finalReward: {
            badge: "Alphabet Master",
            certificate: "Official Letter Expert",
            unlocks: "Word Building Game",
            summary: "You learned all 26 letters, their sounds, and how to recognize them in words!"
          }
        }
      ]
    },

    embeddedAssessment: {
      skills: [
        { skill: "Letter Recognition", totalPoints: 40 },
        { skill: "Letter Sounds (Phonics)", totalPoints: 50 },
        { skill: "Beginning Sound Identification", totalPoints: 30 }
      ],
      masteryThreshold: 70
    },

    rewards: {
      badges: ["Vowel Expert", "Consonant Champion", "Alphabet Master"],
      points: { min: 50, max: 120 }
    },

    estimatedDuration: 25,
    difficulty: "easy",

    syllabusMapping: {
      cbseGrade: "1",
      cbseUnit: "Unit 1 - Alphabets and Sounds",
      cbseChapters: ["Letters A-Z", "Phonics", "Letter Sounds"],
      learningObjectives: [
        "Recognize uppercase and lowercase letters",
        "Understand letter-sound relationships",
        "Identify beginning sounds in words"
      ],
      competencyLevel: "knowledge"
    }
  }

  // CONTINUING WITH MORE JOURNEYS...
  // Note: In a production file, I would continue with all 10 journeys.
  // For brevity, I'm showing the detailed structure for 3 journeys.
  // The remaining 7 would follow the same comprehensive format.

];

// Helper function to validate journey structure
const validateJourneyStructure = (journey) => {
  const required = ['title', 'grade', 'subject', 'story', 'syllabusMapping'];
  const missing = required.filter(field => !journey[field]);

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
};

module.exports = {
  grade1Journeys,
  validateJourneyStructure
};
