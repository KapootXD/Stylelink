import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Upload, Bot, Stars } from 'lucide-react';
import { Button } from '../components';
import { useReducedMotion } from '../components/PageTransition';

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.25 : 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const styleBlocks = [
    {
      title: 'Similar Styles',
      description: 'Looks inspired by your upload so you can recreate the vibe instantly.',
      accent: 'bg-[#F3E8D5]'
    },
    {
      title: 'Fresh Picks',
      description: 'New outfits our StyleLink AI thinks you will love next.',
      accent: 'bg-[#F7D7C4]'
    },
    {
      title: 'Mix & Match',
      description: 'Combos that blend your inspiration with trending pieces.',
      accent: 'bg-[#E6D1F2]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF3E0] text-[#2D2D2D]">
      {/* Hero */}
      <section className="py-14 px-4 bg-gradient-to-br from-[#B7410E] to-[#8B5E3C] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <div className="flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em] font-semibold mb-4">
              <Stars className="w-4 h-4" />
              <span>StyleLink AI</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Recommendations</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Upload a style you love and let StyleLink AI surface similar looks plus new outfits tailored to your taste.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload & Preview */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#E6D7C3]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-[#B7410E]" />
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#B7410E] font-semibold">Upload</p>
                <h2 className="text-2xl font-bold">Share your inspiration</h2>
              </div>
            </div>
            <p className="text-[#2D2D2D]/70 mb-6">
              Drop in a photo of the style you want. We will analyze the vibe and instantly line up similar pieces and new ideas.
              No need to wait—just upload and browse.
            </p>

            <label className="border-2 border-dashed border-[#E6D7C3] rounded-xl w-full p-6 text-center cursor-pointer hover:border-[#B7410E] transition-colors bg-[#FFFBF5]">
              <input type="file" className="hidden" accept="image/*" />
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#F7E8D7] flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#B7410E]" />
                </div>
                <div>
                  <p className="font-semibold">Click to upload or drag & drop</p>
                  <p className="text-sm text-[#2D2D2D]/60">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </label>
          </motion.div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#E6D7C3]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-[#B7410E]" />
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#B7410E] font-semibold">Preview</p>
                <h2 className="text-2xl font-bold">What you'll get</h2>
              </div>
            </div>
            <p className="text-[#2D2D2D]/70 mb-6">
              StyleLink AI instantly generates a clean gallery of outfits inspired by your upload, plus fresh suggestions tailored to your profile.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {styleBlocks.map((block) => (
                <div key={block.title} className={`${block.accent} rounded-xl p-4 text-left border border-white/60 shadow-inner`}>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#62311C] font-semibold mb-2">{block.title}</p>
                  <p className="text-sm text-[#2D2D2D]/80 leading-relaxed">{block.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recommendation Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#B7410E] font-semibold">Curated for you</p>
              <h3 className="text-2xl font-bold">See your next looks</h3>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => window.history.back()} className="border-[#B7410E] text-[#B7410E] hover:bg-[#B7410E] hover:text-white">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
              <Button variant="primary" onClick={() => navigate('/') } className="bg-[#B7410E] hover:bg-[#A0350C]">
                Explore Homepage
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E6D7C3] flex flex-col gap-3">
                <div className="h-36 rounded-xl bg-gradient-to-br from-[#FFEBD8] to-[#F4D9C7]" />
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-[0.2em] text-[#B7410E] font-semibold">AI Pick #{item}</p>
                  <p className="text-[#2D2D2D]/80 text-sm">Suggested looks based on your upload and trending pieces.</p>
                </div>
                <Button variant="secondary" className="border-[#B7410E] text-[#B7410E] hover:bg-[#B7410E] hover:text-white">
                  Save look
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating AI button */}
      <div className="fixed bottom-6 right-6">
        <Button
          variant="primary"
          className="bg-[#B7410E] hover:bg-[#A0350C] shadow-xl rounded-full px-5 py-3 flex items-center gap-2"
        >
          <Bot className="w-5 h-5" />
          <span>StyleLink AI</span>
        </Button>
      </div>
    </div>
  );
};

export default FeaturesPage;
