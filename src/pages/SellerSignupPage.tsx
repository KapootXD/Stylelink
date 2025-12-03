import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button, Input } from '../components';
import { useReducedMotion } from '../components/PageTransition';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const SellerSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { signup, loading } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopBio, setShopBio] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    displayName?: string;
    shopName?: string;
  }>({});

  const fadeIn = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.6 }
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.8 }
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      displayName?: string;
      shopName?: string;
    } = {};

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

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!displayName) {
      errors.displayName = 'Your name is required';
    }

    if (!shopName) {
      errors.shopName = 'Shop name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleCompleteSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Create Firebase Auth account
      await signup(email, password, 'seller', displayName);
      
      // TODO: Create seller profile in Firestore with shopName, shopBio, bankAccount, routingNumber
      // This would typically be done in a separate service or after successful signup
      
      // Navigate to seller dashboard or profile
      navigate('/profile');
    } catch (error) {
      // Error is handled by AuthContext and displayed via toast
      console.error('Seller signup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center gap-2 text-[#2D2D2D]/60 hover:text-[#2D2D2D] mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-10">
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-[#B7410E]">Open Your StyleLink Shop</h1>
              <p className="text-lg text-[#2D2D2D]/70 max-w-2xl mx-auto">
                Share your brand story, showcase your products, and connect with shoppers who love your aesthetic.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCompleteSetup} className="space-y-8">
              {/* Account Details Section */}
              <motion.div variants={fadeIn} className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-[#2D2D2D]">Account Details</h2>
                  <span className="text-sm text-[#2D2D2D]/60">Secure your account to get started.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Business Email"
                    type="email"
                    placeholder="you@business.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) {
                        setFormErrors({ ...formErrors, email: undefined });
                      }
                    }}
                    error={formErrors.email}
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Full Name"
                    placeholder="Your Full Name"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      if (formErrors.displayName) {
                        setFormErrors({ ...formErrors, displayName: undefined });
                      }
                    }}
                    error={formErrors.displayName}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a password (min. 6 characters)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formErrors.password) {
                        setFormErrors({ ...formErrors, password: undefined });
                      }
                    }}
                    error={formErrors.password}
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (formErrors.confirmPassword) {
                        setFormErrors({ ...formErrors, confirmPassword: undefined });
                      }
                    }}
                    error={formErrors.confirmPassword}
                    required
                    disabled={loading}
                  />
                </div>
              </motion.div>

              {/* Shop Details Section */}
              <motion.div variants={fadeIn} className="space-y-4">
                <h2 className="text-xl font-bold text-[#2D2D2D]">Shop Details</h2>

                <div className="space-y-4">
                  <Input
                    label="Shop Name / Username"
                    placeholder="Your Boutique or Handle"
                    value={shopName}
                    onChange={(e) => {
                      setShopName(e.target.value);
                      if (formErrors.shopName) {
                        setFormErrors({ ...formErrors, shopName: undefined });
                      }
                    }}
                    error={formErrors.shopName}
                    required
                    disabled={loading}
                  />

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                      Shop Bio (Optional)
                    </label>
                    <textarea
                      placeholder="Describe your brand, style, and what you offer..."
                      value={shopBio}
                      onChange={(e) => setShopBio(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#B7410E] focus:outline-none focus:ring-2 focus:ring-[#B7410E]/10 resize-none bg-white"
                      rows={4}
                      disabled={loading}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Upload Shop Logo Section */}
              <motion.div variants={fadeIn} className="space-y-3">
                <h2 className="text-xl font-bold text-[#2D2D2D]">Shop Logo (Optional)</h2>
                <p className="text-sm text-[#2D2D2D]/70">Add a crisp logo to keep your storefront looking polished.</p>
                <div className="flex items-center gap-4 p-4 border border-dashed border-[#8B5E3C]/40 rounded-xl bg-[#B7410E]/5">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-inner">
                    <Upload className="w-7 h-7 text-[#8B5E3C]" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full justify-between">
                    <p className="text-sm text-[#2D2D2D]/80">Upload a square logo (PNG or JPG).</p>
                    <Button
                      type="button"
                      variant="secondary"
                      className="border-[#8B5E3C] text-[#2D2D2D] hover:bg-[#8B5E3C]/10"
                      disabled={loading}
                    >
                      Choose File
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Payment Setup Section (Optional for now) */}
              <motion.div variants={fadeIn} className="space-y-3">
                <h2 className="text-xl font-bold text-[#2D2D2D]">Payment Setup (Optional)</h2>
                <p className="text-sm text-[#2D2D2D]/70">You can set up payment information later from your seller dashboard.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Bank Account Number (Optional)"
                    placeholder="Bank Account Number"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    type="text"
                    disabled={loading}
                  />

                  <Input
                    label="Routing Number (Optional)"
                    placeholder="Routing Number"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    type="text"
                    disabled={loading}
                  />
                </div>
              </motion.div>

              {/* Complete Setup Button */}
              <motion.div variants={fadeIn}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-[#8B5E3C] hover:bg-[#B7410E] text-white"
                  disabled={loading || !email || !password || !confirmPassword || !displayName || !shopName}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="sm" />
                      Creating account...
                    </span>
                  ) : (
                    'Create Seller Account'
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerSignupPage;
