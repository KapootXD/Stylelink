import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch,
  increment,
  Firestore
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  OutfitUpload,
  UserProfile,
  ClothingItem,
  StyleAnalysis,
  UserInput,
  SearchFilters
} from '../types';

// Collection names
const COLLECTIONS = {
  OUTFITS: 'outfits',
  USERS: 'users',
  CLOTHING_ITEMS: 'clothingItems',
  STYLE_ANALYSIS: 'styleAnalysis',
  LIKES: 'likes',
  SHARES: 'shares'
} as const;

// Helper function to ensure Firebase is initialized
const ensureDb = (): Firestore => {
  if (!db) {
    throw new Error('Firebase is not initialized. Please check your Firebase configuration.');
  }
  return db;
};

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return timestamp.toDate();
};

// Helper function to convert Date to Firestore timestamp
const convertToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Helper function to convert Firestore document to OutfitUpload
const convertToOutfitUpload = (doc: QueryDocumentSnapshot<DocumentData>): OutfitUpload => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    title: data.title,
    description: data.description,
    occasion: data.occasion,
    season: data.season,
    styleTags: data.styleTags || [],
    items: data.items || [],
    mainImageUrl: data.mainImageUrl,
    additionalImages: data.additionalImages || [],
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
    likes: data.likes || 0,
    shares: data.shares || 0,
    isPublic: data.isPublic ?? true
  };
};

// Helper function to convert OutfitUpload to Firestore document
const convertOutfitToFirestore = (outfit: Partial<OutfitUpload>): DocumentData => {
  const data: DocumentData = {
    userId: outfit.userId,
    title: outfit.title,
    description: outfit.description,
    occasion: outfit.occasion,
    season: outfit.season,
    styleTags: outfit.styleTags || [],
    items: outfit.items || [],
    mainImageUrl: outfit.mainImageUrl,
    additionalImages: outfit.additionalImages || [],
    likes: outfit.likes || 0,
    shares: outfit.shares || 0,
    isPublic: outfit.isPublic ?? true
  };

  if (outfit.createdAt) {
    data.createdAt = convertToTimestamp(outfit.createdAt);
  }
  if (outfit.updatedAt) {
    data.updatedAt = convertToTimestamp(outfit.updatedAt);
  }

  return data;
};

/**
 * Get outfit by ID
 */
export const getOutfitById = async (outfitId: string): Promise<OutfitUpload | null> => {
  try {
    const firestoreDb = ensureDb();
    const outfitRef = doc(firestoreDb, COLLECTIONS.OUTFITS, outfitId);
    const outfitSnap = await getDoc(outfitRef);

    if (outfitSnap.exists()) {
      return convertToOutfitUpload(outfitSnap as QueryDocumentSnapshot<DocumentData>);
    }
    return null;
  } catch (error) {
    console.error('Error getting outfit:', error);
    throw error;
  }
};

/**
 * Get all outfits with optional filters and pagination
 */
export const getOutfits = async (
  filters: SearchFilters = {},
  page: number = 1,
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ outfits: OutfitUpload[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null; hasMore: boolean }> => {
  try {
    const firestoreDb = ensureDb();
    let q = query(collection(firestoreDb, COLLECTIONS.OUTFITS));

    // Apply filters
    if (filters.occasion) {
      q = query(q, where('occasion', '==', filters.occasion));
    }
    if (filters.season) {
      q = query(q, where('season', '==', filters.season));
    }
    if (filters.styleTags && filters.styleTags.length > 0) {
      q = query(q, where('styleTags', 'array-contains-any', filters.styleTags));
    }
    if (filters.brands && filters.brands.length > 0) {
      // For brands, we need to check items array - this is a simplified version
      // In a real app, you might want to denormalize or use a different query structure
    }

    // Order by creation date (newest first)
    q = query(q, orderBy('createdAt', 'desc'));

    // Apply pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    q = query(q, limit(pageSize));

    const querySnapshot = await getDocs(q);
    const outfits: OutfitUpload[] = [];
    let lastDocument: QueryDocumentSnapshot<DocumentData> | null = null;

    querySnapshot.forEach((doc) => {
      outfits.push(convertToOutfitUpload(doc));
      lastDocument = doc;
    });

    const hasMore = querySnapshot.size === pageSize;

    return { outfits, lastDoc: lastDocument, hasMore };
  } catch (error) {
    console.error('Error getting outfits:', error);
    throw error;
  }
};

/**
 * Search outfits by text query
 */
export const searchOutfitsByText = async (
  searchQuery: string,
  filters: SearchFilters = {},
  page: number = 1,
  pageSize: number = 10
): Promise<{ outfits: OutfitUpload[]; totalCount: number; hasMore: boolean }> => {
  try {
    // Firestore doesn't support full-text search natively
    // For now, we'll fetch all outfits and filter in memory
    // For production, consider using Algolia or Firebase Extensions for full-text search
    const { outfits, hasMore } = await getOutfits(filters, page, pageSize);

    let filteredOutfits = outfits;

    // Apply text search filter
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      filteredOutfits = outfits.filter(
        (outfit) =>
          outfit.title.toLowerCase().includes(queryLower) ||
          outfit.description.toLowerCase().includes(queryLower) ||
          outfit.styleTags.some((tag) => tag.toLowerCase().includes(queryLower))
      );
    }

    return {
      outfits: filteredOutfits,
      totalCount: filteredOutfits.length,
      hasMore
    };
  } catch (error) {
    console.error('Error searching outfits:', error);
    throw error;
  }
};

