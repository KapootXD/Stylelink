import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button, Input } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { useReducedMotion } from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { resetPassword, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.6 },
    },
  };

  // Validate email
  const validateEmail = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateEmail()) {
      return;
    }

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-[#2D2D2D]/60 hover:text-[#2D2D2D] mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Login</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              variants={fadeIn}
              className="inline-block p-4 bg-gradient-to-br from-[#B7410E] to-[#8B5E3C] rounded-full mb-6"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#B7410E] mb-4">
              Reset Password
            </h1>
            <p className="text-lg text-[#2D2D2D]/70">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form or Success Message */}
          {success ? (
            <motion.div
              variants={fadeIn}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">
                Check your email
              </h2>
              <p className="text-[#2D2D2D]/70 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-[#2D2D2D]/60 mb-6">
                Please check your inbox and click on the link to reset your password.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
                className="w-full bg-[#8B5E3C] hover:bg-[#B7410E] text-white"
              >
                Back to Login
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={fadeIn}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  error={error}
                  required
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-[#8B5E3C] hover:bg-[#B7410E] text-white"
                  disabled={loading || !email}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="sm" />
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>

              {/* Back to Login Link */}
              <div className="text-center mt-6">
                <Link
                  to="/login"
                  className="text-sm text-[#B7410E] hover:text-[#8B5E3C] transition-colors"
                >
                  Remember your password? Sign in
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

