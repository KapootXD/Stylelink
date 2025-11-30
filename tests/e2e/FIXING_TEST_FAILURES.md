# 🔧 Efficient Guide to Fixing E2E Test Failures

## 🎯 Systematic Approach to Fixing Tests

### Step 1: Run Tests and Generate Report

First, run tests to see what's failing:

```bash
# Run all tests and see summary
npm run test:e2e

# Or run with UI mode to see failures in real-time
npm run test:e2e:ui
```

After running, view the HTML report:

```bash
npm run test:e2e:report
```

## 📊 Understanding Test Failures

### 1. Identify Failure Categories

Tests typically fail for these reasons:
- **Selector issues** - Elements not found
- **Timing issues** - Elements not loaded in time
- **Navigation issues** - Wrong URLs or routes
- **State issues** - Page not in expected state
- **API/Network issues** - Mocked requests failing

### 2. Check Test Report Details

The HTML report shows:
- ✅ Which tests passed/failed
- 📸 Screenshots on failure
- 🎥 Videos of test execution
- 🔍 Error messages and stack traces
- ⏱️ Execution time

## 🔄 Efficient Fixing Workflow

### Phase 1: Quick Wins (High Impact, Low Effort)

1. **Fix Selector Issues** (Most Common)

```bash
# Run tests with trace to see what selectors failed
npx playwright test --trace on
```

**Common fixes:**
- Use more specific selectors
- Add `data-testid` attributes to your components
- Use `getByRole`, `getByLabel`, `getByText` instead of CSS selectors
- Add waits for dynamic content

**Example:**
```typescript
// ❌ Bad: Fragile CSS selector
await page.locator('.some-class').click();

// ✅ Good: Semantic selector
await page.getByRole('button', { name: /submit/i }).click();

// ✅ Best: Test ID
await page.getByTestId('submit-button').click();
```

2. **Fix Timing Issues**

Add proper waits:
```typescript
// ✅ Wait for element to be visible
await expect(page.getByRole('heading')).toBeVisible();

// ✅ Wait for navigation
await page.waitForURL(/.*\/results/);

// ✅ Wait for network idle
await page.waitForLoadState('networkidle');
```

### Phase 2: Run Tests in Debug Mode

For complex failures, use debug mode:

```bash
# Run specific failing test in debug mode
npx playwright test tests/e2e/specs/signup-workflow.spec.ts -g "user can complete customer signup" --debug
```

This opens:
- Playwright Inspector
- Step-by-step execution
- Element picker
- Console logs
- Network requests

### Phase 3: Fix by Priority

Fix in this order:
1. **Critical path tests** (signup, login)
2. **High-traffic features** (search, browse)
3. **Edge cases** (validation, errors)

## 🛠️ Common Fix Patterns

### Pattern 1: Selector Not Found

**Symptoms:**
```
Error: locator.click: Timeout 30000ms exceeded
```

**Fix:**
```typescript
// Update Page Object Model to use better selectors
async clickSubmit() {
  // Try multiple selector strategies
  const button = this.page
    .getByRole('button', { name: /submit/i })
    .or(this.page.locator('[data-testid="submit"]'))
    .or(this.page.getByText(/submit/i))
    .first();
  
  await expect(button).toBeVisible({ timeout: 10000 });
  await button.click();
}
```

### Pattern 2: Element Not Visible

**Symptoms:**
```
Error: Element is not visible
```

**Fix:**
```typescript
// Wait for element to be in viewport
await button.scrollIntoViewIfNeeded();
await expect(button).toBeVisible();
await button.click();
```

### Pattern 3: Navigation Issues

**Symptoms:**
```
Error: expected URL to match /.*\/results/
```

**Fix:**
```typescript
// Wait for navigation to complete
await page.waitForLoadState('domcontentloaded');
await expect(page).toHaveURL(/.*\/results/, { timeout: 10000 });
```

### Pattern 4: Form Input Issues

**Symptoms:**
```
Error: Input element not found
```

