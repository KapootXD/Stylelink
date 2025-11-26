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
    // Unauthenticated users should be redirected to login before accessing protected areas.
    await expect(page).toHaveURL(/login/i);
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});
