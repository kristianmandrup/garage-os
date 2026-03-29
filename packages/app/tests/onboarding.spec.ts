import { test, expect } from '@playwright/test';

test.describe('Onboarding Page', () => {
  test('renders all form fields', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('#shopName')).toBeVisible();
    await expect(page.locator('#shopPhone')).toBeVisible();
    await expect(page.locator('#shopEmail')).toBeVisible();
    await expect(page.locator('#shopAddress')).toBeVisible();
    await expect(page.locator('#timezone')).toBeVisible();
    await expect(page.locator('#currency')).toBeVisible();
  });

  test('shop name is required', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    const shopNameInput = page.locator('#shopName');
    await expect(shopNameInput).toHaveAttribute('required', '');
  });

  test('has GarageOS branding', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="onboarding-brand"]')).toBeVisible();
  });

  test('has step indicator', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    const stepIndicator = page.locator('[data-testid="onboarding-step-indicator"]');
    await expect(stepIndicator).toBeVisible();
  });

  test('has Create My Shop button', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    const btn = page.locator('[data-testid="onboarding-submit"]');
    await expect(btn).toBeVisible();
  });

  test('timezone defaults to Bangkok', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    const timezone = page.locator('#timezone');
    await expect(timezone).toHaveValue('Asia/Bangkok');
  });

  test('currency defaults to THB', async ({ page }) => {
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    const currency = page.locator('#currency');
    await expect(currency).toHaveValue('THB');
  });
});
