import { expect, Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded() {
    await expect(this.page.locator('body')).toBeVisible();
    await expect(this.page).toHaveURL(/localhost:3000/);
    const heading = this.page.getByRole('heading').first();
    if (await heading.count()) {
      await expect(heading).toBeVisible();
    }
  }

  async navigateToFeature() {
    const featureLink = this.page
      .getByRole('link', { name: /feature|explore|discover|get started/i })
      .first();

    if (await featureLink.count()) {
      await featureLink.click();
    } else {
      await this.page.goto('/features');
    }

    await this.page.waitForLoadState('domcontentloaded');
  }
}

export default HomePage;
