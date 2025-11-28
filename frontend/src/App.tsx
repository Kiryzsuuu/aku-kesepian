import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ROUTES } from './config/constants';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ChatPage from './pages/ChatPage';
import CharactersPage from './pages/CharactersPage';
import AdminDashboard from './pages/AdminDashboard';
import TestAdminPage from './pages/TestAdminPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import { GlobalStyles } from './styles/GlobalStyles';

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyles />
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />

            {/* Protected Routes */}
            <Route path={ROUTES.CHARACTERS} element={
              <ProtectedRoute>
                <CharactersPage />
              </ProtectedRoute>
            } />
            <Route path={ROUTES.CHAT} element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/chat/:sessionId" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/test-admin" element={
              <ProtectedRoute>
                <TestAdminPage />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                color: '#1F2937',
                borderRadius: '16px',
                boxShadow: '0 12px 35px rgba(248, 117, 170, 0.2)',
                border: '2px solid rgba(174, 222, 252, 0.5)',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              },
              success: {
                iconTheme: {
                  primary: '#4ADE80',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
