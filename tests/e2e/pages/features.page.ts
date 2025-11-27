import { expect, Page } from '@playwright/test';

export class FeaturesPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/features');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/features/);
    await expect(
      this.page.getByRole('heading', { name: /features/i, level: 1 })
    ).toBeVisible({ timeout: 10000 });
  }

  async expectPageTitle() {
    await expect(
      this.page.getByRole('heading', { name: /features/i, level: 1 })
    ).toBeVisible();
  }

  async expectComingSoonMessage() {
    await expect(
      this.page.getByText(/coming soon/i)
    ).toBeVisible();
  }

  async clickGoBack() {
    const goBackButton = this.page.getByRole('button', { name: /go back/i });
    if (await goBackButton.count() > 0) {
      await goBackButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async clickExploreHomepage() {
    const exploreButton = this.page.getByRole('button', { name: /explore homepage/i });
    if (await exploreButton.count() > 0) {
      await exploreButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }
}

export default FeaturesPage;
