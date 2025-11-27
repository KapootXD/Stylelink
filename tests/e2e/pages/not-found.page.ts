import { expect, Page } from '@playwright/test';

export class NotFoundPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/this-page-does-not-exist');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoInvalidRoute(route: string) {
    await this.page.goto(route);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded() {
    // 404 page should show error message - use first() to handle multiple matches
    await expect(
      this.page.getByText(/404|not found|page not found/i).first()
    ).toBeVisible({ timeout: 10000 });
  }

  async expect404Message() {
    await expect(
      this.page.getByText(/404|not found/i).first()
    ).toBeVisible();
  }

  async expectErrorMessage() {
    await expect(
      this.page.getByText(/sorry|oops|doesn't exist|can't find/i)
    ).toBeVisible();
  }

  async clickGoHome() {
    const homeButton = this.page.getByRole('link', { name: /go home/i });
    await homeButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectBackToHomeLink() {
    await expect(
      this.page.getByRole('link', { name: /home|back to home/i })
    ).toBeVisible();
  }
}

export default NotFoundPage;
