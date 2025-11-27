import { expect, Page } from '@playwright/test';
import { TestUser } from '../fixtures/test-data';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/login/);
    await expect(
      this.page.getByRole('heading', { name: /sign in|login/i, level: 1 }).or(
        this.page.getByRole('heading', { name: /welcome back/i })
      )
    ).toBeVisible({ timeout: 10000 });
  }

  async fillEmail(email: string) {
    await this.page.getByLabel(/email/i).fill(email);
  }

  async fillPassword(password: string) {
    await this.page.locator('input[type="password"]').fill(password);
  }

  async clickSignIn() {
    await this.page.getByRole('button', { name: /sign in|log in/i }).click();
  }

  async login(credentials: TestUser) {
    await this.fillEmail(credentials.email);
    await this.fillPassword(credentials.password);
    await this.clickSignIn();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickSignUpLink() {
    // There may be multiple "Sign up" links (navbar and form), use the one in the form area
    const formArea = this.page.locator('form').or(this.page.locator('main'));
    await formArea.getByRole('link', { name: /sign up/i }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickForgotPasswordLink() {
    await this.page.getByRole('link', { name: /forgot password/i }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectErrorMessage() {
    await expect(
      this.page.getByText(/invalid|error|incorrect/i)
    ).toBeVisible();
  }

  async expectFormVisible() {
    await expect(this.page.getByLabel(/email/i)).toBeVisible();
    await expect(this.page.locator('input[type="password"]')).toBeVisible();
  }
}

export default LoginPage;
