# Quick Fix for Production Site

The production site is currently using Firebase emulators. Here's how to fix it immediately.

## Option 1: Quick Manual Deploy (Fastest Fix)

Deploy manually with the correct production settings:

1. **Make sure you have Firebase credentials locally:**
   - Check if you have a `.env.local` file with production Firebase config
   - If not, create one with your production Firebase values

2. **Create/Update `.env.local` file:**
   ```env
   REACT_APP_USE_FIREBASE_EMULATOR=false
   REACT_APP_FIREBASE_API_KEY=your-production-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=stylelink-74fdf.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=stylelink-74fdf
   REACT_APP_FIREBASE_STORAGE_BUCKET=stylelink-74fdf.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

3. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Option 2: Fix via GitLab CI/CD (Recommended for Future)

1. **Add Firebase variables to GitLab CI/CD** (see PRODUCTION_FIX.md)
2. **Commit and push the updated `.gitlab-ci.yml`:**
   ```bash
   git add .gitlab-ci.yml
   git commit -m "Fix production Firebase configuration"
   git push origin main
   ```
3. **Wait for pipeline to complete** - it will automatically deploy

## Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **stylelink-74fdf**
3. Go to **Project Settings** → **General** tab
4. Scroll to **Your apps** → Click your web app
5. Copy the config values

## Verify the Fix

After deploying, check the browser console:
- ✅ Should see: "Firebase initialized successfully" with `emulatorMode: false`
- ❌ Should NOT see: "Connected to Firebase Auth Emulator"
- ❌ Should NOT see: "ERR_CONNECTION_REFUSED" errors

## Current Issue

The deployed site shows:
- ✅ Firebase initialized
- ❌ Connected to emulators (localhost:9099, localhost:8080, localhost:9199)
- ❌ Login fails with network errors

After fix:
- ✅ Firebase initialized
- ✅ Connected to Firebase Cloud (not emulators)
- ✅ Login should work

