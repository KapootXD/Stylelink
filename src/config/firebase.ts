import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
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

export { app, db, auth, storage };
export default app;

