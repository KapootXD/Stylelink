# 🚀 Start Here - Complete Setup Steps

Follow these steps **in order** to get everything running.

## Step-by-Step Instructions

### Step 1: Open Terminal 1 (Firebase Emulators)

1. **Open PowerShell or Command Prompt**
   - Press `Windows Key + X` → Select "Windows PowerShell" or "Terminal"
   - OR Open VS Code → Press `` Ctrl+` `` to open terminal

2. **Navigate to your project:**
   ```bash
   cd C:\Users\gavin\Documents\stylelink
   ```

3. **Start Firebase Emulators:**
   ```bash
   npm run emulators:start:auth
   ```

4. **Wait for this message:**
   ```
   ✔  All emulators ready!
   ✔  Emulator UI running at http://localhost:4000
   ```

5. **✅ Keep this terminal open!** Don't close it.

---

### Step 2: Open Terminal 2 (React App)

1. **Open a NEW PowerShell/Command Prompt window**
   - If using VS Code: Click the **"+"** button in the terminal panel to create a new terminal tab
   - If using Windows Terminal: Click the dropdown arrow → "New Tab"
   - Otherwise: Just open another PowerShell window

2. **Navigate to your project:**
   ```bash
   cd C:\Users\gavin\Documents\stylelink
   ```

3. **Start React App:**
   ```bash
   npm run start:emulator
   ```

4. **Wait for this message:**
   ```
   Compiled successfully!

   You can now view stylelink in the browser.

     Local:            http://localhost:3000
   ```

5. **✅ Keep this terminal open too!**

---

### Step 3: Open Your Browser

1. **Go to:** http://localhost:3000
2. Your React app should load

---

### Step 4: Test Sign-Up

1. Navigate to the sign-up page
2. Create an account
3. **It should work now!** ✅

---

## 🎯 Quick Reference

### Terminal 1 (Emulators):
```bash
cd C:\Users\gavin\Documents\stylelink
npm run emulators:start:auth
```

### Terminal 2 (React App):
```bash
cd C:\Users\gavin\Documents\stylelink
npm run start:emulator
```

### Browser:
- App: http://localhost:3000
- Emulator UI: http://localhost:4000

---

## 🔍 How to Tell Which Terminal is Which

**Terminal 1 (Emulators)** will show:
- `firebase emulators:start --only auth,storage,ui`
- `✔  All emulators ready!`
- Port numbers (9099, 9199, 4000)

**Terminal 2 (React App)** will show:
- `Compiled successfully!`
- `http://localhost:3000`
- Webpack compilation messages

---

## 🆘 Troubleshooting

### "Port already in use" error?

- Something is already running on that port
- Close the terminal that's using it
- Or kill the process:
  ```bash
  netstat -ano | findstr ":3000"
  taskkill /PID <process-id> /F
  ```

### Can't find a terminal?

- Just open new ones and follow the steps above
- The old ones don't matter if you restart fresh

### React app won't start?

- Make sure Terminal 1 (emulators) is running first
- Wait for "All emulators ready!" before starting React app

---

## ✅ Success Checklist

- [ ] Terminal 1 shows "All emulators ready!"
- [ ] Terminal 2 shows "Compiled successfully!"
- [ ] Browser loads http://localhost:3000
- [ ] Can access sign-up page
- [ ] Sign-up works without errors

If all checked, you're good to go! 🎉

