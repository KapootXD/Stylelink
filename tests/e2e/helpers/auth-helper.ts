import { expect, Page } from '@playwright/test';
import { testUser, TestUser } from '../fixtures/test-data';

/**
 * Thin authentication helper to keep specs focused on user flows.
 * Adjust selectors to match the app's auth screens.
 */
export class AuthHelper {
  constructor(private page: Page) {}

  async login(credentials: TestUser = testUser) {
    await this.page.goto('/login', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    
    // Use label-based selectors to match the Input component
    await this.page.getByLabel(/email/i).fill(credentials.email, { timeout: 5000 });
    
    // Password input might be type="password" or type="text" depending on visibility
    const passwordInput = this.page.locator('input[type="password"], input[type="text"]').filter({
      has: this.page.locator('label').filter({ hasText: /password/i })
    }).or(
      this.page.getByLabel(/password/i)
    ).first();
    await passwordInput.fill(credentials.password, { timeout: 5000 });
    
    await this.page.getByRole('button', { name: /sign in|log in/i }).click({ timeout: 5000 });
    await this.page.waitForTimeout(2000); // Wait for login to complete
    await expect(this.page).not.toHaveURL(/\/login/i, { timeout: 10000 });
  }

  async logout() {
    const logoutButton = this.page.getByRole('button', { name: /log out|sign out/i });
    if (await logoutButton.count()) {
      await logoutButton.first().click();
      await expect(this.page).toHaveURL(/login|signin/i);
    }
  }
}
