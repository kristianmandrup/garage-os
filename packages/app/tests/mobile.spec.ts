import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('login page is mobile friendly', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    // Logo should be visible
    await expect(page.locator('[data-testid="login-brand"]')).toBeVisible();
    // Google button should be visible
    await expect(page.locator('[data-testid="login-google-btn"]')).toBeVisible();
  });

  test('login mobile screenshot', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('onboarding is usable on mobile', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    // Form should be visible and usable
    await expect(page.locator('#shopName')).toBeVisible();
    await expect(page.locator('[data-testid="onboarding-submit"]')).toBeVisible();
  });
});
