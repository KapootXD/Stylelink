# Fix Firebase Storage CORS Errors

## The Problem

You're seeing CORS errors when trying to upload photos:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' 
from origin 'https://stylelink-74fdf.web.app' has been blocked by CORS policy
```

This happens because Firebase Storage needs explicit CORS configuration to allow uploads from your domain.

## Solution: Configure CORS for Firebase Storage

You need to configure CORS on your Firebase Storage bucket to allow uploads from `https://stylelink-74fdf.web.app`.

### Option 1: Using Firebase Console (Easiest) ⭐

**Note:** Firebase Console doesn't have a direct CORS configuration UI, so you'll need to use the `gsutil` command-line tool.

### Option 2: Using gsutil Command (Recommended)

#### Step 1: Install Google Cloud SDK

1. Download and install: https://cloud.google.com/sdk/docs/install
2. Or use the installer for your OS

#### Step 2: Authenticate

Open a terminal/command prompt and run:

```bash
gcloud auth login
```

This will open a browser window for you to sign in with your Google account (the same one used for Firebase).

#### Step 3: Create CORS Configuration File

Create a file called `cors.json` in your project root with this content:

```json
[
  {
    "origin": ["https://stylelink-74fdf.web.app", "http://localhost:3000"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "Authorization", "x-goog-*"],
    "maxAgeSeconds": 3600
  }
]
```

**Important:** This allows uploads from:
- Your production site: `https://stylelink-74fdf.web.app`
- Your local development: `http://localhost:3000` (optional, for testing)

#### Step 4: Apply CORS Configuration

Run this command (replace `stylelink-74fdf` with your actual storage bucket name if different):

```bash
gsutil cors set cors.json gs://stylelink-74fdf.appspot.com
```

**Or if your bucket name is different:**

Your storage bucket name might be:
- `stylelink-74fdf.appspot.com`
- `stylelink-74fdf.firebasestorage.app`

Check your `.env` file for `REACT_APP_FIREBASE_STORAGE_BUCKET` to get the exact bucket name.

#### Step 5: Verify CORS Configuration

Check that CORS was applied:

```bash
gsutil cors get gs://stylelink-74fdf.appspot.com
```

You should see your CORS configuration.

### Option 3: Quick Fix Using gsutil (One-Liner)

If you have `gsutil` installed, you can create and apply CORS in one go:

```bash
# Windows PowerShell
echo '[{"origin":["https://stylelink-74fdf.web.app","http://localhost:3000"],"method":["GET","POST","PUT","DELETE","HEAD"],"responseHeader":["Content-Type","Authorization","x-goog-*"],"maxAgeSeconds":3600}]' | gsutil cors set - gs://stylelink-74fdf.appspot.com
```

### Option 4: Using Firebase CLI (Alternative)

If you have Firebase CLI installed:

```bash
# Create cors.json file first (see Step 3 above)
firebase functions:config:set storage.cors.enabled=true
gsutil cors set cors.json gs://stylelink-74fdf.appspot.com
```

## Find Your Storage Bucket Name

Your storage bucket name is in your Firebase configuration. Check:

1. **In your `.env` file:**
   - Look for `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - Common values:
     - `stylelink-74fdf.appspot.com`
     - `stylelink-74fdf.firebasestorage.app`

2. **In Firebase Console:**
   - Go to: https://console.firebase.google.com/project/stylelink-74fdf/storage
   - Look at the URL or bucket name shown

## Complete CORS Configuration File

Create `cors.json` in your project root:

```json
[
  {
    "origin": [
      "https://stylelink-74fdf.web.app",
      "https://stylelink-74fdf.firebaseapp.com",
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "x-goog-*",
      "x-firebase-*"
    ],
    "maxAgeSeconds": 3600
  }
]
```

This configuration:
- ✅ Allows uploads from production domain
- ✅ Allows uploads from localhost (for development)
- ✅ Supports all HTTP methods needed for file uploads
- ✅ Includes necessary headers
- ✅ Sets cache time to 1 hour

## Apply the Configuration

Once you have `cors.json` created:

```bash
gsutil cors set cors.json gs://YOUR_BUCKET_NAME
```

Replace `YOUR_BUCKET_NAME` with your actual bucket name from `.env`.

## Verify It Works

After applying CORS:

1. **Wait 1-2 minutes** for changes to propagate
2. **Clear browser cache** (Ctrl+Shift+R)
3. **Try uploading a photo again**
4. **Check console** - CORS errors should be gone

## Troubleshooting

### "Command 'gsutil' not found"

**Solution:** Install Google Cloud SDK:
- Windows: https://cloud.google.com/sdk/docs/install-sdk
- Mac: `brew install google-cloud-sdk`
- Or use the web installer

### "Access Denied" or "Permission Denied"

**Solution:**
1. Make sure you're logged in: `gcloud auth login`
2. Make sure you're using the same Google account as your Firebase project
3. Check that your account has Storage Admin permissions in Firebase Console

### "Bucket not found"

**Solution:**
1. Check your bucket name in Firebase Console
2. Verify the bucket name in your `.env` file
3. The bucket name might be `stylelink-74fdf.firebasestorage.app` instead of `.appspot.com`

### CORS Still Not Working After Configuration

1. **Wait longer** - CORS changes can take up to 5 minutes to propagate
2. **Clear browser cache completely** - Use incognito mode
3. **Check bucket name** - Make sure you configured the correct bucket
4. **Verify origin** - Make sure your domain matches exactly in `cors.json`

## Quick Test

After configuring CORS, test it:

1. Open your site: https://stylelink-74fdf.web.app
2. Open DevTools (F12) → Console
3. Try uploading a photo
4. Should see **no CORS errors**
5. Upload should succeed! ✅

## Summary

The fix requires:
1. ✅ Create `cors.json` file with your domain
2. ✅ Install `gsutil` (Google Cloud SDK)
3. ✅ Run: `gsutil cors set cors.json gs://YOUR_BUCKET_NAME`
4. ✅ Wait a few minutes
5. ✅ Test upload - should work!

I can create the `cors.json` file for you if you'd like!

