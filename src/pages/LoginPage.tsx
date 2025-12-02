import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { useReducedMotion } from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  // Get the location to redirect to after login (or default to home)
  const from = (location.state as any)?.from?.pathname || '/';

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

  // Validate form
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await login(email, password);
      // Redirect to the page user was trying to access, or home
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by AuthContext and displayed via toast
      console.error('Login error:', err);
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
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              variants={fadeIn}
              className="inline-block p-4 bg-gradient-to-br from-[#B7410E] to-[#8B5E3C] rounded-full mb-6"
            >
              <LogIn className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#B7410E] mb-4">
              Welcome Back
            </h1>
            <p className="text-lg text-[#2D2D2D]/70">
              Sign in to continue your style journey
            </p>
          </div>

          {/* Auth error message */}
          {error && (
            <motion.div
              variants={fadeIn}
              className="mb-6"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start gap-3 rounded-xl border border-[#B7410E]/20 bg-[#B7410E]/5 px-4 py-3 text-[#B7410E]">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.25a.75.75 0 011.5 0v1.5a.75.75 0 01-1.5 0v-1.5zm0-6a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0V6.75z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-semibold">Login error</p>
                  <p className="text-sm leading-5 text-[#2D2D2D]">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <motion.div
            variants={fadeIn}
            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Email Input */}
              <div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) {
                      clearError();
                    }
                    if (formErrors.email) {
                      setFormErrors({ ...formErrors, email: undefined });
                    }
                  }}
                  error={formErrors.email}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) {
                        clearError();
                      }
                      if (formErrors.password) {
                        setFormErrors({ ...formErrors, password: undefined });
                      }
                    }}
                    error={formErrors.password}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8B5E3C]/60 hover:text-[#B7410E] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#B7410E] hover:text-[#8B5E3C] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-[#8B5E3C] hover:bg-[#B7410E] text-white"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            variants={fadeIn}
            className="text-center"
          >
            <p className="text-[#2D2D2D]/70 mb-4">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-[#B7410E] hover:text-[#8B5E3C] font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

