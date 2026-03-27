import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.describe('Login Page', () => {
    test('desktop light mode', async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('login-desktop-light.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });

    test('desktop dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('login-desktop-dark.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });

    test('mobile light mode', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('login-mobile-light.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });
  });

  test.describe('Onboarding Page', () => {
    test('desktop light mode', async ({ page }) => {
      await page.goto('/auth/onboarding');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('onboarding-desktop-light.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });

    test('desktop dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/auth/onboarding');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('onboarding-desktop-dark.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });
  });
});
