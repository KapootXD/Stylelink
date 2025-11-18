# Deploy to Live Server - Quick Guide

## Quick Deploy Command

```bash
npm run deploy
```

This will:
1. Build your React app
2. Deploy to Firebase Hosting

## Step-by-Step Deployment

### Step 1: Make Sure You're Logged In

```bash
firebase login
```

If you're already logged in, you can skip this step.

### Step 2: Build Your App

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Step 3: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Or use the combined command:
```bash
npm run deploy
```

## What Gets Deployed

✅ **Your React app** (from `build` folder)
✅ **All your code changes** (profile customization, uploads, etc.)
✅ **Firebase configuration** (from your `.env` file - embedded in build)

## Important Notes

### Environment Variables

Your `.env` file is NOT deployed. Environment variables are embedded in the build during `npm run build`.

**Make sure your `.env` file has the correct Firebase config before building!**

### Firestore Rules

Firestore rules are deployed separately. After deploying your app:

1. Go to: https://console.firebase.google.com/project/stylelink-74fdf/firestore/rules
2. Make sure your rules are published (they should already be if you set them up)
3. Rules are NOT part of the code deployment - they're managed in Firebase Console

### Firebase Storage Rules

Storage rules are also managed separately in Firebase Console:

1. Go to: https://console.firebase.google.com/project/stylelink-74fdf/storage/rules
2. Make sure rules allow profile picture uploads

## Deployment Options

### Option 1: Deploy Everything (Recommended)
```bash
npm run deploy
```
Builds and deploys hosting.

### Option 2: Deploy Only Hosting (If Already Built)
```bash
npm run deploy:hosting
```
Only deploys, skips build (use if you already ran `npm run build`).

### Option 3: Deploy All Services
```bash
npm run deploy:all
```
Builds and deploys hosting + any other Firebase services.

## Verify Deployment

After deploying:

1. **Check your live site**: Visit your Firebase Hosting URL
   - Usually: `https://stylelink-74fdf.web.app` or `https://stylelink-74fdf.firebaseapp.com`
   - Or your custom domain if configured

2. **Test profile functionality**:
   - Log in
   - Go to profile
   - Edit profile
   - Save changes
   - Verify it works

3. **Check Firebase Console**:
   - Go to: https://console.firebase.google.com/project/stylelink-74fdf/hosting
   - See deployment history

## Troubleshooting

### Build Fails
- Check for TypeScript errors: `npm run build`
- Fix any compilation errors
- Make sure all dependencies are installed: `npm install`

### Deploy Fails - Not Logged In
```bash
firebase login
```

### Deploy Fails - Wrong Project
```bash
firebase use stylelink-74fdf
```

### Changes Not Showing
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check deployment completed successfully
- Wait a few minutes for CDN to update

### Profile Not Saving on Live Site
- Check Firestore rules are published (not in draft)
- Check browser console for errors
- Verify Firebase config in `.env` is correct
- Make sure you rebuilt after changing `.env`

## Pre-Deployment Checklist

Before deploying, make sure:

- [ ] All code changes are committed (optional, but recommended)
- [ ] `.env` file has correct Firebase config
- [ ] App builds successfully: `npm run build`
- [ ] Firestore rules are published
- [ ] Storage rules are set (for profile pictures)
- [ ] You're logged into Firebase: `firebase login`

## Quick Reference

```bash
# Full deployment (build + deploy)
npm run deploy

# Just deploy (if already built)
npm run deploy:hosting

# Check Firebase project
firebase projects:list

# Switch project
firebase use stylelink-74fdf

# View deployment history
firebase hosting:channel:list
```

## Your Live URLs

After deployment, your app will be available at:
- `https://stylelink-74fdf.web.app`
- `https://stylelink-74fdf.firebaseapp.com`

Check your exact URL in: https://console.firebase.google.com/project/stylelink-74fdf/hosting

