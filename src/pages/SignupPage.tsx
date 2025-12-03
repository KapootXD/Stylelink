import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Store, CheckCircle2 } from 'lucide-react';
import { Button } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { useReducedMotion } from '../components/PageTransition';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { usingDemoAuth } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  const [userType, setUserType] = useState<'customer' | 'seller' | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);

  const handleUserTypeSelection = (type: 'customer' | 'seller') => {
    setSelectionError(null);
    setUserType(type);
  };

  const handleContinue = () => {
    if (!userType) {
      setSelectionError('Choose how you want to use StyleLink to continue.');
      return;
    }

    navigate(`/signup/${userType}`);
  };

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
        className="w-full max-w-xl"
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

        {usingDemoAuth && (
          <motion.div
            variants={fadeInUp}
            className="mb-6"
            role="status"
          >
            <div className="flex items-start gap-3 rounded-xl border border-[#8B5E3C]/30 bg-[#8B5E3C]/10 px-4 py-3 text-[#2D2D2D]">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-12a1 1 0 00-.894.553l-3.5 7A1 1 0 006.5 15h7a1 1 0 00.894-1.447l-3.5-7A1 1 0 0010 6z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-semibold">Demo authentication enabled</p>
                <p className="text-sm leading-5 text-[#2D2D2D]">
                  Firebase credentials were not detected, so signups will create temporary demo accounts locally.
                  Use any email and password to explore features without touching real data.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Signup selection */}
        <motion.div variants={fadeInUp}>
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-[#2D2D2D]">Pick your journey</h2>
              <p className="text-sm text-[#2D2D2D]/70">
                Choose the experience that fits you best to continue setting up your account.
              </p>
            </div>

            {selectionError && (
              <div
                className="flex items-center gap-2 p-4 bg-[#B7410E]/10 border border-[#B7410E] rounded-lg text-[#B7410E]"
                role="alert"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">{selectionError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Option */}
              <motion.button
                type="button"
                onClick={() => handleUserTypeSelection('customer')}
                className={`
                  p-5 rounded-xl border-2 transition-all duration-300 text-left bg-white
                  ${userType === 'customer'
                    ? 'border-[#B7410E] bg-[#B7410E]/10 shadow-md'
                    : 'border-[#8B5E3C]/30 hover:border-[#B7410E]/60 hover:-translate-y-1'
                  }
                `}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                aria-pressed={userType === 'customer'}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <ShoppingBag 
                      className={`w-7 h-7 mb-3 ${
                        userType === 'customer' ? 'text-[#B7410E]' : 'text-[#2D2D2D]/60'
                      }`}
                    />
                    <p className="font-semibold text-lg text-[#2D2D2D]">Shop & Discover</p>
                    <p className="text-sm text-[#2D2D2D]/70 mt-1">
                      Explore looks, follow creators, and build your wardrobe.
                    </p>
                  </div>
                  {userType === 'customer' && (
                    <CheckCircle2 className="w-5 h-5 text-[#B7410E]" aria-hidden="true" />
                  )}
                </div>
              </motion.button>

              {/* Seller Option */}
              <motion.button
                type="button"
                onClick={() => handleUserTypeSelection('seller')}
                className={`
                  p-5 rounded-xl border-2 transition-all duration-300 text-left bg-white
                  ${userType === 'seller'
                    ? 'border-[#B7410E] bg-[#B7410E]/10 shadow-md'
                    : 'border-[#8B5E3C]/30 hover:border-[#B7410E]/60 hover:-translate-y-1'
                  }
                `}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                aria-pressed={userType === 'seller'}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Store
                      className={`w-7 h-7 mb-3 ${
                        userType === 'seller' ? 'text-[#B7410E]' : 'text-[#2D2D2D]/60'
                      }`}
                    />
                    <p className="font-semibold text-lg text-[#2D2D2D]">Sell on StyleLink</p>
                    <p className="text-sm text-[#2D2D2D]/70 mt-1">
                      Open your shop, share your story, and reach shoppers who love your vibe.
                    </p>
                  </div>
                  {userType === 'seller' && (
                    <CheckCircle2 className="w-5 h-5 text-[#B7410E]" aria-hidden="true" />
                  )}
                </div>
              </motion.button>
            </div>

            <Button
              type="button"
              onClick={handleContinue}
              className="w-full bg-[#8B5E3C] hover:bg-[#B7410E] text-white"
            >
              Continue
            </Button>

            <p className="text-center text-sm text-[#2D2D2D]/70">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#B7410E] font-semibold hover:text-[#D4AF37] transition-colors"
              >
                Login
              </Link>
            </p>
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
