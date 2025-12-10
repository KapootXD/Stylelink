# Local Test Server Guide - Discover Page Testing

## 🚀 Quick Start (2 Steps)

### Step 1: Start Firebase Emulators

Open **Terminal 1** and run:

```bash
npm run emulators:start
```

Wait until you see:
```
✔  All emulators ready!
✔  Emulator UI running at http://localhost:4000
```

**Keep this terminal open** - emulators must stay running.

### Step 2: Start React App

Open **Terminal 2** (new terminal) and run:

```bash
npm run start:emulator
```

Or if you prefer regular start:
```bash
npm start
```

The app will open at: **http://localhost:3000**

## ✅ Verify It's Working

1. **Check Browser Console** (F12):
   - Should see: `Firebase initialized successfully`
   - Should see: `Connected to Firebase Auth Emulator`
   - Should see: `Connected to Firebase Firestore Emulator`
   - Should see: `Connected to Firebase Storage Emulator`
   - **No "demo mode" warnings!**

2. **Check Emulator UI**: http://localhost:4000
   - You should see Auth, Firestore, and Storage tabs
   - This confirms emulators are running

## 🧪 Testing the Discover Page

### 1. Navigate to Discover Page

Go to: **http://localhost:3000/discover**

### 2. Test Authentication (Required)

The discover page requires authentication. You'll need to:

1. **Sign up** (if you don't have an account):
   - Go to: http://localhost:3000/signup/customer
   - Fill in email, password, display name, username
   - Click "Create Account"
   - You'll be redirected to profile

2. **Or sign in** (if you already have an account):
   - Go to: http://localhost:3000/login
   - Enter your credentials
   - Click "Sign In"

### 3. Test Discover Page Features

Once logged in and on `/discover`:

- ✅ **Page loads** - Should see outfit feed
- ✅ **Outfits display** - Should see outfit cards/images
- ✅ **Scroll functionality** - Should be able to scroll through outfits
- ✅ **Like button** - Click heart icon to like outfits
- ✅ **Share button** - Click share icon to share outfits
- ✅ **Click outfit card** - Should navigate to details or results

### 4. Add Test Data (Optional)

If the discover page is empty, you can seed test data:

**Option A: Via Emulator UI**
1. Go to: http://localhost:4000
2. Click **Firestore** tab
3. Click **"Start collection"**
4. Collection ID: `outfits`
5. Add documents with outfit data

**Option B: Via Seed Script**
```bash
# In Terminal 3 (while emulators are running)
npm run seed:emulators
```

## 🔍 Troubleshooting

### "Page redirects to /login"

**Fix:** You need to be authenticated. Sign up or sign in first.

### "No outfits showing"

**Fix:** 
1. Check Emulator UI (http://localhost:4000) → Firestore tab
2. Verify `outfits` collection exists
3. Add test outfits manually or run seed script

### "Firebase configuration is missing"

**Fix:**
1. Check `.env.local` file exists
2. Verify `REACT_APP_USE_FIREBASE_EMULATOR=true`
3. Restart React app (Ctrl+C, then `npm run start:emulator`)

### "Cannot connect to emulators"

**Fix:**
1. Make sure emulators are running (Terminal 1)
2. Check ports aren't blocked:
   - Auth: 9099
   - Firestore: 8080
   - Storage: 9199
   - UI: 4000
3. Try restarting emulators

### "Port already in use"

**Fix:**
1. Stop other Firebase emulator instances
2. Or change ports in `firebase.json`

## 📋 Complete Workflow

```bash
# Terminal 1: Start emulators
npm run emulators:start

# Terminal 2: Start React app
npm run start:emulator

# Terminal 3 (optional): Seed test data
npm run seed:emulators
```

Then:
1. Open http://localhost:3000
2. Sign up or sign in
3. Navigate to /discover
4. Test all features!

## 🌐 Access Points

- **React App**: http://localhost:3000
- **Discover Page**: http://localhost:3000/discover
- **Emulator UI**: http://localhost:4000
- **Login Page**: http://localhost:3000/login
- **Signup Page**: http://localhost:3000/signup/customer

## 💡 Tips

- Keep emulators running while testing
- Use Emulator UI to view/manage test data
- Check browser console for errors
- Data persists until you stop emulators
- Use `Ctrl+C` to stop emulators when done

## 🎯 Quick Test Checklist

- [ ] Emulators running (Terminal 1)
- [ ] React app running (Terminal 2)
- [ ] Browser console shows Firebase connected
- [ ] Can navigate to /discover
- [ ] Can see outfit feed (or empty state)
- [ ] Can interact with outfits (like, share, click)
- [ ] No console errors

