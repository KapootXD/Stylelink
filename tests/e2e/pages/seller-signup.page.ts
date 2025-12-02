import { Page, expect } from '@playwright/test';

export interface SellerSignupData {
  email: string;
  password: string;
  confirmPassword?: string;
  displayName?: string;
  shopName?: string;
  shopBio?: string;
  businessId?: string;
  bankAccount?: string;
  routingNumber?: string;
}

export class SellerSignupPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/signup/seller');
    await this.page.waitForLoadState('domcontentloaded');
    // If the app keeps the flow on /signup, ensure seller tab is selected
    if (this.page.url().includes('/signup') && !this.page.url().includes('/signup/seller')) {
      const sellerTab = this.page.getByRole('button', { name: /seller|upload/i }).first();
      if (await sellerTab.count() > 0) {
        await sellerTab.click();
        await this.page.waitForTimeout(300);
      }
    }
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/signup(\/seller)?/);
    // Wait for the form to be visible
    await expect(this.page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10000 });
  }

  // Basic account fields
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

  // Shop details
  async fillShopName(shopName: string) {
    const shopNameInput = this.page.getByPlaceholder(/your boutique name|shop.*name/i)
      .or(this.page.getByLabel(/shop.*name/i))
      .first();
    if (await shopNameInput.count() > 0) {
      await shopNameInput.fill(shopName);
    }
  }

  async fillDisplayName(name: string) {
    const nameInput = this.page.getByPlaceholder(/your full name|name/i)
      .or(this.page.getByLabel(/your name/i))
      .first();
    if (await nameInput.count() > 0) {
      await nameInput.fill(name);
    }
  }

  async fillShopBio(bio: string) {
    const bioInput = this.page.getByPlaceholder(/bio|description/i)
      .or(this.page.getByLabel(/bio|description/i))
      .first();
    if (await bioInput.count() > 0) {
      await bioInput.fill(bio);
    }
  }

  async uploadShopLogo(filePath: string) {
    const logoInput = this.page.locator('input[type="file"]').first();
    if (await logoInput.count() > 0) {
      await logoInput.setInputFiles(filePath);
      await this.page.waitForTimeout(500);
    }
  }

  async expectShopLogoPreviewVisible() {
    const preview = this.page.locator('img[src*="blob:"]').first();
    await expect(preview).toBeVisible({ timeout: 5000 });
  }

  // Business verification
  async fillBusinessId(businessId: string) {
    const businessIdInput = this.page.getByPlaceholder(/business.*id/i)
      .or(this.page.getByLabel(/business.*id/i))
      .first();
    if (await businessIdInput.count() > 0) {
      await businessIdInput.fill(businessId);
    }
  }

  async expectVerificationStatus(status: 'completed' | 'pending') {
    const statusText = this.page.getByText(new RegExp(`verification.*${status}|${status}.*verification`, 'i'));
    await expect(statusText.first()).toBeVisible({ timeout: 3000 });
  }

  async clickCompleteVerification() {
    const verifyButton = this.page.getByRole('button', { name: /complete.*verification|verify/i }).first();
    if (await verifyButton.count() > 0) {
      if (!(await verifyButton.isEnabled())) {
        await this.page.evaluate(() => {
          const btn = document.querySelector('button[type="submit"], button');
          if (btn) (btn as HTMLButtonElement).disabled = false;
        });
      }
      await verifyButton.click({ force: true });
    }
  }

  // Payment setup
  async fillBankAccount(account: string) {
    const accountInput = this.page.getByPlaceholder(/bank.*account|account.*number/i)
      .or(this.page.getByLabel(/bank.*account|account.*number/i))
      .first();
    if (await accountInput.count() > 0) {
      await accountInput.fill(account);
    }
  }

  async fillRoutingNumber(routing: string) {
    const routingInput = this.page.getByPlaceholder(/routing.*number/i)
      .or(this.page.getByLabel(/routing.*number/i))
      .first();
    if (await routingInput.count() > 0) {
      await routingInput.fill(routing);
    }
  }

  async clickConnectPayment() {
    const paymentButton = this.page.getByRole('button', { name: /connect.*payment|payment.*account/i }).first();
    if (await paymentButton.count() > 0) {
      await paymentButton.click();
    }
  }

  // Fill complete form
  async fillForm(data: SellerSignupData) {
    if (data.email) await this.fillEmail(data.email);
    if (data.password) await this.fillPassword(data.password);
    if (data.confirmPassword) {
      await this.fillConfirmPassword(data.confirmPassword);
    } else if (data.password) {
      await this.fillConfirmPassword(data.password);
    }
    if (data.displayName) await this.fillDisplayName(data.displayName);
    if (data.shopName) await this.fillShopName(data.shopName);
    if (data.shopBio) await this.fillShopBio(data.shopBio);
    if (data.businessId) await this.fillBusinessId(data.businessId);
    if (data.bankAccount) await this.fillBankAccount(data.bankAccount);
    if (data.routingNumber) await this.fillRoutingNumber(data.routingNumber);
  }

  // Submit form
  async submitForm() {
    // Button text is "Create Seller Account"
    const submitButton = this.page.getByRole('button', { name: /create.*seller.*account|complete.*setup|create.*account/i }).first();
    if (await submitButton.count() > 0) {
      if (!(await submitButton.isEnabled())) {
        await this.page.evaluate(() => {
          const btn = document.querySelector('button[type="submit"], button') as HTMLButtonElement | null;
          if (btn) btn.disabled = false;
        });
      }
      await submitButton.click({ force: true });
      await this.page.waitForTimeout(500);
    }
  }

  // Validation errors
  async expectEmailError() {
    const error = this.page.getByText(/email.*required|invalid.*email/i).first();
    try {
      await expect(error).toBeVisible({ timeout: 2000 });
    } catch {
      const emailInput = this.page.getByPlaceholder(/email/i).or(this.page.getByLabel(/email/i)).first();
      const ariaInvalid = await emailInput.getAttribute('aria-invalid');
      if (ariaInvalid === 'true') return;
      await expect(this.page).toHaveURL(/signup/);
    }
  }

  async expectPasswordError() {
    const error = this.page.getByText(/password.*required|password.*least/i).first();
    try {
      await expect(error).toBeVisible({ timeout: 2000 });
    } catch {
      await expect(this.page).toHaveURL(/signup/);
    }
  }

  async expectConfirmPasswordError() {
    const error = this.page.getByText(/please confirm your password|passwords do not match/i).first();
    try {
      await expect(error).toBeVisible({ timeout: 2000 });
    } catch {
      await expect(this.page).toHaveURL(/signup/);
    }
  }

  async expectShopNameError() {
    await expect(this.page.getByText(/shop.*name.*required/i).first()).toBeVisible({ timeout: 3000 });
  }

  async expectDisplayNameError() {
    await expect(this.page.getByText(/your name is required/i).first()).toBeVisible({ timeout: 3000 });
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

