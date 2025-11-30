# StyleLink E2E Tests

Comprehensive End-to-End tests for StyleLink using Playwright.

## Overview

This directory contains E2E tests covering the core business logic and user workflows for StyleLink features.

## Structure

```
tests/e2e/
├── fixtures/          # Test data and fixtures
├── helpers/           # Helper utilities and authentication helpers
├── pages/             # Page Object Models (POM)
└── specs/             # Test specifications
```

## Page Object Models

### Core Pages

- **HomePage** (`pages/home.page.ts`) - Homepage interactions
- **LoginPage** (`pages/login.page.ts`) - Authentication page
- **SignupPage** (`pages/signup.page.ts`) - User type selection
- **CustomerSignupPage** (`pages/customer-signup.page.ts`) - Customer registration
- **SellerSignupPage** (`pages/seller-signup.page.ts`) - Seller registration
- **UploadOutfitPage** (`pages/upload-outfit.page.ts`) - Outfit upload form
- **ExplorePage** (`pages/explore.page.ts`) - Browse and search outfits
- **ProfilePage** (`pages/profile.page.ts`) - User profile management

## Test Specifications

### Workflow Tests

1. **signup-workflow.spec.ts** - User signup workflows
   - Customer signup flow
   - Seller signup flow
   - Form validation
   - Navigation

2. **login-workflow.spec.ts** - Authentication workflows
   - Successful login
   - Invalid credentials
   - Form validation
   - Password visibility toggle

3. **upload-outfit-workflow.spec.ts** - Outfit upload workflows
   - Form submission
   - Image upload
   - Field validation
   - Loading states

4. **explore-outfits-workflow.spec.ts** - Browse and search workflows
   - Search functionality
   - Filtering
   - Sorting
   - Pagination
   - Like/share interactions

## Running Tests

### Run all E2E tests
```bash
npm run test:e2e
```

### Run tests in UI mode
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test tests/e2e/specs/signup-workflow.spec.ts
```

### Run tests for specific browser
```bash
npx playwright test --project=chromium-desktop
```

## Test Data

Test data is managed in:
- `fixtures/test-data.ts` - Test user credentials and mock data
- `helpers/test-helpers.ts` - Utility functions for generating test data

## Page Object Model Pattern

All page interactions use the Page Object Model pattern:

```typescript
// Example usage
const uploadPage = new UploadOutfitPage(page);
await uploadPage.goto();
await uploadPage.fillTitle('My Outfit');
await uploadPage.uploadImage('./test-image.jpg');
await uploadPage.submitForm();
await uploadPage.expectSuccessMessage();
```

## Authentication

For tests requiring authentication, use the `AuthHelper`:

```typescript
import { AuthHelper } from '../helpers/auth-helper';

const authHelper = new AuthHelper(page);
await authHelper.login(); // Uses test credentials from fixtures
```

## Best Practices

1. **Use Page Object Models** - All page interactions should go through POMs
2. **Use descriptive test names** - Clearly describe what the test does
3. **Test user workflows** - Focus on end-to-end user journeys
4. **Assert expectations** - Always verify expected outcomes
5. **Clean up** - Use `test.afterEach` or `test.afterAll` for cleanup if needed
6. **Isolate tests** - Each test should be independent and runnable in isolation

## Continuous Integration

Tests are configured to run in CI/CD pipelines:

- Multiple browser projects (Chrome, Firefox, Safari)
- Multiple viewport sizes (Desktop, Tablet, Mobile)
- Automatic retries on failure
- Screenshots and videos on failure
- HTML reports for test results

## Configuration

Playwright configuration is in `playwright.config.ts`:

- Test directory: `tests/e2e`
- Base URL: `http://localhost:3000`
- Timeout: 30 seconds
- Retries: 2 in CI, 0 locally
- Web server: Automatically starts React app

## Troubleshooting

### Tests fail with "page.goto: net::ERR_CONNECTION_REFUSED"
- Ensure the React app is running on port 3000
- Check `playwright.config.ts` webServer configuration

### Tests timeout
- Increase timeout in `playwright.config.ts`
- Check if the app is loading correctly
- Verify selectors match the actual page structure

### Authentication fails
- Check Firebase emulator is running (if using emulators)
- Verify test credentials in `fixtures/test-data.ts`
- Ensure environment variables are set correctly

## Future Enhancements

- [ ] Visual regression testing
- [ ] Accessibility testing
- [ ] Performance testing
- [ ] API mocking for faster tests
- [ ] Parallel test execution optimization
- [ ] Test coverage reporting
