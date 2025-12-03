import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReducedMotion } from './PageTransition';

const Footer: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0.05 : 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.footer 
      className="bg-white border-t border-gray-200"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={staggerChildren}
        >
          {/* Logo and Description */}
          <motion.div className="col-span-1 md:col-span-2" variants={fadeInUp}>
            <div className="text-2xl font-bold text-[#B7410E] mb-4">
              StyleLink
            </div>
            <p className="text-[#2D2D2D]/70 text-sm mb-4 max-w-md">
              Connect global fashion with local creativity. Discover authentic styles worldwide 
              and support local brands through our platform.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-semibold text-[#2D2D2D] uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-[#2D2D2D]/70 hover:text-[#D4AF37] text-sm transition-colors duration-300 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/discover" className="text-[#2D2D2D]/70 hover:text-[#D4AF37] text-sm transition-colors duration-300 hover:underline">
                  Discover
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-[#2D2D2D]/70 hover:text-[#D4AF37] text-sm transition-colors duration-300 hover:underline">
                  Catalog
                </Link>
              </li>
              <li>
                <Link to="/activity" className="text-[#2D2D2D]/70 hover:text-[#D4AF37] text-sm transition-colors duration-300 hover:underline">
                  Activity
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-[#2D2D2D]/70 hover:text-[#D4AF37] text-sm transition-colors duration-300 hover:underline">
                  Features
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-semibold text-[#2D2D2D] uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-[#2D2D2D]/70 hover:text-[#D4AF37] text-sm transition-colors duration-300 hover:underline">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-[#2D2D2D]/70 hover:text-[#D4AF37] text-sm transition-colors duration-300 hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#2D2D2D]/70 hover:text-[#D4AF37] text-sm transition-colors duration-300 hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Border */}
        <motion.div 
          className="mt-8 pt-8 border-t border-secondary-200"
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#2D2D2D]/60 text-sm">
              © 2024 StyleLink. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-[#2D2D2D]/60 hover:text-[#D4AF37] text-sm transition-colors duration-300 hover:underline">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-[#2D2D2D]/60 hover:text-[#D4AF37] text-sm transition-colors duration-300 hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
