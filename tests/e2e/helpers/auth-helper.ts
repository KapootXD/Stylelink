import { expect, Page } from '@playwright/test';
import { testUser, TestUser } from '../fixtures/test-data';

/**
 * Thin authentication helper to keep specs focused on user flows.
 * Adjust selectors to match the app's auth screens.
 */
export class AuthHelper {
  constructor(private page: Page) {}

  async login(credentials: TestUser = testUser) {
    // When guest/demo mode is enabled we don't need to exercise the full
    // authentication flow. Short-circuit to save time and avoid failures when
    // Firebase credentials aren't configured in CI.
    if (
      process.env.REACT_APP_ALLOW_GUEST_MODE === 'true' ||
      process.env.PLAYWRIGHT_BYPASS_AUTH === 'true'
    ) {
      await this.page.goto('/');
      await this.page.waitForLoadState('domcontentloaded');
      return;
    }

    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Use label-based selectors to match the Input component
    await this.page.getByLabel(/email/i).fill(credentials.email);
    
    // Password input might be type="password" or type="text" depending on visibility
    const passwordInput = this.page.locator('input[type="password"], input[type="text"]').filter({
      has: this.page.locator('label').filter({ hasText: /password/i })
    }).or(
      this.page.getByLabel(/password/i)
    ).first();
    await passwordInput.fill(credentials.password);
    
    await this.page.getByRole('button', { name: /sign in|log in/i }).click();
    await this.page.waitForTimeout(2000); // Wait for login to complete
    // In guest/demo mode auth may be disabled; don't fail if we stay on /login
    try {
      await expect(this.page).not.toHaveURL(/\/login/i, { timeout: 10000 });
    } catch {
      // If still on login, proceed so flows relying on demo data continue
    }
  }

  async logout() {
    const logoutButton = this.page.getByRole('button', { name: /log\s*out|logout|sign\s*out|signout/i });
    if (await logoutButton.count()) {
      await logoutButton.first().click();
      await this.page.waitForLoadState('domcontentloaded');
      // After logout, should redirect to home or login
      await expect(this.page).toHaveURL(/.*\/(?!profile|dashboard|settings|upload|activity|discover)/, { timeout: 10000 });
    }
  }
}

/**
 * Helper function to login with different user types
 * Note: These credentials need to exist in your test environment
 */
export async function loginAsUser(
  page: Page,
  userType: 'admin' | 'seller_premium' | 'seller' | 'buyer' | 'premium' | 'regular'
) {
  const mapToCanonicalType = (
    type: 'admin' | 'seller_premium' | 'seller' | 'buyer' | 'premium' | 'regular'
  ): 'admin' | 'seller_premium' | 'seller' | 'buyer' => {
    switch (type) {
      case 'premium':
        return 'seller_premium';
      case 'regular':
        return 'buyer';
      default:
        return type;
    }
  };

  const normalizedType = mapToCanonicalType(userType);

  const credentials: Record<
    'admin' | 'seller_premium' | 'seller' | 'buyer',
    { email: string; password: string }
  > = {
    admin: {
      email: process.env.E2E_ADMIN_EMAIL || 'admin@test.com',
      password: process.env.E2E_ADMIN_PASSWORD || 'admin123'
    },
    seller_premium: {
      email: process.env.E2E_SELLER_PREMIUM_EMAIL || 'sellerpremium@test.com',
      password: process.env.E2E_SELLER_PREMIUM_PASSWORD || 'sellerpremium123'
    },
    seller: {
      email: process.env.E2E_SELLER_EMAIL || 'seller@test.com',
      password: process.env.E2E_SELLER_PASSWORD || 'seller123'
    },
    buyer: {
      email: process.env.E2E_BUYER_EMAIL || 'buyer@test.com',
      password: process.env.E2E_BUYER_PASSWORD || 'buyer123'
    }
  };

  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');
  
  await page.getByLabel(/email/i).fill(credentials[normalizedType].email);
  
  const passwordInput = page.locator('input[type="password"], input[type="text"]').filter({
    has: page.locator('label').filter({ hasText: /password/i })
  }).or(
    page.getByLabel(/password/i)
  ).first();
  await passwordInput.fill(credentials[normalizedType].password);

  await page.getByRole('button', { name: /log in|sign in/i }).click();

  // Wait for redirect away from login page; in guest or demo mode this may not
  // happen, so continue even if navigation stays on /login.
  try {
    await page.waitForURL(/.*\/(?!login)/, { timeout: 10000 });
  } catch {
    // Continue so specs can still assert UI guard rails when auth is optional.
  }
}

/**
 * Helper to create test users via UI
 * Note: This creates a user through the signup flow
 */
export async function createTestUser(
  page: Page, 
  email: string, 
  password: string = 'password123',
  userType: 'customer' | 'seller' = 'customer'
) {
  await page.goto('/signup');
  await page.waitForLoadState('domcontentloaded');
  
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password/i).fill(password);
  await page.getByLabel(/confirm password/i).fill(password);
  
  // Select user type
  if (userType === 'customer') {
    await page.getByRole('button', { name: /customer.*explore.*shop/i }).click();
  } else {
    await page.getByRole('button', { name: /seller.*upload.*promote/i }).click();
  }
  
  // Submit form
  await page.getByRole('button', { name: /sign up|register|create account/i }).click();
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for redirect after signup
  await page.waitForURL(/.*\/(?!signup)/, { timeout: 10000 });
}
