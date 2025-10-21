import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Bell, 
  User, 
  Settings, 
  Heart, 
  Share2, 
  Loader2,
  Grid3X3,
  List,
  ChevronDown,
  X
} from 'lucide-react';
import { searchOutfits } from '../services/apiService';
import { SearchFilters } from '../types';
import { OutfitUpload } from '../types';

interface FormData {
  searchQuery: string;
  selectedCategories: string[];
  selectedOccasion: string;
  selectedSeason: string;
}

interface MainFeaturePageProps {
  // Props can be added here if needed for dynamic content
}

const MainFeaturePage: React.FC<MainFeaturePageProps> = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    searchQuery: '',
    selectedCategories: [],
    selectedOccasion: '',
    selectedSeason: ''
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [outfits, setOutfits] = useState<OutfitUpload[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter options
  const categories = [
    'New Arrivals', 'Streetwear', 'Vintage', 'Minimalist', 
    'Bohemian', 'Formal', 'Casual', 'Athletic'
  ];
  
  const occasions = [
    'Work', 'Party', 'Date', 'Travel', 'Everyday', 'Special Event'
  ];
  
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };
  
  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Load initial data
  useEffect(() => {
    loadOutfits();
  }, []);
  
  // Load outfits function
  const loadOutfits = async (page: number = 1, append: boolean = false) => {
    setIsLoading(true);
    setError('');
    
    try {
      const filters: SearchFilters = {
        styleTags: formData.selectedCategories,
        occasion: formData.selectedOccasion || undefined,
        season: formData.selectedSeason || undefined
      };
      
      const response = await searchOutfits(
        formData.searchQuery,
        filters,
        page,
        12
      );
      
      if (response.status === 'success') {
        const newOutfits = response.data.outfits;
        setOutfits(append ? [...outfits, ...newOutfits] : newOutfits);
        setHasMore(response.data.hasMore);
        setCurrentPage(page);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to load outfits. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      searchQuery: e.target.value
    }));
  };
  
  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  };
  
  // Handle occasion change
  const handleOccasionChange = (occasion: string) => {
    setFormData(prev => ({
      ...prev,
      selectedOccasion: prev.selectedOccasion === occasion ? '' : occasion
    }));
  };
  
  // Handle season change
  const handleSeasonChange = (season: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSeason: prev.selectedSeason === season ? '' : season
    }));
  };
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOutfits(1, false);
  };
  
  // Handle load more
  const handleLoadMore = () => {
    loadOutfits(currentPage + 1, true);
  };
  
  // Handle outfit click
  const handleOutfitClick = (outfit: OutfitUpload) => {
    navigate(`/outfit/${outfit.id}`, { state: { outfit } });
  };
  
  // Validation
  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (formData.searchQuery.trim().length < 2 && formData.selectedCategories.length === 0) {
      errors.push('Please enter a search term or select at least one category');
    }
    
    return errors;
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <motion.div 
          className="text-center mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            Discover Your Next Style Inspiration
        </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Explore authentic streetwear and cultural styles from around the world
          </p>
        </motion.div>
        
        {/* Filter Buttons */}
        <motion.div 
          className="mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  formData.selectedCategories.includes(category)
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-secondary-700 hover:bg-primary-600 hover:text-white'
                } border border-secondary-300 hover:border-primary-500`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Advanced Filters */}
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-secondary-300 rounded-full hover:bg-secondary-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-600'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Advanced Filter Panel */}
          {showFilters && (
            <motion.div 
              className="mt-4 p-6 bg-white rounded-lg shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">Occasion</label>
                  <div className="flex flex-wrap gap-2">
                    {occasions.map((occasion) => (
                      <button
                        key={occasion}
                        onClick={() => handleOccasionChange(occasion)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          formData.selectedOccasion === occasion
                            ? 'bg-primary-600 text-white'
                            : 'bg-secondary-100 text-secondary-700 hover:bg-primary-600 hover:text-white'
                        }`}
                      >
                        {occasion}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">Season</label>
                  <div className="flex flex-wrap gap-2">
                    {seasons.map((season) => (
                      <button
                        key={season}
                        onClick={() => handleSeasonChange(season)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          formData.selectedSeason === season
                            ? 'bg-primary-600 text-white'
                            : 'bg-secondary-100 text-secondary-700 hover:bg-primary-600 hover:text-white'
                        }`}
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Error Message */}
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        {/* Outfits Grid */}
        <motion.div 
          className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          {outfits.map((outfit) => (
            <motion.div
              key={outfit.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
              variants={fadeInUp}
              onClick={() => handleOutfitClick(outfit)}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'} relative`}>
                <img
                  src={outfit.mainImageUrl}
                  alt={outfit.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
                  {outfit.title}
                </h3>
                <p className="text-sm text-secondary-600 mb-2">
                  by {outfit.userId}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {outfit.styleTags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-primary-100 text-primary-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-secondary-500">
                  <span>{outfit.likes} likes</span>
                  <span>{outfit.shares} shares</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}
        
        {/* Load More Button */}
        {hasMore && !isLoading && (
          <motion.div 
            className="text-center mt-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <button
              onClick={handleLoadMore}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Load More Styles
            </button>
          </motion.div>
        )}
        
        {/* No Results */}
        {!isLoading && outfits.length === 0 && !error && (
          <motion.div 
            className="text-center py-12"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No styles found
            </h3>
            <p className="text-secondary-600">
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MainFeaturePage;