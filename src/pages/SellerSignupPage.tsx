import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Upload } from 'lucide-react';
import { Button, Input } from '../components';
import { useReducedMotion } from '../components/PageTransition';

const SellerSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // Form state
  const [shopName, setShopName] = useState('');
  const [shopBio, setShopBio] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');

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

  const handleCompleteSetup = () => {
    // Handle form submission here
    // eslint-disable-next-line no-console
    console.log('Shop setup data:', {
      shopName,
      shopBio,
      bankAccount,
      routingNumber
    });
    // Navigate to success or dashboard page
    navigate('/');
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
                Manage your products, track sales, and connect with fashion enthusiasts.
              </p>
            </div>

            {/* Upload Shop Logo Section */}
            <motion.div
              variants={fadeIn}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">Upload Your Shop Logo</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <Button
                  variant="secondary"
                  className="border-orange-500 text-[#2D2D2D] hover:bg-orange-50"
                >
                  Choose File
                </Button>
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
                  onChange={(e) => setShopName(e.target.value)}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Shop Bio
                  </label>
                  <textarea
                    placeholder="Describe your brand, style, and what you offer..."
                    value={shopBio}
                    onChange={(e) => setShopBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </motion.div>

            {/* Verification Steps Section */}
            <motion.div
              variants={fadeIn}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">Verification Steps</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-[#2D2D2D]">Business ID confirmed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-[#2D2D2D]">Address verification pending</span>
                </div>
              </div>
              
              <Button
                variant="secondary"
                className="border-orange-500 text-[#2D2D2D] hover:bg-orange-50"
              >
                Complete Verification
              </Button>
            </motion.div>

            {/* Payment Setup Section */}
            <motion.div
              variants={fadeIn}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-4">Payment Setup</h2>
              
              <div className="space-y-4 mb-4">
                <Input
                  label="Bank Account Number"
                  placeholder="Bank Account Number"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  type="text"
                  required
                />
                
                <Input
                  label="Routing Number"
                  placeholder="Routing Number"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  type="text"
                  required
                />
              </div>
              
              <Button
                variant="secondary"
                className="border-orange-500 text-[#2D2D2D] hover:bg-orange-50"
              >
                Connect Payment Account
              </Button>
            </motion.div>

            {/* Complete Setup Button */}
            <motion.div
              variants={fadeIn}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleCompleteSetup}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Complete Setup
              </Button>
            </motion.div>
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