/**
 * Create a new outfit
 */
export const createOutfit = async (userInput: UserInput, userId: string): Promise<OutfitUpload> => {
  try {
    const firestoreDb = ensureDb();
    const now = new Date();
    const outfitData: Partial<OutfitUpload> = {
      userId,
      title: userInput.title,
      description: userInput.description,
      occasion: userInput.occasion,
      season: userInput.season,
      styleTags: userInput.styleTags,
      items: userInput.items.map((item, index) => ({
        ...item,
        id: `item-${Date.now()}-${index}`
      })) as ClothingItem[],
      mainImageUrl: userInput.mainImageUrl,
      additionalImages: userInput.additionalImages || [],
      createdAt: now,
      updatedAt: now,
      likes: 0,
      shares: 0,
      isPublic: userInput.isPublic ?? true
    };

    const outfitRef = await addDoc(collection(firestoreDb, COLLECTIONS.OUTFITS), convertOutfitToFirestore(outfitData));
    const newOutfit = await getOutfitById(outfitRef.id);

    if (!newOutfit) {
      throw new Error('Failed to create outfit');
    }

    return newOutfit;
  } catch (error) {
    console.error('Error creating outfit:', error);
    throw error;
  }
};

/**
 * Update an outfit
 */
export const updateOutfit = async (outfitId: string, updates: Partial<OutfitUpload>): Promise<void> => {
  try {
    const firestoreDb = ensureDb();
    const outfitRef = doc(firestoreDb, COLLECTIONS.OUTFITS, outfitId);
    const updateData: DocumentData = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    // Convert dates to timestamps
    if (updates.createdAt) {
      updateData.createdAt = convertToTimestamp(updates.createdAt);
    }

    await updateDoc(outfitRef, updateData);
  } catch (error) {
    console.error('Error updating outfit:', error);
    throw error;
  }
};

/**
 * Delete an outfit
 */
export const deleteOutfit = async (outfitId: string): Promise<void> => {
  try {
    const firestoreDb = ensureDb();
    const outfitRef = doc(firestoreDb, COLLECTIONS.OUTFITS, outfitId);
    await deleteDoc(outfitRef);
  } catch (error) {
    console.error('Error deleting outfit:', error);
    throw error;
  }
};

/**
 * Like an outfit (increment likes count)
 */
export const likeOutfit = async (outfitId: string, userId: string): Promise<number> => {
  try {
    const firestoreDb = ensureDb();
    const outfitRef = doc(firestoreDb, COLLECTIONS.OUTFITS, outfitId);
    
    // Check if user already liked this outfit
    const likeRef = doc(firestoreDb, COLLECTIONS.LIKES, `${outfitId}_${userId}`);
    const likeSnap = await getDoc(likeRef);

    if (likeSnap.exists()) {
      // User already liked, remove like
      await deleteDoc(likeRef);
      await updateDoc(outfitRef, {
        likes: increment(-1)
      });
      
      // Get updated likes count
      const outfitSnap = await getDoc(outfitRef);
      return outfitSnap.data()?.likes || 0;
    } else {
      // Add like
      await addDoc(collection(firestoreDb, COLLECTIONS.LIKES), {
        outfitId,
        userId,
        createdAt: Timestamp.now()
      });
      await updateDoc(outfitRef, {
        likes: increment(1)
      });
      
      // Get updated likes count
      const outfitSnap = await getDoc(outfitRef);
      return outfitSnap.data()?.likes || 0;
    }
  } catch (error) {
    console.error('Error liking outfit:', error);
    throw error;
  }
};

