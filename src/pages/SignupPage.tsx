import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Store, 
  ArrowRight,
  Users,
  Heart,
  TrendingUp,
  Globe,
  Star
} from 'lucide-react';
import { Button, Card } from '../components';
import { useReducedMotion } from '../components/PageTransition';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0.05 : 0.15,
        delayChildren: 0.1
      }
    }
  };

  const handleCustomerSignup = () => {
    navigate('/signup/customer');
  };

  const handleSellerSignup = () => {
    navigate('/signup/seller');
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0]">
      {/* Header Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#B7410E] to-[#8B5E3C]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <span className="text-white text-sm font-medium tracking-wide uppercase">
                Join StyleLink
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              How would you like to use StyleLink?
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Choose your path and start your fashion journey with our community-driven platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* User Type Selection */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Customer Card */}
            <motion.div variants={slideInLeft}>
              <Card 
                variant="default"
                onClick={handleCustomerSignup}
                className="h-full group cursor-pointer hover:shadow-2xl transition-all duration-500"
              >
                <div className="text-center p-8">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#B7410E] to-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-3xl font-bold text-[#2D2D2D] mb-4 group-hover:text-[#B7410E] transition-colors duration-300">
                    Customer
                  </h2>
                  
                  {/* Description */}
                  <p className="text-lg text-[#2D2D2D]/70 mb-8 leading-relaxed">
                    Explore authentic styles, shop looks, and save your favorites. 
                    Discover new brands and connect with fashion enthusiasts worldwide.
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-3 mb-8 text-left">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-[#B7410E]" />
                      <span className="text-[#2D2D2D]/80">Save and organize your favorite looks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-[#B7410E]" />
                      <span className="text-[#2D2D2D]/80">Discover styles from around the world</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[#B7410E]" />
                      <span className="text-[#2D2D2D]/80">Connect with like-minded fashion lovers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-[#B7410E]" />
                      <span className="text-[#2D2D2D]/80">Get personalized style recommendations</span>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="w-full group-hover:scale-105 transition-transform duration-300"
                  >
                    Start Shopping
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Seller Card */}
            <motion.div variants={slideInRight}>
              <Card 
                variant="default"
                onClick={handleSellerSignup}
                className="h-full group cursor-pointer hover:shadow-2xl transition-all duration-500"
              >
                <div className="text-center p-8">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#8B5E3C] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Store className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-3xl font-bold text-[#2D2D2D] mb-4 group-hover:text-[#B7410E] transition-colors duration-300">
                    Seller
                  </h2>
                  
                  {/* Description */}
                  <p className="text-lg text-[#2D2D2D]/70 mb-8 leading-relaxed">
                    Showcase your designs, tag products, and grow your fashion brand. 
                    Reach global audiences and monetize your creative vision.
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-3 mb-8 text-left">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-[#B7410E]" />
                      <span className="text-[#2D2D2D]/80">Track sales and grow your business</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-[#B7410E]" />
                      <span className="text-[#2D2D2D]/80">Reach customers worldwide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[#B7410E]" />
                      <span className="text-[#2D2D2D]/80">Build a loyal customer base</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-[#B7410E]" />
                      <span className="text-[#2D2D2D]/80">Get featured in style recommendations</span>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="w-full group-hover:scale-105 transition-transform duration-300"
                  >
                    Start Selling
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Additional Info */}
          <motion.div 
            className="text-center mt-16"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <p className="text-[#2D2D2D]/70 text-lg mb-6">
              Not sure which path is right for you? You can always switch between customer and seller modes later.
            </p>
            
            <Button 
              variant="secondary"
              onClick={() => navigate('/about')}
              className="text-[#B7410E] border-[#B7410E] hover:bg-[#B7410E] hover:text-white"
            >
              Learn More About StyleLink
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SignupPage;
