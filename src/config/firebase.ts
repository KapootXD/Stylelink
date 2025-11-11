import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
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
    
    // Create user document in Firestore
    try {
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        userType,
        createdAt: serverTimestamp()
      });
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

export { app, db, auth, storage };
export type { User };
export default app;

