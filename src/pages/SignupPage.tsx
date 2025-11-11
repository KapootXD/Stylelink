import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Store, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button, Input } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { useReducedMotion } from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [userType, setUserType] = useState<'customer' | 'seller' | ''>('');
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    confirmPassword?: string; 
    userType?: string; 
    general?: string 
  }>({});

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { 
      email?: string; 
      password?: string; 
      confirmPassword?: string; 
      userType?: string 
    } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!userType) {
      newErrors.userType = 'Please select a user type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await signup(email, password, userType as 'customer' | 'seller');
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create account. Please try again.';
      setErrors({ general: errorMessage });
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.5 }
    }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0.05 : 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2D2D2D] mb-2">
            Join StyleLink
          </h1>
          <p className="text-[#2D2D2D]/70">
            Create your account and start your fashion journey
          </p>
        </motion.div>

        {/* Signup Form */}
        <motion.div variants={fadeInUp}>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error Message */}
              {errors.general && (
                <motion.div
                  className="flex items-center gap-2 p-4 bg-[#B7410E]/10 border border-[#B7410E] rounded-lg text-[#B7410E]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{errors.general}</span>
                </motion.div>
              )}

              {/* Email Input */}
              <div>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  error={errors.email}
                  required
                  disabled={loading}
                  aria-label="Email address"
                />
              </div>

              {/* Password Input */}
              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min. 6 characters)"
                  error={errors.password}
                  required
                  disabled={loading}
                  aria-label="Password"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  error={errors.confirmPassword}
                  required
                  disabled={loading}
                  aria-label="Confirm password"
                />
              </div>

              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-3">
                  I want to... <span className="text-[#B7410E]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Customer Option */}
                  <motion.button
                    type="button"
                    onClick={() => setUserType('customer')}
                    disabled={loading}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-300
                      ${userType === 'customer'
                        ? 'border-[#B7410E] bg-[#B7410E]/10'
                        : 'border-[#8B5E3C]/30 hover:border-[#B7410E]/50'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    aria-pressed={userType === 'customer'}
                  >
                    <ShoppingBag 
                      className={`w-6 h-6 mx-auto mb-2 ${
                        userType === 'customer' ? 'text-[#B7410E]' : 'text-[#2D2D2D]/60'
                      }`}
                    />
                    <p className={`font-semibold text-sm ${
                      userType === 'customer' ? 'text-[#B7410E]' : 'text-[#2D2D2D]'
                    }`}>
                      Customer
                    </p>
                    <p className="text-xs text-[#2D2D2D]/70 mt-1">
                      Explore & shop
                    </p>
                    {userType === 'customer' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#B7410E] mx-auto" />
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Seller Option */}
                  <motion.button
                    type="button"
                    onClick={() => setUserType('seller')}
                    disabled={loading}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-300
                      ${userType === 'seller'
                        ? 'border-[#B7410E] bg-[#B7410E]/10'
                        : 'border-[#8B5E3C]/30 hover:border-[#B7410E]/50'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    aria-pressed={userType === 'seller'}
                  >
                    <Store 
                      className={`w-6 h-6 mx-auto mb-2 ${
                        userType === 'seller' ? 'text-[#B7410E]' : 'text-[#2D2D2D]/60'
                      }`}
                    />
                    <p className={`font-semibold text-sm ${
                      userType === 'seller' ? 'text-[#B7410E]' : 'text-[#2D2D2D]'
                    }`}>
                      Seller
                    </p>
                    <p className="text-xs text-[#2D2D2D]/70 mt-1">
                      Upload & promote
                    </p>
                    {userType === 'seller' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#B7410E] mx-auto" />
                      </motion.div>
                    )}
                  </motion.button>
                </div>
                {errors.userType && (
                  <motion.p
                    className="text-sm text-[#B7410E] mt-2 flex items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.userType}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full"
                aria-label="Create account"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-[#2D2D2D]/70 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#B7410E] font-semibold hover:text-[#D4AF37] transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          variants={fadeInUp}
          className="text-center text-sm text-[#2D2D2D]/60 mt-6"
        >
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-[#B7410E] hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-[#B7410E] hover:underline">
            Privacy Policy
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
