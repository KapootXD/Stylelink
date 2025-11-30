import { expect, Page } from '@playwright/test';
import { testUser, TestUser } from '../fixtures/test-data';

/**
 * Thin authentication helper to keep specs focused on user flows.
 * Adjust selectors to match the app's auth screens.
 */
export class AuthHelper {
  constructor(private page: Page) {}

  async login(credentials: TestUser = testUser) {
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
