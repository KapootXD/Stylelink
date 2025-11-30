import { Page, expect } from '@playwright/test';

export interface ProfileData {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export class ProfilePage {
  constructor(private page: Page) {}

  async goto(userId?: string) {
    const url = userId ? `/profile/${userId}` : '/profile';
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/profile/);
    // Wait for profile content to be visible
    await expect(this.page.locator('body')).toBeVisible({ timeout: 10000 });
  }

  // Profile information
  async expectDisplayName(name: string) {
    await expect(this.page.getByText(new RegExp(name, 'i'))).toBeVisible({ timeout: 5000 });
  }

  async expectBio(bio: string) {
    await expect(this.page.getByText(new RegExp(bio, 'i'))).toBeVisible({ timeout: 5000 });
  }

  async expectLocation(location: string) {
    await expect(this.page.getByText(new RegExp(location, 'i'))).toBeVisible({ timeout: 5000 });
  }

  // Edit profile
  async clickEditProfile() {
    const editButton = this.page.getByRole('button', { name: /edit.*profile|edit/i }).first();
    await editButton.click();
    // Wait for edit modal/form to appear
    await this.page.waitForTimeout(500);
  }

  async expectEditModalVisible() {
    const modal = this.page.locator('[role="dialog"], [data-testid="edit-modal"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
  }

  async fillDisplayName(name: string) {
    const nameInput = this.page.getByPlaceholder(/name|display name/i)
      .or(this.page.getByLabel(/name|display name/i))
      .first();
    await nameInput.fill(name);
  }

  async fillBio(bio: string) {
    const bioInput = this.page.getByPlaceholder(/bio|about/i)
      .or(this.page.getByLabel(/bio|about/i))
      .first();
    await bioInput.fill(bio);
  }

  async fillLocation(location: string) {
    const locationInput = this.page.getByPlaceholder(/location/i)
      .or(this.page.getByLabel(/location/i))
      .first();
    if (await locationInput.count() > 0) {
      await locationInput.fill(location);
    }
  }

  async uploadProfilePicture(filePath: string) {
    const fileInput = this.page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(filePath);
      await this.page.waitForTimeout(500);
    }
  }

  async saveProfile() {
    const saveButton = this.page.getByRole('button', { name: /save|update/i }).first();
    await saveButton.click();
    await this.page.waitForTimeout(1000);
  }

  async cancelEdit() {
    const cancelButton = this.page.getByRole('button', { name: /cancel/i }).first();
    await cancelButton.click();
  }

  // Outfits section
  async expectOutfitsSectionVisible() {
    await expect(this.page.getByText(/outfits|posts/i).first()).toBeVisible({ timeout: 5000 });
  }

  async expectOutfitCount(count: number) {
    const outfitCards = this.page.locator('[data-testid="outfit-card"], .outfit-card');
    const actualCount = await outfitCards.count();
    expect(actualCount).toBeGreaterThanOrEqual(count);
  }

  async clickOutfit(index: number = 0) {
    const outfits = this.page.locator('[data-testid="outfit-card"], .outfit-card');
    await outfits.nth(index).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Stats
  async expectStatsVisible() {
    // Look for followers, following, posts count
    await expect(
      this.page.getByText(/followers|following|posts|outfits/i).first()
    ).toBeVisible({ timeout: 5000 });
  }

  // Follow/Unfollow
  async clickFollow() {
    const followButton = this.page.getByRole('button', { name: /follow/i }).first();
    if (await followButton.count() > 0) {
      await followButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async clickUnfollow() {
    const unfollowButton = this.page.getByRole('button', { name: /unfollow/i }).first();
    if (await unfollowButton.count() > 0) {
      await unfollowButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async expectFollowingStatus(isFollowing: boolean) {
    if (isFollowing) {
      await expect(this.page.getByRole('button', { name: /unfollow/i }).first()).toBeVisible({ timeout: 3000 });
    } else {
      await expect(this.page.getByRole('button', { name: /follow/i }).first()).toBeVisible({ timeout: 3000 });
    }
  }

  // Settings link
  async clickSettings() {
    const settingsLink = this.page.getByRole('link', { name: /settings/i }).first();
    if (await settingsLink.count() > 0) {
      await settingsLink.click();
    }
  }

  // Error states
  async expectErrorVisible(errorMessage?: string) {
    if (errorMessage) {
      await expect(this.page.getByText(new RegExp(errorMessage, 'i'))).toBeVisible({ timeout: 5000 });
    } else {
      await expect(this.page.getByText(/error|failed|try again/i).first()).toBeVisible({ timeout: 5000 });
    }
  }

  // Loading states
  async expectLoading() {
    await expect(this.page.locator('[role="status"], [aria-busy="true"]').first()).toBeVisible({ timeout: 5000 });
  }
}

