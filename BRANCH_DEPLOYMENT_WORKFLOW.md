# Branch Deployment Workflow

## How the CI/CD Pipeline Works

Your GitLab CI/CD is configured with a **safe deployment workflow**:

### What Runs on Feature Branches / Merge Requests

When you push to a **feature branch** and create a **Merge Request (MR)**, these stages run:
- ✅ **install** - Installs dependencies
- ✅ **lint** - Checks code quality
- ✅ **unit_tests** - Runs unit tests
- ✅ **e2e_tests** - Runs end-to-end tests
- ✅ **build** - Builds the production bundle (but doesn't deploy)
- ❌ **deploy** - **SKIPPED** (only runs on `main`)

This lets you:
- Verify your code passes all tests
- See if the build succeeds
- Catch issues **before** merging to main

### What Runs on Main Branch

When code is merged to `main`, **everything runs including deployment**:
- ✅ **install** - Installs dependencies
- ✅ **lint** - Checks code quality
- ✅ **unit_tests** - Runs unit tests
- ✅ **e2e_tests** - Runs end-to-end tests
- ✅ **build** - Builds production bundle with Firebase config
- ✅ **deploy** - **AUTOMATICALLY DEPLOYS** to Firebase Hosting 🚀

## Recommended Workflow

### Option 1: Feature Branch → Merge Request → Deploy (Recommended ✅)

This is the **best practice** - gives you a safety net:

```bash
# 1. Create a feature branch
git checkout -b test/auto-deployment

# 2. Make your changes
git add public/index.html src/App.tsx DEPLOYMENT_TEST.md
git commit -m "Test: Verify automatic deployment pipeline"

# 3. Push to feature branch
git push origin test/auto-deployment

# 4. Create a Merge Request in GitLab
# - Go to GitLab → Merge Requests → New Merge Request
# - Select your feature branch → main
# - The pipeline will run on your feature branch first!

# 5. Wait for pipeline to pass (all tests, build, but NO deploy)
# 6. Review the changes
# 7. Merge the MR to main
# 8. Deployment automatically triggers on main! 🎉
```

**Benefits:**
- ✅ Tests run before merge (catch issues early)
- ✅ Build is verified before deployment
- ✅ Code review opportunity
- ✅ Automatic deployment only happens after merge
- ✅ Safer workflow

### Option 2: Direct Push to Main (Quick but less safe)

```bash
# Make changes
git add public/index.html src/App.tsx DEPLOYMENT_TEST.md
git commit -m "Test: Verify automatic deployment pipeline"

# Push directly to main
git push origin main

# Deployment triggers immediately
```

**Benefits:**
- ✅ Fastest option
- ✅ Immediate deployment

**Drawbacks:**
- ❌ No test verification before deployment
- ❌ No code review
- ❌ If tests fail, broken code might deploy

## Current Configuration

Looking at your `.gitlab-ci.yml`:

```yaml
# These run on both feature branches AND main:
install_dependencies:
  only:
    - main
    - merge_requests  # ✅ Runs on MRs

lint:
  only:
    - main
    - merge_requests  # ✅ Runs on MRs

unit_tests:
  only:
    - main
    - merge_requests  # ✅ Runs on MRs

e2e_tests:
  only:
    - main
    - merge_requests  # ✅ Runs on MRs

build:
  only:
    - main
    - merge_requests  # ✅ Runs on MRs (but doesn't deploy)

# This ONLY runs on main:
deploy_to_firebase:
  only:
    - main  # ❌ Only deploys on main branch!
```

## For Your Test Deployment

You have two options:

### Option A: Test via Merge Request (Recommended)

```bash
# Create a feature branch
git checkout -b test/auto-deployment
git add public/index.html src/App.tsx DEPLOYMENT_TEST.md
git commit -m "Test: Verify automatic deployment pipeline"
git push origin test/auto-deployment
```

Then:
1. Create a Merge Request in GitLab
2. Watch the pipeline run (tests + build, but no deploy)
3. Merge the MR when ready
4. Deployment automatically happens after merge! 🎉

### Option B: Direct Push to Main (Faster)

```bash
# Make sure you're on main
git checkout main
git pull origin main  # Get latest changes

# Add your test changes
git add public/index.html src/App.tsx DEPLOYMENT_TEST.md
git commit -m "Test: Verify automatic deployment pipeline"
git push origin main

# Deployment triggers immediately
```

## Which Should You Choose?

### Use Feature Branch + MR if:
- ✅ You want to review changes before deployment
- ✅ You want tests to run first
- ✅ You're making significant changes
- ✅ You're working with a team
- ✅ You want the safest workflow

### Use Direct Push to Main if:
- ✅ It's a small, safe change
- ✅ You're confident it won't break anything
- ✅ You need it deployed immediately
- ✅ You're just testing the deployment process

## Pipeline Timeline

**Feature Branch / MR:**
```
Push → install → lint → test → e2e → build → ✅ PASS
(No deploy - safe!)
```

**Main Branch:**
```
Merge → install → lint → test → e2e → build → deploy → 🚀 LIVE!
(Full pipeline including deployment)
```

## Verifying Your Test

Regardless of which method you choose, once deployed:

1. **Check GitLab Pipeline:**
   - Go to GitLab → CI/CD → Pipelines
   - Verify all stages passed
   - Check that `deploy_to_firebase` ran (only on main)

2. **Check Live Site:**
   - Visit: https://stylelink-74fdf.web.app
   - View page source: Look for `<!-- Auto-deployment test: v1.0.0-test-deploy -->`
   - Check console: Look for `🚀 StyleLink App Loaded - Auto-deploy test v1.0.0`

## Summary

✅ **You CAN push to a different branch!**

- Feature branches run tests but **don't deploy**
- Only `main` branch triggers **automatic deployment**
- Merge Requests are a great way to test before deploying
- Direct push to main works too, but is less safe

**Recommendation:** Use the feature branch + MR workflow for your test! It's safer and lets you verify everything works before the actual deployment.