**Fix:**
```typescript
// Use multiple selector strategies
const input = page
  .getByLabel(/email/i)
  .or(page.getByPlaceholder(/email/i))
  .or(page.locator('input[type="email"]'))
  .first();

await expect(input).toBeVisible();
await input.fill('test@example.com');
```

## 📝 Step-by-Step Fixing Process

### 1. Run One Failing Test

```bash
# Run single test file
npx playwright test tests/e2e/specs/signup-workflow.spec.ts

# Run single test
npx playwright test -g "user can complete customer signup"
```

### 2. Examine the Failure

Look at:
- Error message
- Screenshot (if generated)
- Stack trace
- Which line failed

### 3. Fix in Page Object Model

Update the Page Object Model, not the test:

```typescript
// tests/e2e/pages/customer-signup.page.ts

// Update the selector
async fillEmail(email: string) {
  // Add fallback selectors
  const emailInput = this.page
    .getByPlaceholder(/email/i)
    .or(this.page.getByLabel(/email/i))
    .or(this.page.locator('input[name="email"]'))
    .first();
  
  await expect(emailInput).toBeVisible({ timeout: 5000 });
  await emailInput.fill(email);
}
```

### 4. Test Your Fix

```bash
# Run just that test again
npx playwright test -g "user can complete customer signup"
```

### 5. Move to Next Failure

Once fixed, move to the next failing test.

## 🎯 Quick Fix Checklist

For each failing test:

- [ ] **Check selector** - Is the element selector correct?
- [ ] **Check timing** - Is there a wait/expect for element?
- [ ] **Check visibility** - Is element visible/attached?
- [ ] **Check state** - Is page in expected state?
- [ ] **Check navigation** - Did navigation complete?
- [ ] **Check console** - Any JavaScript errors?
- [ ] **Check network** - Any failed API calls?

## 🚀 Advanced Debugging

### Use Trace Viewer

```bash
# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

Trace viewer shows:
- Timeline of all actions
- Network requests
- Console logs
- Screenshots at each step

### Use Screenshots

```bash
# Screenshots are automatically saved on failure
# Check: test-results/ folder
```

### Use Video Recording

```bash
# Videos are saved on retry
# Check: test-results/ folder
```

### Check Console Logs

Add logging to your tests:
```typescript
// In your test
await page.on('console', msg => console.log('Browser:', msg.text()));

// Or check for errors
const errors: string[] = [];
page.on('pageerror', error => errors.push(error.message));
```

## 🔍 Selective Test Running

Fix tests one at a time:

```bash
# Run only failing tests from last run
npx playwright test --last-failed

# Run specific test file
npx playwright test tests/e2e/specs/signup-workflow.spec.ts

# Run tests matching pattern
npx playwright test -g "signup"

# Run tests in specific browser
npx playwright test --project=chromium-desktop
```

## 📋 Recommended Fixing Order

1. **Start with signup/login tests** - Core functionality
2. **Fix selector issues first** - Quick wins
3. **Fix timing issues second** - Add proper waits
4. **Fix navigation issues third** - Routes and redirects
5. **Fix validation last** - Edge cases

## 🛠️ Quick Commands Reference

```bash
# Run all tests
npm run test:e2e

# Run with UI (best for fixing)
npm run test:e2e:ui

# Run last failed tests
npx playwright test --last-failed

# Run specific test
npx playwright test -g "test name"

# Debug mode
npx playwright test --debug

# View report
npm run test:e2e:report

# Show trace
npx playwright show-trace trace.zip
```

## 💡 Pro Tips

1. **Use UI Mode** - `npm run test:e2e:ui` is your best friend for fixing tests
2. **Fix one test at a time** - Don't try to fix everything at once
3. **Update Page Objects** - Keep tests clean, fix in POM
4. **Add test IDs** - Add `data-testid` to your React components
5. **Use semantic selectors** - Prefer `getByRole` over CSS selectors
6. **Check screenshots** - They show exactly what the test saw

## 📚 Next Steps

1. Run tests: `npm run test:e2e:ui`
2. Identify first failing test
3. Fix in Page Object Model
4. Re-run that test
5. Move to next failure
6. Repeat until all pass

Happy debugging! 🐛🔧

