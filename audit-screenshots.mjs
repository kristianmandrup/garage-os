import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const DIR = './screenshots-audit';
mkdirSync(DIR, { recursive: true });

const APP_BASE = 'http://localhost:3330';
const SITE_BASE = 'http://localhost:3002';
const SUPABASE_HOST = 'hvvivbogypvkmutvtowx.supabase.co';

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

// ---------------------------------------------------------------------------
// Mock data for Supabase auth & API responses
// ---------------------------------------------------------------------------
const FAKE_USER_ID = '00000000-0000-0000-0000-000000000001';
const FAKE_USER = {
  id: FAKE_USER_ID,
  aud: 'authenticated',
  role: 'authenticated',
  email: 'demo@garageos.app',
  email_confirmed_at: '2025-01-01T00:00:00Z',
  phone: '',
  confirmed_at: '2025-01-01T00:00:00Z',
  last_sign_in_at: '2025-01-01T00:00:00Z',
  app_metadata: { provider: 'google', providers: ['google'] },
  user_metadata: { full_name: 'Demo Owner', avatar_url: '' },
  identities: [],
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

const FAKE_SESSION = {
  access_token: 'fake-access-token-for-screenshots',
  token_type: 'bearer',
  expires_in: 36000,
  expires_at: Math.floor(Date.now() / 1000) + 36000,
  refresh_token: 'fake-refresh-token',
  user: FAKE_USER,
};

const FAKE_PROFILE = {
  id: FAKE_USER_ID,
  name: 'Demo Owner',
  role: 'owner',
  email: 'demo@garageos.app',
};

// ---------------------------------------------------------------------------
// Pages to screenshot
// ---------------------------------------------------------------------------

// Auth pages — no mocking needed
const AUTH_PAGES = [
  { name: 'site-landing', url: `${SITE_BASE}` },
  { name: 'app-login', url: `${APP_BASE}/auth/login` },
  { name: 'app-onboarding', url: `${APP_BASE}/auth/onboarding` },
];

// Dashboard pages — need mock auth
const DASHBOARD_PAGES = [
  { name: 'dashboard', path: '/dashboard' },
  { name: 'job-cards', path: '/dashboard/job-cards' },
  { name: 'job-cards-new', path: '/dashboard/job-cards/new' },
  { name: 'vehicles', path: '/dashboard/vehicles' },
  { name: 'vehicles-new', path: '/dashboard/vehicles/new' },
  { name: 'customers', path: '/dashboard/customers' },
  { name: 'customers-new', path: '/dashboard/customers/new' },
  { name: 'inventory', path: '/dashboard/inventory' },
  { name: 'inventory-new', path: '/dashboard/inventory/new' },
  { name: 'invoices', path: '/dashboard/invoices' },
  { name: 'analytics', path: '/dashboard/analytics' },
  { name: 'diagnostics', path: '/dashboard/diagnostics' },
  { name: 'messages', path: '/dashboard/messages' },
  { name: 'reminders', path: '/dashboard/reminders' },
  { name: 'tasks', path: '/dashboard/tasks' },
  { name: 'settings', path: '/dashboard/settings' },
  { name: 'suppliers', path: '/dashboard/suppliers' },
  { name: 'suppliers-new', path: '/dashboard/suppliers/new' },
  { name: 'inspection', path: '/dashboard/inspection' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Set up route interception on a Playwright page to mock all Supabase calls.
 * This makes the middleware think the user is authenticated and returns empty
 * data for all Supabase REST/PostgREST queries.
 */
async function setupAuthMocking(page) {
  // Intercept Supabase Auth API — getUser endpoint
  await page.route(`**/${SUPABASE_HOST}/auth/v1/user`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(FAKE_USER),
    });
  });

  // Intercept Supabase Auth API — token refresh
  await page.route(`**/${SUPABASE_HOST}/auth/v1/token**`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(FAKE_SESSION),
    });
  });

  // Intercept Supabase Auth API — session
  await page.route(`**/${SUPABASE_HOST}/auth/v1/session**`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(FAKE_SESSION),
    });
  });

  // Intercept Supabase PostgREST — users table (profile lookups)
  await page.route(`**/${SUPABASE_HOST}/rest/v1/users**`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'content-range': '0-0/1' },
      body: JSON.stringify(FAKE_PROFILE),
    });
  });

  // Intercept Supabase PostgREST — shops table
  await page.route(`**/${SUPABASE_HOST}/rest/v1/shops**`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'content-range': '0-0/1' },
      body: JSON.stringify([{
        id: '00000000-0000-0000-0000-000000000010',
        name: 'Demo Garage',
        owner_id: FAKE_USER_ID,
        created_at: '2025-01-01T00:00:00Z',
      }]),
    });
  });

  // Intercept ALL other Supabase PostgREST queries — return empty arrays
  await page.route(`**/${SUPABASE_HOST}/rest/v1/**`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'content-range': '0-0/0' },
      body: JSON.stringify([]),
    });
  });

  // Intercept Supabase Realtime websocket — just let it fail silently
  await page.route(`**/${SUPABASE_HOST}/realtime/**`, (route) => {
    return route.abort('connectionrefused');
  });

  // Intercept app API routes — return appropriate mock data
  await page.route(`${APP_BASE}/api/shops/active`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        shops: [{ id: '00000000-0000-0000-0000-000000000010', name: 'Demo Garage', owner_id: FAKE_USER_ID }],
        activeShop: { id: '00000000-0000-0000-0000-000000000010', name: 'Demo Garage', owner_id: FAKE_USER_ID },
      }),
    });
  });

  // Analytics API — return proper shape
  await page.route(`${APP_BASE}/api/analytics**`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        revenue: { total: 0, paid: 0, pending: 0, byDay: {} },
        jobs: { total: 0, completed: 0, inProgress: 0, byStatus: {} },
        inventory: { total: 0, lowStock: 0, outOfStock: 0, totalValue: 0 },
        mechanics: [],
        customerRetention: { total: 0, returning: 0, rate: 0 },
        period: 30,
      }),
    });
  });

  // All other API routes — return empty arrays
  await page.route(`${APP_BASE}/api/**`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
}

