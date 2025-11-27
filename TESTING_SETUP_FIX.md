# Fixing "vitest is not recognized" Error

## The Problem

The error `'vitest' is not recognized as an internal or external command` occurs because:
1. **Vitest is not installed** - Even though it's listed in `package.json`, the `node_modules` folder doesn't contain vitest
2. **Dependencies need to be installed** - Running `npm install` failed due to a network error

## Solutions

### Option 1: Fix Network Issue and Install Dependencies (Recommended)

The `npm install` command failed with a network error. Try these steps:

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Try installing again:**
   ```bash
   npm install
   ```

3. **If still having network issues, try:**
   ```bash
   npm install --registry https://registry.npmjs.org/
   ```

4. **Or use yarn instead:**
   ```bash
   yarn install
   ```

5. **After successful installation, run tests:**
   ```bash
   npm test
   ```

### Option 2: Temporary Workaround with npx

You can run vitest directly using `npx` (which will download it temporarily):

```bash
# Run tests
npx vitest

# Run with coverage
npx vitest run --coverage

# Run in watch mode
npx vitest watch
```

**Note:** This is temporary. For proper setup, you should install dependencies using Option 1.

### Option 3: Check Your Network/Proxy Settings

If you're behind a proxy or firewall:

1. **Set npm proxy (if needed):**
   ```bash
   npm config set proxy http://proxy-server:port
   npm config set https-proxy http://proxy-server:port
   ```

2. **Or configure npm registry:**
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

## Verify Installation

After installing, verify vitest is available:

```bash
# Check if vitest is installed
npm list vitest

# Or check the binary exists
Test-Path "node_modules\.bin\vitest.cmd"
```

## Why This Happened

- The `node_modules` folder exists but doesn't contain all required packages
- The previous `npm install` was interrupted or failed
- Network connectivity issues prevented complete installation

## Next Steps

1. **Fix the network issue** and run `npm install`
2. **Verify installation** - Check that `node_modules/.bin/vitest.cmd` exists
3. **Run tests** - Execute `npm test` to verify everything works

Once dependencies are properly installed, all test commands will work normally!

