/**
 * User Type Definitions for StyleLink
 * 
 * Defines user classification system with different user types
 * and the complete user interface for the application.
 */

/**
 * User Type Enum
 * Defines the different types of users in the system
 */
export enum UserType {
  ADMIN = 'admin',
  PREMIUM = 'premium',
  REGULAR = 'regular',
  GUEST = 'guest'
}

/**
 * User Type as string literal union
 * Alternative to enum for type checking
 */
export type UserTypeString = 'admin' | 'premium' | 'regular' | 'guest';

/**
 * App User Interface
 * Complete user profile for StyleLink application
 * Extends Firebase Auth User with additional profile data
 */
export interface AppUser {
  // Firebase Auth fields
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  
  // StyleLink specific fields
  userType: UserType | UserTypeString;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  profilePicture?: string; // Alias for photoURL/avatarUrl, used in ProfilePage
  location?: string;
  joinDate?: string;
  
  // Stats
  stats?: {
    followers: number;
    following: number;
    posts: number;
  };
  
  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isOwnProfile?: boolean;
}

/**
 * User Profile in Firestore
 * Structure of user document stored in Firestore 'users' collection
 */
export interface FirestoreUserProfile {
  uid: string;
  email: string;
  displayName?: string;
  userType: UserType | UserTypeString;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  photoURL?: string;
  location?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  stats?: {
    followers: number;
    following: number;
    posts: number;
  };
}

/**
 * User Profile Update
 * Partial type for updating user profile
 */
export interface UserProfileUpdate {
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  photoURL?: string;
  location?: string;
  userType?: UserType | UserTypeString;
}

/**
 * User Type Permissions
 * Defines what each user type can do
 */
export interface UserTypePermissions {
  canUploadOutfits: boolean;
  canSellItems: boolean;
  canAccessPremiumFeatures: boolean;
  canModerateContent: boolean;
  maxOutfitsPerDay?: number;
  maxItemsPerOutfit?: number;
}

/**
 * Get permissions for a user type
 */
export const getUserTypePermissions = (userType: UserType | UserTypeString): UserTypePermissions => {
  switch (userType) {
    case UserType.ADMIN:
      return {
        canUploadOutfits: true,
        canSellItems: true,
        canAccessPremiumFeatures: true,
        canModerateContent: true,
        maxOutfitsPerDay: undefined, // Unlimited
        maxItemsPerOutfit: undefined // Unlimited
      };
    case UserType.PREMIUM:
      return {
        canUploadOutfits: true,
        canSellItems: true,
        canAccessPremiumFeatures: true,
        canModerateContent: false,
        maxOutfitsPerDay: 20,
        maxItemsPerOutfit: 10
      };
    case UserType.REGULAR:
      return {
        canUploadOutfits: true,
        canSellItems: false,
        canAccessPremiumFeatures: false,
        canModerateContent: false,
        maxOutfitsPerDay: 5,
        maxItemsPerOutfit: 5
      };
    case UserType.GUEST:
    default:
      return {
        canUploadOutfits: false,
        canSellItems: false,
        canAccessPremiumFeatures: false,
        canModerateContent: false,
        maxOutfitsPerDay: 0,
        maxItemsPerOutfit: 0
      };
  }
};

/**
 * Check if user type has a specific permission
 */
export const hasPermission = (
  userType: UserType | UserTypeString,
  permission: keyof UserTypePermissions
): boolean => {
  const permissions = getUserTypePermissions(userType);
  return permissions[permission] === true;
};

/**
 * Default user type for new signups
 */
export const DEFAULT_USER_TYPE: UserType = UserType.REGULAR;

