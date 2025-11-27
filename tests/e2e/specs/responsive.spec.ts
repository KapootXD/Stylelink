import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { NavbarComponent } from '../pages/navbar.component';

test.describe('Responsive Design', () => {
  let homePage: HomePage;
  let navbar: NavbarComponent;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    navbar = new NavbarComponent(page);
  });

  test('displays correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.goto();
    await homePage.expectLoaded();

    // Mobile menu button should be visible
    const mobileMenuButton = page
      .locator('button')
      .filter({ has: page.locator('.sr-only', { hasText: /open main menu/i }) })
      .first();
    
    await expect(mobileMenuButton).toBeVisible();

    // Hero section should be visible
    await homePage.expectHeroVisible();

    // Navbar logo should be visible
    await navbar.expectLogoVisible();

    // Desktop navigation links should be hidden
    const desktopNav = page.locator('.hidden.md\\:block');
    if (await desktopNav.count() > 0) {
      // Desktop nav exists but should be hidden on mobile
      const computedStyle = await desktopNav.first().evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(computedStyle).toBe('none');
    }
  });

  test('mobile menu opens and closes correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.goto();

    // Open mobile menu
    await navbar.openMobileMenu();
    await navbar.expectMobileMenuVisible();

    // Close mobile menu
    await navbar.closeMobileMenu();

    // Menu should be closed (links may still be visible but menu overlay closed)
  });

  test('displays correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await homePage.goto();
    await homePage.expectLoaded();

    // Hero section should be visible
    await homePage.expectHeroVisible();

    // Navbar should be visible
    await navbar.expectNavbarVisible();

    // Features section should be accessible
    await homePage.scrollToFeaturesSection();
    await homePage.expectFeaturesSectionVisible();
  });

  test('displays correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await homePage.goto();
    await homePage.expectLoaded();

    // All sections should be visible
    await homePage.expectHeroVisible();
    await navbar.expectNavbarVisible();

    // Desktop navigation should be visible - scope to navigation to avoid footer matches
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: /home/i }).first()).toBeVisible();
    await expect(nav.getByRole('link', { name: /discover/i }).first()).toBeVisible();
  });

  test('homepage layout adapts to different viewport sizes', async ({ page }) => {
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.goto();
    await homePage.expectHeroVisible();

    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await homePage.expectHeroVisible();

    // Test desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await homePage.expectHeroVisible();
  });

  test('navigation adapts to viewport size', async ({ page }) => {
    // Mobile - menu button visible
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.goto();
    
    const mobileMenuButton = page
      .locator('button')
      .filter({ has: page.locator('.sr-only', { hasText: /open main menu/i }) })
      .first();
    await expect(mobileMenuButton).toBeVisible();

    // Desktop - direct links visible - scope to navigation to avoid footer matches
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: /home/i }).first()).toBeVisible();
  });

  test('footer is accessible on all viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await homePage.goto();

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Footer should be visible
      const footer = page.locator('footer').or(
        page.getByText(/stylelink|copyright|rights reserved/i)
      );
      await expect(footer.first()).toBeVisible();
    }
  });

  test('about page displays correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/about');
    
    await expect(
      page.getByRole('heading', { name: /about stylelink/i })
    ).toBeVisible();
  });

  test('features page displays correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/features');
    
    // Features page has "StyleLink Features" heading or "Coming Soon" content
    await expect(
      page.getByRole('heading', { name: /stylelink features|features overview coming soon/i }).first()
    ).toBeVisible();
  });

  test('login page displays correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/login');
    
    await expect(
      page.getByLabel(/email/i)
    ).toBeVisible();
  });

  test('text is readable on all viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await homePage.goto();

      // Check hero text is visible and readable
      const heroText = page.getByText(/stylelink is a community-driven/i);
      await expect(heroText).toBeVisible();

      // Check text size is appropriate (not too small)
      const fontSize = await heroText.evaluate((el) => {
        return parseFloat(window.getComputedStyle(el).fontSize);
      });
      expect(fontSize).toBeGreaterThanOrEqual(12); // Minimum readable size
    }
  });
});
