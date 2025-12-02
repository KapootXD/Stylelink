/**
 * ProtectedFeature Component
 * 
 * A component that conditionally renders content based on user access permissions.
 * Shows children if user has required access, otherwise shows a fallback message
 * or upgrade prompt.
 */

import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Crown, Shield, ArrowRight } from 'lucide-react';
import { useAccessControl } from '../hooks/useAccessControl';
import { FeatureType } from '../utils/accessControl';
import { UserType } from '../types/user';
import Button from './Button';

export interface ProtectedFeatureProps {
  /** Feature type to check access for */
  requiredUserTypes?: UserType[];
  /** Feature type to check (alternative to requiredUserTypes) */
  feature?: FeatureType;
  /** Content to show if user has access */
  children: ReactNode;
  /** Custom fallback content to show if user doesn't have access */
  fallback?: ReactNode;
  /** Show upgrade prompt if locked */
  showUpgradePrompt?: boolean;
  /** Custom message to show when locked */
  lockedMessage?: string;
  /** Whether to hide content completely or show fallback */
  hideContent?: boolean;
}

/**
 * ProtectedFeature Component
 * 
 * Renders children only if user has the required access level.
 * Otherwise shows a fallback message or upgrade prompt.
 */
const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({
  requiredUserTypes,
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  lockedMessage,
  hideContent = false
}) => {
  const { canAccess, userType, isLoggedIn, getLockedMessage } = useAccessControl();

  // Determine if user has access
  let hasAccess = false;

  if (feature) {
    // Check access using feature type
    hasAccess = canAccess(feature);
  } else if (requiredUserTypes && userType) {
    // Check access using required user types
    hasAccess = requiredUserTypes.includes(userType as UserType);
  } else {
    // Default: require login
    hasAccess = isLoggedIn;
  }

  // If user has access, show children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If hideContent is true, don't render anything
  if (hideContent) {
    return null;
  }

  // Use custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Generate locked message
  const message = lockedMessage || (feature ? getLockedMessage(feature) : 'You do not have permission to access this feature.');

  // Determine what type of upgrade prompt to show
  const needsLogin = !isLoggedIn;
  const needsPremium = feature === 'premium' || feature === 'analytics';
  const needsSeller = feature === 'sell';
  const needsAdmin = feature === 'admin' || feature === 'userManagement' || feature === 'moderate';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          {needsAdmin ? (
            <Shield className="w-8 h-8 text-gray-400" />
          ) : needsPremium || needsSeller ? (
            <Crown className="w-8 h-8 text-yellow-500" />
          ) : (
            <Lock className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Message */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {needsLogin
            ? 'Sign In Required'
            : needsPremium
              ? 'Seller Premium Feature'
              : needsSeller
                ? 'Seller Feature'
                : needsAdmin
                  ? 'Admin Only'
                  : 'Access Restricted'}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          {message}
        </p>

        {/* Action Buttons */}
        {showUpgradePrompt && (
          <div className="flex flex-col sm:flex-row gap-3">
            {needsLogin ? (
              <>
                <Link to="/login">
                  <Button variant="primary" className="flex items-center">
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="secondary" className="flex items-center">
                    Create Account
                  </Button>
                </Link>
              </>
            ) : needsPremium ? (
              <>
                <Link to="/settings">
                  <Button variant="primary" className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Seller Premium
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="secondary" className="flex items-center">
                    Learn More
                  </Button>
                </Link>
              </>
            ) : needsSeller ? (
              <Link to="/settings">
                <Button variant="primary" className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Become a Seller
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link to="/">
                <Button variant="secondary" className="flex items-center">
                  Go Home
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtectedFeature;