/**
 * Share an outfit (increment shares count)
 */
export const shareOutfit = async (outfitId: string, userId: string): Promise<number> => {
  try {
    const firestoreDb = ensureDb();
    const outfitRef = doc(firestoreDb, COLLECTIONS.OUTFITS, outfitId);
    await updateDoc(outfitRef, {
      shares: increment(1)
    });

    // Record the share
    await addDoc(collection(firestoreDb, COLLECTIONS.SHARES), {
      outfitId,
      userId,
      createdAt: Timestamp.now()
    });

    // Get updated shares count
    const outfitSnap = await getDoc(outfitRef);
    return outfitSnap.data()?.shares || 0;
  } catch (error) {
    console.error('Error sharing outfit:', error);
    throw error;
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const firestoreDb = ensureDb();
    const userRef = doc(firestoreDb, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: userSnap.id,
        username: data.username,
        displayName: data.displayName,
        bio: data.bio || '',
        avatarUrl: data.avatarUrl || '',
        followers: data.followers || 0,
        following: data.following || 0,
        outfits: [], // This would be fetched separately if needed
        isVerified: data.isVerified || false,
        joinedAt: convertTimestamp(data.joinedAt)
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Create or update user profile
 */
export const upsertUserProfile = async (userProfile: Partial<UserProfile> & { id: string }): Promise<UserProfile> => {
  try {
    const firestoreDb = ensureDb();
    const userRef = doc(firestoreDb, COLLECTIONS.USERS, userProfile.id);
    const userSnap = await getDoc(userRef);

    const profileData: DocumentData = {
      username: userProfile.username,
      displayName: userProfile.displayName,
      bio: userProfile.bio || '',
      avatarUrl: userProfile.avatarUrl || '',
      followers: userProfile.followers || 0,
      following: userProfile.following || 0,
      isVerified: userProfile.isVerified || false
    };

    if (userSnap.exists()) {
      await updateDoc(userRef, profileData);
    } else {
      profileData.joinedAt = Timestamp.now();
      await updateDoc(userRef, profileData);
    }

    const updatedProfile = await getUserProfile(userProfile.id);
    if (!updatedProfile) {
      throw new Error('Failed to create/update user profile');
    }

    return updatedProfile;
  } catch (error) {
    console.error('Error upserting user profile:', error);
    throw error;
  }
};

/**
 * Batch upload outfits (for seeding data)
 */
export const batchUploadOutfits = async (outfits: OutfitUpload[]): Promise<void> => {
  try {
    const firestoreDb = ensureDb();
    const batch = writeBatch(firestoreDb);
    const outfitsCollection = collection(firestoreDb, COLLECTIONS.OUTFITS);

    outfits.forEach((outfit) => {
      const outfitRef = doc(outfitsCollection);
      batch.set(outfitRef, convertOutfitToFirestore(outfit));
    });

    await batch.commit();
  } catch (error) {
    console.error('Error batch uploading outfits:', error);
    throw error;
  }
};

/**
 * Batch upload user profiles (for seeding data)
 */
export const batchUploadUsers = async (users: UserProfile[]): Promise<void> => {
  try {
    const firestoreDb = ensureDb();
    const batch = writeBatch(firestoreDb);
    const usersCollection = collection(firestoreDb, COLLECTIONS.USERS);

    users.forEach((user) => {
      const userRef = doc(usersCollection, user.id);
      const userData: DocumentData = {
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        followers: user.followers,
        following: user.following,
        isVerified: user.isVerified,
        joinedAt: convertToTimestamp(user.joinedAt)
      };
      batch.set(userRef, userData);
    });

    await batch.commit();
  } catch (error) {
    console.error('Error batch uploading users:', error);
    throw error;
  }
};

