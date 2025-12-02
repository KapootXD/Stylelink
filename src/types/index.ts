// Core data types for StyleLink outfit upload feature

export interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  size?: string;
  color: string;
  category: 'top' | 'bottom' | 'dress' | 'shoes' | 'accessories' | 'outerwear';
  directLink: string;
  imageUrl: string;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
}

export interface OutfitUpload {
  id: string;
  userId: string;
  title: string;
  description: string;
  occasion: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  styleTags: string[];
  hashtags?: string[];
  items: ClothingItem[];
  mainImageUrl: string;
  additionalImages: string[];
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  shares: number;
  isPublic: boolean;
}

export interface UserInput {
  title: string;
  description: string;
  occasion: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  styleTags: string[];
  hashtags?: string[];
  items: Omit<ClothingItem, 'id'>[];
  mainImageUrl: string;
  additionalImages?: string[];
  isPublic?: boolean;
}

export interface OutfitResult {
  success: boolean;
  outfit?: OutfitUpload;
  error?: string;
  processingTime: number;
  recommendations?: {
    similarOutfits: OutfitUpload[];
    suggestedItems: ClothingItem[];
  };
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  followers: number;
  following: number;
  outfits: OutfitUpload[];
  isVerified: boolean;
  joinedAt: Date;
}

export interface StyleAnalysis {
  dominantColors: string[];
  styleCategory: 'casual' | 'formal' | 'streetwear' | 'vintage' | 'minimalist' | 'bohemian';
  confidence: number;
  suggestions: string[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
  timestamp: Date;
}

export interface SearchFilters {
  occasion?: string;
  season?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  brands?: string[];
  categories?: string[];
  styleTags?: string[];
  userId?: string;
}

export interface OutfitSearchResult {
  outfits: OutfitUpload[];
  totalCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Results page specific types
export interface FashionItemLabel {
  id: string;
  name: string;
  x: number; // percentage position
  y: number; // percentage position
  confidence: number;
}

export interface ResultsPageData {
  searchQuery?: string;
  filters?: SearchFilters;
  results: OutfitUpload[];
  totalCount: number;
  processingTime?: number;
}

export interface ResultsPageState {
  data: ResultsPageData;
  error?: string;
  isLoading?: boolean;
}

export interface InteractionState {
  likedOutfits: Set<string>;
  savedOutfits: Set<string>;
  commentedOutfits: Set<string>;
  sharedOutfits: Set<string>;
}

export interface SortOption {
  label: string;
  value: 'newest' | 'oldest' | 'most_liked' | 'most_shared' | 'price_low_high' | 'price_high_low';
}

export interface ViewMode {
  type: 'grid' | 'list' | 'detailed';
  itemsPerRow?: number;
}
export * from './activity';
