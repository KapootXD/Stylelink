# Style Link Testing Guide – Phase 3

Comprehensive testing documentation for Style Link development team.

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Running Tests Locally](#running-tests-locally)
3. [Writing Unit Tests](#writing-unit-tests)
4. [Writing E2E Tests](#writing-e2e-tests)
5. [Code Coverage](#code-coverage)
6. [CI/CD Testing](#cicd-testing)
7. [Testing Checklist for MRs](#testing-checklist-for-mrs)
8. [Common Testing Pitfalls](#common-testing-pitfalls)
9. [Debugging Tests](#debugging-tests)
10. [Test Coverage Report](#test-coverage-report)

---

## Testing Overview

### Why We Test

Testing ensures:
- **Quality**: Catch bugs before they reach production
- **Confidence**: Refactor and add features without breaking existing functionality
- **Documentation**: Tests serve as living documentation of how code should work
- **Faster Development**: Catch issues early in the development cycle
- **Better Design**: Writing tests forces us to think about component/service interfaces

### Types of Tests We Use

1. **Unit Tests** (Vitest + React Testing Library)
   - Test individual components, functions, and utilities in isolation
   - Fast execution, high coverage
   - Mock external dependencies

2. **Integration Tests** (Vitest + React Testing Library)
   - Test how components work together
   - Test user interactions and workflows
   - Use real implementations where possible

3. **End-to-End (E2E) Tests** (Playwright)
   - Test complete user flows across the entire application
   - Run in real browsers (Chromium, Firefox, WebKit)
   - Test across different viewports (desktop, tablet, mobile)

### Coverage Requirements

We maintain the following coverage thresholds:

| Metric     | Threshold | Purpose |
|------------|-----------|---------|
| Lines      | 80%       | Ensure most code paths are tested |
| Branches   | 70%       | Test conditional logic |
| Functions  | 70%       | Test function implementations |
| Statements | 80%       | Ensure statements execute |

**Note**: Coverage is a metric, not a goal. Focus on testing critical paths and user-facing functionality.

---

## Running Tests Locally

### Unit Tests

```bash
# Run all unit tests once
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Open Vitest UI (interactive test runner)
npm run test:ui

# Run legacy CRA test runner (if needed)
npm run test:cra
```

### E2E Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run E2E tests with visible browser
npm run test:e2e:headed

# Run E2E tests in interactive UI mode (recommended for debugging)
npm run test:e2e:ui

# Run E2E tests in debug mode (step through tests)
npm run test:e2e:debug

# View last E2E test report
npm run test:e2e:report
```

### Running Specific Tests

```bash
# Run a specific test file
npm test -- Button.test.tsx

# Run tests matching a pattern
npm test -- --grep "login"

# Run E2E tests for a specific file
npm run test:e2e -- tests/e2e/specs/auth.spec.ts

# Run E2E tests in a specific browser
npm run test:e2e -- --project=chromium-desktop
```

---

## Writing Unit Tests

### Where to Place Test Files

**Co-locate test files with source code:**

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx        ← Test file next to component
├── services/
│   ├── apiService.ts
│   └── apiService.test.ts      ← Test file next to service
└── utils/
    ├── validation.ts
    └── validation.test.ts      ← Test file next to utility
```

### Naming Convention

- Unit tests: `*.test.tsx` or `*.test.ts`
- Alternative: `*.spec.tsx` or `*.spec.ts` (both work)
- E2E tests: `*.spec.ts` (in `tests/e2e/specs/`)

### Testing Components

#### Best Practices

1. **Query by Role/Label (Accessibility First)**
   ```tsx
   // ✅ Good - Accessible queries
   const button = getByRole('button', { name: /submit/i });
   const input = getByLabelText(/email/i);
   const heading = getByRole('heading', { name: /welcome/i });

   // ❌ Avoid - Implementation details
   const button = container.querySelector('.btn-primary');
   const input = getByTestId('email-input'); // Only as last resort
   ```

2. **Test User Behavior, Not Implementation**
   ```tsx
   // ✅ Good - Test what user sees/does
   test('user can submit form with valid data', async () => {
     render(<LoginForm />);
     await userEvent.type(getByLabelText(/email/i), 'test@example.com');
     await userEvent.type(getByLabelText(/password/i), 'password123');
     await userEvent.click(getByRole('button', { name: /sign in/i }));
     expect(getByText(/welcome/i)).toBeInTheDocument();
   });

   // ❌ Avoid - Testing implementation
   test('component calls onSubmit with correct data', () => {
     const onSubmit = vi.fn();
     render(<LoginForm onSubmit={onSubmit} />);
     // Testing internal function calls
   });
   ```

3. **Use userEvent for Interactions**
   ```tsx
   import { render, screen } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';

   test('user can type in input', async () => {
     const user = userEvent.setup();
     render(<Input label="Email" />);
     const input = screen.getByLabelText(/email/i);
     await user.type(input, 'test@example.com');
     expect(input).toHaveValue('test@example.com');
   });
   ```

#### Example Component Test Template

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled();
  });
});
```

### Testing Services

#### Best Practices

1. **Mock External Dependencies**
   ```tsx
   import { vi } from 'vitest';
   import axios from 'axios';
   import { fetchUserData } from './apiService';

   vi.mock('axios');

   test('fetches user data successfully', async () => {
     const mockData = { id: 1, name: 'John' };
     vi.mocked(axios.get).mockResolvedValue({ data: mockData });

     const result = await fetchUserData(1);
     expect(result).toEqual(mockData);
     expect(axios.get).toHaveBeenCalledWith('/api/users/1');
   });
   ```

2. **Test Success and Error Cases**
   ```tsx
   describe('apiService', () => {
     it('handles successful API call', async () => {
       vi.mocked(axios.get).mockResolvedValue({ data: { success: true } });
       const result = await fetchData();
       expect(result.success).toBe(true);
     });

     it('handles API errors', async () => {
       vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));
       await expect(fetchData()).rejects.toThrow('Network error');
     });
   });
   ```

3. **Test Edge Cases**
   ```tsx
   describe('validation', () => {
     it('validates email format', () => {
       expect(validateEmail('test@example.com')).toBe(true);
       expect(validateEmail('invalid-email')).toBe(false);
       expect(validateEmail('')).toBe(false);
       expect(validateEmail('test@')).toBe(false);
     });
   });
   ```

#### Example Service Test Template

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiService } from './apiService';
import axios from 'axios';

vi.mock('axios');

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('makes GET request successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    vi.mocked(axios.get).mockResolvedValue({ data: mockData });

    const result = await apiService.get('/users/1');
    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith('/users/1');
  });

  it('handles errors gracefully', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));
    await expect(apiService.get('/users/1')).rejects.toThrow();
  });
});
```

---

## Writing E2E Tests

### Where to Place E2E Tests

```
tests/
└── e2e/
    ├── fixtures/           # Test data
    │   └── test-data.ts
    ├── helpers/            # Shared helper functions
    │   └── auth-helper.ts
    ├── pages/              # Page Object Models
    │   ├── login.page.ts
    │   └── signup.page.ts
    └── specs/              # E2E test files
        ├── auth.spec.ts
        └── navigation.spec.ts
```

### Page Object Model Pattern

**Why Page Objects?**
- Encapsulate page-specific logic
- Reusable across multiple tests
- Easier maintenance when UI changes
- Cleaner test code

**Example Page Object:**

```typescript
// tests/e2e/pages/login.page.ts
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByRole('button', { name: /sign in/i }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectErrorMessage() {
    await expect(
      this.page.getByText(/invalid|error|incorrect/i)
    ).toBeVisible();
  }
}
```

**Using Page Objects in Tests:**

```typescript
// tests/e2e/specs/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('User Login', () => {
  test('user can login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user@test.com', 'password123');
    await expect(page).toHaveURL(/.*\/(?!login)/);
  });
});
```

### Best Practices

1. **Use Auto-Waiting (No Hard-Coded Waits)**
   ```typescript
   // ✅ Good - Playwright auto-waits
   await page.getByRole('button', { name: /submit/i }).click();
   await expect(page.getByText(/success/i)).toBeVisible();

   // ❌ Avoid - Hard-coded waits
   await page.waitForTimeout(2000);
   await page.click('.submit-button');
   ```

2. **Query by User-Visible Elements**
   ```typescript
   // ✅ Good - Accessible queries
   await page.getByRole('button', { name: /submit/i });
   await page.getByLabel(/email/i);
   await page.getByText(/welcome/i);

   // ❌ Avoid - CSS selectors
   await page.locator('.btn-primary');
   await page.locator('#email-input');
   ```

3. **Test Critical Paths**
   - User authentication flows
   - Core user journeys (signup, login, upload, search)
   - Protected routes
   - Form submissions
   - Navigation flows

#### Example E2E Test Template

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { testUser } from '../fixtures/test-data';

test.describe('User Authentication', () => {
  test('user can login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    
    // Verify redirect after login
    await expect(page).toHaveURL(/.*\/(?!login)/);
    
    // Verify user is logged in
    await expect(page.getByRole('link', { name: /profile/i })).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('wrong@test.com', 'wrongpassword');
    
    await loginPage.expectErrorMessage();
  });
});
```

---

## Code Coverage

### Coverage Thresholds

Our coverage thresholds are enforced in `vitest.config.mts`:

- **Lines**: 80%
- **Branches**: 70%
- **Functions**: 70%
- **Statements**: 80%

### Viewing Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report (after running coverage)
# On macOS:
open coverage/index.html

# On Windows:
start coverage/index.html

# On Linux:
xdg-open coverage/index.html
```

### Understanding Coverage Metrics

1. **Line Coverage**: Percentage of executable lines that were executed
2. **Branch Coverage**: Percentage of conditional branches (if/else, switch) that were taken
3. **Function Coverage**: Percentage of functions that were called
4. **Statement Coverage**: Percentage of statements that were executed

### What to Do if Coverage Drops

1. **Identify the Gap**
   - Open `coverage/index.html`
   - Find files with low coverage
   - Review uncovered lines

2. **Add Tests**
   - Focus on critical paths first
   - Test error cases
   - Test edge cases

3. **Review Coverage**
   - Not all code needs 100% coverage
   - Focus on user-facing functionality
   - Don't test implementation details

---

## CI/CD Testing

### Tests Run Automatically

Tests run automatically on every Merge Request (MR) in the following stages:

1. **Install Dependencies** → `npm ci`
2. **Lint** → `npm run lint`
3. **Unit Tests** → `npm run test:coverage`
4. **E2E Tests** → `npm run test:e2e`
5. **Build** → `npm run build` (only if tests pass)

### How to View Test Results in GitLab

1. **Pipeline Status**
   - Go to your MR
   - Check the pipeline status badge
   - Green ✅ = passing, Red ❌ = failing

2. **Coverage Report**
   - Click on the `unit_tests` job
   - Open "Artifacts" tab
   - Download `coverage/` folder
   - Open `coverage/index.html` in browser

3. **E2E Test Results**
   - Click on the `e2e_tests` job
   - View test output in job logs
   - If tests fail, check "Artifacts" for:
     - Screenshots (in `test-results/`)
     - Video recordings (in `test-results/`)
     - Trace files (in `playwright-report/`)

### What to Do When CI Tests Fail

1. **Unit Test Failures**
   ```bash
   # Run tests locally
   npm run test:coverage
   
   # Fix failing tests
   # Check coverage thresholds
   ```

2. **E2E Test Failures**
   ```bash
   # Run E2E tests locally
   npm run test:e2e:headed
   
   # Debug specific test
   npm run test:e2e:debug -- tests/e2e/specs/auth.spec.ts
   
   # Check CI artifacts for screenshots/videos
   ```

3. **Lint Failures**
   ```bash
   # Run linter locally
   npm run lint
   
   # Auto-fix if possible
   npm run lint -- --fix
   ```

4. **Build Failures**
   ```bash
   # Build locally
   npm run build
   
   # Check for TypeScript errors
   # Check for missing dependencies
   ```

### How to Debug CI Failures

1. **Reproduce Locally**
   - Run the same command that failed in CI
   - Check environment variables
   - Verify dependencies

2. **Check CI Logs**
   - Read the full error message
   - Look for stack traces
   - Check for environment-specific issues

3. **Use CI Artifacts**
   - Download screenshots/videos from failed E2E tests
   - Review coverage reports
   - Check build artifacts

---

## Testing Checklist for MRs

Before submitting a Merge Request, ensure:

- [ ] **Unit tests added for new code**
  - New components have test files
  - New services/utilities have tests
  - Edge cases are covered

- [ ] **E2E tests updated if user flow changed**
  - Critical paths still work
  - New user flows are tested
  - Existing E2E tests still pass

- [ ] **All tests passing locally**
  - `npm test` passes
  - `npm run test:e2e` passes
  - No flaky tests

- [ ] **Coverage meets threshold**
  - Run `npm run test:coverage`
  - Check coverage report
  - Coverage doesn't drop below thresholds

- [ ] **No console errors or warnings**
  - Check browser console
  - Check test output
  - Fix any warnings

- [ ] **Code is linted**
  - `npm run lint` passes
  - No linting errors

---

## Common Testing Pitfalls

### 1. Testing Implementation Details

```tsx
// ❌ Bad - Testing implementation
test('calls handleClick function', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick} />);
  // Testing internal function calls
});

// ✅ Good - Testing behavior
test('button calls onClick when clicked', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Button onClick={handleClick}>Click me</Button>);
  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```

### 2. Not Cleaning Up After Tests

```tsx
// ✅ Good - Cleanup in afterEach
afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
```

### 3. Hard-Coded Waits in E2E Tests

```typescript
// ❌ Bad - Hard-coded wait
await page.waitForTimeout(2000);
await page.click('.button');

// ✅ Good - Auto-waiting
await page.getByRole('button', { name: /submit/i }).click();
await expect(page.getByText(/success/i)).toBeVisible();
```

### 4. Not Mocking External Dependencies

```tsx
// ❌ Bad - Real API calls in tests
test('fetches data', async () => {
  const data = await fetchUserData(); // Real API call
});

// ✅ Good - Mocked dependencies
vi.mock('./apiService');
test('fetches data', async () => {
  vi.mocked(fetchUserData).mockResolvedValue({ id: 1 });
  const data = await fetchUserData();
});
```

### 5. Flaky Tests

**Common causes:**
- Race conditions
- Hard-coded timeouts
- Unstable selectors
- Shared state between tests

**Solutions:**
- Use `findBy` queries for async elements
- Use Playwright's auto-waiting
- Isolate test data
- Use `beforeEach`/`afterEach` for setup/cleanup

---

## Debugging Tests

### Using test:watch Mode

```bash
# Run tests in watch mode
npm run test:watch

# Tests re-run automatically on file changes
# Press 'a' to run all tests
# Press 'f' to run only failed tests
# Press 'q' to quit
```

### Using Playwright UI Mode

```bash
# Open Playwright UI
npm run test:e2e:ui

# Features:
# - Visual test runner
# - Step through tests
# - Inspect elements
# - View screenshots/videos
# - Time travel debugging
```

### Using console.log vs debugger

```typescript
// ✅ Good for quick debugging
console.log('Current URL:', page.url());
console.log('Element text:', await element.textContent());

// ✅ Better for step-by-step debugging
test('debug test', async ({ page }) => {
  await page.goto('/login');
  await page.pause(); // Pauses execution, opens Playwright Inspector
  // Step through code line by line
});
```

### Inspecting Test Output

```bash
# Verbose output
npm test -- --reporter=verbose

# Show console logs
npm run test:e2e -- --reporter=list

# Generate detailed report
npm run test:e2e:report
```

---

## Test Coverage Report

### Current Coverage Status

Run `npm run test:coverage` to generate the latest coverage report.

### Coverage by Category

Coverage is tracked for:
- **Components**: React components in `src/components/`
- **Services**: API services in `src/services/`
- **Utils**: Utility functions in `src/utils/`
- **Pages**: Page components in `src/pages/` (if tested)

### Files with 100% Coverage

These files have comprehensive test coverage:
- `src/components/Button.tsx`
- `src/components/Input.tsx`
- `src/components/Card.tsx`
- `src/components/Modal.tsx`
- `src/components/LoadingSpinner.tsx`
- `src/utils/validation.ts`
- `src/utils/helpers.ts`

### Files Needing Improvement

Review coverage report (`coverage/index.html`) to identify:
- Files with coverage below thresholds
- Uncovered critical paths
- Missing error case tests

### Action Items

1. **Review Coverage Report**
   ```bash
   npm run test:coverage
   open coverage/index.html
   ```

2. **Identify Gaps**
   - Files below 80% line coverage
   - Missing branch coverage
   - Untested error cases

3. **Prioritize**
   - Critical user paths first
   - Error handling
   - Edge cases

4. **Add Tests**
   - Focus on user-facing functionality
   - Test error cases
   - Test edge cases

---

## Resources

- **Vitest Documentation**: https://vitest.dev
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro
- **Playwright Documentation**: https://playwright.dev
- **Testing Library Queries**: https://testing-library.com/docs/queries/about
- **Accessibility Testing**: https://www.w3.org/WAI/test-evaluate/

---

## Quick Reference

### Test Commands

```bash
# Unit Tests
npm test                    # Run once
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
npm run test:ui             # UI mode

# E2E Tests
npm run test:e2e            # Headless
npm run test:e2e:headed     # Visible browser
npm run test:e2e:ui         # Interactive UI
npm run test:e2e:debug      # Debug mode
npm run test:e2e:report      # View report
```

### Coverage Thresholds

- Lines: 80%
- Branches: 70%
- Functions: 70%
- Statements: 80%

### Test File Locations

- Unit tests: Co-located with source (`*.test.tsx`)
- E2E tests: `tests/e2e/specs/*.spec.ts`
- Page Objects: `tests/e2e/pages/*.page.ts`
- Helpers: `tests/e2e/helpers/*.ts`
- Fixtures: `tests/e2e/fixtures/*.ts`

---

**Last Updated**: 2024
**Maintained by**: QA Team
