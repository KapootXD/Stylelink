# Profile Save Troubleshooting Guide

## Issue: Profile Changes Not Saving

If profile changes aren't saving, check these common issues:

## Quick Debugging Steps

### 1. Check Browser Console
Open DevTools (F12) and look for:
- `📝 Updating profile with data:` - Shows what data is being sent
- `🔥 Writing to Firestore:` - Confirms Firestore write attempt
- `✅ Firestore update successful` - Confirms successful save
- `❌ Error updating user profile:` - Shows any errors

### 2. Check Firestore Security Rules

**Most Common Issue**: Firestore security rules might be blocking writes.

Go to [Firebase Console](https://console.firebase.google.com/project/stylelink-74fdf/firestore/rules) and ensure rules allow profile updates:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Allow anyone to read user profiles
      allow read: if true;
      
      // Allow users to write their own profile
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // Allow creating profile if it doesn't exist
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Allow updating own profile
      allow update: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Important**: Click "Publish" after updating rules!

### 3. Check Firebase Storage Rules

If profile picture upload fails, check Storage rules:

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

### 4. Verify You're Logged In

- Check that you're authenticated
- Try logging out and back in
- Check browser console for auth errors

### 5. Check Network Tab

In DevTools → Network tab:
- Look for requests to Firestore
- Check if requests are failing (red status)
- Look for error responses

## Common Error Messages

### "Permission denied"
**Fix**: Update Firestore security rules (see above)

### "Firestore is not initialized"
**Fix**: Check your `.env` file has all Firebase config values

### "User not authenticated"
**Fix**: Make sure you're logged in

### "Failed to update profile"
**Fix**: Check browser console for specific error details

## Testing the Save Function

1. **Open Browser Console** (F12)
2. **Edit Profile** and click Save
3. **Watch Console** for these messages:
   ```
   📝 Updating profile with data: {...}
   🔥 Writing to Firestore: {...}
   ✅ Firestore update successful
   🔄 Refreshing user profile...
   ✅ User profile refreshed
   📥 Fetching updated profile for: ...
   ✅ Setting profile data: {...}
   ```

4. **Check Firestore Console**:
   - Go to Firebase Console → Firestore Database
   - Navigate to `users` collection
   - Find your user document (by UID)
   - Verify the fields were updated

## Manual Verification

1. **Check Firestore Directly**:
   - Go to [Firebase Console](https://console.firebase.google.com/project/stylelink-74fdf/firestore/data)
   - Navigate to `users/{your-uid}`
   - Check if `displayName`, `username`, `bio`, `location` fields exist
   - Check `updatedAt` timestamp to see if it changed

2. **Check Firebase Storage**:
   - Go to [Firebase Console](https://console.firebase.google.com/project/stylelink-74fdf/storage)
   - Check `{userId}/profile/` folder
   - Verify profile picture was uploaded

## Still Not Working?

1. **Clear browser cache** and try again
2. **Check for JavaScript errors** in console
3. **Try in incognito mode** to rule out extensions
4. **Check Firebase project** - make sure you're using the right project
5. **Verify .env file** has correct Firebase config

## Expected Behavior

When profile saves successfully:
1. ✅ Toast notification: "Profile updated successfully!"
2. ✅ Modal closes
3. ✅ Profile page refreshes with new data
4. ✅ Changes visible immediately
5. ✅ Changes persist after page reload

If any of these don't happen, check the console for errors.

