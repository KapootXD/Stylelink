# .env File Troubleshooting Guide

## Issue: API Key Not Working Even After Updating

If you're still getting "api-key-not-valid" errors after updating your .env file, try these solutions:

## Solution 1: Verify File Was Saved

1. **Open `.env` file** in your code editor (VS Code, Notepad++, etc.)
2. **Verify** the API key line looks like this:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyC... (your actual key)
   ```
   NOT like this:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key-here
   ```
3. **Save the file** (Ctrl+S or File → Save)
4. **Close and reopen** the file to verify it saved

## Solution 2: Check for Common Mistakes

### ❌ Wrong Format (with quotes):
```env
REACT_APP_FIREBASE_API_KEY="AIzaSyC..."
```
**Fix:** Remove quotes
```env
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
```

### ❌ Wrong Format (with spaces):
```env
REACT_APP_FIREBASE_API_KEY = AIzaSyC...
```
**Fix:** Remove spaces around `=`
```env
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
```

### ❌ Wrong Format (extra characters):
```env
REACT_APP_FIREBASE_API_KEY=AIzaSyC... (with trailing space)
```
**Fix:** No trailing spaces or comments on same line

## Solution 3: Hard Restart Dev Server

Environment variables are only loaded when the server **starts**. A simple restart might not be enough:

1. **Stop the server completely:**
   - Press `Ctrl+C` in the terminal
   - Wait for it to fully stop
   - Close the terminal window if needed

2. **Clear any caches:**
   ```bash
   # Clear npm cache (optional)
   npm cache clean --force
   
   # Delete node_modules/.cache if it exists
   Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
   ```

3. **Start fresh:**
   ```bash
   npm start
   ```

## Solution 4: Verify Environment Variables Are Loaded

After restarting, check the browser console. You should see:

✅ **Good:**
```
Initializing Firebase with config: { apiKey: "AIzaSyC...", ... }
✅ Firebase initialized successfully
```

❌ **Bad:**
```
Firebase configuration is missing
App will run in demo mode with mock data
```

## Solution 5: Check File Location

Make sure `.env` is in the **root directory** of your project:
```
C:\Users\gavin\Documents\stylelink\.env  ✅ Correct
C:\Users\gavin\Documents\stylelink\src\.env  ❌ Wrong
```

## Solution 6: Verify API Key in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/project/stylelink-74fdf/settings/general)
2. Scroll to "Your apps" → Web app
3. Click gear icon → "Config"
4. Copy the `apiKey` value
5. Compare it character-by-character with your `.env` file

**Note:** Firebase API keys usually start with `AIza` and are about 39 characters long.

## Solution 7: Check for Multiple .env Files

Sometimes there might be multiple environment files:

```bash
# Check for all .env files
Get-ChildItem -Path . -Filter ".env*" -Recurse
```

Make sure you're editing the one in the root directory.

## Solution 8: File Encoding Issues

If you're using Notepad on Windows:

1. **Don't use Windows Notepad** - it can cause encoding issues
2. **Use VS Code** or **Notepad++** instead
3. Make sure file is saved as **UTF-8** encoding

## Solution 9: Browser Cache

Sometimes the browser caches old JavaScript:

1. **Hard refresh:** `Ctrl+Shift+R` or `Ctrl+F5`
2. **Clear browser cache** for localhost
3. **Try incognito/private mode**

## Solution 10: Verify All Required Variables

Make sure ALL these are set (not just API key):

```env
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=stylelink-74fdf.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=stylelink-74fdf
REACT_APP_FIREBASE_STORAGE_BUCKET=stylelink-74fdf.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abc123
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Quick Diagnostic Command

Run this to check your .env file:

```powershell
# Check if API key is set (shows first 15 chars only)
Get-Content .env | Select-String "REACT_APP_FIREBASE_API_KEY" | ForEach-Object {
    if ($_ -match "REACT_APP_FIREBASE_API_KEY=(.+)") {
        $key = $matches[1].Trim()
        if ($key -eq "your-api-key-here") {
            Write-Host "❌ Still using placeholder!" -ForegroundColor Red
        } elseif ($key -match '^AIza') {
            Write-Host "✅ API key looks valid: $($key.Substring(0, 15))..." -ForegroundColor Green
        } else {
            Write-Host "⚠️ API key format unusual: $($key.Substring(0, 15))..." -ForegroundColor Yellow
        }
    }
}
```

## Still Not Working?

If none of these work:

1. **Double-check** you're copying the API key from the correct Firebase project
2. **Verify** Email/Password authentication is enabled in Firebase Console
3. **Check** browser console for any other error messages
4. **Try** creating a completely new `.env` file from scratch