/**
 * Build Supabase auth cookies that the middleware will read.
 * The @supabase/ssr library stores the session as chunked cookies.
 */
function getSupabaseCookies() {
  const sessionPayload = JSON.stringify({
    access_token: FAKE_SESSION.access_token,
    token_type: 'bearer',
    expires_in: FAKE_SESSION.expires_in,
    expires_at: FAKE_SESSION.expires_at,
    refresh_token: FAKE_SESSION.refresh_token,
    user: FAKE_USER,
  });

  // Supabase SSR stores session in sb-<project-ref>-auth-token cookie
  // It may chunk large cookies, but our fake session is small enough for one
  const projectRef = SUPABASE_HOST.split('.')[0]; // hvvivbogypvkmutvtowx
  const cookieName = `sb-${projectRef}-auth-token`;

  return [
    {
      name: cookieName,
      value: sessionPayload,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
    // Also set the base64-encoded version that some Supabase versions expect
    {
      name: `${cookieName}.0`,
      value: Buffer.from(sessionPayload).toString('base64'),
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ];
}

async function takeScreenshot(page, filePath) {
  try {
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`    ✓ ${filePath}`);
  } catch (err) {
    console.log(`    ✗ ${filePath} — ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function run() {
  console.log('Audit Screenshots — starting...\n');
  const browser = await chromium.launch();
  let total = 0;
  let failed = 0;

  // ------------------------------------------------------------------
  // 1. Auth pages (no mocking needed)
  // ------------------------------------------------------------------
  console.log('=== Auth / Public Pages ===');
  for (const p of AUTH_PAGES) {
    console.log(`  ${p.name}`);
    for (const variant of ['light', 'dark', 'mobile']) {
      const viewport = variant === 'mobile' ? MOBILE : DESKTOP;
      const colorScheme = variant === 'dark' ? 'dark' : 'light';
      const ctx = await browser.newContext({ viewport, colorScheme });
      const page = await ctx.newPage();
      total++;
      try {
        await page.goto(p.url, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(1000);
        await takeScreenshot(page, `${DIR}/${p.name}-${variant}.png`);
      } catch (err) {
        console.log(`    ✗ ${p.name}-${variant} — ${err.message}`);
        failed++;
      }
      await ctx.close();
    }
  }

  // ------------------------------------------------------------------
  // 2. Dashboard pages (with mock auth)
  // ------------------------------------------------------------------
  console.log('\n=== Dashboard Pages (mocked auth) ===');

  for (const p of DASHBOARD_PAGES) {
    console.log(`  ${p.name}`);
    for (const variant of ['light', 'dark', 'mobile']) {
      const viewport = variant === 'mobile' ? MOBILE : DESKTOP;
      const colorScheme = variant === 'dark' ? 'dark' : 'light';

      const ctx = await browser.newContext({
        viewport,
        colorScheme,
      });

      // Inject Supabase auth cookies and theme cookie before navigation
      await ctx.addCookies([
        ...getSupabaseCookies(),
        {
          name: 'theme',
          value: variant === 'dark' ? 'dark' : 'light',
          domain: 'localhost',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
      ]);

      const page = await ctx.newPage();

      // Set up API mocking
      await setupAuthMocking(page);

      // Force theme via localStorage
      await page.addInitScript((isDark) => {
        const theme = isDark ? 'dark' : 'light';
        localStorage.setItem('garageos-app-store', JSON.stringify({ state: { theme, locale: 'en' }, version: 0 }));
        localStorage.setItem('garageos-theme', theme);
      }, variant === 'dark');

      total++;
      try {
        const url = `${APP_BASE}${p.path}?_screenshot=1`;
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });

        // Check if we got redirected to login (auth mock failed)
        const finalUrl = page.url();
        if (finalUrl.includes('/auth/login')) {
          console.log(`    ⚠ ${p.name}-${variant} — redirected to login (auth mock may not work with SSR middleware)`);
          // Still take the screenshot of whatever rendered
        }

        await page.waitForTimeout(800);

        // Force dark class after hydration and wait for repaint
        if (variant === 'dark') {
          await page.evaluate(() => {
            document.documentElement.classList.add('dark');
            // Also trigger any components that read the class
            window.dispatchEvent(new Event('resize'));
          });
          await page.waitForTimeout(600);
        } else {
          await page.waitForTimeout(400);
        }
        await takeScreenshot(page, `${DIR}/${p.name}-${variant}.png`);
      } catch (err) {
        console.log(`    ✗ ${p.name}-${variant} — ${err.message}`);
        failed++;
      }
      await ctx.close();
    }
  }

  await browser.close();

  console.log(`\n=== Done ===`);
  console.log(`Total: ${total} screenshots`);
  if (failed > 0) {
    console.log(`Failed: ${failed}`);
  }
  console.log(`Output: ${DIR}/`);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
