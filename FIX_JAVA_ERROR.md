# ✅ Fixed: Java Version Error for Storage Emulator

## 🔴 Problem

The Storage emulator requires **Java 11+**, but you have **Java 8**. This causes:
```
UnsupportedClassVersionError: class file version 55.0 (Java 11)
this version only recognizes up to 52.0 (Java 8)
```

## ✅ Quick Fix: Start Auth Emulator Only

I've updated the script to **skip Storage** (which requires Java 11+). 

### Run This Instead:

```bash
npm run emulators:start:auth
```

This starts:
- ✅ **Auth Emulator** (works with Java 8) - **Sign-up/login will work!**
- ✅ **Emulator UI** (works with Java 8)
- ❌ **Storage Emulator** (skipped - requires Java 11+)

**For testing sign-up, you only need Auth!** Storage is optional.

## 🎯 Try It Now

1. **Stop the current emulators** (if running): Press `Ctrl+C`

2. **Start Auth emulator only:**
   ```bash
   npm run emulators:start:auth
   ```

3. **You should see:**
   ```
   ✔  All emulators ready!
   ✔  Emulator UI running at http://localhost:4000
   ```

4. **No more Java errors!** ✅

## 📋 What Changed

- Updated `emulators:start:auth` to skip Storage emulator
- Auth emulator works fine with Java 8
- You can test sign-up/login without Storage

## 🔧 Long-term Fix (Optional)

If you need Storage emulator later, install **Java 21+**:

1. **Download Java 21:**
   - [Microsoft OpenJDK 21](https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-21) (Recommended for Windows)
   - [Adoptium Temurin 21](https://adoptium.net/temurin/releases/?version=21)
   - [Oracle JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)

2. **Install Java 21**

3. **Update JAVA_HOME:**
   - Open System Properties → Environment Variables
   - Set `JAVA_HOME` to Java 21 installation path
   - Add `%JAVA_HOME%\bin` to `PATH`

4. **Restart terminal and verify:**
   ```bash
   java -version  # Should show version 21+
   ```

5. **Then you can use:**
   ```bash
   npm run emulators:start  # Starts all emulators including Storage
   ```

## ✅ For Now

Just use:
```bash
npm run emulators:start:auth
```

**This is enough to test authentication!** 🎉

