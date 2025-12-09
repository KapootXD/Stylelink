# Find Your Firebase Storage Bucket Name

## The Error

You got: `NotFoundException: 404 The specified bucket does not exist`

This means the bucket name `stylelink-74fdf.firebasestorage.app` doesn't exist or isn't accessible.

## How to Find Your Correct Bucket Name

### Method 1: List All Your Buckets (Easiest)

Run this command to see all your buckets:

```powershell
gsutil ls
```

This will show you all available buckets. Look for one that matches your project.

### Method 2: Check Firebase Console

1. Go to: https://console.firebase.google.com/project/stylelink-74fdf/storage
2. Look at the URL or the bucket name shown on the page
3. The bucket name is usually shown at the top

### Method 3: Check Your Firebase Config

Your bucket name should be in your Firebase configuration. Check:

1. **Firebase Console → Project Settings → General**
2. Scroll down to "Your apps" → Web app
3. Look for `storageBucket` in the config
4. It might be:
   - `stylelink-74fdf.appspot.com` (older format)
   - `stylelink-74fdf.firebasestorage.app` (newer format)
   - Or something else

### Method 4: Check GitLab CI/CD Variables

If you set up GitLab CI/CD variables, check:
- GitLab → Settings → CI/CD → Variables
- Look for `FIREBASE_STORAGE_BUCKET`

## Common Bucket Name Formats

Firebase Storage buckets can have different formats:

1. **Old format:** `project-id.appspot.com`
   - Example: `stylelink-74fdf.appspot.com`

2. **New format:** `project-id.firebasestorage.app`
   - Example: `stylelink-74fdf.firebasestorage.app`

3. **Custom bucket:** Could be anything if you created a custom one

## Try These Commands

### List all buckets:
```powershell
gsutil ls
```

### Try the old format:
```powershell
gsutil cors set cors.json gs://stylelink-74fdf.appspot.com
```

### Check if bucket exists:
```powershell
gsutil ls gs://stylelink-74fdf.appspot.com
gsutil ls gs://stylelink-74fdf.firebasestorage.app
```

## If Bucket Doesn't Exist

If the bucket truly doesn't exist, you might need to:

1. **Enable Firebase Storage** in Firebase Console:
   - Go to: https://console.firebase.google.com/project/stylelink-74fdf/storage
   - Click "Get started" if Storage isn't enabled
   - This will create the bucket automatically

2. **Wait a few minutes** after enabling Storage for it to be fully created

3. **Then try the CORS command again**

## Next Steps

1. Run `gsutil ls` to see all your buckets
2. Try the bucket name that appears in the list
3. Or check Firebase Console for the exact bucket name
4. Then apply CORS with the correct bucket name

