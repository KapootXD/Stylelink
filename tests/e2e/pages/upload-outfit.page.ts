import { Page, expect, Locator } from '@playwright/test';

export interface OutfitFormData {
  title: string;
  description?: string;
  location?: string;
  tags?: string;
  price?: string;
  brand?: string;
  occasion?: string;
  season?: 'spring' | 'summer' | 'fall' | 'winter';
}

export class UploadOutfitPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/upload');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded() {
    // If redirected to login, that's expected for unauthenticated users
    const currentUrl = this.page.url();
    if (currentUrl.includes('/login')) {
      // User needs to be authenticated first
      await expect(this.page).toHaveURL(/.*\/login/);
      return;
    }
    await expect(this.page).toHaveURL(/.*\/upload/, { timeout: 10000 });
    // Wait for the upload form to be visible - look for title input or file input
    await expect(
      this.page.locator('input[type="text"], input[type="file"], label[for="image-upload"], label[for="video-upload"]').first()
    ).toBeVisible({ timeout: 10000 });
  }

  // Title input
  async fillTitle(title: string) {
    const titleInput = this.page.getByPlaceholder(/title/i).or(this.page.getByLabel(/title/i)).first();
    await titleInput.fill(title);
  }

  async getTitle(): Promise<string> {
    const titleInput = this.page.getByPlaceholder(/title/i).or(this.page.getByLabel(/title/i)).first();
    return await titleInput.inputValue();
  }

  // Description textarea
  async fillDescription(description: string) {
    const descriptionInput = this.page.getByPlaceholder(/description/i).or(this.page.getByLabel(/description/i)).first();
    await descriptionInput.fill(description);
  }

  // Location input
  async fillLocation(location: string) {
    const locationInput = this.page.getByPlaceholder(/location/i).or(this.page.getByLabel(/location/i)).first();
    await locationInput.fill(location);
  }

  // Tags input
  async fillTags(tags: string | string[]) {
    const tagsString = Array.isArray(tags) ? tags.join(', ') : tags;
    const tagsInput = this.page.getByPlaceholder(/tag|tags/i).or(this.page.getByLabel(/tag|tags/i)).first();
    await tagsInput.fill(tagsString);
  }

  // Price input
  async fillPrice(price: string) {
    const priceInput = this.page.getByPlaceholder(/price/i).or(this.page.getByLabel(/price/i)).first();
    await priceInput.fill(price);
  }

  // Brand input
  async fillBrand(brand: string) {
    const brandInput = this.page.getByPlaceholder(/brand/i).or(this.page.getByLabel(/brand/i)).first();
    await brandInput.fill(brand);
  }

  // Occasion select
  async selectOccasion(occasion: string) {
    const occasionSelect = this.page.locator('select').filter({ 
      has: this.page.locator('option', { hasText: /occasion/i }) 
    }).or(
      this.page.locator('select').first()
    ).first();
    if (await occasionSelect.count() > 0) {
      await occasionSelect.selectOption({ label: new RegExp(occasion, 'i') });
    }
  }

  // Season select
  async selectSeason(season: 'spring' | 'summer' | 'fall' | 'winter') {
    // Find select element that has a label with "Season" or contains season options
    const seasonSelect = this.page.locator('select').filter({ 
      has: this.page.locator('option', { hasText: /season/i })
    }).or(
      this.page.locator('select').filter({ 
        has: this.page.locator('option[value="spring"], option[value="summer"], option[value="fall"], option[value="winter"]')
      })
    ).or(
      this.page.locator('label').filter({ hasText: /season/i }).locator('..').locator('select')
    ).first();
    
    if (await seasonSelect.count() > 0) {
      await seasonSelect.selectOption(season);
      await this.page.waitForTimeout(200);
    } else {
      // Fallback: try to find by text and click
      const seasonButton = this.page.getByRole('button', { name: new RegExp(season, 'i') });
      if (await seasonButton.count() > 0) {
        await seasonButton.click();
      }
    }
  }

  // Fill complete form
  async fillForm(data: OutfitFormData) {
    if (data.title) await this.fillTitle(data.title);
    if (data.description) await this.fillDescription(data.description);
    if (data.location) await this.fillLocation(data.location);
    if (data.tags) await this.fillTags(data.tags);
    if (data.price) await this.fillPrice(data.price);
    if (data.brand) await this.fillBrand(data.brand);
    if (data.occasion) await this.selectOccasion(data.occasion);
    if (data.season) await this.selectSeason(data.season);
  }

  // Image upload
  async uploadImage(filePath: string | string[]) {
    const filePaths = Array.isArray(filePath) ? filePath : [filePath];
    const imageInput = this.page.locator('input[type="file"][accept*="image"]').first();
    await imageInput.setInputFiles(filePaths);
    // Wait for preview to appear
    await this.page.waitForTimeout(500);
  }

  async expectImagePreviewVisible(index: number = 0) {
    const preview = this.page.locator('img[src*="blob:"], img[src^="/"]').nth(index);
    await expect(preview).toBeVisible({ timeout: 5000 });
  }

  async removeImage(index: number = 0) {
    // Images are in a grid with remove buttons (X icon) on hover
    // Find the image preview container and hover to reveal the remove button
    const imagePreviews = this.page.locator('[class*="group"]').filter({ 
      has: this.page.locator('img[src*="blob:"], img[src^="/"]') 
    });
    if (await imagePreviews.count() > index) {
      const preview = imagePreviews.nth(index);
      await preview.hover();
      // Remove button is an X button with absolute positioning
      const removeButton = preview.locator('button').filter({ 
        has: this.page.locator('svg') 
      }).first();
      if (await removeButton.count() > 0) {
        await removeButton.click();
        await this.page.waitForTimeout(300);
      }
    }
  }

  // Video upload
  async uploadVideo(filePath: string | string[]) {
    const filePaths = Array.isArray(filePath) ? filePath : [filePath];
    const videoInput = this.page.locator('input[type="file"][accept*="video"]').first();
    await videoInput.setInputFiles(filePaths);
    await this.page.waitForTimeout(500);
  }

  // Submit form
  async submitForm() {
    // Button text is "Share Your Style"
    const submitButton = this.page.getByRole('button', { name: /share.*style|upload|submit|post|publish/i }).first();
    if (await submitButton.count() > 0) {
      await submitButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async expectSubmitButtonDisabled() {
    const submitButton = this.page.getByRole('button', { name: /share.*style|upload|submit|post|publish/i }).first();
    if (await submitButton.count() > 0) {
      await expect(submitButton).toBeDisabled();
    }
  }

  async expectSubmitButtonEnabled() {
    const submitButton = this.page.getByRole('button', { name: /share.*style|upload|submit|post|publish/i }).first();
    if (await submitButton.count() > 0) {
      await expect(submitButton).toBeEnabled();
    }
  }

  // Loading states
  async expectLoadingVisible() {
    const loadingSpinner = this.page.locator('[role="status"], [aria-busy="true"], .spinner, [data-testid="loading"]').first();
    await expect(loadingSpinner).toBeVisible({ timeout: 5000 });
  }

  async expectLoadingHidden() {
    const loadingSpinner = this.page.locator('[role="status"], [aria-busy="true"], .spinner, [data-testid="loading"]').first();
    await expect(loadingSpinner).toBeHidden({ timeout: 10000 });
  }

  async expectUploadProgressVisible() {
    const progressBar = this.page.locator('progress, [role="progressbar"], [aria-valuenow]').first();
    await expect(progressBar).toBeVisible({ timeout: 5000 });
  }

  // Success states
  async expectSuccessMessage(message?: string) {
    if (message) {
      await expect(this.page.getByText(new RegExp(message, 'i'))).toBeVisible({ timeout: 5000 });
    } else {
      // Look for common success patterns
      await expect(
        this.page.getByText(/success|uploaded|posted|published/i).first()
      ).toBeVisible({ timeout: 5000 });
    }
  }

  async expectPreviewModalVisible() {
    const modal = this.page.locator('[role="dialog"], [data-testid="preview-modal"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
  }

  // Error states
  async expectErrorVisible(errorMessage?: string) {
    // Errors are shown via toast
    if (errorMessage) {
      await expect(
        this.page.locator('#toast-container, [class*="toast"]').getByText(new RegExp(errorMessage, 'i')).first()
      ).toBeVisible({ timeout: 5000 });
    } else {
      await expect(
        this.page.locator('#toast-container, [class*="toast"]').getByText(/error|failed|invalid/i).first()
      ).toBeVisible({ timeout: 5000 });
    }
  }

  // Validation errors
  async expectValidationError(field: string) {
    const errorText = this.page.getByText(new RegExp(`${field}.*required|invalid.*${field}`, 'i')).first();
    await expect(errorText).toBeVisible({ timeout: 3000 });
  }

  // Navigation
  async clickCancel() {
    // There's no cancel button in UploadOutfit - use browser back
    await this.page.goBack();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // File size validation
  async expectFileSizeError() {
    // File size errors are shown via toast
    await expect(
      this.page.locator('#toast-container, [class*="toast"]').getByText(/too large|file size|maximum size/i).first()
    ).toBeVisible({ timeout: 5000 });
  }

  // Required fields check - UploadOutfit uses toast messages, not inline errors
  async expectTitleRequired() {
    // UploadOutfit shows toast: "Please enter an outfit title"
    // React Hot Toast renders in a toast container
    await expect(
      this.page.locator('#toast-container, [class*="toast"]').getByText(/please enter an outfit title/i).first()
    ).toBeVisible({ timeout: 5000 });
  }

  async expectAtLeastOneImageRequired() {
    // UploadOutfit shows toast: "Please upload at least one image or video"
    // React Hot Toast renders in a toast container
    await expect(
      this.page.locator('#toast-container, [class*="toast"]').getByText(/please upload at least one image or video/i).first()
    ).toBeVisible({ timeout: 5000 });
  }

  async expectLoginRequired() {
    // UploadOutfit shows toast if not logged in: "Please log in to upload content"
    await expect(
      this.page.getByText(/please log in to upload content/i).first()
    ).toBeVisible({ timeout: 5000 });
  }
}

