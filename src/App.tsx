import React, { ErrorInfo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import MainFeaturePage from './pages/MainFeaturePage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import ActivityPage from './pages/ActivityPage';
import SignupPage from './pages/SignupPage';
import CustomerSignupPage from './pages/CustomerSignupPage';
import SellerSignupPage from './pages/SellerSignupPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import FeaturesPage from './pages/FeaturesPage';
import SupportPage from './pages/SupportPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import UploadPage from './pages/UploadPage';
import UploadOutfit from './pages/UploadOutfit';
import ExplorePage from './pages/ExplorePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  // Deployment test - verify automatic deployment is working
  // eslint-disable-next-line no-console
  console.log('🚀 StyleLink App Loaded - Auto-deploy test v1.0.0');
  
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // In production, forward to monitoring; in development, surface in console for quick diagnosis.
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('App Error:', error, errorInfo);
    }
  };

  return (
    <ErrorBoundary onError={handleError}>
      <AuthProvider>
        <UserProvider>
          <Router>
            <div className="App min-h-screen flex flex-col">
              <Navbar />
              
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  
                  {/* Authentication Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/signup/customer" element={<CustomerSignupPage />} />
                  <Route path="/signup/seller" element={<SellerSignupPage />} />
                  
                  {/* Protected Routes - Require Authentication */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/:userId"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/activity"
                    element={
                      <ProtectedRoute>
                        <ActivityPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/discover"
                    element={
                      <ProtectedRoute>
                        <MainFeaturePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/results"
                    element={
                      <ProtectedRoute>
                        <ResultsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/upload"
                    element={
                      <ProtectedRoute>
                        <UploadOutfit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/explore"
                    element={<ExplorePage />}
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              
              <Footer />
              
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
