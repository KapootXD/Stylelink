# Firebase Authentication Setup Guide

This guide will walk you through setting up Firebase Authentication for StyleLink.

## Step 1: Create Firebase Project (if you haven't already)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "stylelink")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **web icon (`</>`)** or **"Add app"** → **Web**
2. Register your app with a nickname (e.g., "StyleLink Web")
3. **Copy the Firebase configuration object** - you'll need this for your `.env` file

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 3: Enable Authentication

1. In Firebase Console, go to **"Authentication"** in the left sidebar
2. Click **"Get started"** (if you haven't enabled it yet)
3. Go to the **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. **Enable** the first toggle (Email/Password)
6. (Optional) Enable **"Email link (passwordless sign-in)"** if you want passwordless authentication
7. Click **"Save"**

### Optional: Enable Other Authentication Methods

You can also enable:
- **Google** - For Google Sign-In
- **Facebook** - For Facebook Sign-In
- **Twitter** - For Twitter Sign-In
- **GitHub** - For GitHub Sign-In

For now, **Email/Password is required** for StyleLink to work.

## Step 4: Create Environment Variables File

1. **Copy the template file:**
   ```bash
   cp env.template .env
   ```

2. **Open `.env` file** and fill in your Firebase configuration:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyC...your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: API URL (if you have a separate backend)
REACT_APP_API_URL=http://localhost:3001/api

# Environment
REACT_APP_ENVIRONMENT=development
```

**Important:** Replace all the placeholder values with your actual Firebase configuration values from Step 2.

## Step 5: Set Up Firestore Database (Required for User Profiles)

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose the closest to your users)
5. Click **"Enable"**

### Set Up Security Rules (Important!)

Go to **Firestore Database** → **Rules** tab and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles
      allow read: if true;
      
      // Users can create their own profile
      allow create: if request.auth != null 
        && request.resource.data.uid == request.auth.uid;
      
      // Users can update their own profile
      // Admins can update any profile
      allow update: if request.auth != null && (
        resource.data.uid == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin'
      );
      
      // Only admins can delete profiles
      allow delete: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
    
    // Outfits collection
    match /outfits/{outfitId} {
      // Anyone can read public outfits
      allow read: if true;
      
      // Only authenticated users can create outfits
      allow create: if request.auth != null;
      
      // Only the owner can update/delete their outfits
      allow update, delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

Click **"Publish"** to save the rules.

## Step 6: Restart Your Development Server

After creating/updating your `.env` file, you **must restart** your development server:

1. Stop the current server (Ctrl+C)
2. Start it again:
   ```bash
   npm start
   ```

**Important:** Environment variables are only loaded when the server starts. Changes to `.env` require a restart.

## Step 7: Verify Firebase Authentication is Working

1. **Check the browser console** when you start the app
2. You should see: `✅ Firebase initialized: { app: true, firestore: true, auth: true, storage: true }`
3. If you see warnings, check that your `.env` file has all required variables

## Step 8: Test Authentication

1. **Sign Up:**
   - Go to `/signup` page
   - Create a new account
   - Check Firebase Console → Authentication → Users to see the new user

2. **Login:**
   - Go to `/login` page
   - Sign in with your credentials
   - You should be redirected and logged in

3. **Check User Profile:**
   - After signup/login, check Firestore Database → `users` collection
   - You should see a document with your user ID
   - The document should have `userType: 'regular'` by default

## Troubleshooting

### Issue: "Firebase Auth is not initialized"

**Solution:**
- Check that your `.env` file exists in the root directory
- Verify all `REACT_APP_FIREBASE_*` variables are set correctly
- Make sure there are no typos in variable names
- Restart your development server

### Issue: "Missing or insufficient permissions"

**Solution:**
- Check Firestore Security Rules
- Make sure rules allow the operation you're trying to perform
- For development, you can temporarily use test mode rules

### Issue: "Email already in use" or "Invalid email"

**Solution:**
- Check that Email/Password authentication is enabled in Firebase Console
- Verify the email format is correct
- Check Firebase Console → Authentication → Users to see if the user already exists

### Issue: User profile not created in Firestore

**Solution:**
- Check browser console for errors
- Verify Firestore Security Rules allow user creation
- Check that the `users` collection exists in Firestore
- The profile is created automatically on signup, but check for any errors

## Creating Admin Users

To create an admin user:

1. Sign up a regular user account
2. Go to Firebase Console → Firestore Database → `users` collection
3. Find the user document (by their UID)
4. Edit the document and change `userType` from `'regular'` to `'admin'`
5. Save the document

Now that user will have admin access in the app.

## Next Steps

Once authentication is set up:

1. ✅ Users can sign up and log in
2. ✅ User profiles are automatically created in Firestore
3. ✅ Access control is enforced based on user type
4. ✅ Admin users can manage the system

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)


