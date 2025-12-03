# Fix .env.local File

## The Problem

Your `.env.local` file currently has:
```
REACT_APP_USE_FIREBASE_EMULATOR=true
```

This is causing the production build to try to use Firebase emulators instead of the cloud services.

## The Fix

You need to update your `.env.local` file to set emulators to `false` and ensure all Firebase production credentials are set.

### Step 1: Open .env.local

Open the file: `C:\Users\gavin\Documents\stylelink\.env.local`

### Step 2: Update the File

Change this line:
```env
REACT_APP_USE_FIREBASE_EMULATOR=true
```

To:
```env
REACT_APP_USE_FIREBASE_EMULATOR=false
```

### Step 3: Verify All Firebase Credentials Are Set

Make sure your `.env.local` has all these values with your **production** Firebase credentials:

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

### Step 4: Rebuild and Redeploy

After updating the file:

1. **Delete the old build:**
   ```bash
   Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
   ```

2. **Build with the new settings:**
   ```bash
   npm run build
   ```

3. **Verify the build:**
   - Check `build/static/js/` files
   - Search for "emulator" - you should NOT see "localhost:9099" or emulator connections
   - You should see your Firebase project ID instead

4. **Deploy:**
   ```bash
   firebase deploy --only hosting
   ```

### Step 5: Verify After Deployment

1. Visit your site: https://stylelink-74fdf.web.app
2. Open browser console (F12)
3. You should see:
   - ✅ "Firebase initialized successfully" with `emulatorMode: false`
   - ❌ NO "Connected to Firebase Auth Emulator" messages
   - ❌ NO "ERR_CONNECTION_REFUSED" errors

## Quick Command Summary

```bash
# 1. Update .env.local (manually edit the file)
# Set REACT_APP_USE_FIREBASE_EMULATOR=false

# 2. Clean and rebuild
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
npm run build

# 3. Deploy
firebase deploy --only hosting
```

## Get Your Firebase Credentials

If you need to get your Firebase credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/project/stylelink-74fdf/settings/general)
2. Scroll to **Your apps** section
3. Click on your web app
4. Copy the config values

## Important Notes

- `.env.local` is gitignored (not committed to GitLab)
- Environment variables are embedded at **build time**
- You must rebuild after changing `.env.local`
- The old build in `build/` folder still has the old settings - delete it first!

