/**
 * Add full interactive content to all chapters 2-7
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const HistoricalJourney = require('./src/models/HistoricalJourney');

async function addAllContent() {
  try {
    console.log('🎮 Adding interactive content to all chapters...\n');

    await mongoose.connect(process.env.MONGODB_URI);

    const journey = await HistoricalJourney.findOne({
      title: 'The Magical Shape Kingdom',
      grade: '1'
    });

    if (!journey) {
      console.log('❌ Journey not found!');
      process.exit(1);
    }

    // Find chapters by number and add content
    const chapters = journey.story.chapters;

    // CHAPTER 2: Square Town
    const ch2Index = chapters.findIndex(ch => ch.chapterNumber === 2);
    if (ch2Index !== -1) {
      console.log('Adding content to Chapter 2: Square Town...');
      chapters[ch2Index].decisions = [
        {
          decisionNumber: 1,
          prompt: "Lady Square asks: 'How many corners do I have?'",
          options: [
            {
              text: "4 corners",
              consequence: "🎉 Perfect! Lady Square smiles! 'Yes! I have 4 corners, one at each point where my sides meet!'",
              isCorrect: true,
              feedback: {
                positive: "Excellent! You correctly identified that squares have 4 corners!",
                learningPoint: "Squares have 4 corners (also called vertices) where the sides meet at right angles.",
                encouragement: "You're learning shapes so well! ⭐"
              },
              pointsAwarded: 10,
              leadsToChapter: 3
            },
            {
              text: "3 corners",
              consequence: "Lady Square shakes her head. 'Not quite! Count my corners: top-left, top-right, bottom-right, bottom-left. That's 4!'",
              isCorrect: false,
              feedback: {
                corrective: "Triangles have 3 corners, but squares have 4 corners!",
                hint: "Look at a square - count each pointy corner where two sides meet.",
                encouragement: "Keep practicing! You're learning! 💪"
              },
              pointsAwarded: 3,
              leadsToChapter: 3
            },
            {
              text: "No corners",
              consequence: "Lady Square giggles. 'I have corners! Circles have no corners, but I'm a square with 4 sharp corners!'",
              isCorrect: false,
              feedback: {
                corrective: "Circles have no corners, but squares have 4 corners!",
                hint: "Feel the edges of a square - you'll find 4 pointy corners!",
                encouragement: "You're learning the differences! Great! 🌟"
              },
              pointsAwarded: 3,
              leadsToChapter: 3
            }
          ]
        },
        {
          decisionNumber: 2,
          prompt: "Lady Square shows you objects. Which one is a square?",
          options: [
            {
              text: "A window pane",
              consequence: "✅ Correct! Lady Square claps! 'Yes! Many windows are perfect squares!'",
              isCorrect: true,
              feedback: {
                positive: "Great observation! Windows are often square-shaped!",
                learningPoint: "Squares appear in everyday objects like tiles, windows, and game boards.",
                encouragement: "You're spotting squares like a pro! 🌟"
              },
              pointsAwarded: 10,
              leadsToChapter: 3
            },
            {
              text: "A ball",
              consequence: "Lady Square shakes her head. 'A ball is round like a circle, not square like me!'",
              isCorrect: false,
              feedback: {
                corrective: "Balls are circular/spherical, not square!",
                hint: "Squares have straight sides and corners. Balls are round and smooth.",
                encouragement: "Good try! Let's look for things with 4 equal sides! 💪"
              },
              pointsAwarded: 3,
              leadsToChapter: 3
            }
          ]
        }
      ];

      chapters[ch2Index].challenges = [
        {
          type: "sorting",
          prompt: "Help Lady Square find all the square objects!",
          items: [
            { object: "Dice", isSquare: true, points: 5 },
            { object: "Plate", isSquare: false, points: 0 },
            { object: "Tile", isSquare: true, points: 5 },
            { object: "Ball", isSquare: false, points: 0 }
          ],
          totalPoints: 10
        }
      ];
    }

    // CHAPTER 3: Triangle Peak
    const ch3Index = chapters.findIndex(ch => ch.chapterNumber === 3);
    if (ch3Index !== -1) {
      console.log('Adding content to Chapter 3: Triangle Peak...');
      chapters[ch3Index].decisions = [
        {
          decisionNumber: 1,
          prompt: "Captain Triangle asks: 'How many sides do I have?'",
          options: [
            {
              text: "3 sides",
              consequence: "🎉 Brilliant! Captain Triangle salutes! 'Correct! I have 3 straight sides that make me strong!'",
              isCorrect: true,
              feedback: {
                positive: "Perfect! Triangles have exactly 3 sides!",
                learningPoint: "A triangle has 3 straight sides and 3 corners. It's the strongest shape!",
                encouragement: "You're a triangle expert! ⭐"
              },
              pointsAwarded: 10,
              leadsToChapter: 4
            },
            {
              text: "4 sides",
              consequence: "Captain Triangle shakes his head. 'Squares have 4 sides! I have fewer - count my sides: 1, 2, 3!'",
              isCorrect: false,
              feedback: {
                corrective: "Triangles have 3 sides, not 4!",
                hint: "Count the straight lines that make up a triangle.",
                encouragement: "Keep learning! You're doing great! 💪"
              },
              pointsAwarded: 3,
              leadsToChapter: 4
            }
          ]
        },
        {
          decisionNumber: 2,
          prompt: "Which object is shaped like a triangle?",
          options: [
            {
              text: "Pizza slice",
              consequence: "✅ Perfect! Captain Triangle nods! 'Yes! Pizza slices are triangular!'",
              isCorrect: true,
              feedback: {
                positive: "Excellent! Pizza slices are classic triangles!",
                learningPoint: "Triangles are everywhere: pizza slices, mountains, roofs, signs!",
                encouragement: "You're finding triangles like a champion! 🌟"
              },
              pointsAwarded: 10,
              leadsToChapter: 4
            },
            {
              text: "Book",
              consequence: "Captain Triangle smiles. 'Books are rectangles with 4 sides! Triangles have only 3 sides!'",
              isCorrect: false,
              feedback: {
                corrective: "Books are rectangular, not triangular!",
                hint: "Look for objects with 3 pointy corners and 3 sides.",
                encouragement: "Good thinking! Keep exploring shapes! 💪"
              },
              pointsAwarded: 3,
              leadsToChapter: 4
            }
          ]
        }
      ];

      chapters[ch3Index].challenges = [
        {
          type: "counting",
          prompt: "Count the corners on this triangle!",
          correctAnswer: 3,
          points: 10
        }
      ];
    }

    // CHAPTER 4: Rectangle Road
    const ch4Index = chapters.findIndex(ch => ch.chapterNumber === 4);
    if (ch4Index !== -1) {
      console.log('Adding content to Chapter 4: Rectangle Road...');
      chapters[ch4Index].decisions = [
        {
          decisionNumber: 1,
          prompt: "Duke Rectangle asks: 'What makes me different from a square?'",
          options: [
            {
              text: "My opposite sides are equal, but not all 4 sides",
              consequence: "🎉 Excellent! Duke Rectangle bows! 'Yes! I have 2 long sides and 2 short sides, while squares have all 4 equal!'",
              isCorrect: true,
              feedback: {
                positive: "Perfect understanding! Rectangles have 2 pairs of equal sides!",
                learningPoint: "Rectangles: opposite sides equal. Squares: all 4 sides equal.",
                encouragement: "You understand the difference beautifully! ⭐"
              },
              pointsAwarded: 15,
              leadsToChapter: 5
            },
            {
              text: "I have 3 sides",
              consequence: "Duke Rectangle shakes his head. 'No, I have 4 sides just like a square! The difference is in the side lengths!'",
              isCorrect: false,
              feedback: {
                corrective: "Both rectangles and squares have 4 sides!",
                hint: "The difference is: squares have all sides equal, rectangles have opposite sides equal.",
                encouragement: "You're learning! Keep going! 💪"
              },
              pointsAwarded: 3,
              leadsToChapter: 5
            }
          ]
        },
        {
          decisionNumber: 2,
          prompt: "Which is shaped like a rectangle?",
          options: [
            {
              text: "A door",
              consequence: "✅ Perfect! Duke Rectangle smiles! 'Yes! Most doors are rectangles - taller than they are wide!'",
              isCorrect: true,
              feedback: {
                positive: "Great! Doors are perfect examples of rectangles!",
                learningPoint: "Rectangles are common: doors, phones, books, notebooks!",
                encouragement: "You're spotting rectangles everywhere! 🌟"
              },
              pointsAwarded: 10,
              leadsToChapter: 5
            },
            {
              text: "An orange",
              consequence: "Duke Rectangle chuckles. 'Oranges are round like circles, not rectangular like me!'",
              isCorrect: false,
              feedback: {
                corrective: "Oranges are circular, not rectangular!",
                hint: "Rectangles have straight sides and 4 corners.",
                encouragement: "Keep looking for rectangular objects! You can do it! 💪"
              },
              pointsAwarded: 3,
              leadsToChapter: 5
            }
          ]
        }
      ];

      chapters[ch4Index].challenges = [
        {
          type: "identification",
          prompt: "Find all the rectangles!",
          items: [
            { object: "Phone", isRectangle: true, points: 5 },
            { object: "Coin", isRectangle: false, points: 0 },
            { object: "Book", isRectangle: true, points: 5 }
          ],
          totalPoints: 10
        }
      ];
    }

    // CHAPTER 5: Pattern Palace - Already has 1 challenge, add decisions
    const ch5Index = chapters.findIndex(ch => ch.chapterNumber === 5);
    if (ch5Index !== -1) {
      console.log('Adding decisions to Chapter 5: Pattern Palace...');
      chapters[ch5Index].decisions = [
        {
          decisionNumber: 1,
          prompt: "Pattern: Circle, Square, Circle, Square, Circle, ___. What comes next?",
          options: [
            {
              text: "Square",
              consequence: "🎉 Perfect! The Pattern Princess claps! 'You found the repeating pattern!'",
              isCorrect: true,
              feedback: {
                positive: "Excellent pattern recognition!",
                learningPoint: "This pattern repeats: Circle, Square, Circle, Square...",
                encouragement: "You're a pattern master! ⭐"
              },
              pointsAwarded: 15,
              leadsToChapter: 6
            },
            {
              text: "Circle",
              consequence: "The Princess smiles. 'Look again! We just had Circle. The pattern alternates!'",
              isCorrect: false,
              feedback: {
                corrective: "The pattern switches between Circle and Square!",
                hint: "After Circle comes Square, after Square comes Circle!",
                encouragement: "Patterns take practice! You're learning! 💪"
              },
              pointsAwarded: 5,
              leadsToChapter: 6
            }
          ]
        },
        {
          decisionNumber: 2,
          prompt: "Pattern: Triangle, Triangle, Circle, Triangle, Triangle, ___. What's next?",
          options: [
            {
              text: "Circle",
              consequence: "✅ Brilliant! The Pattern Princess cheers! 'Yes! The pattern is two triangles, then one circle!'",
              isCorrect: true,
              feedback: {
                positive: "Perfect! You spotted the two-triangles-one-circle pattern!",
                learningPoint: "Patterns can have more than 2 shapes! This one repeats: Triangle, Triangle, Circle.",
                encouragement: "You're a pattern genius! 🌟"
              },
              pointsAwarded: 20,
              leadsToChapter: 6
            },
            {
              text: "Triangle",
              consequence: "The Princess shakes her head. 'Look at the pattern: it's Triangle, Triangle, Circle - then it repeats!'",
              isCorrect: false,
              feedback: {
                corrective: "After two triangles comes a circle!",
                hint: "Count: Triangle (1), Triangle (2), Circle - then repeat!",
                encouragement: "Pattern puzzles are tricky! Keep trying! 💪"
              },
              pointsAwarded: 5,
              leadsToChapter: 6
            }
          ]
        }
      ];
    }

    // CHAPTER 6: Shape Building - Already has 1 challenge, add decisions
    const ch6Index = chapters.findIndex(ch => ch.chapterNumber === 6);
    if (ch6Index !== -1) {
      console.log('Adding decisions to Chapter 6: Shape Building...');
      chapters[ch6Index].decisions = [
        {
          decisionNumber: 1,
          prompt: "To build a house, what shape would you use for the roof?",
          options: [
            {
              text: "Triangle",
              consequence: "🎉 Perfect! The Shape King nods! 'Triangles make great roofs - strong and water runs off them!'",
              isCorrect: true,
              feedback: {
                positive: "Excellent choice! Triangular roofs are very common!",
                learningPoint: "Triangles are used for roofs because they're strong and rain slides off!",
                encouragement: "You're thinking like an architect! ⭐"
              },
              pointsAwarded: 15,
              leadsToChapter: 7
            },
            {
              text: "Circle",
              consequence: "The Shape King smiles. 'Circles would roll off! We need a pointy triangle for a stable roof!'",
              isCorrect: false,
              feedback: {
                corrective: "Roofs need to be triangular to be stable!",
                hint: "Think about what shape would let rain slide off easily.",
                encouragement: "Creative thinking! Keep building! 💪"
              },
              pointsAwarded: 5,
              leadsToChapter: 7
            }
          ]
        }
      ];
    }

    // CHAPTER 7: Grand Championship - Add the final assessment
    const ch7Index = chapters.findIndex(ch => ch.chapterNumber === 7);
    if (ch7Index !== -1) {
      console.log('Adding final assessment to Chapter 7...');
      chapters[ch7Index].decisions = [
        {
          decisionNumber: 1,
          prompt: "FINAL QUESTION 1: Which shape has NO corners?",
          options: [
            {
              text: "Circle",
              consequence: "✅ Correct!",
              isCorrect: true,
              feedback: { positive: "Perfect!", pointsAwarded: 10 },
              pointsAwarded: 10,
              leadsToChapter: 7
            },
            {
              text: "Square",
              consequence: "❌ Squares have 4 corners!",
              isCorrect: false,
              pointsAwarded: 0,
              leadsToChapter: 7
            }
          ]
        },
        {
          decisionNumber: 2,
          prompt: "FINAL QUESTION 2: How many sides does a triangle have?",
          options: [
            {
              text: "3 sides",
              consequence: "✅ Correct!",
              isCorrect: true,
              pointsAwarded: 10,
              leadsToChapter: 7
            },
            {
              text: "4 sides",
              consequence: "❌ That's a square!",
              isCorrect: false,
              pointsAwarded: 0,
              leadsToChapter: 7
            }
          ]
        },
        {
          decisionNumber: 3,
          prompt: "FINAL QUESTION 3: What makes a square special?",
          options: [
            {
              text: "All 4 sides are equal",
              consequence: "✅ Perfect! You're a Shape Master!",
              isCorrect: true,
              pointsAwarded: 15,
              leadsToChapter: 7
            },
            {
              text: "It has no corners",
              consequence: "❌ Squares have 4 corners!",
              isCorrect: false,
              pointsAwarded: 0,
              leadsToChapter: 7
            }
          ]
        }
      ];

      // Add completion marker
      chapters[ch7Index].isFinalChapter = true;
    }

    // Mark modified and save
    journey.markModified('story');
    await journey.save();

    console.log('\n✅ Successfully added interactive content to all chapters!\n');

    // Verify
    const verified = await HistoricalJourney.findOne({
      title: 'The Magical Shape Kingdom',
      grade: '1'
    });

    console.log('Verification:');
    verified.story.chapters.forEach(ch => {
      const decisions = ch.decisions ? ch.decisions.length : 0;
      const challenges = ch.challenges ? ch.challenges.length : 0;
      console.log(`Chapter ${ch.chapterNumber}: ${decisions} decisions, ${challenges} challenges`);
    });

    await mongoose.disconnect();
    console.log('\n✅ All chapters now have interactive content!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addAllContent();
