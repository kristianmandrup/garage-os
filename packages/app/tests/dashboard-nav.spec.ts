import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  test('sidebar shows grouped navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Check for group labels (desktop only)
    if (page.viewportSize()!.width >= 1024) {
      await expect(page.locator('text=Operations')).toBeVisible();
      await expect(page.locator('text=Intelligence')).toBeVisible();
      await expect(page.locator('text=Communication')).toBeVisible();
    }
  });

  test('breadcrumb navigation works', async ({ page }) => {
    await page.goto('/dashboard/customers');
    await page.waitForLoadState('networkidle');

    const breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.locator('text=Dashboard')).toBeVisible();
    await expect(breadcrumb.locator('text=Customers')).toBeVisible();
  });

  test('command palette opens with Cmd+K', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Meta+k');
    await expect(page.locator('input[placeholder*="command"]')).toBeVisible();

    // Can search
    await page.fill('input[placeholder*="command"]', 'customers');
    await expect(page.locator('text=Go to Customers')).toBeVisible();

    // Can close with Escape
    await page.keyboard.press('Escape');
    await expect(page.locator('input[placeholder*="command"]')).not.toBeVisible();
  });

  test('skip to content link works', async ({ page }) => {
    await page.goto('/dashboard');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
    const main = page.locator('#main-content');
    await expect(main).toBeAttached();
  });
});
