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
}

export default SignupPage;
