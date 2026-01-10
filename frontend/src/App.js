import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ParentDashboard from './components/dashboard/ParentDashboard';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ClassManagement from './components/admin/ClassManagement';
import CreateStudent from './components/student/CreateStudent';
import AssessmentDetails from './components/assessment/AssessmentDetails';
import AssessmentUploadPage from './components/assessment/AssessmentUploadPage';
import UserManagement from './components/admin/UserManagement';
import BulkUpload from './components/admin/BulkUpload';
import GamificationPage from './components/gamification/GamificationPage';
import QuizList from './components/quiz/QuizList';
import QuizTaking from './components/quiz/QuizTaking';
import QuizResults from './components/quiz/QuizResults';
import GameList from './components/games/GameList';
import GamePlayer from './components/games/GamePlayer';
import GameResults from './components/games/GameResults';
import JourneyList from './components/journeys/JourneyList';
import JourneyPlayer from './components/journeys/JourneyPlayer';
import JourneyResults from './components/journeys/JourneyResults';

import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user.role === 'parent') {
    return <ParentDashboard />;
  }

  if (user.role === 'teacher') {
    return <TeacherDashboard />;
  }

  return <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Register route for initial admin setup only */}
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-student"
              element={
                <ProtectedRoute allowedRoles={['parent', 'teacher']}>
                  <CreateStudent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/assessment/:assessmentId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'teacher']}>
                  <AssessmentDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/upload-assessment/:studentId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'teacher']}>
                  <AssessmentUploadPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/classes"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ClassManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/bulk-upload"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BulkUpload />
                </ProtectedRoute>
              }
            />

            <Route
              path="/gamification/:studentId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'admin']}>
                  <GamificationPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quizzes/:studentId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'admin']}>
                  <QuizList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quiz/:quizId/take/:studentId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'admin']}>
                  <QuizTaking />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quiz/results/:attemptId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'admin']}>
                  <QuizResults />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games/:studentId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'admin']}>
                  <GameList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/game/:gameId/play/:studentId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'admin']}>
                  <GamePlayer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/game/results/:attemptId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'admin']}>
                  <GameResults />
                </ProtectedRoute>
              }
            />

            <Route
              path="/journeys/:studentId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'admin']}>
                  <JourneyList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/journey/:journeyId/play/:studentId/:attemptId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'admin']}>
                  <JourneyPlayer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/journey/results/:attemptId"
              element={
                <ProtectedRoute allowedRoles={['parent', 'admin']}>
                  <JourneyResults />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
