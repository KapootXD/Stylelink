import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAuthInitialized } from '../config/firebase';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * ProtectedRoute component that redirects to login if user is not authenticated
 * Shows loading spinner while checking authentication state
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const authAvailable = isAuthInitialized();

  // Default to guest/demo access unless explicitly forced
  const requireAuth = process.env.REACT_APP_REQUIRE_AUTH === 'true';
  const isGuestMode =
    !requireAuth ||
    !authAvailable ||
    process.env.REACT_APP_ALLOW_GUEST_MODE === 'true' ||
    process.env.NODE_ENV !== 'production';

  if (isGuestMode) {
    return children;
  }

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF3E0]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  // Save the attempted location so we can redirect back after login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected route
  return children;
};

export default ProtectedRoute;

