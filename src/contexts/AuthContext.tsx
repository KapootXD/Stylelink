import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signUp, login, logout as firebaseLogout, resetPassword, getUserProfile, updateUserType, isAuthInitialized } from '../config/firebase';
import { AppUser, DEFAULT_USER_TYPE, UserType } from '../types/user';
import toast from 'react-hot-toast';

// Auth context type
interface AuthContextType {
  currentUser: User | null;
  userProfile: AppUser | null;
  loading: boolean;
  error: string | null;
  authReady: boolean;
  usingDemoAuth: boolean;
  signup: (email: string, password: string, userType: 'customer' | 'seller', displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserType: (userType: UserType | string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const demoAuthEnabled =
    process.env.REACT_APP_ALLOW_GUEST_MODE === 'true' ||
    process.env.NODE_ENV !== 'production';

  const demoCredentials = {
    email: process.env.REACT_APP_DEMO_EMAIL || 'tester@example.com',
    password: process.env.REACT_APP_DEMO_PASSWORD || 'P@ssword1234!',
  };

  const createDemoUser = (email: string): User =>
    ({
      uid: 'demo-user',
      email,
      displayName: email?.split('@')[0] || 'Demo User',
      emailVerified: true,
      isAnonymous: false,
      providerData: [],
      metadata: {} as any,
      providerId: 'password',
      refreshToken: '',
      phoneNumber: null,
      photoURL: null,
      tenantId: null,
      delete: async () => Promise.resolve(),
      getIdToken: async () => Promise.resolve('demo-token'),
      getIdTokenResult: async () => Promise.resolve({} as any),
      reload: async () => Promise.resolve(),
      toJSON: () => ({
        uid: 'demo-user',
        email,
        displayName: 'Demo User',
        emailVerified: true,
        isAnonymous: false,
        providerData: [],
        metadata: {},
        providerId: 'password',
        refreshToken: '',
        phoneNumber: null,
        photoURL: null,
        tenantId: null,
      }),
    } as User);

  const createDemoProfile = (uid: string, email: string): AppUser => ({
    uid,
    email,
    emailVerified: true,
    displayName: 'Demo User',
    photoURL: null,
    userType: DEFAULT_USER_TYPE,
    createdAt: new Date(),
    isOwnProfile: true,
  });

  const authReady = isAuthInitialized() && !!auth;
  const usingDemoAuth = !authReady && demoAuthEnabled;

  // Fetch user profile from Firestore
  const fetchUserProfile = async (user: User | null): Promise<void> => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      // Set default profile if fetch fails
      setUserProfile({
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
        profilePicture: user.photoURL || undefined, // Map photoURL to profilePicture
        userType: UserType.BUYER,
        createdAt: new Date(),
        isOwnProfile: true
      });
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // Check if Firebase Auth is initialized
    const authInstance = auth;

    if (!isAuthInitialized() || !authInstance) {
      console.warn('Firebase Auth is not initialized. Authentication features will not work.');
      setLoading(false);
      return;
    }

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(
      authInstance,
      async (user) => {
        setCurrentUser(user);
        setError(null);
        
        // Fetch user profile when user logs in
        if (user) {
          setLoading(true);
          await fetchUserProfile(user);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
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
  const handleSignup = async (
    email: string,
    password: string,
    userType: 'customer' | 'seller',
    displayName?: string
  ): Promise<void> => {
    try {
      setError(null);
      setLoading(true);

      // If Firebase isn't initialized (e.g., in local demo/test mode), simulate a signup so flows still work
      if (!authReady) {
        if (!demoAuthEnabled) {
          throw new Error('Authentication is not configured. Please add your Firebase credentials to .env');
        }

        const mockUser = {
          uid: `mock-${Date.now()}`,
          email,
          emailVerified: true,
          displayName: displayName || email,
          photoURL: null,
        } as unknown as User;
        const normalizedUserType = userType === 'seller' ? UserType.SELLER : UserType.BUYER;

        setCurrentUser(mockUser);
        setUserProfile({
          uid: mockUser.uid,
          email: mockUser.email,
          emailVerified: mockUser.emailVerified,
          displayName: mockUser.displayName,
          photoURL: mockUser.photoURL,
          profilePicture: mockUser.photoURL || undefined,
          userType: normalizedUserType,
          createdAt: new Date(),
          isOwnProfile: true,
        });

        toast.success('Account created successfully! (demo mode)');
        return;
      }

      const userCredential = await signUp(email, password, userType, displayName);

      // Fetch user profile after signup
      if (userCredential.user) {
        await fetchUserProfile(userCredential.user);
      }
      
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

      // Allow demo/guest login when Firebase isn't configured (used in local/E2E environments)
      if (!authReady) {
        if (!demoAuthEnabled) {
          const errorMessage = 'Authentication is not configured. Please add your Firebase credentials to .env';
          setError(errorMessage);
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }

        if (!email || !password) {
          const errorMessage = 'Email and password are required to sign in.';
          setError(errorMessage);
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }

        const demoUser = createDemoUser(email);
        setCurrentUser(demoUser);
        setUserProfile(createDemoProfile(demoUser.uid, email));
        toast.success('Signed in with demo auth (no Firebase config detected)');
        return;
      }

      const userCredential = await login(email, password);

      // Fetch user profile after login
      if (userCredential.user) {
        await fetchUserProfile(userCredential.user);
      }
      
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
      setUserProfile(null);
      toast.success('Logged out successfully');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update user type function
  const handleUpdateUserType = async (newUserType: UserType | string): Promise<void> => {
    if (!currentUser) {
      throw new Error('No user is currently signed in.');
    }

    try {
      setError(null);
      setLoading(true);
      await updateUserType(currentUser.uid, newUserType);
      
      // Refresh user profile
      await fetchUserProfile(currentUser);
      
      toast.success('User type updated successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update user type. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user profile function
  const handleRefreshUserProfile = async (): Promise<void> => {
    if (!currentUser) {
      return;
    }

    try {
      await fetchUserProfile(currentUser);
    } catch (err: any) {
      console.error('Error refreshing user profile:', err);
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
    userProfile,
    loading,
    error,
    authReady,
    usingDemoAuth,
    signup: handleSignup,
    login: handleLogin,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    updateUserType: handleUpdateUserType,
    refreshUserProfile: handleRefreshUserProfile,
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

