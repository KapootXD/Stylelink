import React, { createContext, useContext, useState, ReactNode } from 'react';

// User type definition
export interface User {
  id: string;
  displayName: string;
  username: string;
  bio: string;
  profilePicture: string;
  location: string;
  joinDate: string;
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  isOwnProfile: boolean;
}

// User context type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// User provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock user data - replace with actual authentication logic
  const [user, setUser] = useState<User | null>({
    id: '1',
    displayName: 'Alex Chen',
    username: '@alexstyle',
    bio: 'Fashion enthusiast sharing authentic streetwear from Tokyo to NYC. Always on the hunt for unique local brands! 🌟',
    profilePicture: '/api/placeholder/150/150',
    location: 'Tokyo, Japan',
    joinDate: 'March 2023',
    stats: {
      followers: 2847,
      following: 156,
      posts: 42
    },
    isOwnProfile: true
  });

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value: UserContextType = {
    user,
    setUser,
    updateUser,
    isLoggedIn: !!user,
    login,
    logout
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
