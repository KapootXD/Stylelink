# Terminal Guide - Finding Your React App

## 🖥️ How to Find Your React App Terminal

### Method 1: Look for the React Dev Server Output

Your React app terminal should show:
```
Compiled successfully!

You can now view stylelink in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Look for a terminal window showing:**
- `npm start` or `npm run start:emulator` command
- "Compiled successfully!" message
- URL like `http://localhost:3000`
- React compilation messages

### Method 2: Check Taskbar/Windows

1. **Look at your taskbar** - Find terminal windows (PowerShell, Command Prompt, or VS Code terminal)
2. **Alt+Tab** through open windows to find terminal windows
3. **Check VS Code** - If you're using VS Code, look for terminal tabs at the bottom

### Method 3: Close and Restart (Easiest)

If you can't find it, just:
1. Close any terminal windows you see
2. Open a fresh terminal in your project folder
3. Start the app again

## 📋 Recommended Terminal Setup

For Firebase Emulators + React App, you need **2 terminal windows**:

### Terminal 1: Firebase Emulators
**Purpose:** Runs Firebase emulators (Auth, Storage, etc.)

**Location:** Open in your project folder (`C:\Users\gavin\Documents\stylelink`)

**Command:**
```bash
npm run emulators:start:auth
```

**What you'll see:**
```
✔  All emulators ready!
✔  Emulator UI running at http://localhost:4000
```

**Keep this running** - don't close it!

### Terminal 2: React App
**Purpose:** Runs your React development server

**Location:** Open in your project folder (`C:\Users\gavin\Documents\stylelink`)

**Command:**
```bash
npm run start:emulator
```
or
```bash
npm start
```

**What you'll see:**
```
Compiled successfully!
Local: http://localhost:3000
```

## 🔍 Quick Check: Is React App Running?

### Option 1: Open Browser
Go to: http://localhost:3000

- **If the page loads** → React app is running ✅
- **If you get "connection refused"** → React app is NOT running ❌

### Option 2: Check Port 3000
Open PowerShell and run:
```powershell
netstat -ano | findstr ":3000"
```

- **If you see output** → Something is running on port 3000
- **If empty** → Port 3000 is free (app not running)

## 🆕 Starting Fresh (If You Can't Find It)

### Step 1: Open New Terminal for Emulators

1. Open PowerShell or Command Prompt
2. Navigate to project:
   ```bash
   cd C:\Users\gavin\Documents\stylelink
   ```
3. Start emulators:
   ```bash
   npm run emulators:start:auth
   ```
4. **Keep this terminal open!**

### Step 2: Open Another Terminal for React App

1. Open a **NEW** PowerShell/Command Prompt window
2. Navigate to project:
   ```bash
   cd C:\Users\gavin\Documents\stylelink
   ```
3. Start React app:
   ```bash
   npm run start:emulator
   ```

### Step 3: Label Your Terminals

**VS Code users:** 
- Click the "+" button to open multiple terminals
- Right-click terminal tab → "Rename" 
- Name them: "Firebase Emulators" and "React App"

**Windows Terminal users:**
- You can create named tabs for each

## 📝 Visual Guide

```
┌─────────────────────────────────────┐
│ Terminal 1: Firebase Emulators      │
│ $ npm run emulators:start:auth      │
│ ✔  All emulators ready!             │
│ ✔  Emulator UI: localhost:4000      │
│ [Keep this running]                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Terminal 2: React App               │
│ $ npm run start:emulator            │
│ Compiled successfully!              │
│ Local: http://localhost:3000        │
│ [Keep this running]                 │
└─────────────────────────────────────┘
```

## 🎯 Quick Steps to Get Started

1. **Open Terminal 1** → Run `npm run emulators:start:auth`
2. **Wait** for "All emulators ready!" message
3. **Open Terminal 2** → Run `npm run start:emulator`
4. **Open browser** → Go to http://localhost:3000
5. **Try signing up!** ✅

## 💡 Pro Tip: Using VS Code Integrated Terminal

If you use VS Code:
1. Open VS Code in your project folder
2. Press `` Ctrl+` `` (backtick) to open terminal
3. Click the **"+"** button (or split button) to create multiple terminals
4. Run emulators in Terminal 1
5. Run React app in Terminal 2

You can see both at the same time! 🎉

## ❓ Still Can't Find It?

If you really can't find where React is running:

1. **Close all terminals**
2. **Restart fresh** using the steps above
3. **Use VS Code** - it makes managing multiple terminals easier

