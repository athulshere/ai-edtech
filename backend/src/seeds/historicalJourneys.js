const HistoricalJourney = require('../models/HistoricalJourney');

const journeys = [
  {
    title: "The Freedom Struggle: India's Path to Independence",
    era: "Indian Independence Movement",
    timePeriod: {
      start: 1857,
      end: 1947
    },
    grade: "9",
    subject: "History",

    story: {
      introduction: {
        title: "A Nation Awakens",
        narrative: "It is the year 1942. India has been under British rule for nearly a century. The air is thick with the spirit of rebellion. From the bustling streets of Bombay to the quiet villages of Bengal, a single cry echoes: 'Quit India!' You are about to witness one of history's greatest struggles for freedom - not through the pages of a textbook, but by living through the choices, challenges, and triumphs of those who fought for independence.",
        setting: "India, August 1942. The monsoon rains have just begun, but a different storm is brewing - a storm of freedom.",
        characterRole: "You are a young student in Bombay (now Mumbai), inspired by the freedom movement. Your choices will shape your journey through India's struggle for independence.",
        imageUrl: "/images/journeys/independence-intro.jpg",
        audioUrl: "/audio/journeys/introduction-theme.mp3"
      },

      chapters: [
        {
          chapterNumber: 1,
          title: "The Spark of Rebellion",

          scene: {
            location: "Gowalia Tank Maidan, Bombay - August 8, 1942",
            timeOfDay: "Morning",
            atmosphere: "Electric with anticipation. Thousands have gathered to hear Mahatma Gandhi speak.",
            imageUrl: "/images/journeys/gowalia-tank.jpg",
            backgroundMusic: "/audio/journeys/gathering-crowd.mp3"
          },

          narrative: "You stand among thousands at the historic Gowalia Tank Maidan. The crowd buzzes with energy. People from all walks of life - students, workers, mothers, elderly freedom fighters - have gathered. On the stage, you see Mahatma Gandhi preparing to speak. This is the moment that will launch the Quit India Movement. You clutch a small Indian tricolor flag, your heart pounding with excitement and nervousness.",

          characters: [
            {
              name: "Mahatma Gandhi",
              role: "Leader of the Independence Movement",
              dialogue: "Here is a mantra, a short one, that I give you. You may imprint it on your hearts and let every breath of yours give expression to it. The mantra is: 'Do or Die.' We shall either free India or die in the attempt.",
              imageUrl: "/images/characters/gandhi.jpg"
            },
            {
              name: "Aruna Asaf Ali",
              role: "Freedom Fighter",
              dialogue: "The British think they can silence us by arresting our leaders. But we are millions! Every Indian must now become a soldier of freedom.",
              imageUrl: "/images/characters/aruna-asaf-ali.jpg"
            }
          ],

          historicalContext: [
            {
              fact: "The Quit India Movement was launched on August 8, 1942, demanding an end to British rule in India.",
              presentedAs: "observation",
              importance: "This was the final major push for independence, showing united Indian resistance."
            },
            {
              fact: "Gandhi's 'Do or Die' speech became the rallying cry for millions of Indians.",
              presentedAs: "dialogue",
              importance: "It galvanized the nation into direct action against British rule."
            }
          ],

          decisions: [
            {
              prompt: "After Gandhi's powerful speech, what do you choose to do?",
              options: [
                {
                  text: "Join the peaceful march through Bombay streets",
                  consequence: "You join thousands in a peaceful procession. British police try to stop the march, but the sheer number of participants makes it impossible. You experience the power of non-violent resistance firsthand.",
                  leadsToChapter: 2,
                  historicalAccuracy: true,
                  learningPoint: "Non-violent resistance was Gandhi's core philosophy and proved effective in mobilizing masses.",
                  pointsAwarded: 20
                },
                {
                  text: "Help distribute underground pamphlets about the movement",
                  consequence: "You work with other students to secretly distribute pamphlets explaining the Quit India Movement. It's dangerous work - British authorities are arresting anyone spreading such literature. But information is power, and the people must know the truth.",
                  leadsToChapter: 2,
                  historicalAccuracy: true,
                  learningPoint: "Underground literature played a crucial role in spreading awareness during the freedom struggle.",
                  pointsAwarded: 25
                },
                {
                  text: "Return home to convince your family to join the movement",
                  consequence: "You rush home to share Gandhi's message with your family. Your father is hesitant - he fears British retaliation. But your mother, inspired by your passion, agrees to participate in the women's movement led by Aruna Asaf Ali.",
                  leadsToChapter: 3,
                  historicalAccuracy: true,
                  learningPoint: "The independence movement involved entire families and communities, transcending age and gender.",
                  pointsAwarded: 15
                }
              ]
            }
          ],

          challenges: [
            {
              type: "timeline-order",
              description: "Before we continue, let's test your understanding of the events leading to this moment. Arrange these important events in chronological order:",
              interactiveElement: {
                events: [
                  { event: "First War of Independence (Sepoy Mutiny)", year: 1857, correctPosition: 1 },
                  { event: "Formation of Indian National Congress", year: 1885, correctPosition: 2 },
                  { event: "Partition of Bengal", year: 1905, correctPosition: 3 },
                  { event: "Jallianwala Bagh Massacre", year: 1919, correctPosition: 4 },
                  { event: "Non-Cooperation Movement begins", year: 1920, correctPosition: 5 },
                  { event: "Salt March (Dandi March)", year: 1930, correctPosition: 6 },
                  { event: "Quit India Movement launched", year: 1942, correctPosition: 7 }
                ]
              },
              onSuccess: {
                narrative: "Excellent! You understand the long journey to this moment. Each of these events built upon the last, creating the wave of resistance we see today.",
                reward: "Historical Timeline Badge",
                points: 30
              },
              onFailure: {
                narrative: "Not quite. The freedom struggle was a long process spanning nearly a century. Let's review these key events.",
                hint: "Think about which events happened before India's independence movement gained mass participation.",
                retryAllowed: true
              }
            }
          ],

          discoveries: [
            {
              type: "document",
              name: "Original Quit India Resolution",
              content: "The Congress Working Committee resolution calling for British withdrawal from India, passed on August 8, 1942.",
              historicalSignificance: "This resolution marked the beginning of the final phase of India's independence struggle.",
              imageUrl: "/images/discoveries/quit-india-resolution.jpg",
              year: 1942
            }
          ],

          learningOutcomes: [
            "Understanding the Quit India Movement's significance",
            "Learning about non-violent resistance",
            "Recognizing key leaders like Gandhi and Aruna Asaf Ali"
          ],

          nextChapters: [2, 3]
        },

        {
          chapterNumber: 2,
          title: "The Underground Movement",

          scene: {
            location: "A secret printing press in Bombay",
            timeOfDay: "Late night",
            atmosphere: "Tense and secretive. The sound of printing machines fills the air.",
            imageUrl: "/images/journeys/underground-press.jpg",
            backgroundMusic: "/audio/journeys/tension-theme.mp3"
          },

          narrative: "Within days of the Quit India Movement's launch, the British arrested all major Congress leaders. Gandhi, Nehru, Patel, and thousands of others are now in prison. But the movement hasn't stopped - it has gone underground. You find yourself in a secret printing press, helping to produce 'Azad Hind' - an underground newspaper that keeps the flame of freedom alive.",

          characters: [
            {
              name: "Ram Manohar Lohia",
              role: "Socialist leader and underground activist",
              dialogue: "The British think that by imprisoning our leaders, they've won. They're wrong. We are the leaders now. Every Indian who refuses to submit is a leader!",
              imageUrl: "/images/characters/lohia.jpg"
            },
            {
              name: "Usha Mehta",
              role: "Operator of Secret Congress Radio",
              dialogue: "I'm broadcasting messages from our leaders to the people. The British can arrest bodies, but they cannot arrest our voices!",
              imageUrl: "/images/characters/usha-mehta.jpg"
            }
          ],

          historicalContext: [
            {
              fact: "Usha Mehta operated the Secret Congress Radio during the Quit India Movement, broadcasting news and messages.",
              presentedAs: "dialogue",
              importance: "Shows how freedom fighters used technology and innovation to resist British censorship."
            },
            {
              fact: "The British arrested over 100,000 people during the Quit India Movement.",
              presentedAs: "observation",
              importance: "Demonstrates the scale of resistance and British repression."
            }
          ],

          decisions: [
            {
              prompt: "The British police are conducting raids. What should you do with today's printed newspapers?",
              options: [
                {
                  text: "Hide them in vegetable carts going to the market",
                  consequence: "Clever thinking! The newspapers are distributed hidden among vegetables. Thousands of people read about the movement's progress. The British remain unaware.",
                  leadsToChapter: 4,
                  historicalAccuracy: true,
                  learningPoint: "Freedom fighters used creative methods to evade British surveillance.",
                  pointsAwarded: 25
                },
                {
                  text: "Burn them to avoid everyone getting arrested",
                  consequence: "Safety first, but at what cost? The information is lost, and people remain unaware of recent developments. Sometimes courage requires risk.",
                  leadsToChapter: 4,
                  historicalAccuracy: false,
                  learningPoint: "Freedom fighters often chose courage over safety, believing the cause was worth the risk.",
                  pointsAwarded: 5
                },
                {
                  text: "Distribute them immediately, even if it means higher risk",
                  consequence: "You and other volunteers rush out to distribute the papers. Some of you are caught, but most succeed. The word spreads. Sometimes direct action is necessary.",
                  leadsToChapter: 4,
                  historicalAccuracy: true,
                  learningPoint: "Many freedom fighters risked imprisonment to spread information about the movement.",
                  pointsAwarded: 20
                }
              ]
            }
          ],

          challenges: [
            {
              type: "decode-message",
              description: "You've intercepted a coded message from Subhas Chandra Bose's Azad Hind Fauj (Indian National Army). Can you decode it?",
              interactiveElement: {
                encodedMessage: "KLQGLD DLOOD ERCCLOOD",
                hint: "Each letter is shifted by 3 positions in the alphabet (Caesar cipher)",
                decodedMessage: "DELHI CHALO"
              },
              onSuccess: {
                narrative: "'Delhi Chalo' - March to Delhi! This was the battle cry of the Indian National Army fighting alongside the freedom movement from outside India. You've helped decode crucial intelligence!",
                reward: "Codebreaker Badge",
                points: 35
              },
              onFailure: {
                narrative: "Code-breaking is difficult. The British used complex systems, but so did our freedom fighters.",
                hint: "Try shifting each letter backward in the alphabet.",
                retryAllowed: true
              }
            }
          ],

          discoveries: [
            {
              type: "artifact",
              name: "Underground newspaper 'Azad Hind'",
              content: "A preserved copy of the secret newspaper that kept the movement alive during British censorship.",
              historicalSignificance: "These underground publications were vital in maintaining morale and spreading information.",
              imageUrl: "/images/discoveries/azad-hind-newspaper.jpg",
              year: 1942
            }
          ],

          learningOutcomes: [
            "Understanding the underground resistance movement",
            "Learning about parallel leadership after mass arrests",
            "Recognizing the role of communication in resistance"
          ],

          nextChapters: [4]
        },

        {
          chapterNumber: 3,
          title: "Women at the Forefront",

          scene: {
            location: "A women's protest march in Bombay",
            timeOfDay: "Afternoon",
            atmosphere: "Determined and powerful. Thousands of women marching together.",
            imageUrl: "/images/journeys/women-march.jpg",
            backgroundMusic: "/audio/journeys/empowerment-theme.mp3"
          },

          narrative: "With most male leaders in prison, women have taken the lead. Your mother marches alongside Aruna Asaf Ali, Sucheta Kripalani, and thousands of others. The British didn't expect this - they thought arresting male leaders would end the movement. They were wrong. You witness the power of India's women rising as one.",

          characters: [
            {
              name: "Aruna Asaf Ali",
              role: "Freedom Fighter who hoisted the flag at Gowalia Tank",
              dialogue: "The British arrested our husbands, fathers, and brothers. Good! Now they'll see what Indian women can do. We are not asking for freedom - we are taking it!",
              imageUrl: "/images/characters/aruna-asaf-ali.jpg"
            },
            {
              name: "Sucheta Kripalani",
              role: "Women's movement leader",
              dialogue: "They call us the 'weaker sex.' Let's show them how strong we really are. Our resistance will be peaceful but unstoppable!",
              imageUrl: "/images/characters/sucheta-kripalani.jpg"
            }
          ],

          historicalContext: [
            {
              fact: "Aruna Asaf Ali hoisted the Indian flag at Gowalia Tank Maidan on August 9, 1942, defying British ban.",
              presentedAs: "observation",
              importance: "This act of defiance became a symbol of fearless resistance."
            },
            {
              fact: "Women played crucial roles in the Quit India Movement, leading protests when male leaders were imprisoned.",
              presentedAs: "observation",
              importance: "Showed that the independence movement involved all sections of society."
            }
          ],

          decisions: [
            {
              prompt: "The police have set up barricades. How do you and the women protesters respond?",
              options: [
                {
                  text: "Sit in peaceful protest at the barricade (Satyagraha)",
                  consequence: "You all sit down peacefully. The police don't know how to respond to thousands of seated women. Hours pass. Your peaceful resistance makes headlines worldwide. The British look like bullies.",
                  leadsToChapter: 4,
                  historicalAccuracy: true,
                  learningPoint: "Satyagraha (peaceful non-cooperation) was a powerful tool that put moral pressure on the British.",
                  pointsAwarded: 30
                },
                {
                  text: "Try to break through the barricade forcefully",
                  consequence: "The confrontation turns chaotic. Some protesters are injured. While your passion is admirable, Gandhi's way was non-violence. The movement's moral high ground is compromised.",
                  leadsToChapter: 4,
                  historicalAccuracy: false,
                  learningPoint: "Gandhi insisted on non-violence even in the face of oppression.",
                  pointsAwarded: 10
                },
                {
                  text: "March to an alternative location and continue the protest",
                  consequence: "Smart thinking! You find another route and continue the march. The British can't block every street. The protest continues, and the message spreads.",
                  leadsToChapter: 4,
                  historicalAccuracy: true,
                  learningPoint: "Flexibility and adaptability were key to maintaining momentum in protests.",
                  pointsAwarded: 25
                }
              ]
            }
          ],

          challenges: [
            {
              type: "map-navigate",
              description: "Help plan the route for tomorrow's protest march through Bombay, avoiding British checkpoints while reaching maximum people.",
              interactiveElement: {
                mapUrl: "/images/challenges/bombay-1942-map.jpg",
                locations: [
                  {
                    name: "Gowalia Tank Maidan (Starting point)",
                    coordinates: { x: 150, y: 200 },
                    isCorrect: true,
                    historicalSignificance: "Where the Quit India Movement was launched"
                  },
                  {
                    name: "Marine Drive (Major public area)",
                    coordinates: { x: 100, y: 150 },
                    isCorrect: true,
                    historicalSignificance: "High visibility public space"
                  },
                  {
                    name: "Police Headquarters (Dangerous)",
                    coordinates: { x: 200, y: 180 },
                    isCorrect: false,
                    historicalSignificance: "Heavy police presence, avoid this area"
                  },
                  {
                    name: "Textile Mill Workers' Area",
                    coordinates: { x: 250, y: 220 },
                    isCorrect: true,
                    historicalSignificance: "Working class stronghold for the movement"
                  }
                ]
              },
              onSuccess: {
                narrative: "Perfect route! You've maximized public impact while avoiding unnecessary confrontations. Strategic thinking like this helped the movement succeed.",
                reward: "Strategic Planner Badge",
                points: 30
              },
              onFailure: {
                narrative: "The route you chose led to unnecessary conflicts or missed opportunities to reach people.",
                hint: "Think about where you can reach the most people while avoiding direct confrontation with armed police.",
                retryAllowed: true
              }
            }
          ],

          discoveries: [
            {
              type: "letter",
              name: "Letter from Kasturba Gandhi",
              content: "A letter from Gandhi's wife Kasturba, written from prison, encouraging women to lead the movement.",
              historicalSignificance: "Shows the family commitment to the freedom struggle and women's leadership.",
              imageUrl: "/images/discoveries/kasturba-letter.jpg",
              year: 1942
            }
          ],

          learningOutcomes: [
            "Understanding women's crucial role in the independence movement",
            "Learning about Satyagraha and non-violent resistance",
            "Recognizing parallel leadership during mass arrests"
          ],

          nextChapters: [4]
        },

        {
          chapterNumber: 4,
          title: "The Final Push: 1946-1947",

          scene: {
            location: "Streets of Delhi, August 1947",
            timeOfDay: "Midnight - between August 14 and 15",
            atmosphere: "Electric with anticipation. History is about to be made.",
            imageUrl: "/images/journeys/independence-eve.jpg",
            backgroundMusic: "/audio/journeys/freedom-theme.mp3"
          },

          narrative: "Five years have passed since the Quit India Movement. The British, weakened by World War II and facing relentless Indian resistance, have finally agreed to leave. You stand in Delhi on the night of August 14-15, 1947. In minutes, India will be free. The journey that began with the 1857 rebellion, continued through decades of struggle, will culminate at midnight. You hear Jawaharlal Nehru preparing to deliver his 'Tryst with Destiny' speech.",

          characters: [
            {
              name: "Jawaharlal Nehru",
              role: "First Prime Minister of independent India",
              dialogue: "At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom. A moment comes, which comes but rarely in history, when we step out from the old to the new, when an age ends, and when the soul of a nation, long suppressed, finds utterance.",
              imageUrl: "/images/characters/nehru.jpg"
            },
            {
              name: "An elderly freedom fighter",
              role: "Participant since 1920 Non-Cooperation Movement",
              dialogue: "I've waited 27 years for this moment. I was beaten by British police, I spent years in jail, I lost friends to this struggle. But we never gave up. And now... we're free.",
              imageUrl: "/images/characters/elderly-fighter.jpg"
            }
          ],

          historicalContext: [
            {
              fact: "India gained independence on August 15, 1947, after nearly 200 years of British rule.",
              presentedAs: "observation",
              importance: "The culmination of a long freedom struggle involving millions of Indians."
            },
            {
              fact: "Nehru's 'Tryst with Destiny' speech is one of the greatest speeches in history.",
              presentedAs: "dialogue",
              importance: "It articulated the hopes and dreams of a newly independent nation."
            },
            {
              fact: "Independence came with the painful partition of India and Pakistan.",
              presentedAs: "observation",
              importance: "The joy of freedom was tempered by the tragedy of partition."
            }
          ],

          decisions: [
            {
              prompt: "As midnight approaches and freedom arrives, how do you choose to mark this historic moment?",
              options: [
                {
                  text: "Join the celebration at India Gate, singing the national anthem",
                  consequence: "You join thousands at India Gate as the Indian flag is hoisted. Jana Gana Mana fills the air. Strangers embrace as tears of joy flow. This is what your grandparents, parents, and you fought for. Freedom.",
                  leadsToChapter: 5,
                  historicalAccuracy: true,
                  learningPoint: "The moment of independence was celebrated with immense joy across the nation.",
                  pointsAwarded: 30
                },
                {
                  text: "Spend the moment remembering those who sacrificed their lives",
                  consequence: "You light candles for Bhagat Singh, Chandrasekhar Azad, Lala Lajpat Rai, and countless others who didn't live to see this day. Your freedom came at a price. You vow to honor their sacrifice by building the India they dreamed of.",
                  leadsToChapter: 5,
                  historicalAccuracy: true,
                  learningPoint: "Many freedom fighters sacrificed their lives for independence; remembering them is important.",
                  pointsAwarded: 35
                },
                {
                  text: "Help in the refugee camps affected by partition",
                  consequence: "While others celebrate, you choose to help those affected by partition. Independence brought freedom but also tragedy. Your compassion in this moment of joy shows true humanity.",
                  leadsToChapter: 5,
                  historicalAccuracy: true,
                  learningPoint: "Partition caused immense human suffering alongside the joy of independence.",
                  pointsAwarded: 40
                }
              ]
            }
          ],

          challenges: [
            {
              type: "artifact-identify",
              description: "As you reflect on the journey to freedom, identify which of these artifacts are from India's independence movement:",
              interactiveElement: {
                artifacts: [
                  {
                    name: "Charkha (Spinning Wheel)",
                    imageUrl: "/images/artifacts/charkha.jpg",
                    description: "A simple spinning wheel used to make khadi cloth",
                    era: "Independence Movement",
                    isCorrect: true
                  },
                  {
                    name: "Quit India Movement Pamphlet",
                    imageUrl: "/images/artifacts/quit-india-pamphlet.jpg",
                    description: "Original pamphlet from the 1942 movement",
                    era: "Independence Movement",
                    isCorrect: true
                  },
                  {
                    name: "British East India Company Flag",
                    imageUrl: "/images/artifacts/eic-flag.jpg",
                    description: "Flag of the trading company that led to British rule",
                    era: "Colonial Period (Before Independence Movement)",
                    isCorrect: false
                  },
                  {
                    name: "Gandhi's Spectacles",
                    imageUrl: "/images/artifacts/gandhi-glasses.jpg",
                    description: "The iconic round glasses worn by Mahatma Gandhi",
                    era: "Independence Movement",
                    isCorrect: true
                  },
                  {
                    name: "Original Indian Constitution Draft",
                    imageUrl: "/images/artifacts/constitution.jpg",
                    description: "Draft of India's constitution",
                    era: "Post-Independence (1950)",
                    isCorrect: false
                  }
                ]
              },
              onSuccess: {
                narrative: "Excellent! You can identify the symbols and artifacts of India's freedom struggle. These objects tell the story of sacrifice and determination.",
                reward: "Historical Artifacts Expert Badge",
                points: 40
              },
              onFailure: {
                narrative: "Some of these artifacts are from the independence movement, while others are from before or after this period.",
                hint: "Think about what was specifically used during the 1857-1947 freedom struggle.",
                retryAllowed: true
              }
            }
          ],

          discoveries: [
            {
              type: "document",
              name: "Indian Independence Act 1947",
              content: "The British Parliament's act that granted independence to India and Pakistan.",
              historicalSignificance: "The legal document that officially ended British rule in India.",
              imageUrl: "/images/discoveries/independence-act.jpg",
              year: 1947
            },
            {
              type: "painting",
              name: "Hoisting of the Indian Flag, August 15, 1947",
              content: "A painting capturing the moment when the Indian tricolor was hoisted at Red Fort.",
              historicalSignificance: "Visual representation of India's independence moment.",
              imageUrl: "/images/discoveries/flag-hoisting.jpg",
              year: 1947
            }
          ],

          learningOutcomes: [
            "Understanding the culmination of the independence movement",
            "Learning about the joy of freedom and tragedy of partition",
            "Recognizing the sacrifices made by freedom fighters"
          ],

          nextChapters: [5]
        },

        {
          chapterNumber: 5,
          title: "Legacy and Reflection",

          scene: {
            location: "India Gate, Delhi - Present Day",
            timeOfDay: "Evening",
            atmosphere: "Peaceful and reflective. The eternal flame burns for the soldiers.",
            imageUrl: "/images/journeys/india-gate-present.jpg",
            backgroundMusic: "/audio/journeys/reflection-theme.mp3"
          },

          narrative: "You find yourself transported to present-day India. Standing at India Gate, you reflect on the journey you've witnessed. From the Quit India Movement of 1942 to independence in 1947, you've experienced the final years of a struggle that spanned generations. The sacrifices, the courage, the non-violent resistance - all of it led to this: a free, democratic India. But freedom was just the beginning. The work of building the nation continues.",

          characters: [
            {
              name: "A modern student (like you)",
              role: "Student learning about independence",
              dialogue: "My grandfather told me stories about the freedom struggle. He said we should never forget the price of freedom. Now I understand what he meant. These weren't just historical events - these were real people making incredible sacrifices.",
              imageUrl: "/images/characters/modern-student.jpg"
            }
          ],

          historicalContext: [
            {
              fact: "India's independence movement influenced freedom struggles worldwide, including in Africa and other parts of Asia.",
              presentedAs: "observation",
              importance: "Shows the global impact of India's non-violent resistance movement."
            },
            {
              fact: "The values of the freedom struggle - democracy, secularism, equality - became the foundation of modern India.",
              presentedAs: "observation",
              importance: "The struggle wasn't just for political freedom but for building a just society."
            }
          ],

          decisions: [
            {
              prompt: "Having experienced this journey through India's independence struggle, what will you do?",
              options: [
                {
                  text: "Share these stories with others to keep history alive",
                  consequence: "You vow to share these stories with friends and family. History isn't just dates and events - it's about people, courage, and sacrifice. By sharing, you ensure these lessons live on.",
                  leadsToChapter: null,
                  historicalAccuracy: true,
                  learningPoint: "Keeping historical memory alive is crucial for future generations.",
                  pointsAwarded: 30
                },
                {
                  text: "Apply the lessons of non-violence and justice in your own life",
                  consequence: "Gandhi's principles weren't just for independence - they're for life. You decide to stand up against injustice peacefully, just as the freedom fighters did. You've learned that one person can make a difference.",
                  leadsToChapter: null,
                  historicalAccuracy: true,
                  learningPoint: "The principles of the independence movement remain relevant today.",
                  pointsAwarded: 35
                },
                {
                  text: "Visit historical sites and learn more about this period",
                  consequence: "You plan to visit Sabarmati Ashram, Jallianwala Bagh, and other sites of the freedom struggle. Walking where these heroes walked will deepen your understanding and connection to history.",
                  leadsToChapter: null,
                  historicalAccuracy: true,
                  learningPoint: "Physical historical sites help connect us tangibly to the past.",
                  pointsAwarded: 30
                }
              ]
            }
          ],

          challenges: [],

          discoveries: [
            {
              type: "scroll",
              name: "Complete Timeline of Indian Independence",
              content: "A comprehensive scroll showing the entire journey from 1857 to 1947 and beyond.",
              historicalSignificance: "Understanding the complete context of the freedom struggle.",
              imageUrl: "/images/discoveries/complete-timeline.jpg",
              year: 2024
            }
          ],

          learningOutcomes: [
            "Understanding the complete arc of India's independence movement",
            "Connecting historical events to modern values",
            "Recognizing the ongoing relevance of freedom struggle lessons"
          ],

          nextChapters: []
        }
      ],

      conclusion: {
        narrative: "You've completed an extraordinary journey through one of history's greatest freedom struggles. You've witnessed Gandhi's call for 'Do or Die,' experienced the underground resistance, seen women lead when male leaders were imprisoned, and celebrated the midnight of freedom. More importantly, you've learned that freedom isn't given - it's earned through sacrifice, courage, and unwavering commitment to justice.",
        summary: "Through this journey, you've learned about the Quit India Movement, the role of non-violent resistance, the leadership of both famous and unsung heroes, the participation of women, and the complex reality of independence that came with partition. You've seen how ordinary people doing extraordinary things can change the course of history.",
        historicalImpact: "India's independence movement became a model for peaceful resistance worldwide. Martin Luther King Jr. was inspired by Gandhi's methods. Nelson Mandela drew lessons from India's struggle. The principle that moral force can overcome physical force changed the 20th century.",
        connections: [
          "The right to protest peacefully is a cornerstone of modern democracy, rooted in the freedom struggle's methods.",
          "India's secular, democratic constitution reflects the inclusive vision of the freedom fighters.",
          "The emphasis on self-reliance (Swadeshi) from the movement influences India's economic thinking today.",
          "The global non-violence movement traces its roots to Gandhi and India's independence struggle."
        ],
        imageUrl: "/images/journeys/conclusion-freedom.jpg"
      }
    },

    embeddeAssessment: {
      knowledgePoints: [
        { concept: "Quit India Movement", whenLearned: "Chapter 1", masteryLevel: "mastered" },
        { concept: "Non-violent resistance", whenLearned: "Chapters 1, 3", masteryLevel: "mastered" },
        { concept: "Underground resistance", whenLearned: "Chapter 2", masteryLevel: "reinforced" },
        { concept: "Women's role in freedom struggle", whenLearned: "Chapter 3", masteryLevel: "mastered" },
        { concept: "Independence and Partition", whenLearned: "Chapter 4", masteryLevel: "introduced" },
        { concept: "Historical timeline 1857-1947", whenLearned: "Chapters 1, 5", masteryLevel: "mastered" }
      ],

      skillsDeveloped: [
        {
          skill: "Critical thinking",
          examples: ["Choosing between different resistance strategies", "Understanding historical cause and effect"]
        },
        {
          skill: "Empathy and perspective-taking",
          examples: ["Understanding sacrifices of freedom fighters", "Recognizing complexity of partition"]
        },
        {
          skill: "Decision-making under pressure",
          examples: ["Making choices during protests", "Deciding how to distribute underground newspapers"]
        },
        {
          skill: "Historical analysis",
          examples: ["Arranging events chronologically", "Identifying authentic historical artifacts"]
        }
      ]
    },

    rewards: {
      badges: [
        { name: "Freedom Fighter", description: "Completed the Independence Movement journey", criteria: "Complete all chapters", icon: "🇮🇳" },
        { name: "Historical Timeline Master", description: "Arranged historical events correctly", criteria: "Complete timeline challenge", icon: "📅" },
        { name: "Codebreaker", description: "Decoded secret messages", criteria: "Complete decoding challenge", icon: "🔐" },
        { name: "Strategic Planner", description: "Planned effective protest routes", criteria: "Complete map navigation challenge", icon: "🗺️" },
        { name: "Artifact Expert", description: "Identified historical artifacts correctly", criteria: "Complete artifact challenge", icon: "🏺" }
      ],

      achievements: [
        { name: "Non-Violence Advocate", description: "Chose peaceful resistance options consistently", unlockCondition: "Make 3+ non-violent choices" },
        { name: "History Scholar", description: "Scored 80%+ historical accuracy", unlockCondition: "High historical accuracy rate" },
        { name: "Complete Journey", description: "Visited all chapters", unlockCondition: "Finish all 5 chapters" }
      ],

      collectibles: [
        { name: "Gandhi's Charkha", type: "artifact", description: "Symbol of self-reliance movement", imageUrl: "/images/collectibles/charkha.jpg" },
        { name: "Quit India Flag", type: "artifact", description: "The tricolor hoisted in defiance", imageUrl: "/images/collectibles/flag.jpg" },
        { name: "Underground Newspaper", type: "document", description: "Secret press publications", imageUrl: "/images/collectibles/newspaper.jpg" },
        { name: "Independence Speech", type: "document", description: "Nehru's Tryst with Destiny", imageUrl: "/images/collectibles/speech.jpg" }
      ]
    },

    estimatedDuration: 45, // minutes
    difficulty: "intermediate",

    prerequisiteKnowledge: [
      "Basic understanding of British colonial rule in India",
      "Awareness of Mahatma Gandhi as a leader",
      "General knowledge of India's independence in 1947"
    ],

    relatedJourneys: [],

    curriculumAlignment: {
      topics: [
        "Indian Freedom Struggle",
        "Quit India Movement",
        "Non-violent Resistance",
        "Role of Women in Independence",
        "Partition of India"
      ],
      learningObjectives: [
        "Understand the key events of 1942-1947 in India's independence movement",
        "Analyze the effectiveness of non-violent resistance",
        "Evaluate the role of different leaders and common people in the struggle",
        "Examine the complex nature of independence and partition",
        "Connect historical events to modern democratic values"
      ],
      ncertChapters: ["Class 9: History - Chapter 3: Nationalism in India"]
    },

    isActive: true
  }
];

module.exports = journeys;
