import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Globe, 
  ArrowRight,
  Search,
  ShoppingBag,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { Button, Card } from '../components';
import { useReducedMotion } from '../components/PageTransition';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  
  // Enhanced animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { 
      opacity: 1, 
      y: 0,
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

  // Updated features with refined descriptions
  const features = [
    {
      icon: <Camera className="w-10 h-10" />,
      title: "Post Your Look",
      description: "Share and tag your outfits with style details and purchase locations. Connect your community to the brands you love."
    },
    {
      icon: <Globe className="w-10 h-10" />,
      title: "Discover Global Styles",
      description: "Explore authentic streetwear and cultural aesthetics from around the world. Find inspiration from real people, not just influencers."
    },
    {
      icon: <ShoppingBag className="w-10 h-10" />,
      title: "Shop Instantly",
      description: "Find and buy items directly through tagged links. Support both global brands and local creators in one seamless experience."
    },
    {
      icon: <MapPin className="w-10 h-10" />,
      title: "Support Local Creators",
      description: "Discover emerging local brands and independent designers. Give them the international visibility they deserve."
    }
  ];

  const steps = [
    {
      number: "01",
      icon: <Search className="w-8 h-8" />,
      title: "Discover Styles Worldwide",
      description: "Browse authentic streetwear and cultural styles from fashion enthusiasts across the globe."
    },
    {
      number: "02",
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Shop Local or Global Alternatives",
      description: "Find similar items from both local creators and international brands with direct shopping links."
    },
    {
      number: "03",
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Share Your Style & Earn Commissions",
      description: "Build your influence, share your discoveries, and earn from your authentic style recommendations."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF3E0]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#B7410E] via-[#D4AF37] to-[#8B5E3C]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-20 h-20 bg-[#D4AF37] rounded-full opacity-20"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-32 h-32 bg-[#B7410E] rounded-full opacity-20"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute top-1/2 right-20 w-16 h-16 bg-[#8B5E3C] rounded-full opacity-20"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.35, 0.2]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
        
        {/* Content */}
        <motion.div 
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.div 
            className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8"
            variants={fadeInUp}
          >
            <span className="text-white/90 text-sm font-medium tracking-wide uppercase">
              Where Style Meets Community
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight"
            variants={fadeInUp}
          >
            If you're looking for style,<br />
            <span className="text-[#D4AF37] drop-shadow-lg">we're worth your while.</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            variants={fadeInUp}
          >
            StyleLink is a community-driven fashion discovery platform that connects global fashion with local creativity. 
            Upload outfit photos, tag where each item was bought, and explore authentic streetwear from around the world.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={fadeInUp}
          >
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/signup')}
              className="shadow-2xl"
            >
              Get Started
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/about')}
              className="bg-white/20 border-white/50 text-white hover:bg-white hover:text-[#2D2D2D] backdrop-blur-sm"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="inline-block px-4 py-2 bg-[#FAF3E0] rounded-full mb-6">
              <span className="text-[#B7410E] text-sm font-medium tracking-wide uppercase">
                Features
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-[#2D2D2D] mb-6">
              Why Choose StyleLink?
            </h2>
            <p className="text-xl text-[#2D2D2D]/80 max-w-3xl mx-auto leading-relaxed">
              Discover the features that make StyleLink the ultimate platform for fashion discovery and community building.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
              >
                <Card 
                  variant="default" 
                  className="h-full group hover:shadow-2xl transition-all duration-500"
                >
                  <div className="text-[#B7410E] mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#2D2D2D] mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-[#2D2D2D]/70 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#FAF3E0] to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="inline-block px-4 py-2 bg-[#B7410E]/10 rounded-full mb-6">
              <span className="text-[#B7410E] text-sm font-medium tracking-wide uppercase">
                How It Works
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-[#2D2D2D] mb-6">
              Three Simple Steps
            </h2>
            <p className="text-xl text-[#2D2D2D]/80 max-w-3xl mx-auto leading-relaxed">
              Get started in three simple steps and join the global fashion community.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
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
                  <div className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#B7410E] to-[#D4AF37] transform translate-x-1/2 z-0"></div>
                )}
                
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-[#B7410E] to-[#D4AF37] w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <div className="bg-white w-32 h-32 rounded-full flex items-center justify-center shadow-lg">
                      <div className="text-[#B7410E]">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <span className="bg-[#D4AF37] text-[#2D2D2D] font-bold text-xl px-4 py-2 rounded-full shadow-lg">
                      {step.number}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#2D2D2D] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[#2D2D2D]/70 leading-relaxed text-lg">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#B7410E] via-[#D4AF37] to-[#8B5E3C] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <span className="text-white text-sm font-medium tracking-wide uppercase">
                Join the Community
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Join the community where<br />
              <span className="text-[#FAF3E0] drop-shadow-lg">creativity meets culture</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Connect with thousands of fashion enthusiasts who are already discovering, sharing, and monetizing their unique style on StyleLink.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/signup')}
                className="shadow-2xl bg-[#FAF3E0] text-[#2D2D2D] hover:bg-white text-xl px-12 py-5"
              >
                Start Your Style Journey
                <ArrowRight className="inline-block ml-3 w-6 h-6" />
              </Button>
              
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/features')}
                className="border-2 border-white/50 text-white hover:bg-white hover:text-[#2D2D2D] text-xl px-12 py-5 backdrop-blur-sm"
              >
                Explore Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
