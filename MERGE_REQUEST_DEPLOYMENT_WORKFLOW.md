# Merge Request Deployment Workflow

## How It Works

### Step 1: Merge Request Pipeline (Testing Only)

When you create/submit a merge request:
- ✅ Pipeline runs: `install` → `lint` → `test` → `e2e` → `build`
- ❌ **Does NOT deploy** (because `deploy_to_firebase` only runs on `main` branch)

**Purpose:** Verify your code passes all tests before merging.

### Step 2: Merge to Main (Automatic Deployment)

When you **merge the merge request** to `main`:
1. ✅ Code is merged into `main` branch
2. ✅ **New pipeline automatically runs** on `main` branch
3. ✅ Pipeline runs: `install` → `lint` → `test` → `e2e` → `build` → **`deploy`**
4. ✅ **Deploys to Firebase Hosting automatically!**

## Your Configuration

Looking at your `.gitlab-ci.yml`:

```yaml
deploy_to_firebase:
  stage: deploy
  only:
    - main  # ← Only runs on main branch
  when: on_success  # ← Only if all previous stages pass
```

This means:
- ✅ Merge request pipelines: Test and build (no deploy)
- ✅ Main branch pipelines: Test, build, **AND deploy**

## Complete Workflow

```
1. Create Feature Branch
   └─> Push code

2. Create Merge Request
   └─> Pipeline runs (tests only, no deploy)
   └─> Wait for approval

3. Merge to Main
   └─> New pipeline runs on main branch
   └─> All tests pass
   └─> ✅ AUTOMATIC DEPLOYMENT to Firebase Hosting
   └─> Site updated at: https://stylelink-74fdf.web.app
```

## What Gets Deployed

When the merge request is merged and the pipeline runs on `main`:

✅ **Your React app** (from `build/` folder)
✅ **All your code changes** (including the `firebase.json` updates)
✅ **Firebase configuration** (from GitLab CI/CD variables)
✅ **Everything will work** (emulators config, storage rules, etc.)

## Verification

After merging:

1. **Check GitLab Pipeline:**
   - Go to: GitLab → CI/CD → Pipelines
   - Find the pipeline for the `main` branch
   - Verify `deploy_to_firebase` job completed successfully

2. **Check Live Site:**
   - Visit: https://stylelink-74fdf.web.app
   - Test your changes
   - Clear browser cache if needed (Ctrl+Shift+R)

3. **Check Firebase Console:**
   - Go to: https://console.firebase.google.com/project/stylelink-74fdf/hosting
   - See deployment history

## Important Notes

### Environment Variables

Your GitLab CI/CD variables are used during the build:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- etc.

These are set in GitLab → Settings → CI/CD → Variables.

### Firestore/Storage Rules

- **Rules files** (`firestore.rules`, `storage.rules`) are in your repo
- They're **not automatically deployed** by the pipeline
- You need to deploy them manually if you changed them:
  ```bash
  firebase deploy --only firestore:rules,storage
  ```

Or they'll be deployed when you run `firebase deploy` (without `--only hosting`).

## Summary

✅ **Merge Request:** Tests and builds (no deploy)
✅ **After Merge to Main:** Tests, builds, **AND automatically deploys**
✅ **Site Updates:** https://stylelink-74fdf.web.app
✅ **Everything Works:** All your Firebase config is included

Just merge the request and it will deploy automatically! 🚀

