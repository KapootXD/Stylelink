/**
 * Access Control Utilities for StyleLink
 * 
 * Provides functions to check user permissions and access rights
 * based on user types (Admin, Seller Premium, Seller, Buyer)
 */

import { UserType, UserTypeString } from '../types/user';

/**
 * Feature types that can be protected
 */
export type FeatureType = 
  | 'premium'           // Premium features (Seller Premium + Admin)
  | 'admin'             // Admin-only features
  | 'upload'            // Upload functionality
  | 'sell'              // Sell items
  | 'edit'              // Edit content
  | 'delete'            // Delete content
  | 'moderate'          // Content moderation
  | 'analytics'         // Advanced analytics
  | 'userManagement'   // User management
  | 'settings'          // Settings access
  | 'basic';            // Basic features (all logged-in users)

/**
 * Normalize user type to enum value for consistent comparison
 * Supports legacy roles for backward compatibility
 */
const normalizeUserType = (
  userType: UserType | UserTypeString | null | undefined
): UserType | null => {
  if (!userType) {
    return null;
  }

  // Convert to enum value (works for both enum and string literal since they match)
  switch (userType) {
    case UserType.ADMIN:
    case 'admin':
      return UserType.ADMIN;
    case UserType.SELLER_PREMIUM:
    case 'seller_premium':
    case 'premium':
      return UserType.SELLER_PREMIUM;
    case UserType.SELLER:
    case 'seller':
      return UserType.SELLER;
    case UserType.BUYER:
    case 'buyer':
    case 'regular':
      return UserType.BUYER;
    default:
      return null;
  }
};

/**
 * Check if a user type can access a specific feature
 * 
 * @param userType - The user type to check
 * @param feature - The feature to check access for
 * @returns true if the user can access the feature, false otherwise
 */
export const canAccessFeature = (
  userType: UserType | UserTypeString | null | undefined,
  feature: FeatureType
): boolean => {
  // Normalize user type to enum for consistent comparison
  const normalizedType = normalizeUserType(userType);
  
  // If no user type, handle based on feature
  if (normalizedType === null) {
    return feature === 'basic';
  }
  
  // Store the type in a way that doesn't get narrowed
  const type: UserType = normalizedType;
  
  // Check feature-specific access
  switch (feature) {
    case 'basic':
      // All logged-in users can access basic features
      return true;
    
    case 'premium':
    case 'analytics':
      // Seller Premium and Admin can access premium features
      return type === UserType.SELLER_PREMIUM || type === UserType.ADMIN;

    case 'admin':
    case 'userManagement':
    case 'moderate':
      // Only Admin can access admin features
      return type === UserType.ADMIN;

    case 'upload':
      // Buyers, Sellers, Seller Premium, and Admin can upload
      return type === UserType.BUYER ||
             type === UserType.SELLER ||
             type === UserType.SELLER_PREMIUM ||
             type === UserType.ADMIN;

    case 'sell':
      // Sellers, Seller Premium, and Admin can sell
      return type === UserType.SELLER || type === UserType.SELLER_PREMIUM || type === UserType.ADMIN;

    case 'edit':
      // All logged-in users except guests can edit
      return true;

    case 'delete':
      // All logged-in users can delete their own content, Admin can delete any content
      return true;

    case 'settings':
      // All logged-in users can access settings
      return true;
    
    default:
      return false;
  }
};

/**
 * Check if a user type is an Admin
 * 
 * @param userType - The user type to check
 * @returns true if the user is an Admin, false otherwise
 */
export const isAdmin = (userType: UserType | UserTypeString | null | undefined): boolean => {
  const normalizedType = normalizeUserType(userType);
  return normalizedType === UserType.ADMIN;
};

/**
 * Check if a user type is Seller Premium
 *
 * @param userType - The user type to check
 * @returns true if the user is Seller Premium or Admin, false otherwise
 */
export const isPremium = (userType: UserType | UserTypeString | null | undefined): boolean => {
  const normalizedType = normalizeUserType(userType);
  return normalizedType === UserType.SELLER_PREMIUM || normalizedType === UserType.ADMIN;
};

/**
 * Check if a user type can edit content
 * 
 * @param userType - The user type to check
 * @returns true if the user can edit, false otherwise
 */
export const canEdit = (userType: UserType | UserTypeString | null | undefined): boolean => {
  return canAccessFeature(userType, 'edit');
};

/**
 * Check if a user type can delete content
 * 
 * @param userType - The user type to check
 * @returns true if the user can delete, false otherwise
 */
export const canDelete = (userType: UserType | UserTypeString | null | undefined): boolean => {
  return canAccessFeature(userType, 'delete');
};

/**
 * Get a list of user types that can access a feature
 * 
 * @param feature - The feature to check
 * @returns Array of user types that can access the feature
 */
export const getAllowedUserTypes = (feature: FeatureType): UserType[] => {
  const allowed: UserType[] = [];

  [UserType.ADMIN, UserType.SELLER_PREMIUM, UserType.SELLER, UserType.BUYER].forEach(userType => {
    if (canAccessFeature(userType, feature)) {
      allowed.push(userType);
    }
  });

  return allowed;
};

/**
 * Get a user-friendly message for why a feature is locked
 * 
 * @param feature - The feature that is locked
 * @param currentUserType - The current user's type
 * @returns A message explaining why the feature is locked
 */
export const getLockedFeatureMessage = (
  feature: FeatureType,
  currentUserType: UserType | UserTypeString | null | undefined
): string => {
  const normalizedType = normalizeUserType(currentUserType);
  if (!normalizedType) {
    return 'Please sign up or log in to access this feature.';
  }

  switch (feature) {
    case 'premium':
    case 'analytics':
      return 'Upgrade to Seller Premium to access this feature.';
    
    case 'admin':
    case 'userManagement':
    case 'moderate':
      return 'This feature is only available to administrators.';
    
    case 'sell':
      return 'Switch to a seller account to list items.';
    
    default:
      return 'You do not have permission to access this feature.';
  }
};

