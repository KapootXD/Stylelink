/**
 * Seed Firebase Emulators with test data
 * This script populates the local emulator database with sample data for testing
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword } from 'firebase/auth';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase emulator configuration
const firebaseConfig = {
  projectId: 'demo-stylelink',
  apiKey: 'fake-api-key-for-emulator',
  authDomain: 'demo-stylelink.firebaseapp.com',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Connect to emulators
const USE_EMULATOR = process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true';

if (USE_EMULATOR) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('✅ Connected to Firebase Emulators');
  } catch (error) {
    console.error('Error connecting to emulators:', error);
    process.exit(1);
  }
}

// Sample data to seed
const sampleUsers = [
  {
    email: 'test@stylelink.com',
    password: 'test123456',
    displayName: 'Test User',
    userType: 'regular'
  },
  {
    email: 'admin@stylelink.com',
    password: 'admin123456',
    displayName: 'Admin User',
    userType: 'admin'
  }
];

const sampleOutfits = [
  {
    userId: '',
    title: 'Summer Casual Outfit',
    description: 'Perfect for a sunny day',
    occasion: 'casual',
    season: 'summer',
    styleTags: ['casual', 'summer'],
    items: [],
    mainImageUrl: 'https://via.placeholder.com/400',
    additionalImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: 10,
    shares: 5,
    isPublic: true
  }
];

/**
 * Seed users
 */
async function seedUsers() {
  console.log('📝 Seeding users...');
  
  for (const userData of sampleUsers) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      // Create user profile in Firestore
      await db.collection('users').doc(userCredential.user.uid).set({
        email: userData.email,
        displayName: userData.displayName,
        userType: userData.userType,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✅ Created user: ${userData.email}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User ${userData.email} already exists`);
      } else {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }
  }
}

/**
 * Seed outfits
 */
async function seedOutfits() {
  console.log('📝 Seeding outfits...');
  
  // Get first user for outfit ownership
  const users = await auth.currentUser;
  if (!users) {
    console.log('⚠️  No authenticated user. Creating outfits without userId.');
  }
  
  for (const outfit of sampleOutfits) {
    try {
      const outfitRef = await db.collection('outfits').add({
        ...outfit,
        userId: users?.uid || 'test-user-id'
      });
      console.log(`✅ Created outfit: ${outfit.title} (${outfitRef.id})`);
    } catch (error: any) {
      console.error(`❌ Error creating outfit ${outfit.title}:`, error.message);
    }
  }
}

/**
 * Main seed function
 */
async function seed() {
  console.log('🌱 Starting to seed Firebase Emulators...\n');
  
  try {
    await seedUsers();
    console.log('');
    await seedOutfits();
    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run seed function
seed();

