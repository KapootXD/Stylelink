# Firebase Emulator Setup - Quick Reference

## 🚀 Quick Start

1. **Install Firebase CLI** (if not installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Create `.env.local`** with emulator settings:
   ```env
   REACT_APP_USE_FIREBASE_EMULATOR=true
   REACT_APP_FIREBASE_API_KEY=AIzaSyDemoKeyForEmulator
   REACT_APP_FIREBASE_AUTH_DOMAIN=demo-stylelink.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=demo-stylelink
   REACT_APP_FIREBASE_STORAGE_BUCKET=demo-stylelink.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

3. **Start Emulators**:
   ```bash
   npm run emulators:start
   ```

4. **Start App** (in another terminal):
   ```bash
   npm run start:emulator
   ```

## 📚 Available Scripts

- `npm run emulators:start` - Start all Firebase emulators
- `npm run emulators:ui` - Start only the Emulator UI
- `npm run start:emulator` - Start React app with emulator support
- `npm run test:emulator` - Run tests with emulator support

## 🌐 Access Points

- **React App**: http://localhost:3000
- **Emulator UI**: http://localhost:4000
- **Auth Emulator**: localhost:9099
- **Firestore Emulator**: localhost:8080
- **Storage Emulator**: localhost:9199

## 📖 Full Documentation

- [Quick Start Guide](./docs/FIREBASE_EMULATOR_QUICKSTART.md)
- [Complete Setup Guide](./docs/FIREBASE_EMULATOR_SETUP.md)

## ⚙️ Configuration Files

- `firebase.json` - Emulator configuration
- `src/config/firebaseEmulator.ts` - Emulator connection logic
- `src/config/firebase.ts` - Firebase initialization with emulator support

## 💡 Tips

- Always start emulators before starting your app/tests
- Use Emulator UI (localhost:4000) to view and manage test data
- Data is cleared when emulators stop (use export/import to persist)
- Set `REACT_APP_USE_FIREBASE_EMULATOR=false` to use production Firebase

