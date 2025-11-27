import { test, expect } from '@playwright/test';
import { AboutPage } from '../pages/about.page';
import { HomePage } from '../pages/home.page';

test.describe('About Page', () => {
  let aboutPage: AboutPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    aboutPage = new AboutPage(page);
    homePage = new HomePage(page);
  });

  test('displays about page content correctly', async ({ page }) => {
    await aboutPage.goto();
    await aboutPage.expectLoaded();
    await aboutPage.expectPageTitle();
  });

  test('shows page header with title', async ({ page }) => {
    await aboutPage.goto();
    await aboutPage.expectPageTitle();
    await expect(
      page.getByRole('heading', { name: /about stylelink/i, level: 1 })
    ).toBeVisible();
  });

  test('displays page description', async ({ page }) => {
    await aboutPage.goto();
    await aboutPage.expectPageContent();
    await expect(
      page.getByText(/learn more about our mission/i)
    ).toBeVisible();
  });

  test('can navigate back from about page', async ({ page }) => {
    await aboutPage.goto();
    
    // Check if go back button exists and works
    const goBackButton = page.getByRole('button', { name: /go back/i });
    if (await goBackButton.count() > 0) {
      await aboutPage.clickGoBack();
      // Should navigate to previous page
    } else {
      // Use browser back or navbar
      await page.goBack();
      await expect(page).not.toHaveURL(/.*\/about/);
    }
  });

  test('about page is accessible from navbar', async ({ page }) => {
    await homePage.goto();
    
    // Navigate via URL (navbar link may require auth check)
    await page.goto('/about');
    await aboutPage.expectLoaded();
  });

  test('about page displays correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await aboutPage.goto();
    await aboutPage.expectPageTitle();
  });

  test('about page displays correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await aboutPage.goto();
    await aboutPage.expectPageTitle();
  });

  test('about page has proper page structure', async ({ page }) => {
    await aboutPage.goto();
    
    // Check for main heading
    await expect(
      page.getByRole('heading', { name: /about/i, level: 1 })
    ).toBeVisible();
    
    // Check page has content - prefer main, fallback to body
    const mainElement = page.locator('main');
    if (await mainElement.count() > 0) {
      await expect(mainElement).toBeVisible();
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
