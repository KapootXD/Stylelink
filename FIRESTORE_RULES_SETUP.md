# Firestore Security Rules Setup Guide

## Step-by-Step Instructions

### Step 1: Navigate to Rules Tab

1. Go to: https://console.firebase.google.com/project/stylelink-74fdf/firestore/rules
2. Click on the **"Rules"** tab (at the top of the Firestore Database page)

### Step 2: Replace All Existing Code

**YES - Delete everything in the editor and paste the new code.**

The default rules (in production mode) look like this:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Replace ALL of it** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - public read, own write
    match /users/{userId} {
      allow read: if true;  // Anyone can read profiles
      allow write: if request.auth != null && request.auth.uid == userId;  // Only own profile
    }
    
    // Outfits - public read, authenticated write
    match /outfits/{outfitId} {
      allow read: if true;  // Anyone can view outfits
      allow create: if request.auth != null;  // Logged in users can create
      allow update, delete: if request.auth != null && request.resource.data.userId == request.auth.uid;  // Only owner can update/delete
    }
    
    // Likes - authenticated only
    match /likes/{likeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Shares - authenticated only
    match /shares/{shareId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 3: Publish the Rules

1. After pasting the new code, click the **"Publish"** button (usually at the top right)
2. Wait for confirmation that rules are published
3. You should see a success message

## Visual Guide

```
┌─────────────────────────────────────────┐
│  Firestore Database                     │
├─────────────────────────────────────────┤
│  [Data] [Rules] [Indexes] [Usage]      │ ← Click "Rules"
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Rules Editor                           │
├─────────────────────────────────────────┤
│  [Select All] [Delete]                  │
│                                         │
│  [DELETE ALL EXISTING CODE HERE]        │
│                                         │
│  [PASTE NEW CODE HERE]                  │
│                                         │
│  [Publish] ← Click this button          │
└─────────────────────────────────────────┘
```

## What Each Rule Does

### Users Collection
- **`allow read: if true`** - Anyone can view user profiles (needed for public profiles)
- **`allow write: if request.auth != null && request.auth.uid == userId`** - Only the owner can update their own profile

### Outfits Collection
- **`allow read: if true`** - Anyone can view outfits (public feed)
- **`allow create: if request.auth != null`** - Logged-in users can upload outfits
- **`allow update, delete: if request.auth != null && request.resource.data.userId == request.auth.uid`** - Only the owner can edit/delete their outfits

### Likes & Shares Collections
- **`allow read: if true`** - Anyone can view likes/shares
- **`allow write: if request.auth != null`** - Only logged-in users can like/share

## Important Notes

✅ **Do**: Replace all existing code  
✅ **Do**: Click "Publish" after pasting  
✅ **Do**: Wait for confirmation message  
❌ **Don't**: Keep any old code  
❌ **Don't**: Forget to publish  

## Verification

After publishing, you should:
1. See a success message
2. Be able to save your profile in the app
3. Be able to upload outfits
4. See no "permission denied" errors in console

## Troubleshooting

If you get errors after publishing:
1. Check that you copied the entire code block
2. Make sure there are no syntax errors (check for missing brackets)
3. Verify you clicked "Publish"
4. Try refreshing the page and checking rules again

