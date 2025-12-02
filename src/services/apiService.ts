import { 
  UserInput, 
  OutfitResult, 
  OutfitUpload, 
  ApiResponse,
  SearchFilters,
  OutfitSearchResult,
  UserProfile
} from '../types';
import * as firebaseService from './firebaseService';

// Check if Firebase is configured
const isFirebaseConfigured = (): boolean => {
  return !!(
    process.env.REACT_APP_FIREBASE_API_KEY &&
    process.env.REACT_APP_FIREBASE_PROJECT_ID
  );
};

// Get current user ID (in a real app, this would come from Firebase Auth)
const getCurrentUserId = (): string => {
  // For now, return a default user ID
  // In production, this should get the authenticated user's ID
  return 'current-user';
};

/**
 * Process user outfit upload input
 * Requires Firebase configuration
 */
export const processOutfitUpload = async (userInput: UserInput): Promise<ApiResponse<OutfitResult>> => {
  try {
    // Validate input
    if (!userInput.title || !userInput.items || userInput.items.length === 0) {
      throw new Error('Title and at least one clothing item are required.');
    }

    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Please add your Firebase environment variables.');
    }

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

    const processingTime = Date.now() - startTime;

    const result: OutfitResult = {
      success: true,
      outfit,
      processingTime,
      recommendations: {
        similarOutfits: similarOutfits.filter(o => o.id !== outfit.id).slice(0, 3),
        suggestedItems: [] // TODO: fetch from Firebase when available
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
 * Requires Firebase configuration
 */
export const searchOutfits = async (
  query: string = '',
  filters: SearchFilters = {},
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<OutfitSearchResult>> => {
  try {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Please add your Firebase environment variables.');
    }

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
 * Requires Firebase configuration
 */
export const getOutfitById = async (id: string): Promise<ApiResponse<OutfitUpload | null>> => {
  try {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Please add your Firebase environment variables.');
    }

    const outfit = await firebaseService.getOutfitById(id);

    return {
      data: outfit,
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
 * Requires Firebase configuration
 */
export const getUserProfile = async (userId: string): Promise<ApiResponse<UserProfile | null>> => {
  try {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Please add your Firebase environment variables.');
    }

    const user = await firebaseService.getUserProfile(userId);

    return {
      data: user,
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
 * Requires Firebase configuration
 */
export const likeOutfit = async (outfitId: string): Promise<ApiResponse<{ likes: number }>> => {
  try {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Please add your Firebase environment variables.');
    }

    const userId = getCurrentUserId();
    const likes = await firebaseService.likeOutfit(outfitId, userId);

    return {
      data: { likes },
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
 * Requires Firebase configuration
 */
export const shareOutfit = async (outfitId: string): Promise<ApiResponse<{ shares: number }>> => {
  try {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Please add your Firebase environment variables.');
    }

    const userId = getCurrentUserId();
    const shares = await firebaseService.shareOutfit(outfitId, userId);

    return {
      data: { shares },
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
