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
    
    // Find and click the Explore Features button
    // It might be in the hero section or CTA section
    const exploreFeaturesButton = page.getByRole('button', { name: /explore features/i }).first();
    await expect(exploreFeaturesButton).toBeVisible({ timeout: 10000 });
    
    // Scroll button into view if needed
    await exploreFeaturesButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Click the button and wait for navigation
    await exploreFeaturesButton.click();
    
    // Wait for navigation to features page (public route)
    await page.waitForURL(/.*\/features/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/features/);
    
    // Verify features page loaded (shows "Features Overview Coming Soon" or similar)
    await expect(
      page.getByText(/features overview coming soon|coming soon/i).first()
    ).toBeVisible({ timeout: 5000 });
  });
});
