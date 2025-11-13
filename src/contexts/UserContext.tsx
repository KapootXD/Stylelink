import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { AppUser, UserType } from '../types/user';

// User context type
interface UserContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  updateUser: (updates: Partial<AppUser>) => void;
  isLoggedIn: boolean;
  userType: UserType | string | null;
  login: (user: AppUser) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// User provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userProfile, currentUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<AppUser | null>(null);

  // Sync user profile from AuthContext
  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    } else {
      setUser(null);
    }
  }, [userProfile]);

  const updateUser = (updates: Partial<AppUser>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const login = (userData: AppUser) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value: UserContextType = {
    user,
    setUser,
    updateUser,
    isLoggedIn: !!user && !!currentUser,
    userType: user?.userType || null,
    login,
    logout,
    isLoading: authLoading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
