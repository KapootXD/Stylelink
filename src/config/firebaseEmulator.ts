/**
 * Firebase Emulator Configuration
 * Use this to connect to Firebase Emulators for local testing
 */

import { connectAuthEmulator, getAuth, Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, Firestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage, FirebaseStorage } from 'firebase/storage';

let emulatorsConnected = false;

/**
 * Initialize Firebase with emulator connections
 * Call this after initializing Firebase app but before using any Firebase services
 */
export const connectFirebaseEmulators = (auth: Auth, db: Firestore, storage: FirebaseStorage) => {
  // Check if we're in emulator mode
  const useEmulator = process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true';

  if (!useEmulator) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔌 Firebase emulators are disabled. Set REACT_APP_USE_FIREBASE_EMULATOR=true to enable.');
    }
    return;
  }

  if (emulatorsConnected) {
    return; // Already connected
  }

  try {
    // Connect to Auth Emulator
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log('✅ Connected to Firebase Auth Emulator (localhost:9099)');
    } catch (error: any) {
      if (error?.message?.includes('already been called')) {
        console.log('Auth emulator already connected');
      } else {
        console.error('Error connecting to Auth emulator:', error);
      }
    }

    // Connect to Firestore Emulator
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('✅ Connected to Firebase Firestore Emulator (localhost:8080)');
    } catch (error: any) {
      if (error?.message?.includes('already been called')) {
        console.log('Firestore emulator already connected');
      } else {
        console.error('Error connecting to Firestore emulator:', error);
      }
    }

    // Connect to Storage Emulator
    try {
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('✅ Connected to Firebase Storage Emulator (localhost:9199)');
    } catch (error: any) {
      if (error?.message?.includes('already been called')) {
        console.log('Storage emulator already connected');
      } else {
        console.error('Error connecting to Storage emulator:', error);
      }
    }

    emulatorsConnected = true;
    console.log('✅ All Firebase emulators connected successfully');
  } catch (error) {
    console.error('Error connecting to Firebase emulators:', error);
  }
};

