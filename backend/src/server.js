require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const assessmentRoutes = require('./routes/assessments');
const schoolRoutes = require('./routes/school');
const classRoutes = require('./routes/class');
const sectionRoutes = require('./routes/section');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const parentRoutes = require('./routes/parent');
const quizRoutes = require('./routes/quiz');
const alertRoutes = require('./routes/alert');
const teacherRoutes = require('./routes/teacher');
const gameRoutes = require('./routes/game');
const historicalJourneyRoutes = require('./routes/historicalJourney');

const app = express();

connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 to 1000 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EdTech Assessment API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/journeys', historicalJourneyRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
