# Quick Fix: Java Version Issue

## The Problem

Firestore emulator requires **Java 21+**, but you have **Java 8** installed. This causes the fatal error.

## Fastest Solution: Update Java

### Step 1: Download JDK 21

1. Go to: **https://adoptium.net/**
2. Click **"Latest LTS Release"** (should be JDK 21)
3. Select:
   - **Operating System:** Windows
   - **Architecture:** x64
   - **Package Type:** JDK
4. Click **"Download"** (installer .msi file)

### Step 2: Install JDK 21

1. Run the downloaded installer
2. Follow the installation wizard
3. **Important:** Note the installation path (usually `C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot`)

### Step 3: Set JAVA_HOME Environment Variable

**Windows 10/11:**

1. Press `Win + X` → **System**
2. Click **"Advanced system settings"** (right side)
3. Click **"Environment Variables"** button
4. Under **"System variables"**, click **"New"**
5. Enter:
   - **Variable name:** `JAVA_HOME`
   - **Variable value:** `C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot` (adjust to your path)
6. Click **"OK"**

### Step 4: Update PATH

1. Still in **Environment Variables**
2. Find **"Path"** in System variables
3. Click **"Edit"**
4. Click **"New"**
5. Add: `%JAVA_HOME%\bin`
6. Click **"OK"** on all dialogs

### Step 5: Verify Installation

1. **Close and reopen** your terminal/PowerShell
2. Run:
   ```bash
   java -version
   ```
3. Should show: `openjdk version "21.x.x"`

### Step 6: Start Emulators

```bash
npm run emulators:start
```

Should now work! ✅

## Alternative: Test Without Firestore (Temporary)

If you need to test immediately and can't update Java right now:

```bash
npm run emulators:start:no-firestore
```

This starts Auth and Storage emulators only (no Firestore). The discover page will work for UI testing, but database features won't work.

## Summary

- **Problem:** Java 8 incompatible with Firestore emulator
- **Solution:** Update to Java 21+
- **Quick Test:** Use `emulators:start:no-firestore` script temporarily

After updating Java, emulators should start successfully! 🚀

