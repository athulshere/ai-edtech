import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Section - Login Form */}
        <div className="auth-left">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-wrapper">
              <div className="auth-logo-icon">🎓</div>
              <div className="auth-logo-text">EdTech Platform</div>
            </div>
          </div>

          {/* Title */}
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in to continue to your dashboard
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@example.com"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? '' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <div className="auth-security-notice">
              <div className="security-icon">🔒</div>
              <div className="security-content">
                <div className="security-title">Secure Access</div>
                <div className="security-text">
                  Your data is encrypted and protected. Need help? Contact your administrator.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Visual Content */}
        <div className="auth-right">
          <div className="auth-visual-content">
            <div className="auth-visual-header">
              <div className="auth-visual-badge">Trusted by 1000+ Schools</div>
              <h2 className="auth-visual-title">
                Empowering Education Through Technology
              </h2>
              <p className="auth-visual-description">
                Your complete platform for modern classroom management, AI-powered assessments, and student engagement.
              </p>
            </div>

            <div className="auth-visual-cards">
              <div className="auth-visual-card">
                <div className="auth-visual-card-header">
                  <div className="auth-visual-icon">🎯</div>
                  <div>
                    <div className="auth-visual-card-title">Smart Assessment</div>
                    <div className="auth-visual-card-subtitle">AI-Powered Grading</div>
                  </div>
                </div>
                <div className="auth-visual-card-content">
                  Automated grading with intelligent feedback saves hours of manual work while providing detailed insights.
                </div>
              </div>

              <div className="auth-visual-card">
                <div className="auth-visual-card-header">
                  <div className="auth-visual-icon">📈</div>
                  <div>
                    <div className="auth-visual-card-title">Progress Tracking</div>
                    <div className="auth-visual-card-subtitle">Real-time Analytics</div>
                  </div>
                </div>
                <div className="auth-visual-card-content">
                  Monitor student performance with comprehensive dashboards and data-driven insights for better outcomes.
                </div>
              </div>

              <div className="auth-visual-card">
                <div className="auth-visual-card-header">
                  <div className="auth-visual-icon">🎮</div>
                  <div>
                    <div className="auth-visual-card-title">Engaging Content</div>
                    <div className="auth-visual-card-subtitle">Interactive Learning</div>
                  </div>
                </div>
                <div className="auth-visual-card-content">
                  Gamified learning experiences and interactive quizzes keep students motivated and actively engaged.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
