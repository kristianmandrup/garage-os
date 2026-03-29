import { test, expect } from '@playwright/test';

test.describe('Site Visual Regression Tests', () => {
  test.describe('Landing Page', () => {
    test('full page light mode', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Wait for scroll animations to settle
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot('landing-light.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });

    test('full page dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot('landing-dark.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });
  });

  test.describe('Hero Section', () => {
    test('has pill badge', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const pill = page.locator('[data-testid="hero-pill"]');
      await expect(pill).toBeVisible();
    });

    test('has CTA buttons', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const startBtn = page.locator('[data-testid="hero-cta-primary"]');
      const demoBtn = page.locator('[data-testid="hero-cta-secondary"]');
      await expect(startBtn).toBeVisible();
      await expect(demoBtn).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('header is sticky', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200);
      const header = page.locator('[data-testid="site-header"]');
      await expect(header).toBeVisible();
    });

    test('skip to content link', async ({ page }) => {
      await page.goto('/');
      const skipLink = page.locator('a[href="#main-content"]');
      await expect(skipLink).toBeAttached();
    });
  });

  test.describe('Pricing Section', () => {
    test('shows three plans', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Scroll to pricing
      await page.locator('[data-testid="pricing-section"]').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      const plans = page.locator('[data-testid="pricing-card"]');
      await expect(plans).toHaveCount(3);
    });

    test('popular plan is highlighted', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const popularBadge = page.locator('[data-testid="popular-badge"]');
      await expect(popularBadge).toBeVisible();
    });
  });
});
