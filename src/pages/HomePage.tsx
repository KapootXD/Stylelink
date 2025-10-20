import React from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Users, 
  DollarSign, 
  Globe, 
  Sparkles, 
  ArrowRight,
  Upload,
  Search,
  Heart,
  Share2,
  Star
} from 'lucide-react';

const HomePage: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Outfit Posts with Shopping Links",
      description: "Upload your looks and tag where each item was bought, creating direct shopping links for your community."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered Recommendations",
      description: "Discover similar items from local and global brands with our intelligent recommendation engine."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Discovery",
      description: "Explore authentic streetwear and cultural styles through aesthetic and style tags from around the world."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Monetization for Users",
      description: "Turn your style into income while giving local brands international visibility and recognition."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Fashion Connection",
      description: "Connect global fashion trends with local creativity in one unified platform."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Authentic Style Sharing",
      description: "Empower everyday users—not just influencers—to showcase and monetize their unique style."
    }
  ];

  const steps = [
    {
      number: "01",
      icon: <Upload className="w-6 h-6" />,
      title: "Upload Your Look",
      description: "Take a photo of your outfit and upload it to the platform with style tags and purchase locations."
    },
    {
      number: "02",
      icon: <Search className="w-6 h-6" />,
      title: "Discover & Connect",
      description: "Explore similar styles, find new brands, and connect with fashion enthusiasts worldwide."
    },
    {
      number: "03",
      icon: <Share2 className="w-6 h-6" />,
      title: "Share & Earn",
      description: "Share your style discoveries and earn from your influence while supporting local brands."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF3E0]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#B7410E] via-[#D4AF37] to-[#8B5E3C] opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Content */}
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            variants={fadeInUp}
          >
            If you're looking for style,<br />
            <span className="text-[#D4AF37]">we're worth your while.</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            StyleLink is a community-driven fashion discovery platform that connects global fashion with local creativity. 
            Upload outfit photos, tag where each item was bought, and explore authentic streetwear from around the world.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={fadeInUp}
          >
            <motion.button 
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#2D2D2D] font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </motion.button>
            
            <motion.button 
              className="border-2 border-white text-white hover:bg-white hover:text-[#2D2D2D] font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#D4AF37] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#B7410E] rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-[#8B5E3C] rounded-full opacity-20 animate-pulse delay-500"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
              Why Choose StyleLink?
            </h2>
            <p className="text-xl text-[#2D2D2D]/80 max-w-3xl mx-auto">
              Discover the features that make StyleLink the ultimate platform for fashion discovery and community building.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-[#B7410E] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#2D2D2D] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#2D2D2D]/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
              How It Works
            </h2>
            <p className="text-xl text-[#2D2D2D]/80 max-w-3xl mx-auto">
              Get started in three simple steps and join the global fashion community.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                variants={fadeInUp}
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#B7410E] to-[#D4AF37] transform translate-x-1/2"></div>
                )}
                
                <div className="bg-gradient-to-br from-[#B7410E] to-[#D4AF37] w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center">
                    <div className="text-[#B7410E]">
                      {step.icon}
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <span className="bg-[#D4AF37] text-[#2D2D2D] font-bold text-lg px-3 py-1 rounded-full">
                    {step.number}
                  </span>
                </div>
                
                <h3 className="text-2xl font-semibold text-[#2D2D2D] mb-4">
                  {step.title}
                </h3>
                <p className="text-[#2D2D2D]/70 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#B7410E] to-[#8B5E3C]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Style Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of fashion enthusiasts who are already discovering, sharing, and monetizing their unique style on StyleLink.
            </p>
            
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button 
                className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#2D2D2D] font-semibold px-10 py-4 rounded-full text-xl transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Style Journey
                <ArrowRight className="inline-block ml-2 w-6 h-6" />
              </motion.button>
              
              <motion.button 
                className="border-2 border-white text-white hover:bg-white hover:text-[#2D2D2D] font-semibold px-10 py-4 rounded-full text-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Features
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
