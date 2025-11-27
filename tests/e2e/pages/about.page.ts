import { expect, Page } from '@playwright/test';

export class AboutPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/about');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/about/);
    await expect(
      this.page.getByRole('heading', { name: /about stylelink/i, level: 1 })
    ).toBeVisible({ timeout: 10000 });
  }

  async expectPageTitle() {
    await expect(
      this.page.getByRole('heading', { name: /about stylelink/i, level: 1 })
    ).toBeVisible();
  }

  async expectPageContent() {
    await expect(
      this.page.getByText(/learn more about our mission/i)
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
}

export default AboutPage;
