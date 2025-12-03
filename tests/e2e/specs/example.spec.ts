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
    await home.expectLoaded();
    
    // Find and click the Explore Features button or link
    const exploreCTA = page
      .getByRole('button', { name: /explore features/i })
      .or(page.getByRole('link', { name: /explore features/i }))
      .first();
    await expect(exploreCTA).toBeVisible({ timeout: 10000 });

    // Scroll CTA into view if needed
    await exploreCTA.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click the CTA and wait for navigation
    await exploreCTA.click();
    
    // Wait for navigation to features page (public route)
    await page.waitForURL(/.*\/features/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/features/);
    
    // Verify features page loaded (shows headline and coming soon message)
    await expect(page.getByRole('heading', { name: /stylelink features/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/features overview coming soon|coming soon/i).first()).toBeVisible({ timeout: 10000 });
  });
});
