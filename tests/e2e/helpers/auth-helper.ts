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
    await this.page.fill('input[name="email"]', credentials.email);
    await this.page.fill('input[name="password"]', credentials.password);
    await this.page.getByRole('button', { name: /sign in|log in/i }).click();
    await expect(this.page).not.toHaveURL(/\/login/i);
  }

  async logout() {
    const logoutButton = this.page.getByRole('button', { name: /log out|sign out/i });
    if (await logoutButton.count()) {
      await logoutButton.first().click();
      await expect(this.page).toHaveURL(/login|signin/i);
    }
  }
}
