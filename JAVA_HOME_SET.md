# JAVA_HOME Configuration Complete ✅

## What Was Done

1. ✅ **JAVA_HOME** set to: `C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot`
2. ✅ **PATH** updated to include: `%JAVA_HOME%\bin`

## Important: Restart Terminal

**You need to close and reopen your terminal/PowerShell** for the changes to take effect in your current session.

After restarting, verify with:
```bash
java -version
```

Should show: `openjdk version "21.0.9"` or similar.

## Next Steps

1. **Close this terminal**
2. **Open a new terminal**
3. **Verify Java version:**
   ```bash
   java -version
   ```
4. **Start Firebase emulators:**
   ```bash
   npm run emulators:start
   ```

The Firestore emulator should now start successfully! 🚀

## Troubleshooting

If `java -version` still shows Java 8 after restarting:

1. **Check JAVA_HOME:**
   ```powershell
   [System.Environment]::GetEnvironmentVariable("JAVA_HOME", [System.EnvironmentVariableTarget]::Machine)
   ```
   Should show: `C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot`

2. **Check PATH:**
   ```powershell
   [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine) -split ';' | Select-String "jdk-21"
   ```
   Should show the JDK 21 bin path.

3. **Restart computer** if changes still don't take effect (rare, but sometimes needed).

