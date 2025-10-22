# CI/CD Pipeline Configuration
# This file helps ensure consistent builds across different environments

# Node.js version
node-version: '18.x'

# Build steps
build-steps:
  1. Install dependencies: npm ci
  2. Type check: npx tsc --noEmit
  3. Lint check: npx eslint src --ext .ts,.tsx
  4. Run tests: npm test -- --coverage --watchAll=false
  5. Build application: npm run build

# Environment variables for CI
env:
  CI: true
  NODE_ENV: production
  GENERATE_SOURCEMAP: false

# Common CI issues and solutions:
# 1. Console statements: Wrap in process.env.NODE_ENV === 'development'
# 2. Missing types: Add proper TypeScript declarations
# 3. CSS classes: Use defined Tailwind classes or custom CSS
# 4. Dependencies: Ensure all imports are properly resolved
# 5. Build optimization: Use CI=false for React builds
