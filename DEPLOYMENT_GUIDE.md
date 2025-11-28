# Deployment Guide - Push Changes to Firebase Hosting

## 🚀 Quick Deploy (Manual)

If you want to deploy immediately:

```bash
npm run deploy
```

This will:
1. Build your React app
2. Deploy to Firebase Hosting

## 📋 Manual Deployment Steps

### Step 1: Make Sure You're Logged In

```bash
firebase login
```

### Step 2: Deploy

```bash
npm run deploy
```

Or step by step:
```bash
# Build first
npm run build

# Then deploy
firebase deploy --only hosting
```

## 🔄 Automatic Deployment (GitLab CI/CD)

I'll set up automatic deployment so every merge to your main branch automatically deploys to Firebase.

### Setup Required (One-Time)

You need to add Firebase credentials to GitLab CI/CD variables:

1. **Generate Firebase CI Token:**
   ```bash
   firebase login:ci
   ```
   This will output a token. Copy it.

2. **Add to GitLab CI/CD Variables:**
   - Go to your GitLab project
   - Settings → CI/CD → Variables
   - Click "Add variable"
   - Key: `FIREBASE_TOKEN`
   - Value: (paste the token from step 1)
   - Check "Masked" and "Protect variable"
   - Click "Add variable"

3. **Add Firebase Project ID (Optional, already in .firebaserc):**
   - Key: `FIREBASE_PROJECT_ID`
   - Value: `stylelink-74fdf`
   - Click "Add variable"

That's it! Once configured, every push to your main branch will automatically deploy.

## 📝 What Gets Deployed

- ✅ Your React app (from `build` folder)
- ✅ All code changes
- ✅ Environment variables (embedded during build)

## ⚠️ Important Notes

### Environment Variables for Build

For production builds, make sure you have a production `.env` file or set variables in GitLab CI/CD:

**Add to GitLab CI/CD Variables:**
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

These will be available during the build process in CI/CD.

## 🎯 Deployment Commands

### Manual Deploy
```bash
npm run deploy
```

### Deploy Only Hosting (if already built)
```bash
npm run deploy:hosting
```

### Deploy Everything (hosting + rules)
```bash
npm run deploy:all
```

## 📖 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

