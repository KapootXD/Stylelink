# Firebase Deployment Guide

This guide explains how to deploy your StyleLink React app to Firebase Hosting.

## Prerequisites

1. **Firebase CLI** - Install globally if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Login** - Make sure you're logged in:
   ```bash
   firebase login
   ```

3. **Verify Project** - Check that your project is linked:
   ```bash
   firebase projects:list
   ```

## Manual Deployment Steps

### Step 1: Build Your App

First, create a production build of your React app:

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Step 2: Deploy to Firebase

Deploy the build to Firebase Hosting:

```bash
firebase deploy --only hosting
```

Or use the convenient npm script:

```bash
npm run deploy
```

This will:
1. Build your app (`npm run build`)
2. Deploy to Firebase Hosting (`firebase deploy --only hosting`)

### Step 3: Verify Deployment

After deployment, Firebase will provide you with a URL like:
```
https://stylelink-74fdf.web.app
```
or
```
https://stylelink-74fdf.firebaseapp.com
```

Visit the URL to verify your deployment is live!

## Deployment Commands

### Quick Deploy (Recommended)
```bash
npm run deploy
```
Builds and deploys in one command.

### Deploy Only Hosting
```bash
npm run deploy:hosting
```
Deploys only the hosting (skips building - use if you already built).

### Deploy Everything
```bash
npm run deploy:all
```
Deploys hosting, functions, firestore rules, etc. (if configured).

### Build Only
```bash
npm run build
```
Creates production build without deploying.

## Troubleshooting

### Error: "Firebase CLI not found"
Install Firebase CLI:
```bash
npm install -g firebase-tools
```

### Error: "Not logged in"
Login to Firebase:
```bash
firebase login
```

### Error: "Build failed"
1. Check for TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```
2. Check for linting errors:
   ```bash
   npx eslint src/
   ```
3. Try building with verbose output:
   ```bash
   CI=false npm run build
   ```

### Error: "Project not found"
Verify your project ID in `.firebaserc`:
```json
{
  "projects": {
    "default": "stylelink-74fdf"
  }
}
```

If the project ID is incorrect, update it:
```bash
firebase use --add
```

## Automatic Deployment (Optional)

### Option 1: GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: stylelink-74fdf
```

### Option 2: Firebase GitHub Integration

1. Go to Firebase Console → Hosting
2. Click "Get started" or "Add new site"
3. Connect your GitHub repository
4. Configure automatic deployments

## Environment Variables

Make sure your `.env` file has all required Firebase variables:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=stylelink-74fdf
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

**Important**: Environment variables are embedded at build time. Make sure your `.env` file is configured before running `npm run build`.

## Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are set in `.env`
- [ ] Code builds successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] No critical linting errors
- [ ] Firebase Storage rules are configured (for uploads)
- [ ] Firestore security rules are set up
- [ ] Firebase Authentication is enabled
- [ ] Test the upload functionality locally first

## Post-Deployment

After deployment:

1. **Test the live site** - Visit your Firebase Hosting URL
2. **Test uploads** - Verify image/video uploads work
3. **Check Firebase Console** - Verify files are being uploaded to Storage
4. **Monitor errors** - Check Firebase Console for any errors

## Rollback

If you need to rollback to a previous version:

1. Go to Firebase Console → Hosting
2. Click on your site
3. View deployment history
4. Click "Rollback" on the previous deployment

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [React Build Optimization](https://create-react-app.dev/docs/production-build/)

