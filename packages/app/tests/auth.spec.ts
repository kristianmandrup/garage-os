import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/auth/login');

    // Check page title and main elements
    await expect(page.locator('text=GarageOS').first()).toBeVisible();
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    await expect(page.locator('text=Sign in to manage your auto repair shop')).toBeVisible();

    // Check Google sign in button exists
    const googleButton = page.locator('button:has-text("Continue with Google")');
    await expect(googleButton).toBeVisible();

    // Check footer links
    await expect(page.locator('text=Terms of Service')).toBeVisible();
    await expect(page.locator('text=Privacy Policy')).toBeVisible();
  });

  test('login page has correct meta tags', async ({ page }) => {
    await page.goto('/auth/login');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /auto repair shop/i);
  });

  test('error page renders on auth error', async ({ page }) => {
    await page.goto('/auth/error?message=Test%20error%20message');

    await expect(page.locator('text=Authentication Error')).toBeVisible();
    await expect(page.locator('text=Test error message')).toBeVisible();
    // Button with asChild renders as <a> tag
    await expect(page.locator('a:has-text("Back to Sign In")')).toBeVisible();
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
    const googleButton = page.locator('button:has-text("Continue with Google")');
    await expect(googleButton).toBeAttached();
  });
});

test.describe('Auth Protection', () => {
  test('unauthenticated user is redirected from dashboard', async ({ page }) => {
    const response = await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
