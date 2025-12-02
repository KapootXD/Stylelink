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
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import {
  OutfitUpload,
  UserProfile,
  ClothingItem,
  StyleAnalysis,
  UserInput,
  SearchFilters,
  ActivityInput,
  ActivityRecord
} from '../types';

// Collection names
const COLLECTIONS = {
  OUTFITS: 'outfits',
  USERS: 'users',
  CLOTHING_ITEMS: 'clothingItems',
  STYLE_ANALYSIS: 'styleAnalysis',
  LIKES: 'likes',
  SHARES: 'shares',
  ACTIVITIES: 'activities'
} as const;

// Helper function to ensure Firebase is initialized
const ensureDb = (): Firestore => {
  if (!db) {
    throw new Error('Firebase is not initialized. Please check your Firebase configuration.');
  }
  return db;
};

// Helper function to ensure Firebase Storage is initialized
const ensureStorage = () => {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized. Please check your Firebase configuration.');
  }
  return storage;
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

// Helper to fetch minimal user information for activity feed
const getUserSummary = async (firestoreDb: Firestore, userId: string) => {
  const userSnapshot = await getDoc(doc(firestoreDb, COLLECTIONS.USERS, userId));
  const userData = userSnapshot.data();

  const displayName = userData?.displayName || userData?.email || 'StyleLink user';
  const username = userData?.username || (userData?.email ? `@${userData.email.split('@')[0]}` : undefined);

  return {
    name: displayName,
    username,
    avatar: userData?.profilePicture || userData?.photoURL
  };
};

// Helper to convert Firestore document to ActivityRecord
const convertToActivityRecord = (doc: QueryDocumentSnapshot<DocumentData>): ActivityRecord => {
  const data = doc.data();

  return {
    id: doc.id,
    type: data.type,
    actorId: data.actorId,
    actorName: data.actorName,
    actorUsername: data.actorUsername,
    actorAvatar: data.actorAvatar,
    targetUserId: data.targetUserId,
    postId: data.postId,
    postTitle: data.postTitle,
    content: data.content,
    createdAt: convertTimestamp(data.createdAt || new Date())
  };
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
    hashtags: data.hashtags || [],
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
    hashtags: outfit.hashtags || [],
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
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }
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
      hashtags: userInput.hashtags || [],
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
    const outfitSnap = await getDoc(outfitRef);

    if (!outfitSnap.exists()) {
      throw new Error('Outfit not found');
    }

    const outfitData = outfitSnap.data();

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

      // Record activity for the outfit owner
      if (outfitData?.userId) {
        const actor = await getUserSummary(firestoreDb, userId);

        await recordActivity({
          type: 'like',
          actorId: userId,
          actorName: actor.name,
          actorUsername: actor.username,
          actorAvatar: actor.avatar,
          targetUserId: outfitData.userId,
          postId: outfitId,
          postTitle: outfitData.title,
          createdAt: new Date()
        });
      }

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
 * Record an activity event for a user
 */
export const recordActivity = async (activity: ActivityInput): Promise<string> => {
  try {
    const firestoreDb = ensureDb();

    const payload: Omit<ActivityInput, 'createdAt'> & { createdAt: Timestamp } = {
      ...activity,
      createdAt: convertToTimestamp(activity.createdAt || new Date())
    };

    const activityRef = await addDoc(collection(firestoreDb, COLLECTIONS.ACTIVITIES), payload);
    return activityRef.id;
  } catch (error) {
    console.error('Error recording activity:', error);
    throw error;
  }
};

/**
 * Get activity feed for a specific user
 */
