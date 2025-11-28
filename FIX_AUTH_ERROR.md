# Fix: ERR_CONNECTION_REFUSED Error

## 🔴 Problem

You're seeing `ERR_CONNECTION_REFUSED` on port 9099 because **Firebase Emulators are not running**.

The green "Connected" messages are misleading - they just mean the connection code ran, not that emulators are actually available.

## ✅ Solution

### Step 1: Start Firebase Emulators (REQUIRED!)

**Open a NEW terminal window** and run:

```bash
npm run emulators:start
```

**Wait for this message:**
```
✔  All emulators ready!
✔  Emulator UI running at http://localhost:4000
```

**⚠️ Keep this terminal window open!** The emulators must stay running.

### Step 2: Verify Emulators Are Running

Open your browser and go to:
- http://localhost:4000 (Emulator UI)

You should see the Firebase Emulator Suite UI. If you get "connection refused", the emulators aren't running.

### Step 3: Restart Your React App

In your React app terminal:

1. **Stop the app**: Press `Ctrl+C`
2. **Start again**:
   ```bash
   npm run start:emulator
   ```

### Step 4: Try Sign-Up Again

Now try signing up - it should work!

## 🔍 How to Check If Emulators Are Running

### Method 1: Check Ports
```bash
# Windows PowerShell
netstat -ano | findstr ":9099"
```

If you see output, emulators are running. If empty, they're not.

### Method 2: Visit Emulator UI
Go to http://localhost:4000 - if it loads, emulators are running.

### Method 3: Check Terminal
Look at your emulator terminal - it should show:
```
✔  All emulators ready!
```

## ⚠️ Common Mistakes

1. **Not starting emulators** - Most common issue!
2. **Closing the emulator terminal** - Emulators stop when terminal closes
3. **Starting app before emulators** - Always start emulators first
4. **Wrong terminal** - Make sure emulators are in a separate terminal

## 📝 Correct Workflow

```bash
# Terminal 1: Start Emulators
npm run emulators:start

# Terminal 2: Start React App (after emulators are ready)
npm run start:emulator
```

## 🆘 Still Having Issues?

1. Make sure Firebase CLI is installed: `firebase --version`
2. Check `.env.local` has `REACT_APP_USE_FIREBASE_EMULATOR=true`
3. Restart both emulators and React app
4. Check firewall isn't blocking ports 9099, 8080, 9199

