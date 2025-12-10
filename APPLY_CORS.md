# Apply CORS Configuration - Quick Guide

## The Problem

You're getting CORS errors when uploading photos because Firebase Storage doesn't allow uploads from your domain yet.

## Quick Fix Steps

### Step 1: Install Google Cloud SDK (if not already installed)

1. **Download:** https://cloud.google.com/sdk/docs/install
2. **Or use Windows installer:** https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe
3. **Follow the installer instructions**

### Step 2: Authenticate with Google Cloud

Open PowerShell or Command Prompt and run:

```powershell
gcloud auth login
```

This will open a browser window. Sign in with the same Google account you use for Firebase.

### Step 3: Apply CORS Configuration

I've created a `cors.json` file for you. Now you just need to apply it:

**First, find your storage bucket name:**
- Check your `.env` file for `REACT_APP_FIREBASE_STORAGE_BUCKET`
- Or check Firebase Console → Storage

**Then run this command (replace YOUR_BUCKET_NAME with your actual bucket):**

```powershell
gsutil cors set cors.json gs://YOUR_BUCKET_NAME
```

**Common bucket names:**
- `gs://stylelink-74fdf.appspot.com`
- `gs://stylelink-74fdf.firebasestorage.app`

### Step 4: Verify It Worked

```powershell
gsutil cors get gs://YOUR_BUCKET_NAME
```

You should see the CORS configuration you just set.

### Step 5: Test Upload

1. **Wait 1-2 minutes** for changes to propagate
2. **Clear browser cache** (Ctrl+Shift+R)
3. **Try uploading a photo again**
4. **CORS errors should be gone!** ✅

## Alternative: If You Don't Want to Install gsutil

Unfortunately, Firebase Storage CORS **must** be configured using `gsutil` or the Google Cloud Console. There's no way to set it through the Firebase Console UI directly.

**Quick install option:**
- Use the Windows installer: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe
- It's a simple installer - just click through it

## What the CORS File Does

The `cors.json` file I created allows:
- ✅ Uploads from your production site: `https://stylelink-74fdf.web.app`
- ✅ Uploads from localhost (for development)
- ✅ All necessary HTTP methods (GET, POST, PUT, DELETE)
- ✅ Required headers for Firebase Storage

## Troubleshooting

### "gsutil not found"

Make sure Google Cloud SDK is installed and in your PATH. Restart your terminal after installing.

### "Permission denied"

Make sure you're logged in with the correct Google account:
```powershell
gcloud auth login
```

### Still seeing CORS errors?

1. Wait 2-3 more minutes (CORS changes can take time)
2. Clear browser cache completely (Ctrl+Shift+R)
3. Try in incognito mode
4. Check that you used the correct bucket name

## Need Help Finding Your Bucket Name?

Check your `.env` or `.env.local` file for:
```
REACT_APP_FIREBASE_STORAGE_BUCKET=...
```

The bucket name is what comes after the `=` sign (without `gs://`).

