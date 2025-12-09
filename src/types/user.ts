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
  GUEST = 'guest',
  ADMIN = 'admin',
  PREMIUM = 'premium',
  SELLER = 'seller',
  CUSTOMER = 'customer'
}

/**
 * User Type as string literal union
 * Alternative to enum for type checking
 */
export type UserTypeString =
  | 'guest'
  | 'admin'
  | 'premium'
  | 'seller'
  | 'customer';

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
  /** Tracks whether the account was originally created as a customer or a seller */
  accountRole?: 'customer' | 'seller';
  username?: string;
  usernameChangeCount?: number;
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
  accountRole?: 'customer' | 'seller';
  username?: string;
  usernameChangeCount?: number;
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
  accountRole?: 'customer' | 'seller';
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
export const getUserTypePermissions = (
  userType: UserType | UserTypeString,
  accountRole: 'customer' | 'seller' = 'customer'
): UserTypePermissions => {
  switch (userType) {
    case UserType.GUEST:
    case 'guest':
      return {
        canUploadOutfits: false,
        canSellItems: false,
        canAccessPremiumFeatures: false,
        canModerateContent: false,
        maxOutfitsPerDay: 0,
        maxItemsPerOutfit: 0
      };
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
    case 'premium':
      return {
        canUploadOutfits: true,
        canSellItems: accountRole === 'seller',
        canAccessPremiumFeatures: true,
        canModerateContent: false,
        maxOutfitsPerDay: accountRole === 'seller' ? 20 : 10,
        maxItemsPerOutfit: accountRole === 'seller' ? 10 : 8
      };
    case UserType.SELLER:
    case 'seller':
      return {
        canUploadOutfits: true,
        canSellItems: true,
        canAccessPremiumFeatures: false,
        canModerateContent: false,
        maxOutfitsPerDay: 10,
        maxItemsPerOutfit: 8
      };
    case UserType.CUSTOMER:
    case 'customer':
    default:
      return {
        canUploadOutfits: true,
        canSellItems: false,
        canAccessPremiumFeatures: false,
        canModerateContent: false,
        maxOutfitsPerDay: 5,
        maxItemsPerOutfit: 5
      };
  }
};

/**
 * Check if user type has a specific permission
 */
export const hasPermission = (
  userType: UserType | UserTypeString,
  permission: keyof UserTypePermissions,
  accountRole: 'customer' | 'seller' = 'customer'
): boolean => {
  const permissions = getUserTypePermissions(userType, accountRole);
  return permissions[permission] === true;
};

/**
 * Default user type for new signups
 */
export const DEFAULT_USER_TYPE: UserType = UserType.GUEST;

/**
 * Default user type for registered accounts
 */
export const REGISTERED_DEFAULT_USER_TYPE: UserType = UserType.CUSTOMER;

