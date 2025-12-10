# Fix: Posts Not Showing in Profile Posts Tab

## Problem

After uploading an outfit, it doesn't appear in the user's profile posts tab.

## Root Cause

Two potential issues:
1. **Firestore Index Missing**: The query uses `where('userId', '==', userId)` with `orderBy('createdAt', 'desc')`, which requires a composite index.
2. **Profile Page Not Refreshing**: After upload, the profile page doesn't automatically refresh to show the new outfit.

## What I Fixed

### 1. Recreated Firestore Indexes File ✅

The `firestore.indexes.json` file was empty. I've recreated it with the necessary composite indexes:

- `userId + createdAt` - For filtering outfits by user and sorting by date
- `occasion + createdAt` - For filtering by occasion
- `season + createdAt` - For filtering by season
- `styleTags + createdAt` - For filtering by style tags
- `createdAt` - For general sorting

### 2. Added Navigation After Upload ✅

Updated `UploadOutfit.tsx` to navigate to profile after successful upload:
- Navigates to `/profile` after upload completes
- Passes `fromUpload: true` state to trigger refresh

### 3. Added Auto-Refresh on Profile Page ✅

Updated `ProfilePage.tsx` to:
- Refresh outfits when navigating to the page (using `location.key`)
- Detect when navigating from upload page (`location.state.fromUpload`)
- Automatically refresh outfits after upload with a small delay

### 4. Added Debug Logging ✅

Added console logs to track:
- When outfits are fetched
- How many outfits are loaded
- When outfits are created in Firestore
- The userId being used for queries

## Next Steps

### Deploy Firestore Indexes

**Important:** You need to deploy the indexes to Firebase:

```bash
firebase deploy --only firestore:indexes
```

Or deploy everything:
```bash
firebase deploy
```

**Note:** Index creation can take a few minutes. Firebase will show you a link to create the index if it doesn't exist.

### Verify It Works

1. **Upload an outfit** from `/upload`
2. **Wait for navigation** to `/profile` (automatic after 1.5 seconds)
3. **Check the Posts tab** - your new outfit should appear
4. **Check browser console** for debug logs showing:
   - Outfit created with userId
   - Outfits fetched for that userId
   - Count of outfits loaded

## Testing

1. Upload an outfit
2. Navigate to profile
3. Check Posts tab
4. Verify the new outfit appears

If it still doesn't work:
- Check browser console for errors
- Verify Firestore indexes are deployed
- Check Firebase Console → Firestore → Data to see if the outfit was created with correct userId

## Summary

✅ **Fixed:** Firestore indexes file recreated
✅ **Fixed:** Navigation to profile after upload
✅ **Fixed:** Auto-refresh on profile page
✅ **Fixed:** Debug logging added

**Action Required:** Deploy Firestore indexes with `firebase deploy --only firestore:indexes`

