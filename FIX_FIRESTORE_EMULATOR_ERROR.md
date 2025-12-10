# Fix Firestore Emulator Fatal Error

## Problem

Firestore emulator is crashing with "Fatal error occurred" and exiting with code 1. This is likely due to Java version incompatibility (you have Java 8, but Firebase emulators need Java 21+).

## Solution Options

### Option 1: Start Without Firestore (Quick Test) ⚡

For testing the discover page, you can start emulators **without Firestore** temporarily:

**Update `package.json`** - Add a new script:

```json
"emulators:start:no-firestore": "firebase emulators:start --only auth,storage,ui"
```

Then run:
```bash
npm run emulators:start:no-firestore
```

**Note:** This will work for Auth and Storage, but Firestore features won't work. The discover page might work in demo mode or with cached data.

### Option 2: Update Java (Recommended) ✅

The proper fix is to update Java to version 21 or above.

#### Windows - Using Adoptium (Recommended)

1. **Download JDK 21:**
   - Go to: https://adoptium.net/
   - Select: **JDK 21** (LTS)
   - Choose: **Windows x64** installer
   - Download and install

2. **Set JAVA_HOME:**
   - Open **System Properties** → **Environment Variables**
   - Click **New** under **System variables**
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot` (adjust path)
   - Click **OK**

3. **Update PATH:**
   - Find **Path** in System variables
   - Click **Edit**
   - Add: `%JAVA_HOME%\bin`
   - Click **OK** on all dialogs

4. **Verify:**
   - Close and reopen terminal
   - Run: `java -version`
   - Should show: `openjdk version "21.x.x"`

5. **Restart Emulators:**
   ```bash
   npm run emulators:start
   ```

#### Windows - Using Chocolatey (Alternative)

```bash
# Install Chocolatey if not installed
# Then run:
choco install openjdk21

# Verify installation
java -version
```

### Option 3: Use Production Firebase (Temporary)

If you need to test immediately, you can use production Firebase instead of emulators:

1. **Update `.env.local`:**
   ```env
   REACT_APP_USE_FIREBASE_EMULATOR=false
   REACT_APP_FIREBASE_API_KEY=your-actual-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=stylelink-74fdf.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=stylelink-74fdf
   REACT_APP_FIREBASE_STORAGE_BUCKET=stylelink-74fdf.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

2. **Start React app:**
   ```bash
   npm start
   ```

**Warning:** This uses your production Firebase, so be careful with test data!

## Quick Test Without Firestore

If you just want to test the discover page UI without database features:

1. **Start Auth and Storage only:**
   ```bash
   firebase emulators:start --only auth,storage,ui
   ```

2. **Start React app:**
   ```bash
   npm run start:emulator
   ```

3. **Test discover page:**
   - Navigate to: http://localhost:3000/discover
   - Auth will work (login/signup)
   - Storage will work (file uploads)
   - Firestore features won't work (outfits won't load from database)

## Recommended Approach

**Best solution:** Update Java to version 21+ (Option 2)

This will:
- ✅ Fix Firestore emulator
- ✅ Fix future compatibility issues
- ✅ Allow full emulator functionality
- ✅ Prepare for Firebase Tools v15

## Verify Fix

After updating Java:

```bash
# Check Java version
java -version
# Should show: openjdk version "21.x.x" or higher

# Start emulators
npm run emulators:start
# Should see: ✔ All emulators ready!
```

## Summary

- **Root Cause:** Java 8 is incompatible with Firestore emulator
- **Quick Fix:** Start emulators without Firestore (limited functionality)
- **Proper Fix:** Update Java to version 21+
- **Alternative:** Use production Firebase temporarily

Choose the option that works best for your immediate needs! 🚀

