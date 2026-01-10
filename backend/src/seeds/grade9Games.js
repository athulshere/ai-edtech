/**
 * Grade 9 Educational Games
 * 10 games per subject: Mathematics, Science, English
 */

const grade9Games = {
  mathematics: [
    {
      title: 'Algebra Challenge',
      description: 'Solve linear equations and algebraic expressions',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '9',
      difficulty: 'medium',
      syllabusTopic: 'Algebra',
      timeLimit: 300,
      maxScore: 100,
      pointsReward: 25,
      gameConfig: {
        questions: [
          { question: 'Solve: 2x + 5 = 13, x = ?', options: ['3', '4', '5', '6'], correctAnswer: 1, explanation: '2x = 13 - 5 = 8, so x = 4', points: 10 },
          { question: 'Simplify: 3x + 2x - x = ?', options: ['4x', '5x', '6x', '2x'], correctAnswer: 0, explanation: '3x + 2x - x = 4x', points: 10 },
          { question: 'If x = 3, what is 2x² + 3x?', options: ['27', '24', '21', '18'], correctAnswer: 0, explanation: '2(9) + 3(3) = 18 + 9 = 27', points: 10 },
          { question: 'Solve: 3(x - 2) = 12, x = ?', options: ['4', '5', '6', '7'], correctAnswer: 2, explanation: '3x - 6 = 12, 3x = 18, x = 6', points: 10 },
          { question: 'Factor: x² - 9 = ?', options: ['(x-3)(x+3)', '(x-9)(x+1)', '(x-1)(x+9)', 'Cannot factor'], correctAnswer: 0, explanation: 'Difference of squares: (x-3)(x+3)', points: 10 },
          { question: 'If 2x + y = 10 and x = 3, y = ?', options: ['2', '3', '4', '5'], correctAnswer: 2, explanation: '2(3) + y = 10, 6 + y = 10, y = 4', points: 10 },
          { question: 'Expand: (x + 2)(x + 3) = ?', options: ['x² + 5x + 6', 'x² + 6x + 5', 'x² + 5x + 5', 'x² + 6x + 6'], correctAnswer: 0, explanation: 'x² + 3x + 2x + 6 = x² + 5x + 6', points: 10 },
          { question: 'Solve: x/4 = 5, x = ?', options: ['15', '20', '25', '30'], correctAnswer: 1, explanation: 'x = 5 × 4 = 20', points: 10 },
          { question: 'What is the slope of y = 2x + 3?', options: ['1', '2', '3', '5'], correctAnswer: 1, explanation: 'In y = mx + c, slope m = 2', points: 10 },
          { question: 'Simplify: (2x)³ = ?', options: ['6x³', '8x³', '2x³', '6x'], correctAnswer: 1, explanation: '(2x)³ = 2³ × x³ = 8x³', points: 10 }
        ]
      }
    },
    {
      title: 'Geometry Master',
      description: 'Test your knowledge of angles, triangles, and circles',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '9',
      difficulty: 'medium',
      syllabusTopic: 'Geometry',
      timeLimit: 300,
      maxScore: 100,
      pointsReward: 25,
      gameConfig: {
        questions: [
          { question: 'Sum of angles in a triangle = ?', options: ['90°', '180°', '270°', '360°'], correctAnswer: 1, explanation: 'Sum of angles in any triangle is 180°', points: 10 },
          { question: 'Area of circle with radius 7 cm (π = 22/7)?', options: ['144 cm²', '154 cm²', '164 cm²', '174 cm²'], correctAnswer: 1, explanation: 'A = πr² = (22/7) × 7 × 7 = 154 cm²', points: 10 },
          { question: 'Pythagoras theorem: a² + b² = ?', options: ['c', 'c²', 'c³', '2c'], correctAnswer: 1, explanation: 'In right triangle: a² + b² = c² (hypotenuse)', points: 10 },
          { question: 'If two angles of triangle are 60° and 70°, third angle = ?', options: ['40°', '50°', '60°', '70°'], correctAnswer: 1, explanation: '180° - 60° - 70° = 50°', points: 10 },
          { question: 'Circumference of circle with radius 14 cm (π = 22/7)?', options: ['78 cm', '88 cm', '98 cm', '108 cm'], correctAnswer: 1, explanation: 'C = 2πr = 2 × (22/7) × 14 = 88 cm', points: 10 },
          { question: 'In a right triangle, if one angle is 90°, the other two are:', options: ['Complementary', 'Supplementary', 'Equal', 'None'], correctAnswer: 0, explanation: 'They add up to 90° (complementary)', points: 10 },
          { question: 'Volume of cube with side 3 cm = ?', options: ['9 cm³', '18 cm³', '27 cm³', '36 cm³'], correctAnswer: 2, explanation: 'V = s³ = 3³ = 27 cm³', points: 10 },
          { question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correctAnswer: 1, explanation: 'Hexagon has 6 sides', points: 10 },
          { question: 'If radius is doubled, area of circle becomes:', options: ['Double', 'Triple', '4 times', '8 times'], correctAnswer: 2, explanation: 'A = πr², if r becomes 2r, area = π(2r)² = 4πr²', points: 10 },
          { question: 'Diagonal of square with side 10 cm = ? (approx)', options: ['12.1 cm', '14.1 cm', '16.1 cm', '18.1 cm'], correctAnswer: 1, explanation: 'd = s√2 = 10√2 ≈ 14.14 cm', points: 10 }
        ]
      }
    },
    {
      title: 'Number Systems',
      description: 'Master rational and irrational numbers',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '9',
      difficulty: 'medium',
      syllabusTopic: 'Number Systems',
      timeLimit: 240,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        questions: [
          { question: 'Which is an irrational number?', options: ['√4', '√9', '√2', '√16'], correctAnswer: 2, explanation: '√2 cannot be expressed as p/q', points: 10 },
          { question: '0.333... is a:', options: ['Natural number', 'Whole number', 'Rational number', 'Irrational number'], correctAnswer: 2, explanation: '0.333... = 1/3 (rational)', points: 10 },
          { question: 'π (pi) is:', options: ['Rational', 'Irrational', 'Whole number', 'Integer'], correctAnswer: 1, explanation: 'π = 3.14159... (non-terminating, non-repeating)', points: 10 },
          { question: 'Between which integers does √50 lie?', options: ['5 and 6', '6 and 7', '7 and 8', '8 and 9'], correctAnswer: 2, explanation: '√49 = 7, √64 = 8, so √50 is between 7 and 8', points: 10 },
          { question: 'Which is NOT a rational number?', options: ['3/4', '5', '√3', '0.25'], correctAnswer: 2, explanation: '√3 is irrational', points: 10 },
          { question: '√0 = ?', options: ['-1', '0', '1', 'undefined'], correctAnswer: 1, explanation: '√0 = 0', points: 10 },
          { question: 'The decimal expansion of 1/7 is:', options: ['Terminating', 'Non-terminating repeating', 'Non-terminating non-repeating', 'None'], correctAnswer: 1, explanation: '1/7 = 0.142857... (repeating)', points: 10 },
          { question: 'Which is the smallest prime number?', options: ['0', '1', '2', '3'], correctAnswer: 2, explanation: '2 is the smallest prime', points: 10 },
          { question: 'HCF of 12 and 18 = ?', options: ['3', '4', '6', '9'], correctAnswer: 2, explanation: 'Common factors: 1,2,3,6. Highest is 6', points: 10 },
          { question: 'LCM of 4 and 6 = ?', options: ['10', '12', '18', '24'], correctAnswer: 1, explanation: 'Multiples of 4: 4,8,12,16... Multiples of 6: 6,12,18... LCM = 12', points: 10 }
        ]
      }
    },
    {
      title: 'Statistics Starter',
      description: 'Learn mean, median, and mode',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '9',
      difficulty: 'easy',
      syllabusTopic: 'Statistics',
      timeLimit: 300,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        questions: [
          { question: 'Mean of 2, 4, 6, 8, 10 = ?', options: ['5', '6', '7', '8'], correctAnswer: 1, explanation: '(2+4+6+8+10)/5 = 30/5 = 6', points: 10 },
          { question: 'Median of 3, 7, 5, 9, 1 = ?', options: ['3', '5', '7', '9'], correctAnswer: 1, explanation: 'Arrange: 1,3,5,7,9. Middle value = 5', points: 10 },
          { question: 'Mode of 2, 3, 3, 4, 5, 3, 6 = ?', options: ['2', '3', '4', '5'], correctAnswer: 1, explanation: '3 appears most frequently (3 times)', points: 10 },
          { question: 'Range of 10, 15, 20, 25, 30 = ?', options: ['15', '20', '25', '30'], correctAnswer: 1, explanation: 'Range = Max - Min = 30 - 10 = 20', points: 10 },
          { question: 'What is the median of 2, 4, 6, 8?', options: ['4', '5', '6', '7'], correctAnswer: 1, explanation: 'For even numbers: (4+6)/2 = 5', points: 10 },
          { question: 'If mean of 3 numbers is 6, their sum = ?', options: ['12', '15', '18', '21'], correctAnswer: 2, explanation: 'Mean = Sum/n, so Sum = 6 × 3 = 18', points: 10 },
          { question: 'Mode of 1, 2, 3, 4, 5 = ?', options: ['1', '3', '5', 'No mode'], correctAnswer: 3, explanation: 'All appear once, no mode', points: 10 },
          { question: 'Mean of 0, 0, 5, 5, 10 = ?', options: ['3', '4', '5', '6'], correctAnswer: 1, explanation: '(0+0+5+5+10)/5 = 20/5 = 4', points: 10 },
          { question: 'What does frequency mean in statistics?', options: ['Mean value', 'How often data occurs', 'Median value', 'Range'], correctAnswer: 1, explanation: 'Frequency = how many times a value appears', points: 10 },
          { question: 'Median of 1, 2, 3, 4, 5, 6, 7 = ?', options: ['3', '4', '5', '6'], correctAnswer: 1, explanation: 'Middle value of 7 numbers is the 4th value = 4', points: 10 }
        ]
      }
    },
    {
      title: 'Coordinate Geometry',
      description: 'Plot points and find distances on coordinate plane',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '9',
      difficulty: 'medium',
      syllabusTopic: 'Coordinate Geometry',
      timeLimit: 300,
      maxScore: 100,
      pointsReward: 25,
      gameConfig: {
        questions: [
          { question: 'What are coordinates of origin?', options: ['(1,0)', '(0,1)', '(0,0)', '(1,1)'], correctAnswer: 2, explanation: 'Origin is at (0,0)', points: 10 },
          { question: 'In which quadrant is point (3, -4)?', options: ['I', 'II', 'III', 'IV'], correctAnswer: 3, explanation: 'x positive, y negative = Quadrant IV', points: 10 },
          { question: 'Distance between (0,0) and (3,4) = ?', options: ['3', '4', '5', '7'], correctAnswer: 2, explanation: 'd = √(3² + 4²) = √25 = 5', points: 10 },
          { question: 'If x-coordinate is 0, point lies on:', options: ['x-axis', 'y-axis', 'Origin', 'Quadrant'], correctAnswer: 1, explanation: 'Points with x=0 lie on y-axis', points: 10 },
          { question: 'Midpoint of (2,4) and (6,8) = ?', options: ['(4,6)', '(8,12)', '(3,5)', '(4,4)'], correctAnswer: 0, explanation: 'Midpoint = ((2+6)/2, (4+8)/2) = (4,6)', points: 10 },
          { question: 'Point (-2, -3) lies in quadrant:', options: ['I', 'II', 'III', 'IV'], correctAnswer: 2, explanation: 'Both coordinates negative = Quadrant III', points: 10 },
          { question: 'Abscissa means:', options: ['y-coordinate', 'x-coordinate', 'Origin', 'Distance'], correctAnswer: 1, explanation: 'Abscissa = x-coordinate', points: 10 },
          { question: 'Ordinate means:', options: ['x-coordinate', 'y-coordinate', 'Origin', 'Slope'], correctAnswer: 1, explanation: 'Ordinate = y-coordinate', points: 10 },
          { question: 'Points (3,0) lies on:', options: ['x-axis', 'y-axis', 'Origin', 'Quadrant I'], correctAnswer: 0, explanation: 'y=0 means point is on x-axis', points: 10 },
          { question: 'Distance formula uses:', options: ['Addition', 'Subtraction', 'Pythagoras theorem', 'Division'], correctAnswer: 2, explanation: 'd = √[(x₂-x₁)² + (y₂-y₁)²] from Pythagoras', points: 10 }
        ]
      }
    },
    {
      title: 'Polynomial Power',
      description: 'Factor and solve polynomial expressions',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '9',
      difficulty: 'hard',
      syllabusTopic: 'Polynomials',
      timeLimit: 300,
      maxScore: 100,
      pointsReward: 30,
      gameConfig: {
        questions: [
          { question: 'Degree of polynomial 5x³ + 2x² - x + 7 = ?', options: ['1', '2', '3', '4'], correctAnswer: 2, explanation: 'Highest power of x is 3', points: 10 },
          { question: 'Which is a binomial?', options: ['x', 'x + y', 'x + y + z', 'xyz'], correctAnswer: 1, explanation: 'Binomial has 2 terms', points: 10 },
          { question: '(a + b)² = ?', options: ['a² + b²', 'a² + 2ab + b²', 'a² - b²', 'a² + ab + b²'], correctAnswer: 1, explanation: '(a+b)² = a² + 2ab + b²', points: 10 },
          { question: '(a - b)² = ?', options: ['a² - b²', 'a² + b²', 'a² - 2ab + b²', 'a² + 2ab - b²'], correctAnswer: 2, explanation: '(a-b)² = a² - 2ab + b²', points: 10 },
          { question: 'a² - b² = ?', options: ['(a+b)²', '(a-b)²', '(a+b)(a-b)', 'Cannot factor'], correctAnswer: 2, explanation: 'Difference of squares: a² - b² = (a+b)(a-b)', points: 10 },
          { question: 'If p(x) = x² - 4, then p(2) = ?', options: ['-4', '0', '4', '8'], correctAnswer: 1, explanation: 'p(2) = 2² - 4 = 4 - 4 = 0', points: 10 },
          { question: 'A polynomial of degree 2 is called:', options: ['Linear', 'Quadratic', 'Cubic', 'Constant'], correctAnswer: 1, explanation: 'Degree 2 = Quadratic polynomial', points: 10 },
          { question: 'Zero of polynomial x - 5 = ?', options: ['0', '5', '-5', '1'], correctAnswer: 1, explanation: 'x - 5 = 0, so x = 5', points: 10 },
          { question: '(x + y)(x - y) = ?', options: ['x² + y²', 'x² - y²', 'x² + 2xy + y²', 'x² - 2xy + y²'], correctAnswer: 1, explanation: '(x+y)(x-y) = x² - y²', points: 10 },
          { question: 'Constant polynomial has degree:', options: ['-1', '0', '1', '2'], correctAnswer: 1, explanation: 'Constant like "5" has degree 0', points: 10 }
        ]
      }
    },
    {
      title: 'Triangle Theorems',
      description: 'Apply congruence and similarity concepts',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '9',
      difficulty: 'medium',
      syllabusTopic: 'Triangles',
      timeLimit: 300,
      maxScore: 100,
      pointsReward: 25,
      gameConfig: {
        questions: [
          { question: 'For congruent triangles, corresponding sides are:', options: ['Different', 'Equal', 'Proportional', 'None'], correctAnswer: 1, explanation: 'Congruent triangles have equal corresponding sides', points: 10 },
          { question: 'SAS stands for:', options: ['Side-Angle-Side', 'Side-Area-Side', 'Shape-Angle-Shape', 'None'], correctAnswer: 0, explanation: 'SAS = Side-Angle-Side congruence criterion', points: 10 },
          { question: 'In isosceles triangle, how many sides are equal?', options: ['0', '1', '2', '3'], correctAnswer: 2, explanation: 'Isosceles has 2 equal sides', points: 10 },
          { question: 'Equilateral triangle has all angles = ?', options: ['45°', '60°', '90°', '120°'], correctAnswer: 1, explanation: 'Each angle = 180°/3 = 60°', points: 10 },
          { question: 'In right triangle, side opposite to 90° is called:', options: ['Base', 'Height', 'Hypotenuse', 'Perpendicular'], correctAnswer: 2, explanation: 'Longest side opposite right angle is hypotenuse', points: 10 },
          { question: 'If two triangles are similar, their corresponding angles are:', options: ['Different', 'Equal', 'Complementary', 'Supplementary'], correctAnswer: 1, explanation: 'Similar triangles have equal corresponding angles', points: 10 },
          { question: 'ASA stands for:', options: ['Angle-Side-Angle', 'Area-Side-Area', 'Angle-Shape-Angle', 'None'], correctAnswer: 0, explanation: 'ASA = Angle-Side-Angle congruence criterion', points: 10 },
          { question: 'Sum of any two sides of triangle must be:', options: ['Equal to third side', 'Less than third side', 'Greater than third side', 'Double the third side'], correctAnswer: 2, explanation: 'Triangle inequality: sum of two sides > third side', points: 10 },
          { question: 'Median of triangle divides it into:', options: ['2 equal areas', '2 unequal parts', '3 parts', '4 parts'], correctAnswer: 0, explanation: 'Median divides triangle into 2 equal areas', points: 10 },
          { question: 'Point where medians meet is called:', options: ['Circumcenter', 'Incenter', 'Centroid', 'Orthocenter'], correctAnswer: 2, explanation: 'Centroid is where medians intersect', points: 10 }
        ]
      }
    },
    {
      title: 'Surface Area & Volume',
      description: 'Calculate dimensions of 3D shapes',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '9',
      difficulty: 'medium',
      syllabusTopic: 'Mensuration',
      timeLimit: 300,
      maxScore: 100,
      pointsReward: 25,
      gameConfig: {
        questions: [
          { question: 'Volume of cube with side 5 cm = ?', options: ['25 cm³', '75 cm³', '125 cm³', '150 cm³'], correctAnswer: 2, explanation: 'V = s³ = 5³ = 125 cm³', points: 10 },
          { question: 'Surface area of cube with side 4 cm = ?', options: ['64 cm²', '96 cm²', '128 cm²', '256 cm²'], correctAnswer: 1, explanation: 'SA = 6s² = 6(4²) = 96 cm²', points: 10 },
          { question: 'Volume of cuboid (l=2, b=3, h=4) = ?', options: ['9 cm³', '12 cm³', '18 cm³', '24 cm³'], correctAnswer: 3, explanation: 'V = l×b×h = 2×3×4 = 24 cm³', points: 10 },
          { question: 'Curved surface area of cylinder = ?', options: ['πr²', '2πr²', '2πrh', 'πr²h'], correctAnswer: 2, explanation: 'CSA of cylinder = 2πrh', points: 10 },
          { question: 'Volume of cylinder with r=7, h=10 (π=22/7) = ?', options: ['1440 cm³', '1540 cm³', '1640 cm³', '1740 cm³'], correctAnswer: 1, explanation: 'V = πr²h = (22/7)×49×10 = 1540 cm³', points: 10 },
          { question: 'Total surface area of cylinder = ?', options: ['2πr(r+h)', '2πrh', 'πr²h', '2πr²'], correctAnswer: 0, explanation: 'TSA = 2πr(r+h)', points: 10 },
          { question: 'Volume of cone = ?', options: ['πr²h', '1/3 πr²h', '2/3 πr²h', '1/2 πr²h'], correctAnswer: 1, explanation: 'V of cone = 1/3 πr²h', points: 10 },
          { question: 'Volume of sphere with radius r = ?', options: ['4/3 πr³', '4πr²', 'πr³', '2/3 πr³'], correctAnswer: 0, explanation: 'V of sphere = 4/3 πr³', points: 10 },
          { question: 'Surface area of sphere with radius r = ?', options: ['2πr²', '3πr²', '4πr²', 'πr²'], correctAnswer: 2, explanation: 'SA of sphere = 4πr²', points: 10 },
          { question: 'Diagonal of cuboid (2×3×6) = ?', options: ['5', '6', '7', '8'], correctAnswer: 2, explanation: 'd = √(l²+b²+h²) = √(4+9+36) = √49 = 7', points: 10 }
        ]
      }
    },
    {
      title: 'Linear Equations Sprint',
      description: 'Solve equations in two variables',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '9',
      difficulty: 'medium',
      syllabusTopic: 'Linear Equations',
      timeLimit: 300,
      maxScore: 100,
      pointsReward: 25,
      gameConfig: {
        questions: [
          { question: 'If x + y = 10 and x = 3, then y = ?', options: ['5', '6', '7', '8'], correctAnswer: 2, explanation: '3 + y = 10, so y = 7', points: 10 },
          { question: 'Which is a linear equation?', options: ['x² + y = 5', 'xy = 6', '2x + 3y = 7', 'x/y = 2'], correctAnswer: 2, explanation: 'Linear equation has degree 1 for each variable', points: 10 },
          { question: 'Graph of linear equation is a:', options: ['Circle', 'Parabola', 'Straight line', 'Curve'], correctAnswer: 2, explanation: 'Linear equations produce straight lines', points: 10 },
          { question: 'If 2x + 3 = 11, then x = ?', options: ['2', '3', '4', '5'], correctAnswer: 2, explanation: '2x = 8, x = 4', points: 10 },
          { question: 'Solution of x + y = 5 when x = 2:', options: ['(2,2)', '(2,3)', '(2,4)', '(2,5)'], correctAnswer: 1, explanation: '2 + y = 5, y = 3, solution (2,3)', points: 10 },
          { question: 'If 3x = 15, then x = ?', options: ['3', '4', '5', '6'], correctAnswer: 2, explanation: 'x = 15/3 = 5', points: 10 },
          { question: 'Standard form of linear equation in 2 variables:', options: ['y = mx + c', 'ax + by + c = 0', 'x = y', 'xy = k'], correctAnswer: 1, explanation: 'Standard form: ax + by + c = 0', points: 10 },
          { question: 'How many solutions does x + y = 5 have?', options: ['0', '1', '2', 'Infinite'], correctAnswer: 3, explanation: 'Linear equation in 2 variables has infinite solutions', points: 10 },
          { question: 'If x - y = 0, then:', options: ['x > y', 'x < y', 'x = y', 'x ≠ y'], correctAnswer: 2, explanation: 'x - y = 0 means x = y', points: 10 },
          { question: 'Point (0, 5) satisfies which equation?', options: ['x + y = 5', 'x - y = 5', 'y = 5', 'x = 5'], correctAnswer: 2, explanation: 'When x=0, y=5 satisfies y = 5', points: 10 }
        ]
      }
    },
    {
      title: 'Probability Basics',
      description: 'Calculate chances and outcomes',
      gameType: 'multiple_choice_race',
      subject: 'Mathematics',
      grade: '9',
      difficulty: 'easy',
      syllabusTopic: 'Probability',
      timeLimit: 240,
      maxScore: 100,
      pointsReward: 20,
      gameConfig: {
        questions: [
          { question: 'Probability of certain event = ?', options: ['0', '0.5', '1', '2'], correctAnswer: 2, explanation: 'Certain event has probability 1', points: 10 },
          { question: 'Probability of impossible event = ?', options: ['0', '0.5', '1', '-1'], correctAnswer: 0, explanation: 'Impossible event has probability 0', points: 10 },
          { question: 'Probability of getting head in coin toss = ?', options: ['0', '1/4', '1/2', '1'], correctAnswer: 2, explanation: 'P(Head) = 1/2 (1 favorable / 2 possible)', points: 10 },
          { question: 'A die has how many outcomes?', options: ['4', '5', '6', '8'], correctAnswer: 2, explanation: 'Die has 6 faces (1,2,3,4,5,6)', points: 10 },
          { question: 'Probability of getting 3 on a die = ?', options: ['1/3', '1/4', '1/5', '1/6'], correctAnswer: 3, explanation: 'P(3) = 1/6 (one 3 in six outcomes)', points: 10 },
          { question: 'In a deck of 52 cards, probability of drawing a king = ?', options: ['1/13', '1/26', '4/52', '1/52'], correctAnswer: 0, explanation: '4 kings / 52 cards = 1/13', points: 10 },
          { question: 'Sum of probabilities of all outcomes = ?', options: ['0', '0.5', '1', '2'], correctAnswer: 2, explanation: 'Total probability always equals 1', points: 10 },
          { question: 'Probability always lies between:', options: ['0 and 1', '-1 and 1', '0 and 2', '-1 and 2'], correctAnswer: 0, explanation: 'Probability: 0 ≤ P ≤ 1', points: 10 },
          { question: 'Tossing 2 coins has how many outcomes?', options: ['2', '3', '4', '5'], correctAnswer: 2, explanation: 'HH, HT, TH, TT = 4 outcomes', points: 10 },
          { question: 'Probability of getting an even number on die = ?', options: ['1/6', '1/3', '1/2', '2/3'], correctAnswer: 2, explanation: '3 even numbers (2,4,6) / 6 total = 1/2', points: 10 }
        ]
      }
    }
  ],

  science: [
    // We'll add science games here - for now just creating placeholder structure
  ],

  english: [
    // English games here
  ]
};

module.exports = grade9Games;
