import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { Button, Input } from '../components';
import { useReducedMotion } from '../components/PageTransition';

const CustomerSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Streetwear', 'Minimalist']);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Available style options
  const styleOptions = [
    'Streetwear',
    'Y2K',
    'Minimalist',
    'Bohemian',
    'Vintage',
    'Formal',
    'Casual',
    'Athleisure'
  ];

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

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    // Handle form submission here
    // eslint-disable-next-line no-console
    console.log('Customer signup data:', {
      displayName,
      username,
      selectedStyles
    });
    // Navigate to next step or profile page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
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
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#B7410E] mb-4">
              Welcome to StyleLink!
            </h1>
            <p className="text-lg text-[#2D2D2D]/70 max-w-xl mx-auto">
              Create your unique profile to connect with a community of fashion enthusiasts, share your style, and discover new trends.
            </p>
          </div>

          {/* Profile Picture Section */}
          <motion.div
            variants={fadeIn}
            className="text-center mb-8"
          >
            <div className="relative inline-block">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mx-auto mb-2">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="text-[#8B5E3C] hover:text-[#B7410E] transition-colors font-medium">
                  Change Photo
                </span>
              </label>
            </div>
          </motion.div>

          {/* Form Fields */}
          <motion.div
            variants={fadeIn}
            className="space-y-6 mb-8"
          >
            <Input
              label="Display Name"
              placeholder="Your Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            
            <Input
              label="Username"
              placeholder="@yourstyle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </motion.div>

          {/* Style Preferences */}
          <motion.div
            variants={fadeIn}
            className="mb-8"
          >
            <label className="block text-lg font-medium text-[#2D2D2D] mb-4">
              Your Style Preferences
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {styleOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedStyles.includes(style)
                      ? 'bg-[#8B5E3C] text-white shadow-md'
                      : 'bg-white text-[#2D2D2D] hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            variants={fadeIn}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              className="w-full bg-[#8B5E3C] hover:bg-[#B7410E] text-white"
              disabled={!displayName || !username}
            >
              Continue to Profile
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerSignupPage;
