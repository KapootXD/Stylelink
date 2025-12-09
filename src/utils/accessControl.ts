/**
 * Access Control Utilities for StyleLink
 *
 * Provides functions to check user permissions and access rights
 * based on user types (Admin, Premium, Seller, Customer, Guest)
 */

import { UserType, UserTypeString } from '../types/user';

/**
 * Feature types that can be protected
 */
export type FeatureType =
  | 'premium' // Premium features (Premium users + Admin)
  | 'admin' // Admin-only features
  | 'upload' // Upload functionality
  | 'sell' // Sell items
  | 'edit' // Edit content
  | 'delete' // Delete content
  | 'moderate' // Content moderation
  | 'analytics' // Advanced analytics
  | 'userManagement' // User management
  | 'settings' // Settings access
  | 'basic'; // Basic features (all logged-in users)

type AccountRole = 'customer' | 'seller';

type UserContext = {
  normalizedType: UserType;
  accountRole: AccountRole;
};

/**
 * Normalize user type to enum value for consistent comparison and preserve account role
 * Supports legacy roles for backward compatibility
 */
const resolveUserContext = (
  userType: UserType | UserTypeString | null | undefined,
  accountRole: AccountRole = 'customer'
): UserContext => {
  if (!userType) {
    return { normalizedType: UserType.GUEST, accountRole };
  }

  switch (userType) {
    case UserType.GUEST:
    case 'guest':
      return { normalizedType: UserType.GUEST, accountRole: 'customer' };
    case UserType.ADMIN:
    case 'admin':
      return { normalizedType: UserType.ADMIN, accountRole };
    case UserType.PREMIUM:
    case 'premium':
      return { normalizedType: UserType.PREMIUM, accountRole };
    case UserType.SELLER:
    case 'seller':
      return { normalizedType: UserType.SELLER, accountRole: 'seller' };
    case UserType.CUSTOMER:
    case 'customer':
      return { normalizedType: UserType.CUSTOMER, accountRole: 'customer' };
    default:
      return { normalizedType: UserType.GUEST, accountRole };
  }
};

/**
 * Check if a user type can access a specific feature
 *
 * @param userType - The user type to check
 * @param feature - The feature to check access for
 * @param accountRole - Whether the account was created as a seller or customer
 * @returns true if the user can access the feature, false otherwise
 */
export const canAccessFeature = (
  userType: UserType | UserTypeString | null | undefined,
  feature: FeatureType,
  accountRole: AccountRole = 'customer'
): boolean => {
  const { normalizedType, accountRole: resolvedRole } = resolveUserContext(userType, accountRole);
  const role = resolvedRole;
  const type: UserType = normalizedType;

  switch (feature) {
    case 'basic':
      return true;

    case 'premium':
      return type === UserType.PREMIUM || type === UserType.ADMIN;

    case 'analytics':
      return type === UserType.ADMIN || (type === UserType.PREMIUM && role === 'seller');

    case 'admin':
    case 'userManagement':
    case 'moderate':
      return type === UserType.ADMIN;

    case 'upload':
      return (
        type !== UserType.GUEST &&
        (type === UserType.CUSTOMER ||
          type === UserType.SELLER ||
          type === UserType.PREMIUM ||
          type === UserType.ADMIN)
      );

    case 'sell':
      return type === UserType.ADMIN || type === UserType.SELLER || (type === UserType.PREMIUM && role === 'seller');

    case 'edit':
      return type !== UserType.GUEST;

    case 'delete':
      return type !== UserType.GUEST;

    case 'settings':
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
  const { normalizedType } = resolveUserContext(userType);
  return normalizedType === UserType.ADMIN;
};

/**
 * Check if a user type is Premium
 *
 * @param userType - The user type to check
 * @returns true if the user is Premium or Admin, false otherwise
 */
export const isPremium = (userType: UserType | UserTypeString | null | undefined): boolean => {
  const { normalizedType } = resolveUserContext(userType);
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

  [UserType.ADMIN, UserType.PREMIUM, UserType.SELLER, UserType.CUSTOMER, UserType.GUEST].forEach(userType => {
    if (canAccessFeature(userType, feature, userType === UserType.SELLER ? 'seller' : 'customer')) {
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
 * @param accountRole - Whether the account was created as a seller or customer
 * @returns A message explaining why the feature is locked
 */
export const getLockedFeatureMessage = (
  feature: FeatureType,
  currentUserType: UserType | UserTypeString | null | undefined,
  accountRole: AccountRole = 'customer'
): string => {
  const { normalizedType, accountRole: resolvedRole } = resolveUserContext(currentUserType, accountRole);

  if (normalizedType === UserType.GUEST) {
    return 'Please sign up or log in to access this feature.';
  }

  switch (feature) {
    case 'premium':
      return 'Upgrade to Premium to access this feature.';

    case 'analytics':
      if (resolvedRole === 'seller') {
        return 'Upgrade to Premium to unlock advanced seller analytics.';
      }
      return 'Analytics are available for Premium seller accounts.';

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

