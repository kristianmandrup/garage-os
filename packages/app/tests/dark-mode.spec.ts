import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
  test('login page respects system dark preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    // Check the page has dark background
    const body = page.locator('body');
    const bg = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    // Dark mode should have a dark background (not white)
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });

  test('onboarding page renders in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/auth/onboarding');
    await page.waitForLoadState('networkidle');

    // The card should exist
    await expect(page.locator('text=Set Up Your Shop')).toBeVisible();
  });

  test('login desktop dark screenshot', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login-dark-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});
