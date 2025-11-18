# Firebase Realtime Database Security Rules

## Important Note

Your codebase currently uses **Firestore**, not Realtime Database. These are two different Firebase products:

- **Firestore**: Document-based NoSQL database (what you're using now)
- **Realtime Database**: JSON-based NoSQL database (different product)

If you want to use Realtime Database, you'll need to:
1. Create a Realtime Database in Firebase Console
2. Update your code to use Realtime Database instead of Firestore
3. Use these rules below

## Realtime Database Rules

Go to: **Firebase Console → Realtime Database → Rules**

Paste these rules:

```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": true,
        ".write": "auth != null && auth.uid === $userId",
        ".validate": "newData.hasChildren(['uid', 'email'])"
      }
    },
    "outfits": {
      "$outfitId": {
        ".read": true,
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['userId', 'title'])"
      }
    },
    "likes": {
      "$likeId": {
        ".read": true,
        ".write": "auth != null"
      }
    },
    "shares": {
      "$shareId": {
        ".read": true,
        ".write": "auth != null"
      }
    }
  }
}
```

## Rule Breakdown

### Users
- **`.read: true`** - Anyone can read user profiles
- **`.write: "auth != null && auth.uid === $userId"`** - Only the owner can write their own profile
- **`.validate`** - Ensures required fields (uid, email) are present

### Outfits
- **`.read: true`** - Anyone can read outfits
- **`.write: "auth != null"`** - Only authenticated users can create/update outfits
- **`.validate`** - Ensures required fields (userId, title) are present

### Likes & Shares
- **`.read: true`** - Anyone can read
- **`.write: "auth != null"`** - Only authenticated users can write

## If You Want to Stay with Firestore

If you want to continue using Firestore (recommended - it's what your code uses), use these Firestore rules instead:

Go to: **Firebase Console → Firestore Database → Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /outfits/{outfitId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /likes/{likeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /shares/{shareId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Recommendation

**Stay with Firestore** - Your entire codebase is built for Firestore. Switching to Realtime Database would require rewriting all database operations.

If you're getting parse errors with Firestore rules, the issue is likely:
1. Hidden characters in the editor
2. Wrong quote type
3. Encoding issues

Try typing the rules manually with single quotes: `rules_version = '2';`

