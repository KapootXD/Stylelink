import { expect, Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    // Ensure hero content is ready before continuing
    await expect(
      this.page.getByRole('heading', { name: /if you're looking for style/i, level: 1 })
    ).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async expectLoaded() {
    await expect(this.page.locator('body')).toBeVisible();
    await expect(this.page).toHaveURL(/.*\//);
    // Wait for hero heading to be visible
    await expect(
      this.page.getByRole('heading', { name: /if you're looking for style/i, level: 1 })
    ).toBeVisible({ timeout: 10000 });
  }

  async expectHeroVisible() {
    await expect(
      this.page.getByRole('heading', { name: /if you're looking for style/i, level: 1 })
    ).toBeVisible();
    await expect(
      this.page.getByText(/stylelink is a community-driven/i)
    ).toBeVisible();
  }

  async expectFeaturesSectionVisible() {
    await expect(
      this.page.getByRole('heading', { name: /why choose stylelink/i })
    ).toBeVisible();
    // Check for feature cards
    await expect(
      this.page.getByText(/post your look/i)
    ).toBeVisible();
  }

  async clickGetStarted() {
    const button = this.page.getByRole('button', { name: /get started/i }).first();
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickLearnMore() {
    const button = this.page.getByRole('button', { name: /learn more/i }).first();
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickStartYourStyleJourney() {
    const button = this.page.getByRole('button', { name: /start your style journey/i }).first();
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickExploreFeatures() {
    const exploreCTA = this.page
      .getByRole('button', { name: /explore features/i })
      .or(this.page.getByRole('link', { name: /explore features/i }))
      .first();

    await expect(exploreCTA).toBeVisible({ timeout: 10_000 });
    await exploreCTA.scrollIntoViewIfNeeded();
    await exploreCTA.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectFeatureCard(index: number) {
    const featureTitles = [
      /post your look/i,
      /discover global styles/i,
      /shop instantly/i,
      /support local creators/i,
    ];
    if (featureTitles[index]) {
      await expect(
        this.page.getByText(featureTitles[index])
      ).toBeVisible();
    }
  }

  async scrollToFeaturesSection() {
    // Use Playwright locator to find the heading and scroll to it
    const heading = this.page.getByRole('heading', { name: /why choose stylelink/i });
    await heading.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500); // Wait for scroll animation
  }

  async scrollToHowItWorksSection() {
    // Use Playwright locator to find the text and scroll to it
    const text = this.page.getByText(/how it works/i).first();
    await text.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  async scrollToCTASection() {
    // Use Playwright locator to find the CTA section by heading or button
    // The CTA section has "Join the community" heading or "Start Your Style Journey" button
    const ctaSection = this.page.getByRole('heading', { name: /join the community/i })
      .or(this.page.getByRole('button', { name: /start your style journey/i }))
      .first();
    await ctaSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  async navigateToFeature() {
    // Navigate to features page by clicking the Explore Features button
    await this.clickExploreFeatures();
  }
}

export default HomePage;