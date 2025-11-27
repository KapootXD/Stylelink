# Firebase Emulator Setup Guide

This guide will help you set up a local test server using Firebase Emulators for development and testing.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Starting the Emulators](#starting-the-emulators)
6. [Running Tests with Emulators](#running-tests-with-emulators)
7. [Using Emulators in Development](#using-emulators-in-development)
8. [Seeding Test Data](#seeding-test-data)
9. [Emulator UI](#emulator-ui)
10. [Troubleshooting](#troubleshooting)

## Overview

Firebase Emulator Suite allows you to run Firebase services (Auth, Firestore, Storage) locally on your machine. This provides:

- **Fast testing** without network latency
- **Cost-free** testing (no Firebase billing)
- **Offline development** capabilities
- **Isolated test environment** separate from production data
- **Deterministic testing** with seeded data

## Prerequisites

- Node.js 16+ installed
- Firebase CLI installed globally
- Firebase project created (optional, for initial setup)

## Installation

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase (if deploying later)

```bash
firebase login
```

### 3. Verify Installation

```bash
firebase --version
```

The Firebase configuration for emulators is already set up in `firebase.json`.

## Configuration

### 1. Environment Variables

Create a `.env.local` file in the root directory (or update existing `.env`):

```env
# Enable Firebase Emulators
REACT_APP_USE_FIREBASE_EMULATOR=true

# Firebase configuration (use dummy values for emulators)
REACT_APP_FIREBASE_API_KEY=AIzaSyDemoKeyForEmulator
REACT_APP_FIREBASE_AUTH_DOMAIN=demo-stylelink.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=demo-stylelink
REACT_APP_FIREBASE_STORAGE_BUCKET=demo-stylelink.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Note:** When using emulators, the Firebase config values are not critical since the emulators run locally. However, they must be present for the Firebase SDK to initialize.

### 2. Firebase Emulator Configuration

The emulator configuration is in `firebase.json`:

```json
{
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "storage": { "port": 9199 },
    "ui": { "enabled": true, "port": 4000 }
  }
}
```

## Starting the Emulators

### Option 1: Start All Emulators

```bash
npm run emulators:start
```

This starts:
- Auth Emulator on port 9099
- Firestore Emulator on port 8080
- Storage Emulator on port 9199
- Emulator UI on port 4000

### Option 2: Start Emulator UI Only

```bash
npm run emulators:ui
```

### Option 3: Using Firebase CLI Directly

```bash
firebase emulators:start
```

The emulators will start and show:
- Individual service URLs
- Emulator UI URL (typically http://localhost:4000)
- Logs from each service

## Running Tests with Emulators

### Run Tests with Emulator Mode Enabled

```bash
npm run test:emulator
```

This sets `REACT_APP_USE_FIREBASE_EMULATOR=true` and runs your tests against the local emulators.

**Important:** Make sure the emulators are running before executing tests!

### Running Tests in Watch Mode

1. Start emulators in one terminal:
   ```bash
   npm run emulators:start
   ```

2. In another terminal, run tests:
   ```bash
   npm run test:emulator
   ```

## Using Emulators in Development

### Start Development Server with Emulators

```bash
npm run start:emulator
```

This starts your React app with emulator support enabled.

**Workflow:**

1. Terminal 1: Start emulators
   ```bash
   npm run emulators:start
   ```

2. Terminal 2: Start React app
   ```bash
   npm run start:emulator
   ```

Your app will now use the local Firebase emulators instead of the production Firebase project.

## Seeding Test Data

### Option 1: Using the Seed Script (Recommended)

Create a seed script that populates the emulators with test data:

```bash
# Make sure emulators are running first
npm run emulators:start

# In another terminal, run the seed script
npx ts-node scripts/seed-emulators.ts
```

### Option 2: Manual Seeding via Emulator UI

1. Start emulators: `npm run emulators:start`
2. Open Emulator UI: http://localhost:4000
3. Use the UI to manually add test data to Firestore collections
4. Create test users in the Auth section

### Option 3: Export/Import Data

Firebase emulators support data export/import for consistent test data:

**Export data:**
```bash
firebase emulators:export ./emulator-data
```

**Import data:**
```bash
firebase emulators:start --import=./emulator-data
```

Update `firebase.json` to auto-import:

```json
{
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "storage": { "port": 9199 },
    "ui": { "enabled": true, "port": 4000 },
    "singleProjectMode": true
  },
  "emulatorOptions": {
    "import": "./emulator-data"
  }
}
```

## Emulator UI

The Firebase Emulator UI provides a web interface to:

- View and edit Firestore data
- Manage Auth users
- Monitor Storage files
- View request logs
- Clear/reset emulator data

**Access the UI:**
```
http://localhost:4000
```

When emulators start, you'll see a message like:
```
✔  Emulator UI running at http://localhost:4000
```

## Troubleshooting

### Port Already in Use

If you see "Port XXXX is already in use", either:

1. Stop the process using that port
2. Change the port in `firebase.json`

### Emulators Not Connecting

**Check:**
1. Emulators are running (`npm run emulators:start`)
2. `.env.local` has `REACT_APP_USE_FIREBASE_EMULATOR=true`
3. Restart your React app after setting the env variable

### Connection Refused Errors

- Verify emulators are running before starting your app
- Check firewall settings
- Ensure ports are not blocked

### Data Not Persisting

By default, emulator data is cleared when emulators stop. To persist data:

1. Use export/import (see [Seeding Test Data](#seeding-test-data))
2. Configure auto-import in `firebase.json`

### Firebase SDK Errors

If you see errors about Firebase not being initialized:

1. Check that `.env.local` has all required Firebase config variables
2. Verify emulators are running
3. Check browser console for connection errors

## Best Practices

1. **Always start emulators before tests/app**
   - Use a process manager like `concurrently` to start both together

2. **Use separate emulator projects for different test suites**
   - Export data for each test scenario
   - Import as needed

3. **Seed data consistently**
   - Create seed scripts for reproducible test data
   - Version control seed data files

4. **Clear data between test runs**
   - Use `firebase emulators:exec` for CI/CD
   - Automate data cleanup

5. **Monitor emulator logs**
   - Watch for connection errors
   - Check for unexpected behavior

## Additional Resources

- [Firebase Emulator Suite Documentation](https://firebase.google.com/docs/emulator-suite)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Local Testing with Firebase](https://firebase.google.com/docs/emulator-suite/connect_and_prototype)

## Example: Full Development Workflow

```bash
# Terminal 1: Start emulators
npm run emulators:start

# Terminal 2: Start React app with emulator support
npm run start:emulator

# Terminal 3: Run tests (if needed)
npm run test:emulator
```

Visit:
- React App: http://localhost:3000
- Emulator UI: http://localhost:4000

