import { test, expect } from '@playwright/test';
import { SignupPage } from '../pages/signup.page';

test.describe('User Signup', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
  });

  test('user can sign up with valid credentials as customer', async ({ page }) => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    await signupPage.goto();
    await signupPage.signup(uniqueEmail, 'password123', 'password123', 'customer');
    
    // Verify redirect to home or dashboard
    await expect(page).toHaveURL(/.*\/(?!signup)/, { timeout: 10000 });
    
    // Verify user is logged in (check for user menu or profile link)
    const profileLink = page.getByRole('link', { name: /profile/i });
    const userMenu = page.locator('[data-testid="user-menu"]');
    
    // Either profile link or user menu should be visible
    const hasProfileLink = await profileLink.count() > 0;
    const hasUserMenu = await userMenu.count() > 0;
    
    expect(hasProfileLink || hasUserMenu).toBeTruthy();
  });

  test('user can sign up with valid credentials as seller', async ({ page }) => {
    const uniqueEmail = `seller${Date.now()}@example.com`;
    
    await signupPage.goto();
    await signupPage.signup(uniqueEmail, 'password123', 'password123', 'seller');
    
    // Verify redirect to home or dashboard
    await expect(page).toHaveURL(/.*\/(?!signup)/, { timeout: 10000 });
    
    // Verify user is logged in
    const profileLink = page.getByRole('link', { name: /profile/i });
    const userMenu = page.locator('[data-testid="user-menu"]');
    
    const hasProfileLink = await profileLink.count() > 0;
    const hasUserMenu = await userMenu.count() > 0;
    
    expect(hasProfileLink || hasUserMenu).toBeTruthy();
  });

  test('shows error for mismatched passwords', async ({ page }) => {
    await signupPage.goto();
    
    await signupPage.page.getByLabel(/email/i).fill('test@example.com');
    await signupPage.page.getByLabel(/^password/i).fill('password123');
    await signupPage.page.getByLabel(/confirm password/i).fill('different');
    await signupPage.clickCustomerSignup();
    await signupPage.page.getByRole('button', { name: /sign up|register|create account/i }).click();
    
    // Should show validation error for password mismatch
    await expect(
      page.getByText(/password.*match|passwords do not match/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('shows error for invalid email', async ({ page }) => {
    await signupPage.goto();
    
    await signupPage.page.getByLabel(/email/i).fill('invalid-email');
    await signupPage.page.getByLabel(/^password/i).fill('password123');
    await signupPage.page.getByLabel(/confirm password/i).fill('password123');
    await signupPage.clickCustomerSignup();
    await signupPage.page.getByRole('button', { name: /sign up|register|create account/i }).click();
    
    await signupPage.expectValidationError('email');
  });

  test('shows error for empty email field', async ({ page }) => {
    await signupPage.goto();
    
    await signupPage.page.getByLabel(/^password/i).fill('password123');
    await signupPage.page.getByLabel(/confirm password/i).fill('password123');
    await signupPage.clickCustomerSignup();
    await signupPage.page.getByRole('button', { name: /sign up|register|create account/i }).click();
    
    await signupPage.expectValidationError('email');
  });

  test('shows error for empty password field', async ({ page }) => {
    await signupPage.goto();
    
    await signupPage.page.getByLabel(/email/i).fill('test@example.com');
    await signupPage.page.getByLabel(/confirm password/i).fill('password123');
    await signupPage.clickCustomerSignup();
    await signupPage.page.getByRole('button', { name: /sign up|register|create account/i }).click();
    
    await signupPage.expectValidationError('password');
  });

  test('shows error for password too short', async ({ page }) => {
    await signupPage.goto();
    
    await signupPage.page.getByLabel(/email/i).fill('test@example.com');
    await signupPage.page.getByLabel(/^password/i).fill('12345'); // Less than 6 characters
    await signupPage.page.getByLabel(/confirm password/i).fill('12345');
    await signupPage.clickCustomerSignup();
    await signupPage.page.getByRole('button', { name: /sign up|register|create account/i }).click();
    
    await expect(
      page.getByText(/password.*at least.*6|password must be at least/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('shows error when user type is not selected', async ({ page }) => {
    await signupPage.goto();
    
    await signupPage.page.getByLabel(/email/i).fill('test@example.com');
    await signupPage.page.getByLabel(/^password/i).fill('password123');
    await signupPage.page.getByLabel(/confirm password/i).fill('password123');
    // Don't select user type
    await signupPage.page.getByRole('button', { name: /sign up|register|create account/i }).click();
    
    await expect(
      page.getByText(/user type|please select.*user type/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('can navigate to login from signup page', async ({ page }) => {
    await signupPage.goto();
    await signupPage.clickLoginLink();
    
    await expect(page).toHaveURL(/.*\/login/, { timeout: 5000 });
  });
});

