/**
 * Access Control Utilities for StyleLink
 * 
 * Provides functions to check user permissions and access rights
 * based on user types (Admin, Premium, Regular, Guest)
 */

import { UserType, UserTypeString } from '../types/user';

/**
 * Feature types that can be protected
 */
export type FeatureType = 
  | 'premium'           // Premium features (Premium + Admin)
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
 * Since UserType enum values are string enums matching the string literals,
 * we can safely convert between them
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
    case UserType.PREMIUM:
    case 'premium':
      return UserType.PREMIUM;
    case UserType.REGULAR:
    case 'regular':
      return UserType.REGULAR;
    case UserType.GUEST:
    case 'guest':
      return UserType.GUEST;
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
      // Premium and Admin can access premium features
      return type === UserType.PREMIUM || type === UserType.ADMIN;
    
    case 'admin':
    case 'userManagement':
    case 'moderate':
      // Only Admin can access admin features
      return type === UserType.ADMIN;
    
    case 'upload':
      // Regular, Premium, and Admin can upload
      return type === UserType.REGULAR || 
             type === UserType.PREMIUM || 
             type === UserType.ADMIN;
    
    case 'sell':
      // Premium and Admin can sell
      return type === UserType.PREMIUM || type === UserType.ADMIN;
    
    case 'edit':
      // All logged-in users except guests can edit
      return type !== UserType.GUEST;
    
    case 'delete':
      // Regular, Premium, and Admin can delete (their own content)
      // Admin can delete any content
      return type === UserType.REGULAR || 
             type === UserType.PREMIUM || 
             type === UserType.ADMIN;
    
    case 'settings':
      // All logged-in users can access settings
      return type !== UserType.GUEST;
    
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
 * Check if a user type is Premium
 * 
 * @param userType - The user type to check
 * @returns true if the user is Premium or Admin, false otherwise
 */
export const isPremium = (userType: UserType | UserTypeString | null | undefined): boolean => {
  const normalizedType = normalizeUserType(userType);
  return normalizedType === UserType.PREMIUM || normalizedType === UserType.ADMIN;
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
  
  [UserType.ADMIN, UserType.PREMIUM, UserType.REGULAR, UserType.GUEST].forEach(userType => {
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
  if (!normalizedType || normalizedType === UserType.GUEST) {
    return 'Please sign up or log in to access this feature.';
  }

  switch (feature) {
    case 'premium':
    case 'analytics':
      return 'Upgrade to Premium to access this feature.';
    
    case 'admin':
    case 'userManagement':
    case 'moderate':
      return 'This feature is only available to administrators.';
    
    case 'sell':
      return 'Upgrade to Premium to sell items.';
    
    default:
      return 'You do not have permission to access this feature.';
  }
};

