import { test, expect } from '@playwright/test';

test.describe('Auth UI', () => {
  test('login page has Google sign-in button', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    const googleBtn = page.locator('button:has-text("Google")');
    await expect(googleBtn).toBeVisible();
  });

  test('login page has trust badges', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Secure').first()).toBeVisible();
    await expect(page.locator('text=AI-Powered').first()).toBeVisible();
  });

  test('onboarding page has GarageOS branding', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=GarageOS').first()).toBeVisible();
  });

  test('onboarding page has form fields', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('input#shopName')).toBeVisible();
  });

  test('onboarding page has step indicator', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    // Step indicator dots
    const dots = page.locator('.rounded-full.h-1\\.5');
    await expect(dots.first()).toBeVisible();
  });
});
