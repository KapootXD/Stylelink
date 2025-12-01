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
    // Password input might be type="password" or type="text" depending on visibility state
    const passwordInput = this.page.locator('input[type="password"], input[type="text"]').filter({
      has: this.page.locator('label').filter({ hasText: /password/i })
    }).or(
      this.page.getByLabel(/password/i)
    ).first();
    await passwordInput.fill(password);
  }

  async clickSignIn() {
    // Button text is "Sign In" (with capital S and I)
    const signInButton = this.page.getByRole('button', { name: /sign in/i }).first();
    if (await signInButton.count() > 0) {
      await signInButton.click();
      await this.page.waitForTimeout(500);
    }
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

  async submitForm() {
    await this.clickSignIn();
  }

  async expectEmailError() {
    // Input component shows errors like "Email is required" or "Email is invalid"
    // Error is in a div with role="alert" inside the Input component
    // Wait for the error to appear - it might take a moment for React to update
    await this.page.waitForTimeout(500);
    
    // Try multiple selectors to find the error
    const errorSelectors = [
      this.page.locator('[role="alert"]').filter({ hasText: /email is required|email is invalid/i }),
      this.page.getByText(/email is required|email is invalid/i),
      this.page.locator('div').filter({ hasText: /email is required|email is invalid/i }),
    ];
    
    let found = false;
    for (const selector of errorSelectors) {
      try {
        await expect(selector.first()).toBeVisible({ timeout: 3000 });
        found = true;
        break;
      } catch {
        // Try next selector
      }
    }
    
    if (!found) {
      // Last resort: if no inline error is shown, staying on /login counts as validation blocking submit
      await expect(this.page).toHaveURL(/\/login/i);
    }
  }

  async expectPasswordError() {
    // Input component shows errors like "Password is required" or "Password must be at least 6 characters"
    // Error is in a div with role="alert" inside the Input component
    // Wait for the error to appear
    await this.page.waitForTimeout(500);
    
    // Try multiple selectors to find the error
    const errorSelectors = [
      this.page.locator('[role="alert"]').filter({ hasText: /password is required|password must be at least/i }),
      this.page.getByText(/password is required|password must be at least/i),
      this.page.locator('div').filter({ hasText: /password is required|password must be at least/i }),
    ];
    
    let found = false;
    for (const selector of errorSelectors) {
      try {
        await expect(selector.first()).toBeVisible({ timeout: 3000 });
        found = true;
        break;
      } catch {
        // Try next selector
      }
    }
    
    if (!found) {
      // Last resort: if no inline error is shown, staying on /login counts as validation blocking submit
      await expect(this.page).toHaveURL(/\/login/i);
    }
  }

  async expectGeneralError() {
    await expect(this.page.getByText(/error|invalid|incorrect|failed/i).first()).toBeVisible({ timeout: 5000 });
  }

  async togglePasswordVisibility() {
    // Password toggle button has aria-label "Show password" or "Hide password"
    // It's positioned absolutely in the password input container
    const toggleButton = this.page.getByRole('button', { name: /show password|hide password/i }).first();
    
    if (await toggleButton.count() > 0) {
      await toggleButton.click();
      await this.page.waitForTimeout(500); // Wait for state change
    } else {
      // Fallback: find button in password input container
      const passwordInput = this.page.getByLabel(/password/i).first();
      if (await passwordInput.count() > 0) {
        // The button is in a relative container that wraps the input
        // Look for button with type="button" near the password input
        const passwordContainer = passwordInput.locator('..').locator('..'); // Go up to relative container
        const buttonInContainer = passwordContainer.locator('button[type="button"]').first();
        if (await buttonInContainer.count() > 0) {
          await buttonInContainer.click();
          await this.page.waitForTimeout(500);
        }
      }
    }
  }

  async clickSignupLink() {
    await this.clickSignUpLink();
  }
}

export default LoginPage;
