import { Page, expect } from '@playwright/test';

export interface CustomerSignupData {
  email: string;
  password: string;
  confirmPassword?: string;
  displayName?: string;
  username?: string;
}

export class CustomerSignupPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/signup/customer');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/signup\/customer/);
    // Wait for the form to be visible
    await expect(this.page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10000 });
  }

  // Fill form fields
  async fillEmail(email: string) {
    const emailInput = this.page.getByPlaceholder(/email/i).or(this.page.getByLabel(/email/i)).first();
    await emailInput.fill(email);
  }

  async fillPassword(password: string) {
    const passwordInput = this.page.getByPlaceholder(/password/i).or(this.page.getByLabel(/password/i)).first();
    await passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string) {
    const confirmInput = this.page.getByPlaceholder(/confirm.*password/i)
      .or(this.page.getByLabel(/confirm.*password/i))
      .first();
    await confirmInput.fill(password);
  }

  async fillDisplayName(name: string) {
    const nameInput = this.page.getByPlaceholder(/your name|name|display name/i)
      .or(this.page.getByLabel(/display name|your name/i))
      .first();
    if (await nameInput.count() > 0) {
      await nameInput.fill(name);
    }
  }

  async fillUsername(username: string) {
    const usernameInput = this.page.getByPlaceholder(/yourstyle|username/i)
      .or(this.page.getByLabel(/username/i))
      .first();
    if (await usernameInput.count() > 0) {
      await usernameInput.fill(username);
    }
  }

  // Fill complete form
  async fillForm(data: CustomerSignupData) {
    if (data.email) await this.fillEmail(data.email);
    if (data.password) await this.fillPassword(data.password);
    if (data.confirmPassword) {
      await this.fillConfirmPassword(data.confirmPassword);
    } else if (data.password) {
      await this.fillConfirmPassword(data.password);
    }
    if (data.displayName) await this.fillDisplayName(data.displayName);
    // Username is required - generate one if not provided
    if (!data.username && data.displayName) {
      await this.fillUsername(data.displayName.toLowerCase().replace(/\s+/g, ''));
    } else if (data.username) {
      await this.fillUsername(data.username);
    }
  }

  // Submit form
  async submitForm() {
    // Button text is exactly "Create Account"
    const submitButton = this.page.getByRole('button', { name: /create account/i }).first();
    if (await submitButton.count() > 0) {
      await submitButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  // Validation errors
  async expectEmailError(message?: string) {
    const pattern = message ? new RegExp(message, 'i') : /email is required|email is invalid/i;
    const errorByRole = this.page.locator('[role="alert"]').filter({
      hasText: pattern
    }).first();
    const errorByText = this.page.getByText(pattern).first();
    
    try {
      await expect(errorByRole).toBeVisible({ timeout: 5000 });
    } catch {
      await expect(errorByText).toBeVisible({ timeout: 5000 });
    }
  }

  async expectPasswordError(message?: string) {
    const pattern = message ? new RegExp(message, 'i') : /password is required|password must be at least/i;
    const errorByRole = this.page.locator('[role="alert"]').filter({
      hasText: pattern
    }).first();
    const errorByText = this.page.getByText(pattern).first();
    
    try {
      await expect(errorByRole).toBeVisible({ timeout: 5000 });
    } catch {
      await expect(errorByText).toBeVisible({ timeout: 5000 });
    }
  }

  async expectPasswordMismatchError() {
    const errorByRole = this.page.locator('[role="alert"]').filter({
      hasText: /passwords do not match|please confirm your password/i
    }).first();
    const errorByText = this.page.getByText(/passwords do not match|please confirm your password/i).first();
    
    try {
      await expect(errorByRole).toBeVisible({ timeout: 5000 });
    } catch {
      await expect(errorByText).toBeVisible({ timeout: 5000 });
    }
  }

  async expectDisplayNameError() {
    const errorByRole = this.page.locator('[role="alert"]').filter({
      hasText: /display name is required/i
    }).first();
    const errorByText = this.page.getByText(/display name is required/i).first();
    
    try {
      await expect(errorByRole).toBeVisible({ timeout: 5000 });
    } catch {
      await expect(errorByText).toBeVisible({ timeout: 5000 });
    }
  }

  async expectUsernameError() {
    const errorByRole = this.page.locator('[role="alert"]').filter({
      hasText: /username is required|username must be at least/i
    }).first();
    const errorByText = this.page.getByText(/username is required|username must be at least/i).first();
    
    try {
      await expect(errorByRole).toBeVisible({ timeout: 5000 });
    } catch {
      await expect(errorByText).toBeVisible({ timeout: 5000 });
    }
  }

  // Success state
  async expectSignupSuccess() {
    // After successful signup, navigates to /profile
    await expect(this.page).toHaveURL(/.*\/profile/, { timeout: 10000 });
  }

  // Navigation
  async clickBackToSignup() {
    // Back button is a button with "Back" text, not a link
    const backButton = this.page.getByRole('button', { name: /back/i }).first();
    if (await backButton.count() > 0) {
      await backButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      // Fallback: use browser back
      await this.page.goBack();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async clickLoginLink() {
    const loginLink = this.page.getByRole('link', { name: /login|sign in/i }).first();
    if (await loginLink.count() > 0) {
      await loginLink.click();
    }
  }

  // Loading state
  async expectLoading() {
    await expect(this.page.locator('[role="status"], [aria-busy="true"]').first()).toBeVisible({ timeout: 5000 });
  }

  // Error state
  async expectGeneralError(errorMessage?: string) {
    if (errorMessage) {
      await expect(this.page.getByText(new RegExp(errorMessage, 'i'))).toBeVisible({ timeout: 5000 });
    } else {
      await expect(this.page.getByText(/error|failed|try again/i).first()).toBeVisible({ timeout: 5000 });
    }
  }
}

