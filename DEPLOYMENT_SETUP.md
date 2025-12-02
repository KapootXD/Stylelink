# GitLab CI/CD Automatic Deployment Setup

This guide will help you set up automatic deployment from GitLab to Firebase Hosting.

## Prerequisites

1. Firebase project already set up
2. Firebase CLI installed locally (for generating token)
3. GitLab repository access

## Step 1: Generate Firebase Token

1. Install Firebase CLI locally (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Generate a CI token:
   ```bash
   firebase login:ci
   ```

4. Copy the token that's displayed - you'll need it for Step 2.

## Step 2: Add GitLab CI/CD Variables

1. Go to your GitLab project
2. Navigate to **Settings** → **CI/CD** → **Variables**
3. Click **Add variable** and add the following:

   **Variable 1: `FIREBASE_TOKEN`**
   - Key: `FIREBASE_TOKEN`
   - Value: (paste the token from Step 1)
   - Type: Variable
   - Environment scope: All
   - Flags: ✅ Protect variable, ✅ Mask variable
   - Click **Add variable**

   **Variable 2: `FIREBASE_PROJECT_ID`** (optional, for environment URL)
   - Key: `FIREBASE_PROJECT_ID`
   - Value: (your Firebase project ID from `.firebaserc`)
   - Type: Variable
   - Environment scope: All
   - Flags: ✅ Protect variable
   - Click **Add variable**

## Step 3: Verify Configuration

The `.gitlab-ci.yml` file has been updated with a `deploy_to_firebase` job that will:

- ✅ Only run on the `main` branch
- ✅ Only deploy after successful build, unit tests, and E2E tests
- ✅ Automatically deploy to Firebase Hosting
- ✅ Use the `build/` folder from the build stage

## Step 4: Test the Deployment

1. Make a change to your code
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Test automatic deployment"
   git push origin main
   ```

3. Go to GitLab → **CI/CD** → **Pipelines** to watch the pipeline run
4. The deployment will happen automatically after all tests pass

## How It Works

1. **Install**: Installs dependencies
2. **Lint**: Runs linting checks
3. **Test**: Runs unit tests with coverage
4. **E2E**: Runs end-to-end tests
5. **Build**: Builds the production bundle
6. **Deploy**: Deploys to Firebase Hosting (only on `main` branch)

## Troubleshooting

### Deployment fails with "Authentication Error"
- Verify `FIREBASE_TOKEN` is set correctly in GitLab CI/CD variables
- Regenerate the token if needed: `firebase login:ci`

### Build artifacts not found
- Ensure the `build` job completes successfully
- Check that `build/` folder is in artifacts

### Wrong project deployed
- Check your `.firebaserc` file matches your Firebase project
- Verify `FIREBASE_PROJECT_ID` variable if using it

## Manual Deployment (if needed)

If you need to deploy manually:

```bash
npm run build
firebase deploy --only hosting
```

## Security Notes

- The `FIREBASE_TOKEN` is stored as a protected, masked variable in GitLab
- Only users with maintainer access can view/modify CI/CD variables
- The token should be regenerated periodically for security

