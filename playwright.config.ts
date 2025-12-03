import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000, // Increased to 60 seconds to handle authentication
  retries: isCI ? 2 : 0,
  reporter: [['html']],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 120_000,
    env: {
      BROWSER: 'none',
      CI: 'true',
      // Allow the app to run in guest/demo mode so protected routes are accessible in E2E runs
      REACT_APP_ALLOW_GUEST_MODE: 'true',
      // Minimal Firebase config for E2E tests (app will use demo mode if needed)
      REACT_APP_USE_FIREBASE_EMULATOR: process.env.REACT_APP_USE_FIREBASE_EMULATOR || 'false',
      REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY || 'test-api-key',
      REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'test.firebaseapp.com',
      REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'test-project',
      REACT_APP_FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'test.appspot.com',
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
      REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID || '1:123456789:web:test',
    },
  },
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'chromium-tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'firefox-tablet',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'webkit-tablet',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'firefox-mobile',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'webkit-mobile',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 375, height: 667 },
      },
    },
  ],
});
