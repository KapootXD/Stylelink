import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Clock } from 'lucide-react';
import { Button } from '../components';
import { useReducedMotion } from '../components/PageTransition';

const AboutPage: React.FC = () => {
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
              About StyleLink
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Learn more about our mission to connect global fashion with local creativity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platform Story */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="bg-white rounded-2xl p-10 shadow-lg space-y-10">
              <div className="flex flex-col gap-6 text-[#2D2D2D]">
                <div className="w-20 h-20 bg-[#FAF3E0] rounded-full flex items-center justify-center">
                  <Clock className="w-10 h-10 text-[#B7410E]" />
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-bold">The Story Behind StyleLink</h2>
                  <p className="text-lg leading-relaxed text-[#2D2D2D]/80">
                    StyleLink is a community-centered fashion discovery platform built for the web. It lets users upload
                    photos of their outfits and attach direct links to where each item can be purchased, removing the guesswork
                    from recreating looks.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 bg-[#FAF3E0]/50 rounded-xl space-y-3">
                    <h3 className="text-2xl font-semibold text-[#B7410E]">Shop by Style</h3>
                    <p className="text-base leading-relaxed text-[#2D2D2D]/80">
                      Browse posts by tags like streetwear, business casual, or Y2K, and instantly shop the pieces you love without
                      hunting across the internet.
                    </p>
                  </div>
                  <div className="p-6 bg-[#FAF3E0]/50 rounded-xl space-y-3">
                    <h3 className="text-2xl font-semibold text-[#B7410E]">People-First Discovery</h3>
                    <p className="text-base leading-relaxed text-[#2D2D2D]/80">
                      Follow people whose style you admire, receive personalized recommendations, and discover trending aesthetics
                      from around the world.
                    </p>
                  </div>
                  <div className="p-6 bg-[#FAF3E0]/50 rounded-xl space-y-3">
                    <h3 className="text-2xl font-semibold text-[#B7410E]">Global Cultural Connector</h3>
                    <p className="text-base leading-relaxed text-[#2D2D2D]/80">
                      Explore how people dress in different countries and gain insight into authentic local streetwear and cultural styles
                      through a search system that goes beyond your region.
                    </p>
                  </div>
                  <div className="p-6 bg-[#FAF3E0]/50 rounded-xl space-y-3">
                    <h3 className="text-2xl font-semibold text-[#B7410E]">Fueling Local Brands</h3>
                    <p className="text-base leading-relaxed text-[#2D2D2D]/80">
                      Local clothing brands get a dedicated space to showcase their work, reaching audiences searching for unique and authentic styles
                      while growing everyday creativity and community-driven fashion.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-[#B7410E] text-white rounded-xl space-y-4">
                  <h3 className="text-2xl font-semibold">Inclusive and Sustainable</h3>
                  <p className="text-base leading-relaxed text-white/90">
                    StyleLink encourages both influencers and everyday creators to monetize their style. When someone purchases through an outfit post,
                    the original poster earns a commission—building a sustainable ecosystem where creativity and commerce meet.
                  </p>
                </div>
              </div>

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
                  <Heart className="w-5 h-5 mr-2" />
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

export default AboutPage;