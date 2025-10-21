// localStorage utility functions for data persistence

interface PersistedData {
  likedPosts: string[];
  savedPosts: string[];
  comments: {[outfitId: string]: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string;
  }>};
  lastVisit: string;
  userPreferences: {
    theme: string;
    notifications: boolean;
  };
}

const STORAGE_KEY = 'stylelink_user_data';

// Initialize default data structure
const defaultData: PersistedData = {
  likedPosts: [],
  savedPosts: [],
  comments: {},
  lastVisit: new Date().toISOString(),
  userPreferences: {
    theme: 'light',
    notifications: true
  }
};

// Get data from localStorage
export const getPersistedData = (): PersistedData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new fields
      return { ...defaultData, ...parsed };
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  return defaultData;
};

// Save data to localStorage
export const savePersistedData = (data: PersistedData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Update specific data and save
export const updatePersistedData = (updates: Partial<PersistedData>): PersistedData => {
  const currentData = getPersistedData();
  const updatedData = { ...currentData, ...updates };
  savePersistedData(updatedData);
  return updatedData;
};

// Clear all persisted data
export const clearPersistedData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Utility functions for specific data types
export const saveLikedPosts = (likedPosts: Set<string>): void => {
  updatePersistedData({
    likedPosts: Array.from(likedPosts)
  });
};

export const saveSavedPosts = (savedPosts: Set<string>): void => {
  updatePersistedData({
    savedPosts: Array.from(savedPosts)
  });
};

export const saveComments = (comments: {[outfitId: string]: Array<{
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}>}): void => {
  updatePersistedData({ comments });
};

export const saveUserPreferences = (preferences: PersistedData['userPreferences']): void => {
  updatePersistedData({ userPreferences: preferences });
};

// Get specific data
export const getLikedPosts = (): Set<string> => {
  const data = getPersistedData();
  return new Set(data.likedPosts);
};

export const getSavedPosts = (): Set<string> => {
  const data = getPersistedData();
  return new Set(data.savedPosts);
};

export const getComments = (): {[outfitId: string]: Array<{
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}>} => {
  const data = getPersistedData();
  return data.comments;
};

export const getUserPreferences = (): PersistedData['userPreferences'] => {
  const data = getPersistedData();
  return data.userPreferences;
};

// Update last visit timestamp
export const updateLastVisit = (): void => {
  updatePersistedData({
    lastVisit: new Date().toISOString()
  });
};

// Check if this is the first visit
export const isFirstVisit = (): boolean => {
  const data = getPersistedData();
  return data.lastVisit === defaultData.lastVisit;
};

// Get storage usage info
export const getStorageInfo = (): { used: number; available: number } => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const used = data ? new Blob([data]).size : 0;
    // Most browsers allow ~5-10MB for localStorage
    const available = 10 * 1024 * 1024; // 10MB estimate
    return { used, available };
  } catch (error) {
    return { used: 0, available: 0 };
  }
};
