import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { NavbarComponent } from '../pages/navbar.component';

test.describe('Homepage', () => {
  let homePage: HomePage;
  let navbar: NavbarComponent;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    navbar = new NavbarComponent(page);
  });

  test('displays all sections correctly', async ({ page }) => {
    await homePage.goto();
    await homePage.expectLoaded();

    // Test hero section
    await homePage.expectHeroVisible();

    // Test features section
    await homePage.scrollToFeaturesSection();
    await homePage.expectFeaturesSectionVisible();

    // Verify navbar is visible
    await navbar.expectNavbarVisible();
    await navbar.expectLogoVisible();
  });

  test('Get Started button navigates to signup', async ({ page }) => {
    await homePage.goto();
    await homePage.clickGetStarted();
    await expect(page).toHaveURL(/.*\/signup/);
  });

  test('Learn More button navigates to about page', async ({ page }) => {
    await homePage.goto();
    await homePage.clickLearnMore();
    await expect(page).toHaveURL(/.*\/about/);
  });

  test('Start Your Style Journey button navigates to signup', async ({ page }) => {
    await homePage.goto();
    
    // Scroll to CTA section
    await homePage.scrollToCTASection();
    
    // Click the button
    await homePage.clickStartYourStyleJourney();
    await expect(page).toHaveURL(/.*\/signup/);
  });

  test('Explore Features button navigates to features page', async ({ page }) => {
    await homePage.goto();
    
    // Scroll to CTA section
    await homePage.scrollToCTASection();
    
    // Click the button
    await homePage.clickExploreFeatures();
    await expect(page).toHaveURL(/.*\/features/);
  });

  test('displays all feature cards', async ({ page }) => {
    await homePage.goto();
    await homePage.scrollToFeaturesSection();

    // Verify all feature cards are visible
    await homePage.expectFeatureCard(0); // Post Your Look
    await homePage.expectFeatureCard(1); // Discover Global Styles
    await homePage.expectFeatureCard(2); // Shop Instantly
    await homePage.expectFeatureCard(3); // Support Local Creators
  });

  test('hero section is visible on load', async ({ page }) => {
    await homePage.goto();
    await homePage.expectHeroVisible();

    // Verify hero content
    await expect(
      page.getByText(/stylelink is a community-driven/i)
    ).toBeVisible();
  });

  test('page loads without errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await homePage.goto();
    await homePage.expectLoaded();

    // Allow some time for any async errors
    await page.waitForTimeout(2000);

    // Filter out known/expected errors
    const criticalErrors = errors.filter(
      (error) => 
        !error.includes('favicon') && 
        !error.includes('sourcemap') &&
        !error.includes('prefers-reduced-motion') &&
        !error.includes('deprecation') &&
        !error.includes('deprecated') &&
        !error.includes('webpack') &&
        !error.includes('middleware') &&
        !error.includes('firebase') &&
        !error.includes('REACT_APP_FIREBASE') &&
        !error.includes('apiKey: missing') &&
        !error.includes('projectId: missing') &&
        !error.includes('authDomain: missing') &&
        !error.includes('missing') &&
        !error.includes('Current config') &&
        !error.includes('JSHandle') &&
        !error.toLowerCase().includes('warning') &&
        !error.includes('NO_COLOR') &&
        !error.includes('FORCE_COLOR') &&
        !error.includes('Firefox') &&
        !error.includes('moz-extension') &&
        !error.includes('moz-extension://') &&
        !error.includes('extension')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('smooth scrolling works for sections', async ({ page }) => {
    await homePage.goto();
    
    // Test scrolling to features section
    await homePage.scrollToFeaturesSection();
    await page.waitForTimeout(500);
    
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    // Test scrolling to how it works section
    await homePage.scrollToHowItWorksSection();
    await page.waitForTimeout(500);
    
    const scrollY2 = await page.evaluate(() => window.scrollY);
    expect(scrollY2).toBeGreaterThan(scrollY);
  });

  test('displays footer on homepage', async ({ page }) => {
    await homePage.goto();
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Footer should be visible - scope to footer role to avoid matching other elements
    const footer = page.getByRole('contentinfo');
    await expect(
      footer.getByText(/stylelink|copyright|rights reserved/i).first()
    ).toBeVisible();
  });

  test('all CTA buttons are functional', async ({ page }) => {
    await homePage.goto();

    // Test first CTA (Get Started)
    await homePage.clickGetStarted();
    await expect(page).toHaveURL(/.*\/signup/);
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/.*\/$/);

    // Test second CTA (Learn More)
    await homePage.clickLearnMore();
    await expect(page).toHaveURL(/.*\/about/);
  });
});
