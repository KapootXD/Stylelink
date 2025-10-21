import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Heart, 
  Share2, 
  ShoppingBag,
  MapPin,
  Star,
  ArrowRight
} from 'lucide-react';
import { Button, Card, Input, LoadingSpinner } from '../components';
import { useReducedMotion } from '../components/PageTransition';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0.05 : 0.15,
        delayChildren: 0.1
      }
    }
  };

  // Mock data for outfit results
  const outfitResults = [
    {
      id: 1,
      image: '/api/placeholder/300/400',
      title: 'Streetwear Vibes',
      creator: '@stylequeen',
      location: 'Tokyo, Japan',
      tags: ['streetwear', 'urban', 'casual'],
      likes: 1247,
      price: '$89',
      brand: 'Local Tokyo Brand'
    },
    {
      id: 2,
      image: '/api/placeholder/300/400',
      title: 'Vintage Denim Look',
      creator: '@vintagevibes',
      location: 'Los Angeles, CA',
      tags: ['vintage', 'denim', 'retro'],
      likes: 892,
      price: '$45',
      brand: 'Thrifted'
    },
    {
      id: 3,
      image: '/api/placeholder/300/400',
      title: 'Minimalist Chic',
      creator: '@minimalstyle',
      location: 'Copenhagen, Denmark',
      tags: ['minimalist', 'scandinavian', 'clean'],
      likes: 2156,
      price: '$120',
      brand: 'Nordic Design Co'
    },
    {
      id: 4,
      image: '/api/placeholder/300/400',
      title: 'Bohemian Dreams',
      creator: '@bohostyle',
      location: 'Barcelona, Spain',
      tags: ['bohemian', 'flowy', 'colorful'],
      likes: 743,
      price: '$65',
      brand: 'Local Artisan'
    },
    {
      id: 5,
      image: '/api/placeholder/300/400',
      title: 'Athleisure Perfection',
      creator: '@activewear',
      location: 'Melbourne, Australia',
      tags: ['athleisure', 'sporty', 'comfortable'],
      likes: 1834,
      price: '$95',
      brand: 'Aussie Active'
    },
    {
      id: 6,
      image: '/api/placeholder/300/400',
      title: 'Formal Elegance',
      creator: '@elegantstyle',
      location: 'London, UK',
      tags: ['formal', 'elegant', 'business'],
      likes: 967,
      price: '$180',
      brand: 'British Tailoring'
    }
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0]">
      {/* Header Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-[#B7410E] to-[#8B5E3C]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Explore Global Styles
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover authentic streetwear, cultural aesthetics, and unique fashion from creators worldwide.
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    label=""
                    placeholder="Search styles, creators, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/90"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleSearch}
                    className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-[#2D2D2D]"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-[#2D2D2D]"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <motion.div 
              className="flex justify-center items-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <LoadingSpinner size="lg" color="#B7410E" />
            </motion.div>
          ) : (
            <>
              {/* Results Header */}
              <motion.div 
                className="flex justify-between items-center mb-8"
                initial="initial"
                animate="animate"
                variants={fadeInUp}
              >
                <h2 className="text-3xl font-bold text-[#2D2D2D]">
                  Discovered Styles
                </h2>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    Trending
                  </Button>
                  <Button variant="secondary" size="sm">
                    Newest
                  </Button>
                  <Button variant="secondary" size="sm">
                    Most Liked
                  </Button>
                </div>
              </motion.div>

              {/* Results Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial="initial"
                animate="animate"
                variants={staggerChildren}
              >
                {outfitResults.map((outfit, index) => (
                  <motion.div
                    key={outfit.id}
                    variants={fadeInUp}
                    className="group"
                  >
                    <Card 
                      variant="outfit" 
                      className="overflow-hidden h-full"
                      onClick={() => navigate('/results')}
                    >
                      {/* Image Placeholder */}
                      <div className="relative h-80 bg-gradient-to-br from-[#B7410E]/20 to-[#D4AF37]/20 rounded-t-2xl mb-4 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <ShoppingBag className="w-16 h-16 text-[#B7410E]/50 mx-auto mb-2" />
                            <p className="text-[#2D2D2D]/60 text-sm">Outfit Image</p>
                          </div>
                        </div>
                        
                        {/* Overlay Actions */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className="w-4 h-4 text-[#B7410E]" />
                          </motion.button>
                          <motion.button
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Share2 className="w-4 h-4 text-[#B7410E]" />
                          </motion.button>
                        </div>

                        {/* Price Tag */}
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-[#D4AF37] text-[#2D2D2D] font-bold px-3 py-1 rounded-full text-sm">
                            {outfit.price}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-[#2D2D2D] mb-2 group-hover:text-[#B7410E] transition-colors duration-300">
                          {outfit.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[#2D2D2D]/70 text-sm">by {outfit.creator}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-[#D4AF37] fill-current" />
                            <span className="text-[#2D2D2D]/70 text-sm">{outfit.likes}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-4 h-4 text-[#8B5E3C]" />
                          <span className="text-[#2D2D2D]/70 text-sm">{outfit.location}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {outfit.tags.map((tag, tagIndex) => (
                            <span 
                              key={tagIndex}
                              className="bg-[#FAF3E0] text-[#8B5E3C] px-2 py-1 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-[#2D2D2D]/70 text-sm font-medium">
                            {outfit.brand}
                          </span>
                          <Button 
                            variant="primary" 
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            Shop Now
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Load More Button */}
              <motion.div 
                className="text-center mt-12"
                initial="initial"
                animate="animate"
                variants={fadeInUp}
              >
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate('/results')}
                >
                  Load More Styles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
