import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Context
import { UserProvider } from './contexts/UserContext';

// Pages
import HomePage from './pages/HomePage';
import MainFeaturePage from './pages/MainFeaturePage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import CustomerSignupPage from './pages/CustomerSignupPage';
import SellerSignupPage from './pages/SellerSignupPage';
import FeaturesPage from './pages/FeaturesPage';
import SupportPage from './pages/SupportPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import UploadPage from './pages/UploadPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Home Route */}
              <Route path="/" element={<HomePage />} />
              
              {/* Sign-up Routes */}
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signup/customer" element={<CustomerSignupPage />} />
              <Route path="/signup/seller" element={<SellerSignupPage />} />
              
              {/* Feature Routes */}
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/discover" element={<MainFeaturePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/upload" element={<UploadPage />} />
              
              {/* Support Routes */}
              <Route path="/support" element={<SupportPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              
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
  );
}

export default App;