export const getActivitiesForUser = async (userId: string, maxResults: number = 50): Promise<ActivityRecord[]> => {
  try {
    const firestoreDb = ensureDb();
    const activityQuery = query(
      collection(firestoreDb, COLLECTIONS.ACTIVITIES),
      where('targetUserId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );

    const snapshot = await getDocs(activityQuery);
    return snapshot.docs.map(convertToActivityRecord);
  } catch (error) {
    console.error('Error fetching activities:', error);
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

/**
 * Upload a file (image or video) to Firebase Storage
 * @param file - The file to upload (should be compressed for images)
 * @param userId - The user ID
 * @param folder - The folder path in storage (e.g., 'outfits', 'profile')
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with the download URL
 */
export const uploadFile = async (
  file: File,
  userId: string,
  folder: string = 'outfits',
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const storageInstance = ensureStorage();
    
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid file: file is empty or undefined');
    }
    
    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${userId}/${folder}/${timestamp}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    
    console.log(`📤 Uploading file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB) to ${fileName}`);
    
    // Create storage reference
    const storageRef = ref(storageInstance, fileName);
    
    // Upload file with progress tracking
    // Note: For images, file should be compressed before calling this function
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('❌ Error uploading file:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          
          // Provide more helpful error messages
          if (error.code === 'storage/unauthorized') {
            reject(new Error('Storage unauthorized: Check Firebase Storage security rules. They should allow authenticated users to write.'));
          } else if (error.code === 'storage/quota-exceeded') {
            reject(new Error('Storage quota exceeded: Your Firebase Storage quota has been reached.'));
          } else if (error.code === 'storage/unauthenticated') {
            reject(new Error('User not authenticated: Please log in to upload files.'));
          } else {
            reject(error);
          }
        },
        async () => {
          // Upload completed successfully
          try {
            console.log('✅ File uploaded successfully, getting download URL...');
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('✅ Download URL obtained:', downloadURL.substring(0, 50) + '...');
            resolve(downloadURL);
          } catch (error) {
            console.error('❌ Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload multiple files (images or videos) to Firebase Storage
 * @param files - Array of files to upload
 * @param userId - The user ID
 * @param folder - The folder path in storage
 * @param onProgress - Optional callback for overall progress
 * @returns Promise with array of download URLs
 */
export const uploadMultipleFiles = async (
  files: File[],
  userId: string,
  folder: string = 'outfits',
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => 
      uploadFile(file, userId, folder, (fileProgress) => {
        // Calculate overall progress
        if (onProgress) {
          const overallProgress = ((index + fileProgress / 100) / files.length) * 100;
          onProgress(overallProgress);
        }
      })
    );
    
    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

/**
 * Create an outfit with uploaded media files
 * @param userInput - The outfit data
 * @param userId - The user ID
 * @param imageFiles - Array of image files to upload (will be compressed)
 * @param videoFiles - Optional array of video files to upload
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with the created outfit
 */
export const createOutfitWithMedia = async (
  userInput: Omit<UserInput, 'mainImageUrl' | 'additionalImages'>,
  userId: string,
  imageFiles: File[],
  videoFiles: File[] = [],
  onProgress?: (progress: number) => void
): Promise<OutfitUpload> => {
  try {
    if (imageFiles.length === 0 && videoFiles.length === 0) {
      throw new Error('At least one image or video file is required');
    }

    let uploadedImageUrls: string[] = [];
    let uploadedVideoUrls: string[] = [];
    let currentProgress = 0;

    // Compress and upload images
    if (imageFiles.length > 0) {
      let imagesToUpload: File[] = imageFiles;

      try {
        // Import compression utility dynamically to avoid circular dependencies
        const { compressImages } = await import('../utils/imageCompression');

        // Compress images first (10% of progress)
        if (onProgress) {
          onProgress(5);
        }

        try {
          const compressedImages = await Promise.race([
            compressImages(
              imageFiles,
              {
                maxWidth: 1920,
                maxHeight: 1920,
                quality: 0.8,
                maxSizeMB: 2
              },
              (compressProgress) => {
                // Compression takes 10% of total progress
                if (onProgress) {
                  onProgress(5 + (compressProgress * 0.05));
                }
              }
            ),
            // Timeout after 30 seconds - use original files if compression takes too long
            new Promise<File[]>((_, reject) =>
              setTimeout(() => reject(new Error('Compression timeout')), 30000)
            )
          ]);

          imagesToUpload = compressedImages;
          console.log('✅ Images compressed successfully');
        } catch (compressionError) {
          console.warn('⚠️ Image compression failed or timed out, using original files:', compressionError);
          // Use original files if compression fails
          imagesToUpload = imageFiles;
          if (onProgress) {
            onProgress(10); // Skip compression progress
          }
        }
      } catch (importError) {
        console.error('Error importing compression utility:', importError);
        // Use original files if compression utility can't be loaded
        imagesToUpload = imageFiles;
        if (onProgress) {
          onProgress(10); // Skip compression progress
        }
      }

      // Upload images (60% of progress)
      if (onProgress) {
        onProgress(Math.max(currentProgress, 10));
      }
      const imageProgressCallback = (progress: number) => {
        currentProgress = 10 + (progress * 0.6); // Images upload takes 60% of progress
        if (onProgress) {
          onProgress(currentProgress);
        }
      };
      uploadedImageUrls = await uploadMultipleFiles(imagesToUpload, userId, 'outfits/images', imageProgressCallback);
    }

    // Upload videos
    if (videoFiles.length > 0) {
      if (onProgress) {
        onProgress(Math.max(currentProgress, 70));
      }
      const videoProgressCallback = (progress: number) => {
        currentProgress = 70 + (progress * 0.3); // Videos take 30% of progress
        if (onProgress) {
          onProgress(currentProgress);
        }
      };
      uploadedVideoUrls = await uploadMultipleFiles(videoFiles, userId, 'outfits/videos', videoProgressCallback);
    }

    // Set main image (first image or first video thumbnail)
    const mainImageUrl = uploadedImageUrls[0] || uploadedVideoUrls[0];

    // Create outfit data
    const outfitData: UserInput = {
      ...userInput,
      mainImageUrl,
      additionalImages: [...uploadedImageUrls.slice(1), ...uploadedVideoUrls]
    };

    // Create outfit in Firestore
    if (onProgress) {
      onProgress(95);
    }
    const outfit = await createOutfit(outfitData, userId);
    
    if (onProgress) {
      onProgress(100);
    }

    return outfit;
  } catch (error) {
    console.error('Error creating outfit with media:', error);
    throw error;
  }
};

