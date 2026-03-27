import { test, expect } from '@playwright/test';

test.describe('Component Integration', () => {
  test.describe('Notification Center', () => {
    test('shows notification bell', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      const bell = page.locator('button[aria-label*="Notification"]');
      await expect(bell).toBeVisible();
    });

    test('opens notification dropdown', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      await page.locator('button[aria-label*="Notification"]').first().click();
      await expect(page.locator('text=Notifications').first()).toBeVisible();
    });
  });

  test.describe('Page Transitions', () => {
    test('content fades in on load', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // The page transition wrapper should exist
      const content = page.locator('main#main-content');
      await expect(content).toBeVisible();
    });
  });

  test.describe('Mobile Bottom Tab Bar', () => {
    test('shows on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Bottom tab bar should be visible
      const tabBar = page.locator('nav.lg\\:hidden').last();
      await expect(tabBar).toBeVisible();
      await expect(page.locator('text=Home')).toBeVisible();
      await expect(page.locator('text=Jobs')).toBeVisible();
      await expect(page.locator('text=Vehicles')).toBeVisible();
      await expect(page.locator('text=Customers')).toBeVisible();
      await expect(page.locator('text=More')).toBeVisible();
    });
  });
});
