# Start Local Test Server - Discover Page

## 🚀 Quick Start (2 Terminal Windows)

### Terminal 1: Start Firebase Emulators

```bash
npm run emulators:start
```

**Wait for this message:**
```
✔  All emulators ready!
✔  Emulator UI running at http://localhost:4000
```

**Keep this terminal open!** Emulators must keep running.

### Terminal 2: Start React App

```bash
npm run start:emulator
```

The app will automatically open at: **http://localhost:3000**

## ✅ Verify Setup

1. **Check Browser Console** (Press F12):
   - Look for: `Firebase initialized successfully`
   - Look for: `Connected to Firebase Auth Emulator`
   - Look for: `Connected to Firebase Firestore Emulator`
   - Look for: `Connected to Firebase Storage Emulator`
   - ✅ **No "demo mode" warnings!**

2. **Check Emulator UI**: 
   - Open: http://localhost:4000
   - You should see tabs for Auth, Firestore, and Storage

## 🧪 Test Discover Page

### Step 1: Sign Up or Sign In

The discover page (`/discover`) requires authentication.

**Option A: Sign Up (New User)**
1. Go to: http://localhost:3000/signup/customer
2. Fill in:
   - Email: `test@example.com`
   - Password: `password123`
   - Display Name: `Test User`
   - Username: `testuser`
3. Click **"Create Account"**
4. You'll be redirected to `/profile`

**Option B: Sign In (Existing User)**
1. Go to: http://localhost:3000/login
2. Enter your credentials
3. Click **"Sign In"**

### Step 2: Navigate to Discover Page

Once logged in:
- Go to: **http://localhost:3000/discover**
- Or click "Discover" in the navigation menu

### Step 3: Test Discover Page Features

✅ **Page loads** - Should see outfit feed (or empty state)
✅ **Outfits display** - Should see outfit cards/images
✅ **Scroll functionality** - Scroll through outfits
✅ **Like button** - Click heart icon to like outfits
✅ **Share button** - Click share icon to share outfits
✅ **Click outfit card** - Navigate to details

## 📊 Add Test Data (If Page is Empty)

If the discover page shows no outfits, add test data:

### Option 1: Via Emulator UI (Easiest)

1. Open: http://localhost:4000
2. Click **Firestore** tab
3. Click **"Start collection"**
4. Collection ID: `outfits`
5. Document ID: (leave empty for auto-generated)
6. Add fields:
   - `title` (string): "Summer Casual Outfit"
   - `description` (string): "Perfect for a sunny day"
   - `userId` (string): (your user ID from Auth tab)
   - `createdAt` (timestamp): (current time)
   - `mainImageUrl` (string): "https://via.placeholder.com/400"
   - `likes` (number): 0
   - `shares` (number): 0
   - `isPublic` (boolean): true
7. Click **"Save"**
8. Refresh discover page

### Option 2: Via Seed Script

```bash
# In Terminal 3 (while emulators are running)
npm run seed:emulators
```

## 🔍 Troubleshooting

### ❌ "Page redirects to /login"

**Solution:** You need to be authenticated first.
- Sign up: http://localhost:3000/signup/customer
- Or sign in: http://localhost:3000/login

### ❌ "No outfits showing"

**Solution:** Add test data to Firestore.
- Use Emulator UI: http://localhost:4000 → Firestore → Create `outfits` collection
- Or run seed script: `npm run seed:emulators`

### ❌ "Firebase configuration is missing"

**Solution:** Check `.env.local` file.
1. Make sure file exists: `C:\Users\gavin\Documents\stylelink\.env.local`
2. Should contain: `REACT_APP_USE_FIREBASE_EMULATOR=true`
3. Restart React app (Ctrl+C, then `npm run start:emulator`)

### ❌ "Cannot connect to emulators"

**Solution:** 
1. Make sure emulators are running (Terminal 1)
2. Check ports aren't blocked:
   - Auth: 9099
   - Firestore: 8080
   - Storage: 9199
   - UI: 4000
3. Try restarting emulators

### ❌ "Port already in use"

**Solution:**
1. Stop other Firebase emulator instances
2. Or change ports in `firebase.json`

## 📋 Complete Command Reference

```bash
# Terminal 1: Start emulators (keep running)
npm run emulators:start

# Terminal 2: Start React app
npm run start:emulator

# Terminal 3 (optional): Seed test data
npm run seed:emulators
```

## 🌐 Important URLs

- **React App**: http://localhost:3000
- **Discover Page**: http://localhost:3000/discover
- **Emulator UI**: http://localhost:4000
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup/customer
- **Profile**: http://localhost:3000/profile

## ✅ Quick Test Checklist

Before testing discover page:
- [ ] Emulators running (Terminal 1 shows "All emulators ready!")
- [ ] React app running (Terminal 2 shows "Compiled successfully!")
- [ ] Browser console shows Firebase connected (no errors)
- [ ] User is authenticated (signed up or signed in)
- [ ] Can navigate to /discover
- [ ] Can see outfit feed (or empty state message)
- [ ] Can interact with outfits (like, share, click)

## 💡 Pro Tips

- **Keep emulators running** while testing
- **Use Emulator UI** (localhost:4000) to view/manage test data
- **Check browser console** (F12) for any errors
- **Data persists** until you stop emulators
- **Use Ctrl+C** to stop emulators when done testing

## 🎯 What to Test on Discover Page

1. ✅ Page loads without errors
2. ✅ Outfits display correctly
3. ✅ Scroll works smoothly
4. ✅ Like button updates count
5. ✅ Share button works
6. ✅ Clicking outfit card navigates correctly
7. ✅ Loading states show properly
8. ✅ Empty state shows when no outfits
9. ✅ Error handling works (if API fails)

## 🛑 Stop Testing

When done testing:
1. **Terminal 2**: Press `Ctrl+C` to stop React app
2. **Terminal 1**: Press `Ctrl+C` to stop emulators
3. All test data will be cleared (unless exported)

---

**Ready to test?** Follow the Quick Start steps above! 🚀

