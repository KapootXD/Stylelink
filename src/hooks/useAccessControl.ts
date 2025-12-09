/**
 * useAccessControl Hook
 * 
 * Custom React hook that provides access control utilities
 * based on the current user's type from authentication context
 */

import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserType, UserTypeString } from '../types/user';
import {
  canAccessFeature,
  isAdmin as checkIsAdmin,
  isPremium as checkIsPremium,
  canEdit as checkCanEdit,
  canDelete as checkCanDelete,
  FeatureType,
  getLockedFeatureMessage
} from '../utils/accessControl';

/**
 * Return type for useAccessControl hook
 */
export interface UseAccessControlReturn {
  /** Current user type */
  userType: UserType | UserTypeString | null;
  /** Check if user can access a specific feature */
  canAccess: (feature: FeatureType) => boolean;
  /** Check if user is an Admin */
  isAdmin: () => boolean;
  /** Check if user is Seller Premium (or Admin) */
  isPremium: () => boolean;
  /** Check if user can edit content */
  canEdit: () => boolean;
  /** Check if user can delete content */
  canDelete: () => boolean;
  /** Get locked feature message */
  getLockedMessage: (feature: FeatureType) => string;
  /** Check if user is logged in */
  isLoggedIn: boolean;
}

/**
 * Custom hook for access control
 * 
 * @returns Access control utilities based on current user
 */
export const useAccessControl = (): UseAccessControlReturn => {
  const { userProfile, currentUser } = useAuth();

  const userType = useMemo(() => {
    return userProfile?.userType || null;
  }, [userProfile]);

  const accountRole = useMemo(() => {
    if (userProfile?.accountRole) {
      return userProfile.accountRole;
    }

    if (userProfile?.userType === UserType.SELLER || userProfile?.userType === 'seller') {
      return 'seller';
    }

    return 'customer' as const;
  }, [userProfile]);

  const isLoggedIn = useMemo(() => {
    return !!currentUser && !!userProfile;
  }, [currentUser, userProfile]);

  const canAccess = useMemo(() => {
    return (feature: FeatureType): boolean => {
      return canAccessFeature(userType, feature, accountRole);
    };
  }, [accountRole, userType]);

  const isAdmin = useMemo(() => {
    return (): boolean => {
      return checkIsAdmin(userType);
    };
  }, [userType]);

  const isPremium = useMemo(() => {
    return (): boolean => {
      return checkIsPremium(userType);
    };
  }, [userType]);

  const canEdit = useMemo(() => {
    return (): boolean => {
      return checkCanEdit(userType);
    };
  }, [userType]);

  const canDelete = useMemo(() => {
    return (): boolean => {
      return checkCanDelete(userType);
    };
  }, [userType]);

  const getLockedMessage = useMemo(() => {
    return (feature: FeatureType): string => {
      return getLockedFeatureMessage(feature, userType, accountRole);
    };
  }, [accountRole, userType]);

  return {
    userType,
    canAccess,
    isAdmin,
    isPremium,
    canEdit,
    canDelete,
    getLockedMessage,
    isLoggedIn
  };
};

