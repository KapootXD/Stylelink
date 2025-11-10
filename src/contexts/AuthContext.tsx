import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signUp, login, logout as firebaseLogout, resetPassword } from '../config/firebase';
import toast from 'react-hot-toast';

// Auth context type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Signup function
  const handleSignup = async (email: string, password: string, displayName?: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await signUp(email, password, displayName);
      toast.success('Account created successfully!');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const handleLogin = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = async (): Promise<void> => {
    try {
      setError(null);
      await firebaseLogout();
      toast.success('Logged out successfully');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Reset password function
  const handleResetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      await resetPassword(email);
      toast.success('Password reset email sent!');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Clear error function
  const clearError = (): void => {
    setError(null);
  };

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error: any): string => {
    if (!error || !error.code) {
      return 'An unexpected error occurred. Please try again.';
    }

    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or try logging in.';
      case 'auth/invalid-email':
        return 'Invalid email address. Please check your email and try again.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please check your email or sign up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/requires-recent-login':
        return 'Please log out and log back in to complete this action.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    signup: handleSignup,
    login: handleLogin,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

