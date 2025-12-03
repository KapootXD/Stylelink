import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
  SortAsc,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  ChevronDown
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  OutfitUpload,
  ResultsPageState,
  InteractionState,
  SortOption,
  ViewMode,
  FashionItemLabel
} from '../types';
import { likeOutfit, shareOutfit } from '../services/apiService';
import { getOutfits } from '../services/firebaseService';
import { getLikedPosts, getSavedPosts, saveLikedPosts, saveSavedPosts } from '../utils/localStorage';
import PageErrorBoundary from '../components/PageErrorBoundary';

const ResultsPageContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from navigation state when available
  const navigationData = location.state as ResultsPageState;

  // State management
  const [results, setResults] = useState<OutfitUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>({ type: 'grid' });
  const [sortBy, setSortBy] = useState<SortOption['value']>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitUpload | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  
  // Interaction state
  const [interactions, setInteractions] = useState<InteractionState>({
    likedOutfits: getLikedPosts(),
    savedOutfits: getSavedPosts(),
    commentedOutfits: new Set(),
    sharedOutfits: new Set()
  });
  
  // Sort options
  const sortOptions: SortOption[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Most Liked', value: 'most_liked' },
    { label: 'Most Shared', value: 'most_shared' },
    { label: 'Price: Low to High', value: 'price_low_high' },
    { label: 'Price: High to Low', value: 'price_high_low' }
  ];
  
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const fetchCatalog = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      if (navigationData?.data?.results && navigationData.data.results.length > 0) {
        setResults(navigationData.data.results);
      } else {
        const { outfits } = await getOutfits({}, 1, 30);
        setResults(outfits);
      }
    } catch (catalogError) {
      console.error('Error loading catalog:', catalogError);
      setError('Unable to load the catalog right now. Please try again in a moment.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [navigationData]);

  // Initialize data
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFilters(false);
    };
    
    if (showFilters) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showFilters]);

  // Save liked outfits to localStorage when they change
  useEffect(() => {
    saveLikedPosts(interactions.likedOutfits);
  }, [interactions.likedOutfits]);

  // Save saved outfits to localStorage when they change
  useEffect(() => {
    saveSavedPosts(interactions.savedOutfits);
  }, [interactions.savedOutfits]);
  
  // Sort results
  const sortedResults = useMemo(() => {
    const sorted = [...results];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'most_liked':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'most_shared':
        return sorted.sort((a, b) => b.shares - a.shares);
      case 'price_low_high':
        return sorted.sort((a, b) => {
          const aPrice = a.items.reduce((sum, item) => sum + item.price, 0);
          const bPrice = b.items.reduce((sum, item) => sum + item.price, 0);
          return aPrice - bPrice;
        });
      case 'price_high_low':
        return sorted.sort((a, b) => {
          const aPrice = a.items.reduce((sum, item) => sum + item.price, 0);
          const bPrice = b.items.reduce((sum, item) => sum + item.price, 0);
          return bPrice - aPrice;
        });
      default:
        return sorted;
    }
  }, [results, sortBy]);
  
  // Handle interactions
  const handleLike = async (outfitId: string) => {
    const newInteractions = { ...interactions };
    if (newInteractions.likedOutfits.has(outfitId)) {
      newInteractions.likedOutfits.delete(outfitId);
    } else {
      newInteractions.likedOutfits.add(outfitId);
      // Simulate API call
      await likeOutfit(outfitId);
    }
    setInteractions(newInteractions);
  };
  
  const handleShare = async (outfitId: string) => {
    const newInteractions = { ...interactions };
    newInteractions.sharedOutfits.add(outfitId);
    setInteractions(newInteractions);
    
    // Simulate API call
    await shareOutfit(outfitId);
    
    // Copy to clipboard or open share dialog
    if (navigator.share) {
      navigator.share({
        title: 'Check out this outfit on StyleLink',
        url: window.location.href
      });
    }
  };
  
  const handleSave = (outfitId: string) => {
    const newInteractions = { ...interactions };
    if (newInteractions.savedOutfits.has(outfitId)) {
      newInteractions.savedOutfits.delete(outfitId);
    } else {
      newInteractions.savedOutfits.add(outfitId);
    }
    setInteractions(newInteractions);
  };
  
  const handleComment = (outfitId: string) => {
    const newInteractions = { ...interactions };
    newInteractions.commentedOutfits.add(outfitId);
    setInteractions(newInteractions);
    // In a real app, this would open a comment modal
  };
  
  // Handle outfit click for detailed view
  const handleOutfitClick = (outfit: OutfitUpload) => {
    setSelectedOutfit(outfit);
    setShowDetailedView(true);
  };
  
  // Refresh catalog content
  const handleRefreshCatalog = () => {
    fetchCatalog();
  };
  
  // Generate fashion item labels from outfit items
  const generateFashionLabels = (outfit: OutfitUpload): FashionItemLabel[] => {
    return outfit.items.slice(0, 3).map((item, index) => {
      // Create more realistic label positions
      const positions = [
        { x: 25, y: 35 }, // Top left
        { x: 65, y: 55 }, // Center right
        { x: 35, y: 75 }  // Bottom left
      ];
      
      return {
        id: item.id,
        name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
        x: positions[index]?.x || 20 + (index * 25),
        y: positions[index]?.y || 30 + (index * 15),
        confidence: 0.85 + (index * 0.05)
      };
    });
  };
  
  // Render fashion item labels on image
  const renderFashionLabels = (outfit: OutfitUpload) => {
    const labels = generateFashionLabels(outfit);
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {labels.map((label, index) => (
          <div
            key={label.id}
            className="absolute bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-gray-800 shadow-lg border border-gray-200 hover:bg-white transition-colors"
            style={{
              left: `${label.x}%`,
              top: `${label.y}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{label.name}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render outfit card
  const renderOutfitCard = (outfit: OutfitUpload) => {
    const isLiked = interactions.likedOutfits.has(outfit.id);
    const isSaved = interactions.savedOutfits.has(outfit.id);
    const isCommented = interactions.commentedOutfits.has(outfit.id);
    const isShared = interactions.sharedOutfits.has(outfit.id);
    
    return (
      <motion.div
        key={outfit.id}
        variants={fadeInUp}
        data-testid="outfit-card"
        className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
          viewMode.type === 'list' ? 'flex' : ''
        }`}
        onClick={() => handleOutfitClick(outfit)}
      >
        {/* Image Section */}
        <div className={`${viewMode.type === 'list' ? 'w-48 h-32' : 'w-full h-48'} relative`}>
          <img
            src={outfit.mainImageUrl}
            alt={outfit.title}
            className="w-full h-full object-cover"
          />
          {renderFashionLabels(outfit)}
          
          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex space-x-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleLike(outfit.id);
              }}
              className={`p-1 rounded-full transition-colors ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleShare(outfit.id);
              }}
              className={`p-1 rounded-full transition-colors ${
                isShared ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Content Section */}
        <div className={`p-4 ${viewMode.type === 'list' ? 'flex-1' : ''}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {outfit.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            by {outfit.userId}
          </p>
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {outfit.description}
          </p>
          
          {/* Style tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {outfit.styleTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          {/* Engagement metrics */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>{outfit.likes} likes</span>
            <span>{outfit.shares} shares</span>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(outfit.id);
                }}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-colors ${
                  isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleComment(outfit.id);
                }}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-colors ${
                  isCommented ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                }`}
              >
                <MessageCircle className="w-3 h-3" />
                <span>Comment</span>
              </button>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSave(outfit.id);
              }}
              className={`p-1 rounded-full transition-colors ${
                isSaved ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Catalog</h1>
                <p className="text-sm text-gray-600">
                  Shop {sortedResults.length} looks uploaded by our community
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode({ type: 'grid' })}
                  aria-label="Grid view"
                  className={`p-2 rounded transition-colors ${
                    viewMode.type === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode({ type: 'list' })}
                  aria-label="List view"
                  className={`p-2 rounded transition-colors ${
                    viewMode.type === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SortAsc className="w-4 h-4" />
                  <span className="text-sm">Sort</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                            sortBy === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="results-container">
        {/* Catalog Actions */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button
            onClick={handleRefreshCatalog}
            variant="secondary"
            size="md"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Catalog</span>
          </Button>
        </div>
        
        {/* Error State */}
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}
        
        {/* Results Grid/List */}
        <motion.div 
          className={`${
            viewMode.type === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <AnimatePresence>
            {sortedResults.map((outfit) => renderOutfitCard(outfit))}
          </AnimatePresence>
        </motion.div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8" role="status" aria-label="Loading results">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && sortedResults.length === 0 && !error && (
          <motion.div
            className="text-center py-12"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No outfits found
            </h3>
            <p className="text-gray-600 mb-6">
              Once outfits are uploaded, you can shop them here.
            </p>
            <Button onClick={handleRefreshCatalog} variant="primary">
              Refresh Catalog
            </Button>
          </motion.div>
        )}
      </div>
      
      {/* Detailed View Modal */}
      <AnimatePresence>
        {showDetailedView && selectedOutfit && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailedView(false)}
          >
            <motion.div
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-label="Outfit details"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedOutfit.title}
                  </h2>
                  <button
                    onClick={() => setShowDetailedView(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={selectedOutfit.mainImageUrl}
                      alt={selectedOutfit.title}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    {renderFashionLabels(selectedOutfit)}
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700">{selectedOutfit.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Style Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedOutfit.styleTags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
                      <div className="space-y-2">
                        {selectedOutfit.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.brand} • ${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleLike(selectedOutfit.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                            interactions.likedOutfits.has(selectedOutfit.id) 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${interactions.likedOutfits.has(selectedOutfit.id) ? 'fill-current' : ''}`} />
                          <span>{selectedOutfit.likes} likes</span>
                        </button>
                        <button 
                          onClick={() => handleShare(selectedOutfit.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => handleSave(selectedOutfit.id)}
                        className={`p-2 rounded-full transition-colors ${
                          interactions.savedOutfits.has(selectedOutfit.id) 
                            ? 'bg-yellow-100 text-yellow-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${interactions.savedOutfits.has(selectedOutfit.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResultsPage: React.FC = () => {
  return (
    <PageErrorBoundary pageName="Results">
      <ResultsPageContent />
    </PageErrorBoundary>
  );
};

export default ResultsPage;
