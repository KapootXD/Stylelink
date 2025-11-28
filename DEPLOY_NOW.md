# 🚀 Deploy to Firebase Hosting - Quick Guide

## Immediate Deployment (Manual)

You're already logged in to Firebase! Just run:

```bash
npm run deploy
```

This will:
1. ✅ Build your React app for production
2. ✅ Deploy to Firebase Hosting
3. ✅ Your site will be live in ~2-3 minutes

After it completes, you'll see:
```
✔  Deploy complete!

Hosting URL: https://stylelink-74fdf.web.app
```

## 🔄 Set Up Automatic Deployment

To automatically deploy when you merge to GitLab:

### Step 1: Generate Firebase CI Token

Run this command:

```bash
firebase login:ci
```

It will open your browser, then output a token. **Copy that token**.

### Step 2: Add to GitLab CI/CD Variables

1. Go to your GitLab project
2. **Settings → CI/CD → Variables → Expand**
3. Click **"Add variable"**
4. Set:
   - **Key**: `FIREBASE_TOKEN`
   - **Value**: (paste the token from Step 1)
   - ✅ Check "Mask variable"
   - ✅ Check "Protect variable"
5. Click **"Add variable"**

### Step 3: Add Environment Variables for Build

Add these so the build works in CI/CD:

**Settings → CI/CD → Variables → Add variable** (repeat for each):

- `REACT_APP_FIREBASE_API_KEY` = (your API key)
- `REACT_APP_FIREBASE_PROJECT_ID` = `stylelink-74fdf`
- `REACT_APP_FIREBASE_AUTH_DOMAIN` = (your auth domain)
- `REACT_APP_FIREBASE_STORAGE_BUCKET` = (your storage bucket)
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` = (your sender ID)
- `REACT_APP_FIREBASE_APP_ID` = (your app ID)

✅ Check "Mask variable" for each.

### Done!

Now every merge to `main` will automatically:
1. Run tests
2. Build the app
3. **Deploy to Firebase Hosting** 🎉

## 📝 What I Changed

I've updated `.gitlab-ci.yml` to add a `deploy` stage that:
- Only runs on `main`/`master` branch
- Uses the build artifact from the build stage
- Deploys to Firebase Hosting automatically
- Only runs if `FIREBASE_TOKEN` is set (won't fail if not configured)

## ⚡ Quick Commands

```bash
# Deploy manually (right now)
npm run deploy

# Just build (no deploy)
npm run build

# Deploy without building (if already built)
npm run deploy:hosting
```

## 🔍 Verify Deployment

After deploying, check:
- Firebase Console: https://console.firebase.google.com/project/stylelink-74fdf/hosting
- Live site: https://stylelink-74fdf.web.app

See [HOW_TO_DEPLOY.md](./HOW_TO_DEPLOY.md) for detailed instructions!

