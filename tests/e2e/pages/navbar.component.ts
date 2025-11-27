import { expect, Page } from '@playwright/test';

export class NavbarComponent {
  constructor(private page: Page) {}

  async expectNavbarVisible() {
    await expect(this.page.getByRole('navigation')).toBeVisible();
  }

  async expectLogoVisible() {
    // Logo is in the navbar, use the link with exact text
    await expect(this.page.getByRole('link', { name: 'StyleLink', exact: true }).first()).toBeVisible();
  }

  async clickLogo() {
    // Logo is in the navbar, scope to navigation to avoid matching footer/other text
    const nav = this.page.getByRole('navigation');
    await nav.getByRole('link', { name: 'StyleLink', exact: true }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickHomeLink() {
    // On mobile, links are in the mobile menu. On desktop, they're in the navbar.
    // Check viewport size to determine approach
    const viewport = this.page.viewportSize();
    const isMobile = viewport && viewport.width < 768;
    
    if (isMobile) {
      // On mobile, open menu first, then click link
      await this.openMobileMenu();
      await this.page.waitForTimeout(300);
    }
    
    // Home link appears in both navbar and footer, use the one in navigation
    const nav = this.page.getByRole('navigation');
    await nav.getByRole('link', { name: /^home$/i }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickDiscoverLink() {
    // On mobile, links are in the mobile menu. On desktop, they're in the navbar.
    const viewport = this.page.viewportSize();
    const isMobile = viewport && viewport.width < 768;
    
    if (isMobile) {
      // On mobile, open menu first, then click link
      await this.openMobileMenu();
      await this.page.waitForTimeout(300);
    }
    
    // Discover link appears in both navbar and footer, use the one in navigation
    const nav = this.page.getByRole('navigation');
    await nav.getByRole('link', { name: /discover/i }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickLoginLink() {
    // On mobile, links are in the mobile menu. On desktop, they're in the navbar.
    const viewport = this.page.viewportSize();
    const isMobile = viewport && viewport.width < 768;
    
    if (isMobile) {
      // On mobile, open menu first, then click link
      await this.openMobileMenu();
      await this.page.waitForTimeout(300);
    }
    
    await this.page.getByRole('link', { name: /login/i }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickSignUpLink() {
    // On mobile, links are in the mobile menu. On desktop, they're in the navbar.
    const viewport = this.page.viewportSize();
    const isMobile = viewport && viewport.width < 768;
    
    if (isMobile) {
      // On mobile, open menu first, then click link
      await this.openMobileMenu();
      await this.page.waitForTimeout(300);
    }
    
    await this.page.getByRole('link', { name: /sign up/i }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoggedOutState() {
    // On mobile, login/signup links are in the mobile menu
    const viewport = this.page.viewportSize();
    const isMobile = viewport && viewport.width < 768;
    
    if (isMobile) {
      // Open mobile menu first
      await this.openMobileMenu();
      await this.page.waitForTimeout(300);
    }
    
    await expect(this.page.getByRole('link', { name: /login/i }).first()).toBeVisible();
    await expect(this.page.getByRole('link', { name: /sign up/i }).first()).toBeVisible();
  }

  async expectLoggedInState(userDisplayName?: string) {
    if (userDisplayName) {
      await expect(
        this.page.getByRole('link', { name: new RegExp(userDisplayName, 'i') })
      ).toBeVisible();
    }
    await expect(
      this.page.getByRole('button', { name: /logout/i })
    ).toBeVisible();
  }

  // Mobile menu methods
  async openMobileMenu() {
    // Mobile menu button has sr-only text "Open main menu"
    // Find button that contains the sr-only span with "Open main menu" text
    const menuButton = this.page
      .locator('button')
      .filter({ has: this.page.locator('.sr-only', { hasText: /open main menu/i }) })
      .or(this.page.locator('button[aria-label*="main menu" i]'))
      .first();
    
    // Check if button is visible (mobile menu button is only visible on mobile)
    const isVisible = await menuButton.isVisible().catch(() => false);
    if (!isVisible) {
      // Button might not be visible on this viewport, skip
      return;
    }
    
    await menuButton.click();
    await this.page.waitForTimeout(500); // Wait for menu animation
  }

  async closeMobileMenu() {
    const closeButton = this.page
      .locator('button')
      .filter({ has: this.page.locator('.sr-only', { hasText: /open main menu/i }) })
      .first();
    
    if (await closeButton.count() > 0) {
      await closeButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  async expectMobileMenuVisible() {
    // After opening mobile menu, navigation links should be visible in mobile view
    await expect(
      this.page.getByRole('link', { name: /home/i }).first()
    ).toBeVisible();
  }

  async clickMobileMenuLink(linkName: string) {
    await this.openMobileMenu();
    // Wait for mobile menu to be visible
    await this.page.waitForTimeout(300);
    // Find the link - in mobile menu, links should be visible
    const link = this.page.getByRole('link', { name: new RegExp(linkName, 'i') });
    // Use first() to handle multiple matches, but ensure it's visible
    await expect(link.first()).toBeVisible({ timeout: 5000 });
    await link.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Search functionality
  async clickSearchButton() {
    // Search button is in the desktop menu, may not have accessible text
    const searchButton = this.page
      .locator('.hidden.md\\:flex button')
      .first();
    
    if (await searchButton.count() > 0) {
      await searchButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  async expectSearchModalVisible() {
    await expect(
      this.page.getByRole('dialog').or(this.page.getByPlaceholder(/search/i))
    ).toBeVisible();
  }

  // Profile and user menu
  async clickProfileLink() {
    await this.page.getByRole('link', { name: /profile/i }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickLogoutButton() {
    await this.page.getByRole('button', { name: /logout/i }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Check active link highlighting
  async expectActiveLink(linkName: string) {
    // On mobile, links are in the mobile menu. On desktop, they're in the navbar.
    const viewport = this.page.viewportSize();
    const isMobile = viewport && viewport.width < 768;
    
    if (isMobile) {
      // On mobile, open menu first
      await this.openMobileMenu();
      await this.page.waitForTimeout(300);
    }
    
    // Scope to navigation to avoid footer matches
    const nav = this.page.getByRole('navigation');
    const link = nav.getByRole('link', { name: new RegExp(linkName, 'i') }).first();
    await expect(link).toHaveClass(/text-\[#B7410E\]/);
  }
}

export default NavbarComponent;
