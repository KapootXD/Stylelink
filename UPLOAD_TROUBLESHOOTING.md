# Upload Troubleshooting Guide

## Issue: Image Stuck During Upload

If your image upload is stuck or hanging, try these solutions:

## Quick Fixes

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for errors:
- Look for red error messages
- Check for Firebase Storage errors
- Look for compression errors

### 2. Check Firebase Storage Configuration

**Verify Storage is enabled:**
1. Go to [Firebase Console](https://console.firebase.google.com/project/stylelink-74fdf/storage)
2. Make sure Storage is enabled
3. If not, click "Get started" and enable it

**Check Storage Security Rules:**
1. Go to Firebase Console → Storage → Rules
2. Make sure rules allow authenticated uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Allow read for everyone
      allow read: if true;
      
      // Allow write only for authenticated users
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Check Network Connection
- Slow internet can make uploads appear stuck
- Check your internet speed
- Try a different network if possible

### 4. Check File Size
- Very large files (>10MB) may take a long time
- Check browser console for file size info
- Compression should reduce file size automatically

## Common Error Messages

### "Storage unauthorized"
**Fix:** Update Firebase Storage security rules (see above)

### "User not authenticated"
**Fix:** Make sure you're logged in before uploading

### "Compression timeout"
**Fix:** This is okay - the system will use the original file. Upload may take longer.

### "Storage quota exceeded"
**Fix:** Your Firebase Storage quota is full. Upgrade your plan or delete old files.

## Debug Steps

### Step 1: Check Console Logs
Look for these messages in the browser console:
- `📤 Uploading file: ...` - Upload started
- `✅ File uploaded successfully` - Upload completed
- `❌ Error uploading file` - Upload failed

### Step 2: Test with Small Image
Try uploading a small image (< 1MB) first to see if the issue is file-size related.

### Step 3: Check Firebase Storage
1. Go to Firebase Console → Storage
2. Check if files are actually being uploaded
3. Look for any error messages

### Step 4: Disable Compression (Temporary)
If compression is causing issues, you can temporarily disable it by modifying the code, but the current implementation should automatically fall back to original files if compression fails.

## Still Not Working?

1. **Clear browser cache** - Sometimes cached files cause issues
2. **Try different browser** - Test in Chrome, Firefox, or Edge
3. **Check Firebase project** - Make sure you're using the correct project
4. **Verify .env file** - Make sure Firebase Storage bucket is configured correctly

## Performance Tips

- **Compression is automatic** - Large images are automatically compressed
- **Progress bar shows status** - Watch for "Compressing images..." then "Uploading images..."
- **Multiple files upload in parallel** - This speeds things up
- **Small files upload faster** - Images under 2MB upload much faster

## Getting Help

If uploads are still stuck:
1. Check browser console for specific error codes
2. Check Firebase Console → Storage for any errors
3. Verify your internet connection is stable
4. Try uploading a very small test image first

