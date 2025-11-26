import { expect, Page } from '@playwright/test';

export class FeaturePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/features');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded() {
    await expect(this.page.locator('body')).toBeVisible();
    const heading = this.page.getByRole('heading', { name: /feature|explore|style|discover/i }).first();
    if (await heading.count()) {
      await expect(heading).toBeVisible();
    }
  }
}

export default FeaturePage;
