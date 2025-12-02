import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  MessageCircle,
  Bookmark,
  Loader2,
  ChevronUp,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';
import { searchOutfits } from '../services/apiService';
import { SearchFilters } from '../types';
import { OutfitUpload } from '../types';
import { 
  getLikedPosts, 
  getSavedPosts, 
  getComments, 
  saveLikedPosts, 
  saveSavedPosts, 
  saveComments,
  updateLastVisit 
} from '../utils/localStorage';
import PageErrorBoundary from '../components/PageErrorBoundary';

interface FormData {
  searchQuery: string;
  selectedCategories: string[];
  selectedOccasion: string;
  selectedSeason: string;
}

interface MainFeaturePageProps {
  // Props can be added here if needed for dynamic content
}

const MainFeaturePageContent: React.FC<MainFeaturePageProps> = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [outfits, setOutfits] = useState<OutfitUpload[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(getLikedPosts());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(getSavedPosts());
  const [showComments, setShowComments] = useState(false);
  const [currentPostComments, setCurrentPostComments] = useState<OutfitUpload | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<{[outfitId: string]: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string;
  }>}>(getComments());
  const [showShopping, setShowShopping] = useState(false);
  const [currentPostShopping, setCurrentPostShopping] = useState<OutfitUpload | null>(null);
  
  // Scroll and animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  
  // Animation variants
  const slideIn = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };
  
  // Load initial data
  useEffect(() => {
    loadOutfits();
    updateLastVisit();
  }, []);

  // Save liked posts to localStorage when they change
  useEffect(() => {
    saveLikedPosts(likedPosts);
  }, [likedPosts]);

  // Save saved posts to localStorage when they change
  useEffect(() => {
    saveSavedPosts(savedPosts);
  }, [savedPosts]);

  // Save comments to localStorage when they change
  useEffect(() => {
    saveComments(comments);
  }, [comments]);

  // Handle scroll events to update current post index
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const postHeight = window.innerHeight;
        const currentIndex = Math.round(scrollTop / postHeight);
        setCurrentPostIndex(currentIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Load outfits function
  const loadOutfits = async (page: number = 1, append: boolean = false) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await searchOutfits('', {}, page, 4);
      
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
  
  // Handle interactions
  const handleLike = (outfitId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(outfitId)) {
        newSet.delete(outfitId);
      } else {
        newSet.add(outfitId);
      }
      return newSet;
    });
  };
  
  const handleSave = (outfitId: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(outfitId)) {
        newSet.delete(outfitId);
      } else {
        newSet.add(outfitId);
      }
      return newSet;
    });
  };
  
  const handleShare = (outfit: OutfitUpload) => {
    if (navigator.share) {
      navigator.share({
        title: outfit.title,
        text: outfit.description,
        url: window.location.href
      });
    }
  };
  
  const handleComment = (outfitId: string) => {
    // Show comments panel for the specific outfit
    const outfit = outfits.find(o => o.id === outfitId);
    if (outfit) {
      setCurrentPostComments(outfit);
      setShowComments(true);
    }
  };

  const handleShopping = (outfitId: string) => {
    // Show shopping links for the specific outfit
    const outfit = outfits.find(o => o.id === outfitId);
    if (outfit) {
      setCurrentPostShopping(outfit);
      setShowShopping(true);
    }
  };

  const handleSubmitComment = () => {
    if (!commentInput.trim() || !currentPostComments) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'Y',
      text: commentInput.trim(),
      timestamp: 'now'
    };

    setComments(prev => ({
      ...prev,
      [currentPostComments.id]: [
        ...(prev[currentPostComments.id] || []),
        newComment
      ]
    }));

    setCommentInput('');
  };

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
      handleSubmitComment();
    }
  };
  
  // Handle load more
  const handleLoadMore = () => {
    loadOutfits(currentPage + 1, true);
  };
  
  // Handle scroll to next/previous post
  const scrollToNext = () => {
    if (currentPostIndex < outfits.length - 1) {
      const nextIndex = currentPostIndex + 1;
      setCurrentPostIndex(nextIndex);
      // Scroll to the next post
      const nextPost = containerRef.current?.children[nextIndex] as HTMLElement;
      if (nextPost) {
        nextPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (hasMore) {
      handleLoadMore();
    }
  };
  
  const scrollToPrevious = () => {
    if (currentPostIndex > 0) {
      const prevIndex = currentPostIndex - 1;
      setCurrentPostIndex(prevIndex);
      // Scroll to the previous post
      const prevPost = containerRef.current?.children[prevIndex] as HTMLElement;
      if (prevPost) {
        prevPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-black">

      {/* Feed Container */}
      <div 
        ref={containerRef}
        className="h-full w-full relative overflow-y-auto feed-container snap-container"
      >
        {outfits.map((outfit, index) => (
          <motion.div
            key={outfit.id}
            data-testid="outfit-card"
            className="h-screen w-full relative snap-item flex items-center justify-center"
            variants={slideIn}
            initial="initial"
          animate="animate"
            exit="exit"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={outfit.mainImageUrl}
                alt={outfit.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex">
              {/* Left Side - Content */}
              <div className="flex-1 flex flex-col justify-end p-6 text-white">
                <div className="space-y-4 bg-black/20 backdrop-blur-sm rounded-2xl p-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        {outfit.userId.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{outfit.userId}</p>
                      <p className="text-sm text-white/70">{outfit.occasion}</p>
                    </div>
                  </div>

                  {/* Outfit Title & Description */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold leading-tight">
                      {outfit.title}
                    </h2>
                    <p className="text-lg text-white/90 leading-relaxed">
                      {outfit.description}
                    </p>
                  </div>

                  {/* Style Tags */}
                  <div className="flex flex-wrap gap-2">
                    {outfit.styleTags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                      >
                        #{tag}
                      </span>
            ))}
          </div>
          
                  {/* Engagement Stats */}
                  <div className="flex items-center space-x-6 text-sm">
                    <span>{outfit.likes} likes</span>
                    <span>{outfit.shares} shares</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Action Buttons */}
              <div className="flex flex-col justify-end items-center space-y-4 p-6 mr-16 pb-20">
                {/* Like Button */}
                <motion.button
                  onClick={() => handleLike(outfit.id)}
                  className="flex flex-col items-center space-y-2 hover:bg-white/10 rounded-full transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <div className={`p-2 rounded-full transition-colors ${
                    likedPosts.has(outfit.id) 
                      ? 'bg-red-500' 
                      : 'bg-white/20 backdrop-blur-sm'
                  }`}>
                    <Heart 
                      className={`w-5 h-5 ${
                        likedPosts.has(outfit.id) 
                          ? 'fill-current text-white' 
                          : 'text-white'
                      }`} 
                    />
                  </div>
                  <span className="text-xs text-white/70 font-medium">Like</span>
                </motion.button>

                {/* Comment Button */}
                <motion.button
                  onClick={() => handleComment(outfit.id)}
                  className="flex flex-col items-center space-y-2 hover:bg-white/10 rounded-full transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-white/70 font-medium">Comment</span>
                </motion.button>

                {/* Share Button */}
                <motion.button
                  onClick={() => handleShare(outfit)}
                  className="flex flex-col items-center space-y-2 hover:bg-white/10 rounded-full transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-white/70 font-medium">Share</span>
                </motion.button>

                {/* Save Button */}
                <motion.button
                  onClick={() => handleSave(outfit.id)}
                  className="flex flex-col items-center space-y-2 hover:bg-white/10 rounded-full transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <Bookmark 
                      className={`w-5 h-5 ${
                        savedPosts.has(outfit.id) 
                          ? 'fill-current text-white' 
                          : 'text-white'
                      }`} 
                    />
                  </div>
                  <span className="text-xs text-white/70 font-medium">Save</span>
                </motion.button>

                {/* Shopping Button */}
                <motion.button
                  onClick={() => handleShopping(outfit.id)}
                  className="flex flex-col items-center space-y-2 hover:bg-white/10 rounded-full transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-white/70 font-medium">Shop</span>
                </motion.button>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 z-20">
              <button
                onClick={scrollToPrevious}
                disabled={currentPostIndex === 0}
                className={`p-3 rounded-full text-white transition-all duration-200 ${
                  currentPostIndex === 0 
                    ? 'bg-white/10 cursor-not-allowed opacity-50' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-110'
                }`}
                title="Previous post"
              >
                <ChevronUp className="w-6 h-6" />
              </button>
              <button
                onClick={scrollToNext}
                disabled={currentPostIndex === outfits.length - 1 && !hasMore}
                className={`p-3 rounded-full text-white transition-all duration-200 ${
                  (currentPostIndex === outfits.length - 1 && !hasMore)
                    ? 'bg-white/10 cursor-not-allowed opacity-50' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-110'
                }`}
                title="Next post"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="h-screen flex items-center justify-center" role="status" aria-label="Loading styles">
            <div className="flex items-center space-x-3 text-white">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium">Loading more styles...</span>
            </div>
          </div>
        )}

        {/* Load More Trigger */}
        {hasMore && (
          <div className="h-screen flex items-center justify-center">
            <button
              onClick={handleLoadMore}
              className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:bg-white/30"
            >
              Load More Styles
            </button>
          </div>
        )}
      </div>

      {/* Comments Panel */}
      <AnimatePresence>
        {showComments && currentPostComments && (
          <motion.div
            className="fixed inset-0 z-40 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div 
              className="flex-1 bg-black/50"
              onClick={() => setShowComments(false)}
            />
            
            {/* Comments Panel */}
            <motion.div 
              className="w-full max-w-md bg-white h-full overflow-hidden flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
                      <button
                    onClick={() => setShowComments(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600 rotate-90" />
                      </button>
                </div>
                
                {/* Post Info */}
                <div className="mt-3 flex items-center space-x-3">
                  <img
                    src={currentPostComments.mainImageUrl}
                    alt={currentPostComments.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{currentPostComments.title}</p>
                    <p className="text-xs text-gray-500">by {currentPostComments.userId}</p>
                  </div>
                  </div>
                </div>
                
              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="space-y-4">
                  {/* Show existing comments for this outfit */}
                  {currentPostComments && comments[currentPostComments.id] && comments[currentPostComments.id].map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        comment.userId === 'current-user' ? 'bg-blue-500' : 
                        comment.userAvatar === 'A' ? 'bg-blue-500' :
                        comment.userAvatar === 'M' ? 'bg-pink-500' :
                        comment.userAvatar === 'J' ? 'bg-green-500' :
                        comment.userAvatar === 'S' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}>
                        <span className="text-white text-sm font-semibold">{comment.userAvatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">{comment.userName}</p>
                          <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                          <p className="text-xs text-gray-500 mt-2">{comment.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show default mock comments if no comments exist for this outfit */}
                  {(!currentPostComments || !comments[currentPostComments.id] || comments[currentPostComments.id].length === 0) && (
                    <>
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">A</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-900">Alex Chen</p>
                            <p className="text-sm text-gray-700 mt-1">Love this outfit! Where can I get the blazer? 🔥</p>
                            <p className="text-xs text-gray-500 mt-2">2h ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">M</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-900">Maya Rodriguez</p>
                            <p className="text-sm text-gray-700 mt-1">The color combination is perfect for fall! 🍂</p>
                            <p className="text-xs text-gray-500 mt-2">4h ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">J</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-900">Jordan Kim</p>
                            <p className="text-sm text-gray-700 mt-1">This is exactly what I was looking for! Thanks for sharing ✨</p>
                            <p className="text-xs text-gray-500 mt-2">6h ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">S</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-900">Sam Wilson</p>
                            <p className="text-sm text-gray-700 mt-1">Perfect for a casual Friday at work 👔</p>
                            <p className="text-xs text-gray-500 mt-2">8h ago</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Comment Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">Y</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentInput}
                      onChange={handleCommentInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a comment..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                  <button 
                    onClick={handleSubmitComment}
                    disabled={!commentInput.trim()}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      commentInput.trim() 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
        
      {/* Shopping Panel */}
      <AnimatePresence>
        {showShopping && currentPostShopping && (
          <motion.div 
            className="fixed inset-0 z-40 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div 
              className="flex-1 bg-black/50"
              onClick={() => setShowShopping(false)}
            />
            
            {/* Shopping Panel */}
        <motion.div 
              className="w-full max-w-md bg-white h-full overflow-hidden flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Shop This Look</h2>
                  <button
                    onClick={() => setShowShopping(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600 rotate-90" />
                  </button>
                </div>
                
                {/* Post Info */}
                <div className="mt-3 flex items-center space-x-3">
                  <img
                    src={currentPostShopping.mainImageUrl}
                    alt={currentPostShopping.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{currentPostShopping.title}</p>
                    <p className="text-xs text-gray-500">by {currentPostShopping.userId}</p>
                  </div>
                </div>
              </div>
              
              {/* Shopping Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="space-y-4">
                  {currentPostShopping.items.map((item, index) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex space-x-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-500 mb-2">{item.brand}</p>
                          <p className="text-sm font-semibold text-gray-900">${item.price}</p>
                          <p className="text-xs text-gray-500">Size: {item.size} • Color: {item.color}</p>
                          <div className="mt-3">
                            <a
                              href={item.directLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors"
                            >
                              <ShoppingBag className="w-3 h-3 mr-1" />
                              Shop Now
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  Prices and availability may vary. StyleLink may earn commission from purchases.
                </p>
              </div>
            </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => loadOutfits()}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MainFeaturePage: React.FC = () => {
  return (
    <PageErrorBoundary pageName="Discover">
      <MainFeaturePageContent />
    </PageErrorBoundary>
  );
};

export default MainFeaturePage;