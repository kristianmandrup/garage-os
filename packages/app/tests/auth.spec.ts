import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/auth/login');

    // Check page has login elements
    await expect(page.locator('[data-testid="login-brand"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-page"]')).toBeVisible();

    // Check Google sign in button exists
    const googleButton = page.locator('[data-testid="login-google-btn"]');
    await expect(googleButton).toBeVisible();

    // Check footer links
    await expect(page.locator('a[href*="terms"]')).toBeVisible();
    await expect(page.locator('a[href*="privacy"]')).toBeVisible();
  });

  test('login page has correct meta tags', async ({ page }) => {
    await page.goto('/auth/login');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /auto repair shop/i);
  });

  test('error page renders on auth error', async ({ page }) => {
    await page.goto('/auth/error?message=Test%20error%20message');

    await expect(page.locator('[data-testid="auth-error-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="auth-error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="auth-error-back"]')).toBeVisible();
  });

  test('dashboard redirects to login when not authenticated', async ({ page }) => {
    // Navigate to dashboard without auth
    await page.goto('/dashboard');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('login page has Google OAuth button', async ({ page }) => {
    await page.goto('/auth/login');

    // Check that the Google OAuth button exists
    const googleButton = page.locator('[data-testid="login-google-btn"]');
    await expect(googleButton).toBeAttached();
  });
});

test.describe('Auth Protection', () => {
  test('unauthenticated user is redirected from dashboard', async ({ page }) => {
    const response = await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
