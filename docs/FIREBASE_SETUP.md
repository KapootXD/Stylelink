# Firebase Setup Guide for StyleLink

This guide will walk you through setting up Firebase for the StyleLink application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Project Setup](#firebase-project-setup)
3. [Firestore Database Configuration](#firestore-database-configuration)
4. [Environment Variables](#environment-variables)
5. [Seeding Sample Data](#seeding-sample-data)
6. [Firebase Security Rules](#firebase-security-rules)
7. [Testing the Integration](#testing-the-integration)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- A Google account
- Node.js and npm installed
- Firebase CLI (optional, for advanced features)

## Firebase Project Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "stylelink")
4. (Optional) Enable Google Analytics
5. Click "Create project"

### Step 2: Register Your Web App

1. In your Firebase project, click the web icon (</>)
2. Register your app with a nickname (e.g., "StyleLink Web")
3. (Optional) Set up Firebase Hosting
4. Copy the Firebase configuration object

### Step 3: Get Firebase Configuration

You'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXXXXX"
};
```

Save these values - you'll need them for environment variables.

## Firestore Database Configuration

### Step 1: Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll update security rules later)
4. Select a location for your database (choose the closest to your users)
5. Click "Enable"

### Step 2: Create Collections

Firestore will automatically create collections when data is written, but you can manually create them:

- `outfits` - Stores outfit uploads
- `users` - Stores user profiles
- `clothingItems` - Stores clothing items (optional)
- `likes` - Tracks outfit likes
- `shares` - Tracks outfit shares

### Step 3: Set Up Indexes

Firestore may require composite indexes for complex queries. If you see an error about missing indexes:

1. Click the link in the error message
2. Create the required index in Firebase Console
3. Wait for the index to build (usually takes a few minutes)

## Environment Variables

### Step 1: Create .env File

1. Copy `.env.example` to `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase configuration values:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Step 2: Restart Development Server

After updating `.env`, restart your development server:

```bash
npm start
```

**Important:** Environment variables starting with `REACT_APP_` are embedded at build time. You must restart the server after changing them.

## Seeding Sample Data

### Option 1: Using the Seed Script (Recommended)

1. Install ts-node (if not already installed):
   ```bash
   npm install -D ts-node
   ```

2. Run the seed script:
   ```bash
   npx ts-node scripts/seedFirebase.ts
   ```

3. Verify data in Firebase Console:
   - Go to Firestore Database
   - Check that `outfits` and `users` collections have been created
   - Verify that sample data is present

### Option 2: Manual Seeding via Firebase Console

1. Go to Firestore Database in Firebase Console
2. Click "Start collection"
3. Create collections and add documents manually
4. Use the data structure from `src/data/demoData.ts` as a reference

### Option 3: Using Firebase CLI

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```

4. Export data from `src/data/demoData.ts` to JSON format
5. Import using Firebase CLI or Console

## Firebase Security Rules

### Initial Setup (Test Mode)

For development, you can start with test mode, which allows read/write access for 30 days:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

### Production Security Rules

For production, implement proper security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Outfits collection
    match /outfits/{outfitId} {
      // Anyone can read public outfits
      allow read: if resource.data.isPublic == true || request.auth != null;
      
      // Only authenticated users can create outfits
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
      
      // Only the owner can update/delete their outfits
      allow update, delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles
      allow read: if true;
      
      // Users can create their own profile
      allow create: if request.auth != null 
        && request.resource.data.id == request.auth.uid;
      
      // Users can update their own profile
      allow update: if request.auth != null 
        && resource.data.id == request.auth.uid;
    }
    
    // Likes collection
    match /likes/{likeId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Shares collection
    match /shares/{shareId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

### How to Update Security Rules

1. Go to Firebase Console → Firestore Database → Rules
2. Paste your security rules
3. Click "Publish"
4. Test your rules using the Rules Playground

## Testing the Integration

### Step 1: Verify Firebase Connection

1. Start your development server:
   ```bash
   npm start
   ```

2. Open browser console
3. Check for Firebase initialization messages
4. Verify no Firebase configuration errors

### Step 2: Test CRUD Operations

1. **Create an Outfit:**
   - Navigate to the upload page
   - Fill out the form and submit
   - Check Firestore Console to verify the outfit was created

2. **Search Outfits:**
   - Use the search functionality
   - Verify results are fetched from Firestore

3. **Like/Share:**
   - Like or share an outfit
   - Check that the count updates in Firestore

### Step 3: Verify Data Persistence

1. Create some data in the app
2. Refresh the page
3. Verify data persists (not lost on refresh)

## Troubleshooting

### Issue: "Firebase configuration is missing"

**Solution:**
- Check that your `.env` file exists in the root directory
- Verify all `REACT_APP_FIREBASE_*` variables are set
- Restart your development server after updating `.env`

### Issue: "Permission denied" errors

**Solution:**
- Check Firestore Security Rules
- Verify you're using the correct rules for your environment
- For development, you can use test mode rules temporarily

### Issue: "Missing or insufficient permissions"

**Solution:**
- Update Firestore Security Rules to allow the operation
- Verify the user is authenticated (if required)
- Check that the user has permission to access the document

### Issue: Data not appearing after seeding

**Solution:**
- Check browser console for errors
- Verify Firestore Console shows the data
- Clear browser cache and reload
- Check that environment variables are set correctly

### Issue: "Index required" errors

**Solution:**
1. Click the error link to create the index
2. Wait for the index to build
3. Retry the operation

### Issue: Slow queries

**Solution:**
- Add composite indexes for complex queries
- Limit the number of documents returned
- Use pagination instead of loading all data at once
- Consider using Cloud Functions for complex queries

## Next Steps

1. **Set up Firebase Authentication:**
   - Enable authentication methods (Email/Password, Google, etc.)
   - Update `getCurrentUserId()` in `apiService.ts` to use Firebase Auth
   - Implement authentication in your components

2. **Set up Firebase Storage:**
   - Enable Firebase Storage for image uploads
   - Update image upload functionality to use Firebase Storage
   - Configure Storage security rules

3. **Implement Real-time Updates:**
   - Use Firestore real-time listeners for live data updates
   - Update components to listen for changes
   - Handle offline support

4. **Optimize Performance:**
   - Add pagination for large datasets
   - Implement caching strategies
   - Use Firestore indexes for faster queries

5. **Set up Monitoring:**
   - Enable Firebase Analytics
   - Set up error tracking
   - Monitor database usage and costs

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)

## Support

If you encounter issues not covered in this guide:

1. Check Firebase Console for error messages
2. Review browser console for client-side errors
3. Check Firestore Security Rules
4. Verify environment variables are set correctly
5. Consult Firebase documentation or community forums

