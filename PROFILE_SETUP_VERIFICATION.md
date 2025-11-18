# Profile Setup Verification Checklist

## ✅ After Setting Firestore Rules

After you've set the Firestore rules and restarted your server, profiles should work! Here's what to verify:

## Quick Verification Steps

### 1. Check Firestore Rules Are Published
- Go to: https://console.firebase.google.com/project/stylelink-74fdf/firestore/rules
- Verify rules are published (not in draft mode)
- Should see your rules with `allow read: if true` and `allow write: if request.auth != null && request.auth.uid == userId`

### 2. Restart Your Development Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm start
```

### 3. Test Profile Functionality

**Test 1: View Your Profile**
1. Log in to your app
2. Navigate to `/profile`
3. Should see your profile (even if empty initially)

**Test 2: Edit Profile**
1. Click "Edit Profile" button
2. Update display name, username, bio, location
3. Upload a profile picture (optional)
4. Click "Save Changes"
5. Should see success message: "Profile updated successfully!"

**Test 3: Verify Data Saved**
1. Go to Firebase Console → Firestore Database
2. Navigate to `users` collection
3. Find your user document (by your UID)
4. Verify fields were updated:
   - `displayName`
   - `username`
   - `bio`
   - `location`
   - `avatarUrl` or `photoURL` (if you uploaded a picture)
   - `updatedAt` timestamp

### 4. Check Browser Console

Open DevTools (F12) and look for:
- ✅ `📝 Updating profile with data:` - Shows data being sent
- ✅ `🔥 Writing to Firestore:` - Confirms write attempt
- ✅ `✅ Firestore update successful` - Confirms save worked
- ❌ Any error messages (especially "permission denied")

## Expected Behavior

✅ **Should Work:**
- Viewing your own profile
- Editing your own profile
- Saving profile changes
- Uploading profile pictures
- Viewing other users' profiles (read-only)

❌ **Should NOT Work:**
- Editing other users' profiles (should get permission denied)
- Saving without being logged in

## Common Issues & Fixes

### Issue: "Permission denied" error
**Fix:** Check that Firestore rules are published (not in draft)

### Issue: Profile not saving
**Fix:** 
1. Check browser console for specific errors
2. Verify you're logged in
3. Check Firestore rules are correct

### Issue: Profile picture not uploading
**Fix:** Check Firebase Storage rules (separate from Firestore rules)

### Issue: Changes not showing after save
**Fix:** 
1. Refresh the page
2. Check that `refreshUserProfile()` is being called
3. Check browser console for refresh errors

## Storage Rules (For Profile Pictures)

If profile picture upload fails, also check Storage rules:

Go to: **Firebase Console → Storage → Rules**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{userId}/profile/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Quick Test Script

After restarting, try this in your app:

1. **Login** → Should work
2. **Go to Profile** → Should load (even if empty)
3. **Click Edit Profile** → Modal should open
4. **Change display name** → Type something
5. **Click Save** → Should see success message
6. **Check profile page** → Should show updated name
7. **Check Firestore Console** → Should see updated data

If all these work, profiles are fully functional! 🎉

