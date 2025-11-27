# StyleLink E2E Tests

Comprehensive End-to-End tests for StyleLink application using Playwright.

## Quick Start

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## Test Structure

### Page Objects (`pages/`)

Page Object Models encapsulate page interactions:

- `home.page.ts` - Homepage interactions
- `about.page.ts` - About page interactions  
- `features.page.ts` - Features page interactions
- `navbar.component.ts` - Navigation component
- `login.page.ts` - Login page interactions
- `signup.page.ts` - Signup page interactions
- `not-found.page.ts` - 404 page interactions

### Test Specs (`specs/`)

Comprehensive test suites:

- `navigation.spec.ts` - Navigation flows (15+ tests)
- `homepage.spec.ts` - Homepage functionality (10+ tests)
- `responsive.spec.ts` - Responsive design (10+ tests)
- `auth.spec.ts` - Authentication flows (12+ tests)
- `404-page.spec.ts` - Error page handling (8+ tests)
- `about-page.spec.ts` - About page tests (8+ tests)
- `accessibility.spec.ts` - Keyboard navigation (10+ tests)

### Helpers (`helpers/`)

- `auth-helper.ts` - Authentication helper functions

### Fixtures (`fixtures/`)

- `test-data.ts` - Test data and mock responses

## Test Coverage

- ✅ All public pages tested
- ✅ All authentication pages tested
- ✅ Navigation flows tested
- ✅ Mobile/Tablet/Desktop responsive testing
- ✅ Keyboard navigation and accessibility
- ✅ Error handling (404 page)
- ✅ Protected route redirects

## Running Specific Tests

```bash
# Run a specific test file
npx playwright test tests/e2e/specs/navigation.spec.ts

# Run tests matching a pattern
npx playwright test --grep "mobile"

# Run on specific browser
npx playwright test --project=chromium-desktop

# Run with specific viewport
npx playwright test --project=chromium-mobile
```

## Configuration

Tests are configured in `playwright.config.ts`:
- Multiple browsers (Chromium, Firefox, WebKit)
- Multiple viewports (Mobile, Tablet, Desktop)
- Auto-start dev server
- Screenshots on failure
- Video on retry

## Best Practices

1. **Page Object Model**: All page interactions abstracted
2. **Accessible Queries**: Using roles, labels, and semantic queries
3. **Proper Waits**: Using `waitForLoadState` and explicit waits
4. **Clear Descriptions**: Descriptive test names
5. **Maintainable**: Easy to update and extend

