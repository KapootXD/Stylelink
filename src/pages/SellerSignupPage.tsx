import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Upload } from 'lucide-react';
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

  const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.8 }
    }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { 
      opacity: 1, 
      x: 0,
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
    <div className="min-h-screen bg-white">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Column - Form */}
        <div className="overflow-y-auto p-8 lg:p-12">
          <motion.div
            initial="initial"
            animate="animate"
            variants={slideInLeft}
          >
            {/* Back Button */}
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center gap-2 text-[#2D2D2D]/60 hover:text-[#2D2D2D] mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-3">
                Welcome, Seller! Let's Set Up Your Shop
              </h1>
              <p className="text-lg text-[#2D2D2D]/60">
                Create your account and start selling on StyleLink.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCompleteSetup}>
              {/* Account Details Section */}
              <motion.div
                variants={fadeIn}
                className="mb-8"
              >
                <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">Account Details</h2>
                
                <div className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your.email@example.com"
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
                  
                  <Input
                    label="Your Name"
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
              </motion.div>

              {/* Shop Details Section */}
              <motion.div
                variants={fadeIn}
                className="mb-8"
              >
                <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">Shop Details</h2>
                
                <div className="space-y-4">
                  <Input
                    label="Shop Name"
                    placeholder="Your Boutique Name"
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
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                      rows={4}
                      disabled={loading}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Upload Shop Logo Section */}
              <motion.div
                variants={fadeIn}
                className="mb-8"
              >
                <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">Upload Your Shop Logo (Optional)</h2>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="border-orange-500 text-[#2D2D2D] hover:bg-orange-50"
                    disabled={loading}
                  >
                    Choose File
                  </Button>
                </div>
              </motion.div>

            {/* Payment Setup Section (Optional for now) */}
            <motion.div
              variants={fadeIn}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">Payment Setup (Optional)</h2>
              <p className="text-sm text-[#2D2D2D]/60 mb-4">
                You can set up payment information later from your seller dashboard.
              </p>
              
              <div className="space-y-4">
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
            <motion.div
              variants={fadeIn}
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
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
          </motion.div>
        </div>

        {/* Right Column - Image */}
        <motion.div
          className="hidden lg:block relative overflow-hidden"
          initial="initial"
          animate="animate"
          variants={slideInRight}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
              alt="Vintage clothing store interior"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerSignupPage;
