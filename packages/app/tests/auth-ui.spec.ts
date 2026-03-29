import { test, expect } from '@playwright/test';

test.describe('Auth UI', () => {
  test('login page has Google sign-in button', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    const googleBtn = page.locator('[data-testid="login-google-btn"]');
    await expect(googleBtn).toBeVisible();
  });

  test('login page has trust badges', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="trust-badges"]')).toBeVisible();
  });

  test('onboarding page has GarageOS branding', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="onboarding-brand"]')).toBeVisible();
  });

  test('onboarding page has form fields', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('#shopName')).toBeVisible();
  });

  test('onboarding page has step indicator', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    const stepIndicator = page.locator('[data-testid="onboarding-step-indicator"]');
    await expect(stepIndicator).toBeVisible();
  });
});
