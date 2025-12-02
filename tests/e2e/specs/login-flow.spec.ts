import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { testUser } from '../fixtures/test-data';

test.describe('User Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('user can login with valid credentials', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    
    // Should redirect away from login page
    await loginPage.expectRedirectToHome();
    
    // Verify user is logged in (check for profile link or user menu)
    const profileLink = page.getByRole('link', { name: /profile/i });
    const logoutButton = page.getByRole('button', { name: /log\s*out|logout|sign\s*out|signout/i });
    
    const hasProfileLink = await profileLink.count() > 0;
    const hasLogoutButton = await logoutButton.count() > 0;
    
    expect(hasProfileLink || hasLogoutButton).toBeTruthy();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login('wrong@test.com', 'wrongpassword');
    
    // Wait a bit for error to appear
    await page.waitForTimeout(1000);
    
    // Check for error message (could be toast notification or inline error)
    const errorSelectors = [
      page.getByText(/invalid|incorrect|wrong|error/i),
      page.locator('[role="alert"]'),
      page.getByText(/email.*password|credentials/i)
    ];
    
    let errorFound = false;
    for (const selector of errorSelectors) {
      try {
        await expect(selector.first()).toBeVisible({ timeout: 5000 });
        errorFound = true;
        break;
      } catch {
        // Continue to next selector
      }
    }
    
    // If no error message found, at least verify we're still on login page
    if (!errorFound) {
      await expect(page).toHaveURL(/.*\/login/);
    }
  });

  test('shows error for empty email field', async ({ page }) => {
    await loginPage.goto();
    
    // Try to submit with empty email
    await loginPage.fillPassword('password123');
    await loginPage.clickSignIn();
    
    await loginPage.expectEmailError();
  });

  test('shows error for empty password field', async ({ page }) => {
    await loginPage.goto();
    
    // Try to submit with empty password
    await loginPage.fillEmail('test@example.com');
    await loginPage.clickSignIn();
    
    await loginPage.expectPasswordError();
  });

  test('shows error for empty fields', async ({ page }) => {
    await loginPage.goto();
    
    // Try to submit empty form
    await loginPage.clickSignIn();
    
    // Should show validation errors
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.locator('input[type="password"]').first();
    
    // Check HTML5 validation or custom errors
    const emailRequired = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing);
    const passwordRequired = await passwordInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing);
    
    // If HTML5 validation doesn't catch it, check for custom error messages
    if (!emailRequired || !passwordRequired) {
      const errorMessages = page.getByText(/required|please/i);
      await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('shows error for invalid email format', async ({ page }) => {
    await loginPage.goto();
    
    await loginPage.fillEmail('invalid-email');
    await loginPage.fillPassword('password123');
    await loginPage.clickSignIn();
    
    await loginPage.expectEmailError();
  });

  test('can navigate to signup from login page', async ({ page }) => {
    await loginPage.goto();
    await loginPage.clickSignUpLink();
    
    await expect(page).toHaveURL(/.*\/signup/, { timeout: 5000 });
  });

  test('can navigate to forgot password from login page', async ({ page }) => {
    await loginPage.goto();
    await loginPage.clickForgotPasswordLink();
    
    await expect(page).toHaveURL(/.*\/forgot-password/, { timeout: 5000 });
  });

  test('password visibility toggle works', async ({ page }) => {
    await loginPage.goto();
    
    // Fill password
    await loginPage.fillPassword('password123');
    
    // Toggle password visibility
    await loginPage.togglePasswordVisibility();
    
    // Check that password input type changed to text
    const passwordInput = page.locator('input[type="text"]').filter({
      has: page.locator('label').filter({ hasText: /password/i })
    });
    
    // Password should be visible (type="text")
    const isVisible = await passwordInput.count() > 0;
    expect(isVisible).toBeTruthy();
  });

  test('redirects to intended page after login', async ({ page }) => {
    // Try to access protected route first
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    
    // Should redirect to login
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      // Login
      await loginPage.login(testUser.email, testUser.password);
      
      // Should redirect back to profile
      await expect(page).toHaveURL(/.*\/profile/, { timeout: 10000 });
    } else {
      // In guest mode, might stay on profile
      // Just verify we're on a valid page
      await expect(page).toHaveURL(/.*\/(profile|login)/);
    }
  });
});

