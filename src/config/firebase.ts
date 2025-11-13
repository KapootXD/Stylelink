import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { 
  getAuth, 
  Auth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential
} from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { UserType, DEFAULT_USER_TYPE, FirestoreUserProfile, AppUser } from '../types/user';

// Firebase configuration
// These values should be set in your .env file
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

// Initialize Firebase only if it hasn't been initialized yet
if (getApps().length === 0) {
  // Validate that all required environment variables are present
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn(
      'Firebase configuration is missing. Please set REACT_APP_FIREBASE_API_KEY and REACT_APP_FIREBASE_PROJECT_ID in your .env file.'
    );
    console.warn('App will run in demo mode with mock data.');
  } else {
    try {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      storage = getStorage(app);
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      console.warn('App will run in demo mode with mock data.');
    }
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
}

// Auth helper functions
export const signUp = async (
  email: string, 
  password: string, 
  userType: 'customer' | 'seller',
  displayName?: string
): Promise<UserCredential> => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
  }
  
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.');
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    // Create user document in Firestore with userType classification
    // Map 'customer'/'seller' to 'regular' userType (can be upgraded later)
    const appUserType: UserType = DEFAULT_USER_TYPE;
    
    try {
      const userProfile: Omit<FirestoreUserProfile, 'createdAt'> & { createdAt: any } = {
        uid: userCredential.user.uid,
        email,
        userType: appUserType,
        createdAt: serverTimestamp()
      };
      
      if (displayName) {
        userProfile.displayName = displayName;
      }
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
    } catch (firestoreError) {
      console.error('Error creating user document in Firestore:', firestoreError);
      // Don't throw - auth user is already created, Firestore doc can be created later
    }
    
    return userCredential;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Fetch user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.');
  }
  
  if (!auth) {
    return null;
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    const firebaseUser = auth.currentUser;
    
    if (!userDoc.exists()) {
      // User profile doesn't exist, create a default one if Firebase user exists
      if (firebaseUser && firebaseUser.uid === uid) {
        return createDefaultUserProfile(firebaseUser);
      }
      return null;
    }
    
    const data = userDoc.data() as FirestoreUserProfile;
    
    // Convert Firestore Timestamp to Date
    const createdAt = data.createdAt instanceof Timestamp 
      ? data.createdAt.toDate() 
      : data.createdAt;
    const updatedAt = data.updatedAt instanceof Timestamp 
      ? data.updatedAt.toDate() 
      : data.updatedAt;
    
    // Use Firebase Auth user data if available, otherwise use Firestore data
    const email = firebaseUser?.email || data.email || null;
    const emailVerified = firebaseUser?.emailVerified || false;
    const displayName = firebaseUser?.displayName || data.displayName || null;
    const photoURL = firebaseUser?.photoURL || data.photoURL || data.avatarUrl || null;
    
    // Use photoURL or avatarUrl for profilePicture (convert null to undefined)
    const profilePicture = photoURL || data.avatarUrl || undefined;
    
    return {
      uid,
      email,
      emailVerified,
      displayName,
      photoURL,
      userType: data.userType || DEFAULT_USER_TYPE,
      username: data.username,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      profilePicture, // Map to profilePicture for backward compatibility
      location: data.location,
      createdAt,
      updatedAt,
      stats: data.stats,
      isOwnProfile: firebaseUser?.uid === uid
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Return default profile if fetch fails and Firebase user exists
    if (auth.currentUser && auth.currentUser.uid === uid) {
      return createDefaultUserProfile(auth.currentUser);
    }
    return null;
  }
};

/**
 * Create default user profile for users without Firestore document
 */
const createDefaultUserProfile = (firebaseUser: User): AppUser => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    profilePicture: firebaseUser.photoURL || undefined, // Map photoURL to profilePicture
    userType: DEFAULT_USER_TYPE,
    createdAt: new Date(),
    isOwnProfile: true
  };
};

/**
 * Update user type in Firestore
 */
export const updateUserType = async (uid: string, userType: UserType | string): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.');
  }
  
  try {
    await setDoc(
      doc(db, 'users', uid),
      {
        userType,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user type:', error);
    throw error;
  }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfileInFirestore = async (
  uid: string,
  updates: Partial<FirestoreUserProfile>
): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.');
  }
  
  try {
    await setDoc(
      doc(db, 'users', uid),
      {
        ...updates,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<UserCredential> => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
  }
  
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const updateUserProfile = async (updates: { displayName?: string; photoURL?: string }): Promise<void> => {
  if (!auth || !auth.currentUser) {
    throw new Error('No user is currently signed in.');
  }
  
  try {
    await updateProfile(auth.currentUser, updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Check if Firebase Auth is initialized and ready
 */
export const isAuthInitialized = (): boolean => {
  return auth !== undefined;
};

/**
 * Get Firebase Auth instance (throws if not initialized)
 */
export const getAuthInstance = (): Auth => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
  }
  return auth;
};

/**
 * Check if Firebase is fully initialized
 */
export const isFirebaseInitialized = (): boolean => {
  return app !== undefined && db !== undefined && auth !== undefined;
};

// Log initialization status
if (process.env.NODE_ENV === 'development') {
  if (isFirebaseInitialized()) {
    console.log('✅ Firebase initialized:', {
      app: !!app,
      firestore: !!db,
      auth: !!auth,
      storage: !!storage
    });
  } else {
    console.warn('⚠️ Firebase not fully initialized. Check your .env file for Firebase configuration.');
  }
}

export { app, db, auth, storage };
export type { User };
export default app;

