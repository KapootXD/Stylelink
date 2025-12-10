# Fix Firebase Storage Permission Errors

## Problem

Getting `storage/unauthorized` errors when trying to upload images:
- "User does not have permission to access '{userId}/outfits/images/{filename}'"
- Error code: `storage/unauthorized`

## Root Cause

The Firebase Storage security rules exist locally in `storage.rules`, but they haven't been **deployed to production Firebase**. The rules need to be published to Firebase for the live site to use them.

## Solution

Deploy the Storage rules to Firebase. You have two options:

### Option 1: Deploy via Firebase CLI (Recommended)

```bash
# Make sure you're logged in
firebase login

# Deploy only Storage rules
firebase deploy --only storage
```

This will deploy your `storage.rules` file to production Firebase.

### Option 2: Deploy via Firebase Console

1. Go to: https://console.firebase.google.com/project/stylelink-74fdf/storage/rules
2. Click **"Edit rules"**
3. Copy the contents of your `storage.rules` file
4. Paste into the editor
5. Click **"Publish"**

## Verify Rules Are Deployed

After deploying, verify:

1. **Check Firebase Console:**
   - Go to: https://console.firebase.google.com/project/stylelink-74fdf/storage/rules
   - Verify the rules match your local `storage.rules` file

2. **Test Upload:**
   - Try uploading an image again
   - Should work without permission errors

## Your Current Storage Rules

Your `storage.rules` file allows:
- ✅ **Profile pictures**: Public read, owner write
- ✅ **Outfit images**: Public read, authenticated user write (to their own folder)
- ✅ **General uploads**: Public read, owner write

The rules are correct - they just need to be deployed!

## Quick Deploy Command

```bash
firebase deploy --only storage
```

After deploying, try uploading an image again. It should work! 🚀

## Note

If you're using GitLab CI/CD, you might want to add Storage rules deployment to your pipeline, but for now, deploy manually using the command above.

