import React, { useState, useEffect } from 'react';
import { Search, User, Palette, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'profile' | 'style';
  name: string;
  username?: string;
  description?: string;
  avatar?: string;
  tags?: string[];
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchType, setSearchType] = useState<'profile' | 'style'>('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in a real app, this would come from an API
  const mockProfiles: SearchResult[] = [
    {
      id: '1',
      type: 'profile',
      name: 'Sarah Johnson',
      username: '@sarahj',
      description: 'Fashion enthusiast and streetwear lover',
      avatar: '',
      tags: ['streetwear', 'sneakers', 'urban']
    },
    {
      id: '2',
      type: 'profile',
      name: 'Mike Chen',
      username: '@mikechen',
      description: 'Minimalist fashion photographer',
      avatar: '',
      tags: ['minimalist', 'photography', 'neutral']
    },
    {
      id: '3',
      type: 'profile',
      name: 'Emma Wilson',
      username: '@emmaw',
      description: 'Vintage style curator',
      avatar: '',
      tags: ['vintage', 'retro', 'classic']
    }
  ];

  const mockStyles: SearchResult[] = [
    {
      id: '1',
      type: 'style',
      name: 'Streetwear',
      description: 'Urban and casual fashion style',
      tags: ['casual', 'urban', 'sneakers', 'hoodie']
    },
    {
      id: '2',
      type: 'style',
      name: 'Vintage 90s',
      description: 'Retro fashion from the 1990s',
      tags: ['retro', '90s', 'grunge', 'denim']
    },
    {
      id: '3',
      type: 'style',
      name: 'Minimalist',
      description: 'Clean and simple fashion approach',
      tags: ['minimal', 'clean', 'neutral', 'simple']
    }
  ];

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const data = searchType === 'profile' ? mockProfiles : mockStyles;
      const filteredResults = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setResults(filteredResults);
      setIsLoading(false);
    }, 300);
  }, [searchQuery, searchType]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleResultClick = (result: SearchResult) => {
    // Navigate to profile or style page
    if (result.type === 'profile') {
      // In a real app, this would navigate to the profile page
      console.log('Navigate to profile:', result.username);
    } else {
      // Navigate to style page
      console.log('Navigate to style:', result.name);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-16">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Search</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Type Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setSearchType('profile')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 font-medium text-sm ${
                searchType === 'profile'
                  ? 'text-[#B7410E] border-b-2 border-[#B7410E]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profiles</span>
            </button>
            <button
              onClick={() => setSearchType('style')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 font-medium text-sm ${
                searchType === 'style'
                  ? 'text-[#B7410E] border-b-2 border-[#B7410E]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>Styles</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${searchType === 'profile' ? 'profiles by username...' : 'styles...'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B7410E] focus:border-transparent outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B7410E] mx-auto"></div>
              <p className="text-gray-500 mt-2">Searching...</p>
            </div>
          ) : searchQuery.trim() === '' ? (
            <div className="p-6 text-center text-gray-500">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>Start typing to search {searchType === 'profile' ? 'profiles' : 'styles'}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No {searchType === 'profile' ? 'profiles' : 'styles'} found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {results.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar or Icon */}
                    <div className="flex-shrink-0">
                      {result.type === 'profile' ? (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#B7410E] to-[#D4AF37] flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {result.name.charAt(0)}
                          </span>
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-[#B7410E] to-[#D4AF37] flex items-center justify-center">
                          <Palette className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {result.name}
                        </h3>
                        {result.username && (
                          <span className="text-sm text-gray-500">{result.username}</span>
                        )}
                      </div>
                      
                      {result.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                      
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                          {result.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{result.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
