# Quick Start Guide - Firebase Emulator Setup

## 🚨 Current Issue

Your app is running in **demo mode** because Firebase is not configured. To enable authentication and database features, you need to:

1. **Start Firebase Emulators** (for local testing)
2. **Restart your React app**

## Step-by-Step Setup

### Step 1: Start Firebase Emulators

Open a **new terminal window** and run:

```bash
npm run emulators:start
```

Wait until you see:
```
✔  All emulators ready!
✔  Emulator UI running at http://localhost:4000
```

**Keep this terminal open** - the emulators need to keep running.

### Step 2: Restart Your React App

In your **original terminal** (where you ran `npm start`):

1. Stop the app (press `Ctrl+C`)
2. Start it again with emulator support:
   ```bash
   npm run start:emulator
   ```

Or if you're just using regular `npm start`:
```bash
npm start
```

### Step 3: Verify It's Working

After restarting, check the browser console. You should see:
- ✅ `Firebase initialized successfully`
- ✅ `Connected to Firebase Auth Emulator`
- ✅ `Connected to Firebase Firestore Emulator`
- ✅ `Connected to Firebase Storage Emulator`

**No more "demo mode" warnings!**

## 🌐 Access Points

- **React App**: http://localhost:3000
- **Emulator UI**: http://localhost:4000 (manage test data here)

## 🔑 Testing Sign-Up

1. Make sure emulators are running (Step 1)
2. Restart your app (Step 2)
3. Go to http://localhost:3000
4. Try signing up - it should work now!

The user will be created in the local emulator (not production Firebase).

## 📝 Managing Test Data

Visit http://localhost:4000 (Emulator UI) to:
- View created users
- See Firestore collections
- Manage test data
- Clear data between tests

## 🛠️ Troubleshooting

### "Firebase configuration is missing" error persists?

1. Make sure `.env.local` file exists in the project root
2. Restart your React app (environment variables load at start)
3. Check that `REACT_APP_USE_FIREBASE_EMULATOR=true` is set

### "Connection refused" errors?

- Make sure emulators are running (`npm run emulators:start`)
- Check that ports 9099, 8080, 9199 are not blocked

### Still having issues?

Check the [Full Emulator Setup Guide](./docs/FIREBASE_EMULATOR_SETUP.md)

