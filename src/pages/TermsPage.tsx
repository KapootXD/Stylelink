import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock } from 'lucide-react';
import { Button } from '../components';
import { useReducedMotion } from '../components/PageTransition';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0]">
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#B7410E] to-[#8B5E3C]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Review our terms and conditions for using the StyleLink platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <div className="w-24 h-24 bg-[#FAF3E0] rounded-full flex items-center justify-center mx-auto mb-8">
                <Clock className="w-12 h-12 text-[#B7410E]" />
              </div>
              
              <h2 className="text-4xl font-bold text-[#2D2D2D] mb-6">
                Terms of Service Coming Soon!
              </h2>
              
              <p className="text-xl text-[#2D2D2D]/70 mb-8 leading-relaxed">
                We're preparing detailed terms of service that outline the rules and guidelines 
                for using StyleLink. These terms will ensure a safe and fair experience for all users.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={() => window.history.back()}
                  className="bg-[#B7410E] hover:bg-[#A0350C]"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go Back
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => navigate('/')}
                  className="border-[#B7410E] text-[#B7410E] hover:bg-[#B7410E] hover:text-white"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Explore Homepage
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
