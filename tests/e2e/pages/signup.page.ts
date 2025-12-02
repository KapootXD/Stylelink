import { expect, Page } from '@playwright/test';

export class SignupPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/signup');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/signup/);
  }

  async clickCustomerSignup() {
    // The customer button is in the signup form, not a link
    // Button has accessible name "Customer Explore & shop"
    await this.page.getByRole('button', { name: /customer.*explore.*shop/i }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickSellerSignup() {
    // The seller button is in the signup form, not a link
    // Button has accessible name "Seller Upload & promote"
    await this.page.getByRole('button', { name: /seller.*upload.*promote/i }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectUserTypeSelection() {
    // Check for the label "I want to..." which indicates user type selection
    await expect(
      this.page.getByText(/i want to/i)
    ).toBeVisible();
  }

  async expectCustomerOption() {
    // Look for the customer button specifically, not generic text that might match navbar
    await expect(
      this.page.getByRole('button', { name: /customer.*explore.*shop/i })
    ).toBeVisible();
  }

  async expectSellerOption() {
    // Look for the seller button specifically, not generic text that might match navbar
    await expect(
      this.page.getByRole('button', { name: /seller.*upload.*promote/i })
    ).toBeVisible();
  }

  async expectCustomerOptionVisible() {
    await this.expectCustomerOption();
  }

  async expectSellerOptionVisible() {
    await this.expectSellerOption();
  }

  async clickLoginLink() {
    const loginLink = this.page.getByRole('link', { name: /login|sign in/i }).first();
    if (await loginLink.count() > 0) {
      await loginLink.click();
    }
  }

  // Additional methods for comprehensive testing
  async signup(email: string, password: string, confirmPassword: string, userType: 'customer' | 'seller' = 'customer') {
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/^password/i).fill(password);
    await this.page.getByLabel(/confirm password/i).fill(confirmPassword);
    
    // Select user type
    if (userType === 'customer') {
      await this.clickCustomerSignup();
    } else {
      await this.clickSellerSignup();
    }
    
    // Submit form
    await this.page.getByRole('button', { name: /sign up|register|create account/i }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectValidationError(field: string) {
    await expect(
      this.page.getByText(new RegExp(`${field}.*required|invalid|please`, 'i'))
    ).toBeVisible({ timeout: 5000 });
  }

  async expectSuccess() {
    // After successful signup, should redirect away from signup page
    await expect(this.page).not.toHaveURL(/.*\/signup/, { timeout: 10000 });
  }
}

export default SignupPage;
