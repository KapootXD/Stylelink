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
import * as firebaseService from './firebaseService';

// Check if Firebase is configured
const isFirebaseConfigured = (): boolean => {
  return !!(
    process.env.REACT_APP_FIREBASE_API_KEY &&
    process.env.REACT_APP_FIREBASE_PROJECT_ID
  );
};

// Fallback: Simulate API delay for demo mode
const simulateApiDelay = (ms: number = 2000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Fallback: Generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Get current user ID (in a real app, this would come from Firebase Auth)
const getCurrentUserId = (): string => {
  // For now, return a default user ID
  // In production, this should get the authenticated user's ID
  return 'current-user';
};

/**
 * Process user outfit upload input
 * Uses Firebase if configured, otherwise falls back to demo mode
 */
export const processOutfitUpload = async (userInput: UserInput): Promise<ApiResponse<OutfitResult>> => {
  try {
    // Validate input
    if (!userInput.title || !userInput.items || userInput.items.length === 0) {
      throw new Error('Title and at least one clothing item are required.');
    }

    if (isFirebaseConfigured()) {
      // Use Firebase
      const userId = getCurrentUserId();
      const startTime = Date.now();
      
      const outfit = await firebaseService.createOutfit(userInput, userId);
      
      // Get similar outfits for recommendations
      const { outfits: similarOutfits } = await firebaseService.getOutfits(
        { occasion: outfit.occasion },
        1,
        3
      );

      // Simulate style analysis (in production, this would be done by a ML service)
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

      const processingTime = Date.now() - startTime;

      const result: OutfitResult = {
        success: true,
        outfit,
        processingTime,
        recommendations: {
          similarOutfits: similarOutfits.filter(o => o.id !== outfit.id).slice(0, 3),
          suggestedItems: DEMO_DATA.clothingItems.slice(0, 3) // TODO: Get from Firebase
        }
      };

      return {
        data: result,
        message: 'Outfit uploaded successfully!',
        status: 'success',
        timestamp: new Date()
      };
    } else {
      // Fallback to demo mode
      await simulateApiDelay(2000);

      const outfit: OutfitUpload = {
        id: generateId(),
        userId: getCurrentUserId(),
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

      const styleAnalysis: StyleAnalysis = {
        dominantColors: ['white', 'navy', 'black'],
        styleCategory: 'minimalist',
        confidence: 0.85,
        suggestions: [
          'Consider adding a statement accessory',
          'The color palette works well together',
          'Perfect for professional settings'
        ]
      };

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
        message: 'Outfit uploaded successfully! (Demo mode - Firebase not configured)',
        status: 'success',
        timestamp: new Date()
      };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return {
      data: {
        success: false,
        error: errorMessage,
        processingTime: 0
      },
      message: errorMessage,
      status: 'error',
      timestamp: new Date()
    };
  }
};

/**
 * Search outfits with filters
 * Uses Firebase if configured, otherwise falls back to demo mode
 */
export const searchOutfits = async (
  query: string = '',
  filters: SearchFilters = {},
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<OutfitSearchResult>> => {
  try {
    if (isFirebaseConfigured()) {
      // Use Firebase
      const { outfits, hasMore } = await firebaseService.searchOutfitsByText(
        query,
        filters,
        page,
        limit
      );

      const result: OutfitSearchResult = {
        outfits,
        totalCount: outfits.length, // Note: This is approximate with pagination
        page,
        limit,
        hasMore
      };

      return {
        data: result,
        message: `Found ${outfits.length} outfits`,
        status: 'success',
        timestamp: new Date()
      };
    } else {
      // Fallback to demo mode
      await simulateApiDelay(1500);

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
        message: `Found ${result.totalCount} outfits (Demo mode)`,
        status: 'success',
        timestamp: new Date()
      };
    }

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
 * Uses Firebase if configured, otherwise falls back to demo mode
 */
export const getOutfitById = async (id: string): Promise<ApiResponse<OutfitUpload | null>> => {
  try {
    if (isFirebaseConfigured()) {
      // Use Firebase
      const outfit = await firebaseService.getOutfitById(id);

      return {
        data: outfit,
        message: outfit ? 'Outfit found' : 'Outfit not found',
        status: outfit ? 'success' : 'error',
        timestamp: new Date()
      };
    } else {
      // Fallback to demo mode
      await simulateApiDelay(1000);

      const outfit = DEMO_DATA.outfits.find(o => o.id === id);

      return {
        data: outfit || null,
        message: outfit ? 'Outfit found (Demo mode)' : 'Outfit not found',
        status: outfit ? 'success' : 'error',
        timestamp: new Date()
      };
    }

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
 * Uses Firebase if configured, otherwise falls back to demo mode
 */
export const getUserProfile = async (userId: string): Promise<ApiResponse<UserProfile | null>> => {
  try {
    if (isFirebaseConfigured()) {
      // Use Firebase
      const user = await firebaseService.getUserProfile(userId);

      return {
        data: user,
        message: user ? 'User profile found' : 'User not found',
        status: user ? 'success' : 'error',
        timestamp: new Date()
      };
    } else {
      // Fallback to demo mode
      await simulateApiDelay(1000);

      const user = DEMO_DATA.users.find(u => u.id === userId);

      return {
        data: user || null,
        message: user ? 'User profile found (Demo mode)' : 'User not found',
        status: user ? 'success' : 'error',
        timestamp: new Date()
      };
    }

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
 * Uses Firebase if configured, otherwise falls back to demo mode
 */
export const likeOutfit = async (outfitId: string): Promise<ApiResponse<{ likes: number }>> => {
  try {
    if (isFirebaseConfigured()) {
      // Use Firebase
      const userId = getCurrentUserId();
      const likes = await firebaseService.likeOutfit(outfitId, userId);

      return {
        data: { likes },
        message: 'Outfit liked successfully',
        status: 'success',
        timestamp: new Date()
      };
    } else {
      // Fallback to demo mode
      await simulateApiDelay(500);

      const outfit = DEMO_DATA.outfits.find(o => o.id === outfitId);
      const newLikes = outfit ? outfit.likes + 1 : 0;

      return {
        data: { likes: newLikes },
        message: 'Outfit liked successfully (Demo mode)',
        status: 'success',
        timestamp: new Date()
      };
    }

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
 * Uses Firebase if configured, otherwise falls back to demo mode
 */
export const shareOutfit = async (outfitId: string): Promise<ApiResponse<{ shares: number }>> => {
  try {
    if (isFirebaseConfigured()) {
      // Use Firebase
      const userId = getCurrentUserId();
      const shares = await firebaseService.shareOutfit(outfitId, userId);

      return {
        data: { shares },
        message: 'Outfit shared successfully',
        status: 'success',
        timestamp: new Date()
      };
    } else {
      // Fallback to demo mode
      await simulateApiDelay(500);

      const outfit = DEMO_DATA.outfits.find(o => o.id === outfitId);
      const newShares = outfit ? outfit.shares + 1 : 0;

      return {
        data: { shares: newShares },
        message: 'Outfit shared successfully (Demo mode)',
        status: 'success',
        timestamp: new Date()
      };
    }

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
