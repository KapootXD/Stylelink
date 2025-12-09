# Set JAVA_HOME Manually (If Needed)

## Good News! ✅

**Java 21 is already working!** The `java -version` command shows Java 21.0.9 is active.

I've set JAVA_HOME for your **current user account**. For **system-wide** JAVA_HOME (optional), follow these steps:

## Set JAVA_HOME System-Wide (Optional)

If you want JAVA_HOME set for all users on the system:

### Method 1: Using GUI (Easiest)

1. Press `Win + X` → Click **"System"**
2. Click **"Advanced system settings"** (right side)
3. Click **"Environment Variables"** button
4. Under **"System variables"** (bottom section):
   - Click **"New"**
   - **Variable name:** `JAVA_HOME`
   - **Variable value:** `C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot`
   - Click **"OK"**
5. Find **"Path"** in System variables:
   - Click **"Edit"**
   - Click **"New"**
   - Add: `%JAVA_HOME%\bin`
   - Click **"OK"** on all dialogs
6. **Restart terminal** for changes to take effect

### Method 2: Using PowerShell (Admin)

1. **Right-click** PowerShell → **"Run as Administrator"**
2. Run:
   ```powershell
   [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot", [System.EnvironmentVariableTarget]::Machine)
   ```

## Current Status

✅ **Java 21 is working** - `java -version` shows version 21.0.9
✅ **JAVA_HOME set for user** - Current user account
⚠️ **JAVA_HOME system-wide** - Optional (only needed if you want it for all users)

## Test Firebase Emulators Now

Since Java 21 is working, you can try starting emulators:

```bash
npm run emulators:start
```

The Firestore emulator should now start successfully! 🚀

## Verify Everything Works

1. **Check Java version:**
   ```bash
   java -version
   ```
   Should show: `openjdk version "21.0.9"`

2. **Start emulators:**
   ```bash
   npm run emulators:start
   ```
   Should see: `✔ All emulators ready!`

3. **Start React app** (in another terminal):
   ```bash
   npm run start:emulator
   ```

4. **Test discover page:**
   - Navigate to: http://localhost:3000/discover

Everything should work now! ✅

