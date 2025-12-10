# Fix: Bucket Not Found Error

## The Error

```
NotFoundException: 404 The specified bucket does not exist.
```

This means either:
1. The bucket name is wrong
2. Firebase Storage isn't enabled yet
3. You need to use a different bucket name format

## Solution Steps

### Step 1: Check if Firebase Storage is Enabled

1. Go to: https://console.firebase.google.com/project/stylelink-74fdf/storage
2. **If you see "Get started"** → Click it to enable Storage
3. **If Storage is already enabled** → Note the bucket name shown

### Step 2: Find Your Correct Bucket Name

The bucket name format might be different. Try these:

**Option A: Old Format (Most Common)**
```powershell
gsutil cors set cors.json gs://stylelink-74fdf.appspot.com
```

**Option B: Check Firebase Console**
1. Go to: https://console.firebase.google.com/project/stylelink-74fdf/storage
2. Look at the URL or bucket name displayed
3. It might show something like: `stylelink-74fdf.appspot.com`

**Option C: Check Project Settings**
1. Go to: https://console.firebase.google.com/project/stylelink-74fdf/settings/general
2. Scroll to "Your apps" → Click your web app
3. Look for `storageBucket` in the config
4. Copy that exact value

### Step 3: List All Your Buckets

If you have `gsutil` installed correctly, try listing buckets:

```powershell
gsutil ls -p stylelink-74fdf
```

Or just:
```powershell
gsutil ls
```

This will show all available buckets.

### Step 4: Enable Storage if Needed

If Storage isn't enabled:

1. Go to: https://console.firebase.google.com/project/stylelink-74fdf/storage
2. Click **"Get started"**
3. Choose a location (same as your Firestore location)
4. Click **"Done"**
5. **Wait 2-3 minutes** for the bucket to be created
6. Then try the CORS command again

### Step 5: Try Alternative Bucket Name

Most likely, your bucket uses the **old format**:

```powershell
gsutil cors set cors.json gs://stylelink-74fdf.appspot.com
```

Notice: `.appspot.com` instead of `.firebasestorage.app`

## Quick Checklist

- [ ] Storage is enabled in Firebase Console
- [ ] You're using the correct bucket name format
- [ ] You're authenticated: `gcloud auth login`
- [ ] You have the right project selected: `gcloud config set project stylelink-74fdf`

## Most Likely Fix

Try this command (old format):

```powershell
gsutil cors set cors.json gs://stylelink-74fdf.appspot.com
```

If that doesn't work, check Firebase Console for the exact bucket name!

