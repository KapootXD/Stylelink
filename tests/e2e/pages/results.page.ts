import { Page, expect } from '@playwright/test';

export interface SortOption {
  label: string;
  value: 'newest' | 'oldest' | 'most_liked' | 'most_shared' | 'price_low_high' | 'price_high_low';
}

export class ResultsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/results');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/results/);
    // Wait for results container or header to be visible
    await expect(
      this.page.getByRole('heading', { name: /style results|results/i }).or(
        this.page.locator('[data-testid="results-container"]')
      ).first()
    ).toBeVisible({ timeout: 10000 });
  }

  // Results verification
  async expectResultsVisible() {
    const resultsContainer = this.page.locator('[data-testid="results-container"]')
      .or(this.page.locator('.grid, .space-y-4').first());
    await expect(resultsContainer).toBeVisible({ timeout: 10000 });
  }

  async expectResultCount(expectedCount: number) {
    const resultCards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const count = await resultCards.count();
    expect(count).toBeGreaterThanOrEqual(expectedCount);
  }

  async expectResultsCountExact(expectedCount: number) {
    const resultCards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const count = await resultCards.count();
    expect(count).toBe(expectedCount);
  }

  async expectNoResults() {
    await expect(
      this.page.getByText(/no.*outfits.*found|no results|nothing found/i).first()
    ).toBeVisible({ timeout: 5000 });
  }

  async expectResultsHeaderText(text: string) {
    await expect(this.page.getByText(new RegExp(text, 'i'))).toBeVisible({ timeout: 5000 });
  }

  // Result cards interaction
  async clickResultCard(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    await cards.nth(index).click();
    await this.page.waitForTimeout(500);
  }

  async expectResultCardVisible(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    await expect(cards.nth(index)).toBeVisible({ timeout: 5000 });
  }

  async expectResultTitle(title: string, index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    await expect(card.getByText(new RegExp(title, 'i'))).toBeVisible({ timeout: 3000 });
  }

  async expectResultDescription(description: string, index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    await expect(card.getByText(new RegExp(description, 'i'))).toBeVisible({ timeout: 3000 });
  }

  // Detailed view modal
  async expectDetailedViewVisible() {
    const modal = this.page.locator('[role="dialog"], [class*="fixed"][class*="inset-0"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
  }

  async closeDetailedView() {
    const closeButton = this.page.getByRole('button', { name: /close/i }).or(
      this.page.locator('button').filter({ has: this.page.locator('svg') }).last()
    ).first();
    if (await closeButton.count() > 0) {
      await closeButton.click();
    } else {
      // Click outside modal
      await this.page.click('body', { position: { x: 10, y: 10 } });
    }
  }

  // Sorting
  async openSortDropdown() {
    const sortButton = this.page.getByRole('button', { name: /sort/i }).or(
      this.page.locator('button').filter({ hasText: /sort/i })
    ).first();
    await sortButton.click();
    await this.page.waitForTimeout(300);
  }

  async selectSortOption(option: SortOption['value'] | string) {
    await this.openSortDropdown();
    
    const optionLabels: Record<string, string> = {
      'newest': /newest first/i,
      'oldest': /oldest first/i,
      'most_liked': /most liked/i,
      'most_shared': /most shared/i,
      'price_low_high': /price.*low.*high/i,
      'price_high_low': /price.*high.*low/i,
    };

    const labelPattern = typeof option === 'string' && optionLabels[option] 
      ? optionLabels[option] 
      : new RegExp(option, 'i');

    const optionButton = this.page.getByRole('button', { name: labelPattern }).or(
      this.page.locator('button, [role="menuitem"]').filter({ hasText: labelPattern })
    ).first();
    
    await optionButton.click();
    await this.page.waitForTimeout(500); // Wait for sort to apply
  }

  async expectSortOptionSelected(option: SortOption['value'] | string) {
    await this.openSortDropdown();
    const optionLabels: Record<string, string> = {
      'newest': /newest first/i,
      'oldest': /oldest first/i,
      'most_liked': /most liked/i,
      'most_shared': /most shared/i,
      'price_low_high': /price.*low.*high/i,
      'price_high_low': /price.*high.*low/i,
    };

    const labelPattern = typeof option === 'string' && optionLabels[option] 
      ? optionLabels[option] 
      : new RegExp(option, 'i');

    const selectedOption = this.page.locator('[class*="bg-blue"], [class*="text-blue"]').filter({
      hasText: labelPattern
    }).first();
    await expect(selectedOption).toBeVisible({ timeout: 3000 });
    // Close dropdown
    await this.page.keyboard.press('Escape');
  }

  // View mode toggle
  async switchToGridView() {
    const gridButton = this.page.getByRole('button', { name: /grid/i }).or(
      this.page.locator('button').filter({ has: this.page.locator('svg') }).first()
    );
    if (await gridButton.count() > 0) {
      await gridButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  async switchToListView() {
    const listButton = this.page.getByRole('button', { name: /list/i }).or(
      this.page.locator('button').filter({ has: this.page.locator('svg') }).last()
    );
    if (await listButton.count() > 0) {
      await listButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  async expectGridView() {
    const gridContainer = this.page.locator('[class*="grid"][class*="grid-cols"]').first();
    await expect(gridContainer).toBeVisible({ timeout: 3000 });
  }

  async expectListView() {
    const listContainer = this.page.locator('[class*="space-y"], [class*="flex"][class*="flex-col"]').first();
    await expect(listContainer).toBeVisible({ timeout: 3000 });
  }

  // Interactions (like, share, save, comment)
  async likeResult(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    const likeButton = card.locator('button').filter({ has: this.page.locator('svg') }).first();
    await likeButton.click();
    await this.page.waitForTimeout(300);
  }

  async shareResult(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    const shareButton = card.getByRole('button', { name: /share/i }).or(
      card.locator('button').filter({ has: this.page.locator('svg') }).nth(1)
    ).first();
    if (await shareButton.count() > 0) {
      await shareButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  async saveResult(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    const saveButton = card.getByRole('button', { name: /save|bookmark/i }).or(
      card.locator('button').filter({ has: this.page.locator('svg') }).last()
    ).first();
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  async commentResult(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    const commentButton = card.getByRole('button', { name: /comment/i }).first();
    if (await commentButton.count() > 0) {
      await commentButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  // Verify interaction states
  async expectResultLiked(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    const likeButton = card.locator('button').filter({ has: this.page.locator('svg') }).first();
    await expect(likeButton.locator('[class*="bg-red"], [class*="text-red"]').first()).toBeVisible({ timeout: 3000 });
  }

  async expectResultSaved(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    const saveButton = card.getByRole('button', { name: /save|bookmark/i }).first();
    await expect(saveButton.locator('[class*="bg-yellow"], [class*="text-yellow"]').first()).toBeVisible({ timeout: 3000 });
  }

  // Navigation
  async clickBack() {
    const backButton = this.page.getByRole('button', { name: /back/i }).first();
    if (await backButton.count() > 0) {
      await backButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async clickTryAgain() {
    const tryAgainButton = this.page.getByRole('button', { name: /try.*another.*search|try again/i }).first();
    if (await tryAgainButton.count() > 0) {
      await tryAgainButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  // Loading and error states
  async expectLoading() {
    const loadingSpinner = this.page.locator('[role="status"], [aria-busy="true"], [class*="spinner"], [class*="animate-spin"]').first();
    await expect(loadingSpinner).toBeVisible({ timeout: 5000 });
  }

  async expectLoadingHidden() {
    const loadingSpinner = this.page.locator('[role="status"], [aria-busy="true"], [class*="spinner"], [class*="animate-spin"]').first();
    await expect(loadingSpinner).toBeHidden({ timeout: 10000 });
  }

  async expectError(errorMessage?: string) {
    if (errorMessage) {
      await expect(this.page.getByText(new RegExp(errorMessage, 'i'))).toBeVisible({ timeout: 5000 });
    } else {
      await expect(this.page.getByText(/error|failed|try again/i).first()).toBeVisible({ timeout: 5000 });
    }
  }

  // Result content verification
  async expectResultHasImage(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    const image = card.locator('img').first();
    await expect(image).toBeVisible({ timeout: 3000 });
  }

  async expectResultHasStyleTags(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    const tags = card.locator('[class*="bg-yellow"], [class*="rounded-full"]').first();
    await expect(tags).toBeVisible({ timeout: 3000 });
  }

  async expectResultHasLikes(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    const likesText = card.getByText(/\d+.*likes?/i).first();
    await expect(likesText).toBeVisible({ timeout: 3000 });
  }

  async expectResultHasShares(index: number = 0) {
    const cards = this.page.locator('[data-testid="outfit-card"], .outfit-card, [class*="rounded-lg"]').filter({
      has: this.page.locator('img')
    });
    const card = cards.nth(index);
    const sharesText = card.getByText(/\d+.*shares?/i).first();
    await expect(sharesText).toBeVisible({ timeout: 3000 });
  }
}

