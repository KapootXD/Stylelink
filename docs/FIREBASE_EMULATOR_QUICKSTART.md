# Firebase Emulator Quick Start

A quick guide to get up and running with Firebase Emulators for local testing.

## Quick Setup (5 minutes)

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Create Environment File

Create `.env.local` in the project root:

```env
REACT_APP_USE_FIREBASE_EMULATOR=true
REACT_APP_FIREBASE_API_KEY=AIzaSyDemoKeyForEmulator
REACT_APP_FIREBASE_AUTH_DOMAIN=demo-stylelink.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=demo-stylelink
REACT_APP_FIREBASE_STORAGE_BUCKET=demo-stylelink.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3. Start Emulators

```bash
npm run emulators:start
```

Wait for the emulators to start. You'll see:
```
✔  All emulators ready!
✔  Emulator UI running at http://localhost:4000
```

### 4. Start Your App (in a new terminal)

```bash
npm run start:emulator
```

Your app is now running with Firebase emulators!

## What's Running

- **React App**: http://localhost:3000
- **Emulator UI**: http://localhost:4000
- **Auth Emulator**: localhost:9099
- **Firestore Emulator**: localhost:8080
- **Storage Emulator**: localhost:9199

## Running Tests with Emulators

```bash
# Terminal 1: Start emulators
npm run emulators:start

# Terminal 2: Run tests
npm run test:emulator
```

## Next Steps

- View the [Full Setup Guide](./FIREBASE_EMULATOR_SETUP.md) for detailed information
- Use the Emulator UI at http://localhost:4000 to view and manage test data
- Seed test data using `scripts/seedFirebase.ts` or the Emulator UI

## Troubleshooting

**Port in use?** Stop other Firebase emulator instances or change ports in `firebase.json`

**Can't connect?** Make sure:
1. Emulators are running
2. `.env.local` has `REACT_APP_USE_FIREBASE_EMULATOR=true`
3. Restart your React app after setting env variables

