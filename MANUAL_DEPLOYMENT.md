# Manual Deployment Guide

This guide shows you how to manually deploy your changes from GitLab to Firebase Hosting.

## Option 1: Deploy from Your Local Machine (Recommended)

This is the fastest way to deploy manually.

### Prerequisites
1. Make sure you have the latest code from GitLab:
   ```bash
   git pull origin main
   ```

2. Ensure Firebase CLI is installed:
   ```bash
   npm install -g firebase-tools
   ```

3. Login to Firebase (if not already logged in):
   ```bash
   firebase login
   ```

### Deploy Steps

1. **Build your application:**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting:**
   ```bash
   firebase deploy --only hosting
   ```

   Or use the npm script:
   ```bash
   npm run deploy:hosting
   ```

3. **Verify deployment:**
   - Visit your site: https://stylelink-74fdf.web.app
   - Check Firebase Console: https://console.firebase.google.com

### Deploy Everything (Hosting + Functions + Firestore Rules, etc.)

If you want to deploy all Firebase services:
```bash
npm run deploy:all
```

Or:
```bash
firebase deploy
```

## Option 2: Trigger GitLab Pipeline Manually

If you want to use the CI/CD pipeline but trigger it manually:

1. **Go to GitLab:**
   - Navigate to your project
   - Go to **CI/CD** → **Pipelines**

2. **Run Pipeline:**
   - Click **Run pipeline** button
   - Select the branch (usually `main`)
   - Click **Run pipeline**

3. **Monitor the Pipeline:**
   - Watch the pipeline run through all stages
   - The deployment will happen automatically after tests pass

## Option 3: Deploy Specific Branch/Commit

If you want to deploy a specific branch or commit:

### From Local Machine:

1. **Checkout the branch/commit:**
   ```bash
   git checkout your-branch-name
   # or
   git checkout commit-hash
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### From GitLab:

1. Go to **CI/CD** → **Pipelines**
2. Click **Run pipeline**
3. Select the branch or enter a commit SHA
4. Click **Run pipeline**

## Quick Deploy Script

You can create a quick deploy script. Add this to your `package.json` scripts:

```json
"deploy:quick": "npm run build && firebase deploy --only hosting"
```

Then just run:
```bash
npm run deploy:quick
```

## Troubleshooting

### "Firebase login required"
```bash
firebase login
```

### "Project not found"
Check your `.firebaserc` file matches your Firebase project:
```bash
cat .firebaserc
```

### "Build failed"
Make sure all dependencies are installed:
```bash
npm install
npm run build
```

### "Permission denied"
Make sure you're logged in with the correct Firebase account:
```bash
firebase login
firebase projects:list  # Verify you can see your project
```

## Deployment Checklist

Before deploying, make sure:

- [ ] All tests pass locally: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Code is committed and pushed to GitLab
- [ ] You're logged into Firebase: `firebase login`
- [ ] You're deploying to the correct project (check `.firebaserc`)

## Rollback (if needed)

If you need to rollback to a previous deployment:

1. **View deployment history:**
   ```bash
   firebase hosting:channel:list
   ```

2. **Rollback to previous version:**
   - Go to Firebase Console
   - Navigate to Hosting
   - Click on the deployment you want to rollback to
   - Click "Rollback"

## Environment-Specific Deployments

If you have multiple environments (staging, production):

### Deploy to Staging Channel:
```bash
firebase hosting:channel:deploy staging
```

### Deploy to Production:
```bash
firebase deploy --only hosting
```

## Notes

- Manual deployments bypass the CI/CD pipeline tests
- Always test locally before deploying manually
- The automatic CI/CD pipeline will still run when you push to `main`
- Manual deployments are useful for hotfixes or urgent updates

