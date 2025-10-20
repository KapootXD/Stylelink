import { 
  UserInput, 
  OutfitResult, 
  OutfitUpload, 
  ApiResponse, 
  SearchFilters, 
  OutfitSearchResult,
  StyleAnalysis,
  UserProfile
} from '../types';
import { DEMO_DATA } from '../data/demoData';

// Simulate API delay
const simulateApiDelay = (ms: number = 2000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Simulate API error (10% chance)
const shouldSimulateError = (): boolean => {
  return Math.random() < 0.1;
};

/**
 * Process user outfit upload input
 * Simulates API call with 2-second delay
 */
export const processOutfitUpload = async (userInput: UserInput): Promise<ApiResponse<OutfitResult>> => {
  try {
    // Simulate API delay
    await simulateApiDelay(2000);

    // Simulate occasional errors
    if (shouldSimulateError()) {
      throw new Error('Failed to process outfit upload. Please try again.');
    }

    // Validate input
    if (!userInput.title || !userInput.items || userInput.items.length === 0) {
      throw new Error('Title and at least one clothing item are required.');
    }

    // Create outfit from user input
    const outfit: OutfitUpload = {
      id: generateId(),
      userId: 'current-user', // In real app, this would come from auth
      title: userInput.title,
      description: userInput.description,
      occasion: userInput.occasion,
      season: userInput.season,
      styleTags: userInput.styleTags,
      items: userInput.items.map(item => ({
        ...item,
        id: generateId()
      })),
      mainImageUrl: userInput.mainImageUrl,
      additionalImages: userInput.additionalImages || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      shares: 0,
      isPublic: userInput.isPublic ?? true
    };

    // Simulate style analysis
    const styleAnalysis: StyleAnalysis = {
      dominantColors: ['white', 'navy', 'black'], // Simplified for demo
      styleCategory: 'minimalist',
      confidence: 0.85,
      suggestions: [
        'Consider adding a statement accessory',
        'The color palette works well together',
        'Perfect for professional settings'
      ]
    };

    // Find similar outfits (simplified matching)
    const similarOutfits = DEMO_DATA.outfits
      .filter(o => o.occasion === outfit.occasion || o.season === outfit.season)
      .slice(0, 3);

    const result: OutfitResult = {
      success: true,
      outfit,
      processingTime: 2000,
      recommendations: {
        similarOutfits,
        suggestedItems: DEMO_DATA.clothingItems.slice(0, 3)
      }
    };

    return {
      data: result,
      message: 'Outfit uploaded successfully!',
      status: 'success',
      timestamp: new Date()
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return {
      data: {
        success: false,
        error: errorMessage,
        processingTime: 2000
      },
      message: errorMessage,
      status: 'error',
      timestamp: new Date()
    };
  }
};

/**
 * Search outfits with filters
 * Simulates API call with delay
 */
export const searchOutfits = async (
  query: string = '',
  filters: SearchFilters = {},
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<OutfitSearchResult>> => {
  try {
    await simulateApiDelay(1500);

    if (shouldSimulateError()) {
      throw new Error('Search service temporarily unavailable');
    }

    let filteredOutfits = [...DEMO_DATA.outfits];

    // Apply text search
    if (query) {
      filteredOutfits = filteredOutfits.filter(outfit =>
        outfit.title.toLowerCase().includes(query.toLowerCase()) ||
        outfit.description.toLowerCase().includes(query.toLowerCase()) ||
        outfit.styleTags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.occasion) {
      filteredOutfits = filteredOutfits.filter(outfit => outfit.occasion === filters.occasion);
    }

    if (filters.season) {
      filteredOutfits = filteredOutfits.filter(outfit => outfit.season === filters.season);
    }

    if (filters.styleTags && filters.styleTags.length > 0) {
      filteredOutfits = filteredOutfits.filter(outfit =>
        filters.styleTags!.some(tag => outfit.styleTags.includes(tag))
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOutfits = filteredOutfits.slice(startIndex, endIndex);

    const result: OutfitSearchResult = {
      outfits: paginatedOutfits,
      totalCount: filteredOutfits.length,
      page,
      limit,
      hasMore: endIndex < filteredOutfits.length
    };

    return {
      data: result,
      message: `Found ${result.totalCount} outfits`,
      status: 'success',
      timestamp: new Date()
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Search failed';
    
    return {
      data: {
        outfits: [],
        totalCount: 0,
        page: 1,
        limit: 10,
        hasMore: false
      },
      message: errorMessage,
      status: 'error',
      timestamp: new Date()
    };
  }
};

/**
 * Get outfit by ID
 * Simulates API call with delay
 */
export const getOutfitById = async (id: string): Promise<ApiResponse<OutfitUpload | null>> => {
  try {
    await simulateApiDelay(1000);

    if (shouldSimulateError()) {
      throw new Error('Failed to fetch outfit details');
    }

    const outfit = DEMO_DATA.outfits.find(o => o.id === id);

    return {
      data: outfit || null,
      message: outfit ? 'Outfit found' : 'Outfit not found',
      status: outfit ? 'success' : 'error',
      timestamp: new Date()
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch outfit';
    
    return {
      data: null,
      message: errorMessage,
      status: 'error',
      timestamp: new Date()
    };
  }
};

/**
 * Get user profile
 * Simulates API call with delay
 */
export const getUserProfile = async (userId: string): Promise<ApiResponse<UserProfile | null>> => {
  try {
    await simulateApiDelay(1000);

    if (shouldSimulateError()) {
      throw new Error('Failed to fetch user profile');
    }

    const user = DEMO_DATA.users.find(u => u.id === userId);

    return {
      data: user || null,
      message: user ? 'User profile found' : 'User not found',
      status: user ? 'success' : 'error',
      timestamp: new Date()
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user profile';
    
    return {
      data: null,
      message: errorMessage,
      status: 'error',
      timestamp: new Date()
    };
  }
};

/**
 * Like an outfit
 * Simulates API call with delay
 */
export const likeOutfit = async (outfitId: string): Promise<ApiResponse<{ likes: number }>> => {
  try {
    await simulateApiDelay(500);

    if (shouldSimulateError()) {
      throw new Error('Failed to like outfit');
    }

    // In a real app, this would update the database
    const outfit = DEMO_DATA.outfits.find(o => o.id === outfitId);
    const newLikes = outfit ? outfit.likes + 1 : 0;

    return {
      data: { likes: newLikes },
      message: 'Outfit liked successfully',
      status: 'success',
      timestamp: new Date()
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to like outfit';
    
    return {
      data: { likes: 0 },
      message: errorMessage,
      status: 'error',
      timestamp: new Date()
    };
  }
};

/**
 * Share an outfit
 * Simulates API call with delay
 */
export const shareOutfit = async (outfitId: string): Promise<ApiResponse<{ shares: number }>> => {
  try {
    await simulateApiDelay(500);

    if (shouldSimulateError()) {
      throw new Error('Failed to share outfit');
    }

    // In a real app, this would update the database
    const outfit = DEMO_DATA.outfits.find(o => o.id === outfitId);
    const newShares = outfit ? outfit.shares + 1 : 0;

    return {
      data: { shares: newShares },
      message: 'Outfit shared successfully',
      status: 'success',
      timestamp: new Date()
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to share outfit';
    
    return {
      data: { shares: 0 },
      message: errorMessage,
      status: 'error',
      timestamp: new Date()
    };
  }
};
