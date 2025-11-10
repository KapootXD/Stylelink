# Firebase Quick Start Guide

This is a quick reference guide for setting up Firebase with StyleLink. For detailed instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

## Quick Setup (5 minutes)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name and create
4. Register your web app (click web icon `</>`)
5. Copy the Firebase configuration

### 2. Configure Environment Variables

1. Copy `env.template` to `.env`:
   ```bash
   cp env.template .env
   ```

2. Open `.env` and paste your Firebase configuration values

### 3. Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select a location and enable

### 4. Seed Sample Data

1. Install dotenv (if not already installed):
   ```bash
   npm install -D dotenv ts-node
   ```

2. Run the seed script:
   ```bash
   npm run seed:firebase
   ```

   Or manually:
   ```bash
   npx ts-node -r dotenv/config scripts/seedFirebase.ts
   ```

### 5. Start Your App

```bash
npm start
```

## Verify Setup

1. **Check Firebase Connection:**
   - Open browser console
   - Look for Firebase initialization messages
   - No errors should appear

2. **Check Data:**
   - Go to Firebase Console → Firestore Database
   - Verify `outfits` and `users` collections exist
   - Check that sample data is present

3. **Test Functionality:**
   - Upload an outfit
   - Search for outfits
   - Like/share an outfit
   - Verify data persists in Firestore

## Troubleshooting

### "Firebase configuration is missing"
- Check that `.env` file exists in root directory
- Verify all `REACT_APP_FIREBASE_*` variables are set
- Restart development server after updating `.env`

### "Permission denied" errors
- Check Firestore Security Rules
- For development, use test mode rules
- See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for production rules

### Data not appearing
- Check browser console for errors
- Verify Firestore Console shows the data
- Clear browser cache and reload
- Check environment variables are correct

## Next Steps

- Set up Firebase Authentication
- Configure Security Rules for production
- Set up Firebase Storage for image uploads
- Implement real-time updates
- Add error monitoring

For detailed instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

