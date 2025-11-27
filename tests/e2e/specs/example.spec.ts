import { test, expect } from '@playwright/test';
import HomePage from '../pages/home.page';

test.describe('Stylelink smoke navigation', () => {
  test('homepage loads', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.expectLoaded();
  });

  test('navigation to feature page works', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.navigateToFeature();
    // Features page should be accessible (or redirect to login if protected)
    // Check if we're on features page or login page
    const url = page.url();
    if (url.includes('/features')) {
      // Features page is accessible
      await expect(page).toHaveURL(/.*\/features/);
    } else {
      // Redirected to login
      await expect(page).toHaveURL(/.*\/login/);
      await expect(page.getByLabel(/email/i)).toBeVisible();
    }
  });
});
