# How to Deploy to Firebase Hosting

## 🚀 Quick Deploy (Right Now)

Deploy your changes immediately:

```bash
npm run deploy
```

That's it! Your changes will be live in a few minutes.

## 📋 Step-by-Step Manual Deployment

### Step 1: Login to Firebase (if not already)

```bash
firebase login
```

### Step 2: Deploy

```bash
npm run deploy
```

This command:
1. Builds your React app (`npm run build`)
2. Deploys to Firebase Hosting (`firebase deploy --only hosting`)

### Step 3: Verify

After deployment completes, you'll see a URL like:
```
✔  Deploy complete!

Hosting URL: https://stylelink-74fdf.web.app
```

Visit the URL to see your changes live!

## 🔄 Automatic Deployment (GitLab CI/CD)

Set up automatic deployment so every merge to `main` branch automatically deploys.

### One-Time Setup

#### Step 1: Generate Firebase CI Token

Run this command locally:

```bash
firebase login:ci
```

This will open your browser for authentication and then display a token. **Copy this token** - you'll need it in the next step.

#### Step 2: Add Token to GitLab CI/CD Variables

1. Go to your GitLab project
2. Navigate to: **Settings → CI/CD → Variables**
3. Click **"Add variable"**
4. Fill in:
   - **Key**: `FIREBASE_TOKEN`
   - **Value**: (paste the token from Step 1)
   - **Options**: 
     - ✅ Check "Mask variable" (hides it in logs)
     - ✅ Check "Protect variable" (only available to protected branches)
5. Click **"Add variable"**

#### Step 3: Add Environment Variables (For Build)

Also add these so the build has Firebase config:

1. Still in **Settings → CI/CD → Variables**
2. Add each of these (get values from your `.env` file or Firebase Console):

   - **Key**: `REACT_APP_FIREBASE_API_KEY`  
     **Value**: (your Firebase API key)

   - **Key**: `REACT_APP_FIREBASE_PROJECT_ID`  
     **Value**: `stylelink-74fdf`

   - **Key**: `REACT_APP_FIREBASE_AUTH_DOMAIN`  
     **Value**: (your auth domain)

   - **Key**: `REACT_APP_FIREBASE_STORAGE_BUCKET`  
     **Value**: (your storage bucket)

   - **Key**: `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`  
     **Value**: (your sender ID)

   - **Key**: `REACT_APP_FIREBASE_APP_ID`  
     **Value**: (your app ID)

3. For each variable, check "Mask variable" and "Protect variable"

### That's It!

Now when you merge to `main`:
1. GitLab CI/CD runs tests
2. Builds your app
3. **Automatically deploys to Firebase Hosting** 🎉

## 🎯 What Happens During Deployment

### Manual (`npm run deploy`):
1. ✅ Builds React app for production
2. ✅ Creates optimized bundle in `build/` folder
3. ✅ Uploads to Firebase Hosting
4. ✅ Goes live!

### Automatic (GitLab CI/CD):
1. ✅ Runs tests
2. ✅ Builds React app
3. ✅ Deploys to Firebase (if `FIREBASE_TOKEN` is set)
4. ✅ Updates live site automatically

## ⚙️ Deployment Commands

### Quick Deploy (Build + Deploy)
```bash
npm run deploy
```

### Deploy Only (Skip Build)
```bash
npm run deploy:hosting
```
Use this if you already ran `npm run build` and just want to deploy.

### Deploy Everything
```bash
npm run deploy:all
```
Deploys hosting, Firestore rules, Storage rules, etc.

## 🔍 Troubleshooting

### Error: "Not logged in"
```bash
firebase login
```

### Error: "Firebase CLI not found"
```bash
npm install -g firebase-tools
```

### Error: "Project not found"
Check your `.firebaserc` file has the correct project ID:
```json
{
  "projects": {
    "default": "stylelink-74fdf"
  }
}
```

### Build Fails in CI/CD
- Check that all environment variables are set in GitLab CI/CD Variables
- Make sure `FIREBASE_TOKEN` is set correctly
- Check the GitLab CI/CD pipeline logs for detailed errors

### Deployment Doesn't Trigger Automatically
- Make sure you're merging to `main` or `master` branch
- Check that `FIREBASE_TOKEN` is set in GitLab CI/CD Variables
- Verify the deploy stage is running in your pipeline

## 📝 Environment Variables Note

**Important**: Environment variables (like `REACT_APP_FIREBASE_API_KEY`) are embedded into your build during `npm run build`. They are NOT read at runtime.

- For **local builds**: Use `.env` file
- For **CI/CD builds**: Add variables to GitLab CI/CD Variables

## ✅ Quick Checklist

Before deploying:
- [ ] Code is tested and working locally
- [ ] `.env` file has correct Firebase config (for local builds)
- [ ] GitLab CI/CD Variables are set (for automatic deployment)
- [ ] Firebase CLI is installed (`firebase --version`)
- [ ] Logged in to Firebase (`firebase login`)

## 🎉 After Deployment

1. Visit your site: https://stylelink-74fdf.web.app
2. Test all features
3. Check Firebase Console for any errors
4. Share the URL with your team!

## 📖 More Information

- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide
- See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for additional details

