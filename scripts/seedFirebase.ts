/**
 * Firebase Seed Script
 * 
 * This script populates Firestore with sample data from demoData.ts
 * 
 * Usage:
 * 1. Make sure your .env file has Firebase configuration
 * 2. Install dependencies: npm install
 * 3. Load environment variables (use dotenv): npm install -D dotenv
 * 4. Run: npx ts-node -r dotenv/config scripts/seedFirebase.ts
 * 
 * Alternative: Use react-scripts to run (requires setting up as a script in package.json)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { DEMO_DATA } from '../src/data/demoData';
import { UserProfile, OutfitUpload } from '../src/types';

// Load environment variables
// Note: In Node.js, we need to use dotenv or pass env vars directly
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Helper function to convert Date to Firestore Timestamp
const convertToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Helper function to convert OutfitUpload to Firestore document
const outfitToFirestore = (outfit: OutfitUpload) => {
  return {
    userId: outfit.userId,
    title: outfit.title,
    description: outfit.description,
    occasion: outfit.occasion,
    season: outfit.season,
    styleTags: outfit.styleTags || [],
    items: outfit.items || [],
    mainImageUrl: outfit.mainImageUrl,
    additionalImages: outfit.additionalImages || [],
    createdAt: convertToTimestamp(outfit.createdAt),
    updatedAt: convertToTimestamp(outfit.updatedAt),
    likes: outfit.likes || 0,
    shares: outfit.shares || 0,
    isPublic: outfit.isPublic ?? true
  };
};

// Helper function to convert UserProfile to Firestore document
const userToFirestore = (user: UserProfile) => {
  return {
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    followers: user.followers,
    following: user.following,
    isVerified: user.isVerified,
    joinedAt: convertToTimestamp(user.joinedAt)
  };
};

async function seedFirebase() {
  try {
    console.log('🚀 Starting Firebase seeding...');

    // Validate configuration
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.error('❌ Error: Firebase configuration is missing!');
      console.error('Please set the following environment variables:');
      console.error('  - REACT_APP_FIREBASE_API_KEY');
      console.error('  - REACT_APP_FIREBASE_PROJECT_ID');
      console.error('');
      console.error('You can either:');
      console.error('  1. Set them in your .env file and use: npx ts-node -r dotenv/config scripts/seedFirebase.ts');
      console.error('  2. Set them as environment variables before running the script');
      process.exit(1);
    }

    // Initialize Firebase
    console.log('📦 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized');
    console.log(`   Project ID: ${firebaseConfig.projectId}`);

    // Seed user profiles
    console.log('\n👥 Seeding user profiles...');
    const usersBatch = writeBatch(db);
    const usersCollection = collection(db, 'users');
    
    DEMO_DATA.users.forEach((user) => {
      const userRef = doc(usersCollection, user.id);
      usersBatch.set(userRef, userToFirestore(user));
    });
    
    await usersBatch.commit();
    console.log(`✅ Seeded ${DEMO_DATA.users.length} user profiles`);

    // Seed outfits
    console.log('\n👗 Seeding outfits...');
    const outfitsBatch = writeBatch(db);
    const outfitsCollection = collection(db, 'outfits');
    
    DEMO_DATA.outfits.forEach((outfit) => {
      const outfitRef = doc(outfitsCollection);
      outfitsBatch.set(outfitRef, outfitToFirestore(outfit));
    });
    
    await outfitsBatch.commit();
    console.log(`✅ Seeded ${DEMO_DATA.outfits.length} outfits`);

    console.log('\n🎉 Firebase seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Users: ${DEMO_DATA.users.length}`);
    console.log(`   - Outfits: ${DEMO_DATA.outfits.length}`);
    console.log(`   - Clothing Items: ${DEMO_DATA.clothingItems.length}`);
    console.log(`\n💡 Tip: Check your Firestore console to verify the data:`);
    console.log(`   https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding Firebase:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      if (error.stack) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run the seed function
seedFirebase();

