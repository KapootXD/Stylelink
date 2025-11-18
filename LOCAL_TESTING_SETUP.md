# Local Testing Setup Guide

## Issue: Login Not Working

If login functionality isn't working, it's likely because Firebase isn't configured. Follow these steps:

## Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **stylelink-74fdf**
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" → Web (</>) icon
7. Copy the Firebase configuration values

## Step 2: Create .env File

Create a `.env` file in the root directory (`C:\Users\gavin\Documents\stylelink\.env`) with your Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=stylelink-74fdf.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=stylelink-74fdf
REACT_APP_FIREBASE_STORAGE_BUCKET=stylelink-74fdf.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Step 3: Enable Firebase Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 4: Configure Firebase Storage Rules

For upload functionality to work:

1. Go to **Storage** in Firebase Console
2. Click "Get started" (if not already set up)
3. Go to "Rules" tab
4. Update rules to allow authenticated uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 5: Restart Development Server

After creating `.env` file:

1. **Stop** the current server (Ctrl+C)
2. **Restart** with: `npm start`

**Important**: Environment variables are only loaded when the server starts. You must restart after creating/updating `.env`.

## Step 6: Test Login

1. First, create a test account:
   - Go to `/signup` or `/signup/customer`
   - Create an account with email and password
   
2. Then test login:
   - Go to `/login`
   - Use the credentials you just created

## Troubleshooting

### "Firebase configuration is missing" error
- Check that `.env` file exists in root directory
- Verify all variables start with `REACT_APP_`
- Restart the dev server after creating `.env`

### "Firebase Auth is not initialized" error
- Check browser console for specific errors
- Verify Firebase project ID matches in `.env` and `.firebaserc`
- Make sure Email/Password auth is enabled in Firebase Console

### Login button does nothing
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab to see if requests are being made

### Can't create account
- Verify Email/Password authentication is enabled in Firebase Console
- Check that you're using a valid email format
- Password must be at least 6 characters

## Testing Upload Functionality

After login works:

1. Login to your account
2. Navigate to `/upload`
3. Try uploading an image or video
4. Check Firebase Console → Storage to see uploaded files

## Quick Test Commands

```bash
# Check if .env exists
if (Test-Path .env) { Write-Host "✅ .env exists" } else { Write-Host "❌ .env missing" }

# Start dev server
npm start

# Build for production
npm run build

# Test production build locally
npx serve -s build
```

