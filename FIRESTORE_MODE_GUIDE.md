# Firestore Database Mode Selection Guide

## Quick Answer

**Choose: Production Mode (Locked Mode)**

Then immediately set up security rules. This is the secure and recommended approach.

## Mode Comparison

### Test Mode
- ✅ Allows all reads and writes for 30 days
- ✅ Quick to get started (no rules needed initially)
- ❌ **Automatically locks after 30 days** (can break your app)
- ❌ **Insecure** - anyone can read/write your data
- ❌ Not suitable for production

### Production Mode (Locked Mode)
- ✅ **Secure from the start** - no access until rules are set
- ✅ **Best practice** for production apps
- ✅ Forces you to set up proper security
- ❌ Requires setting rules immediately
- ❌ Slightly more setup work upfront

## Recommended Approach

### Step 1: Create Database in Production Mode

1. Go to: https://console.firebase.google.com/project/stylelink-74fdf/firestore
2. Click "Create database"
3. **Select "Start in production mode"**
4. Choose location: `us-central1` (Iowa)
5. Click "Enable"

### Step 2: Immediately Set Security Rules

Right after creating the database, go to the "Rules" tab and add:

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

3. Click **"Publish"** to save the rules

## Why Production Mode?

1. **Security First**: Your data is protected from day one
2. **No Surprises**: Won't suddenly lock after 30 days
3. **Best Practice**: Industry standard for production apps
4. **Control**: You explicitly define who can access what

## If You Choose Test Mode (Not Recommended)

⚠️ **Warning**: Test mode will automatically lock after 30 days, which can break your app if you forget to set rules!

If you do use test mode:
1. Set a reminder to update rules within 30 days
2. Don't use test mode for production deployments
3. Switch to production rules as soon as possible

## Quick Setup Checklist

After creating database in Production Mode:

- [ ] Database created in Production Mode
- [ ] Security rules set (copy rules above)
- [ ] Rules published
- [ ] Test profile creation works
- [ ] Test profile update works
- [ ] Test outfit upload works

## Testing Your Rules

After setting rules, test that:
1. ✅ You can read your own profile
2. ✅ You can update your own profile
3. ✅ You can create outfits
4. ✅ You can view other users' profiles
5. ❌ You cannot update other users' profiles (should fail)

## My Strong Recommendation

**Use Production Mode** - It's the right way to start, and setting rules only takes 2 minutes. Your app will be secure from the beginning.

