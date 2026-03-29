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

  // Analytics API — return rich data
  await page.route(`${APP_BASE}/api/analytics**`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        revenue: {
          total: 245000, paid: 198000, pending: 47000,
          byDay: { '2026-03-23': 12000, '2026-03-24': 18000, '2026-03-25': 15000, '2026-03-26': 22000, '2026-03-27': 19000, '2026-03-28': 25000, '2026-03-29': 21000 },
        },
        jobs: {
          total: 47, completed: 31, inProgress: 12,
          byStatus: { inspection: 4, diagnosed: 3, parts_ordered: 5, in_progress: 12, pending_approval: 2, completed: 31, cancelled: 1 },
        },
        inventory: { total: 156, lowStock: 8, outOfStock: 2, totalValue: 89500 },
        mechanics: [
          { id: 'm-1', name: 'Somkiat C.', jobsCompleted: 14, activeJobs: 4, rating: 4.8 },
          { id: 'm-2', name: 'Wichai P.', jobsCompleted: 11, activeJobs: 5, rating: 4.6 },
          { id: 'm-3', name: 'Apichart N.', jobsCompleted: 6, activeJobs: 3, rating: 4.9 },
        ],
        customerRetention: { total: 89, returning: 52, rate: 58.4 },
        period: 30,
      }),
    });
  });

  // Job Cards API
  await page.route(`${APP_BASE}/api/job-cards`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'jc-1', title: 'Engine Oil Change', status: 'in_progress', license_plate: 'กท 1234', customer_name: 'Somchai P.', assigned_to: 'Mechanic A', created_at: '2026-03-28', estimated_cost: 2500 },
        { id: 'jc-2', title: 'Brake Pad Replacement', status: 'completed', license_plate: 'ชร 5678', customer_name: 'Nattaya W.', assigned_to: 'Mechanic B', created_at: '2026-03-27', estimated_cost: 4200 },
        { id: 'jc-3', title: 'AC Compressor Repair', status: 'diagnosed', license_plate: 'สก 9012', customer_name: 'Prasert K.', assigned_to: 'Mechanic A', created_at: '2026-03-27', estimated_cost: 8500 },
        { id: 'jc-4', title: 'Tire Rotation & Balance', status: 'inspection', license_plate: 'นบ 3456', customer_name: 'Waraporn S.', assigned_to: 'Mechanic C', created_at: '2026-03-26', estimated_cost: 1800 },
        { id: 'jc-5', title: 'Transmission Fluid Flush', status: 'parts_ordered', license_plate: 'กท 7890', customer_name: 'Arun T.', assigned_to: 'Mechanic B', created_at: '2026-03-25', estimated_cost: 3500 },
      ]),
    });
  });

  // Vehicles API
  await page.route(`${APP_BASE}/api/vehicles`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'v-1', make: 'Toyota', model: 'Camry', year: 2022, license_plate: 'กท 1234', color: 'White', customer_name: 'Somchai P.', vin: 'JTDKN3DU5N0123456', last_service: '2026-03-28' },
        { id: 'v-2', make: 'Honda', model: 'Civic', year: 2021, license_plate: 'ชร 5678', color: 'Silver', customer_name: 'Nattaya W.', vin: '2HGFC2F59MH567890', last_service: '2026-03-27' },
        { id: 'v-3', make: 'Isuzu', model: 'D-Max', year: 2023, license_plate: 'สก 9012', color: 'Blue', customer_name: 'Prasert K.', vin: 'MPATFS86JRT012345', last_service: '2026-03-20' },
        { id: 'v-4', make: 'Mazda', model: '3', year: 2020, license_plate: 'นบ 3456', color: 'Red', customer_name: 'Waraporn S.', vin: '3MZBM1V76LM654321', last_service: '2026-03-15' },
      ]),
    });
  });

  // Customers API
  await page.route(`${APP_BASE}/api/customers`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'c-1', name: 'Somchai Phanomwan', email: 'somchai@email.com', phone: '081-234-5678', address: '123 Sukhumvit Soi 31, Bangkok 10110', vehicles_count: 2, total_spent: 45000, created_at: '2025-06-15' },
        { id: 'c-2', name: 'Nattaya Wongsakul', email: 'nattaya@email.com', phone: '089-876-5432', address: '45 Rama IX Rd, Bangkok 10310', vehicles_count: 1, total_spent: 28000, created_at: '2025-08-20' },
        { id: 'c-3', name: 'Prasert Kamolrat', email: 'prasert@email.com', phone: '062-345-6789', address: '78 Ladprao Soi 15, Bangkok 10230', vehicles_count: 1, total_spent: 62000, created_at: '2025-04-10' },
        { id: 'c-4', name: 'Waraporn Srisuk', email: 'waraporn@email.com', phone: '095-111-2233', address: '9 Silom Rd, Bangkok 10500', vehicles_count: 1, total_spent: 18500, created_at: '2026-01-05' },
        { id: 'c-5', name: 'Arun Thongchai', email: 'arun@email.com', phone: '083-999-8877', address: '234 Ratchadaphisek Rd, Bangkok 10400', vehicles_count: 3, total_spent: 95000, created_at: '2025-02-28' },
      ]),
    });
  });

  // Inventory / Parts API
  await page.route(`${APP_BASE}/api/inventory`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'p-1', name: 'Engine Oil 5W-30 (4L)', sku: 'OIL-5W30-4L', category: 'Fluids', quantity: 24, min_stock: 10, price: 850, cost: 620, status: 'in_stock' },
        { id: 'p-2', name: 'Brake Pad Set (Front)', sku: 'BRK-PAD-F01', category: 'Brakes', quantity: 8, min_stock: 5, price: 1200, cost: 780, status: 'in_stock' },
        { id: 'p-3', name: 'Air Filter - Toyota Camry', sku: 'FLT-AIR-TC22', category: 'Filters', quantity: 3, min_stock: 5, price: 450, cost: 280, status: 'low_stock' },
        { id: 'p-4', name: 'Spark Plug Set (4pc)', sku: 'SPK-PLG-4PC', category: 'Ignition', quantity: 0, min_stock: 4, price: 680, cost: 420, status: 'out_of_stock' },
        { id: 'p-5', name: 'Transmission Fluid ATF (1L)', sku: 'FLD-ATF-1L', category: 'Fluids', quantity: 15, min_stock: 8, price: 380, cost: 240, status: 'in_stock' },
        { id: 'p-6', name: 'Serpentine Belt - Honda Civic', sku: 'BLT-SRP-HC21', category: 'Belts', quantity: 2, min_stock: 3, price: 950, cost: 600, status: 'low_stock' },
      ]),
    });
  });

  // Also match /api/parts in case that's used
  await page.route(`${APP_BASE}/api/parts`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'p-1', name: 'Engine Oil 5W-30 (4L)', sku: 'OIL-5W30-4L', category: 'Fluids', quantity: 24, min_stock: 10, price: 850, cost: 620, status: 'in_stock' },
        { id: 'p-2', name: 'Brake Pad Set (Front)', sku: 'BRK-PAD-F01', category: 'Brakes', quantity: 8, min_stock: 5, price: 1200, cost: 780, status: 'in_stock' },
        { id: 'p-3', name: 'Air Filter - Toyota Camry', sku: 'FLT-AIR-TC22', category: 'Filters', quantity: 3, min_stock: 5, price: 450, cost: 280, status: 'low_stock' },
        { id: 'p-4', name: 'Spark Plug Set (4pc)', sku: 'SPK-PLG-4PC', category: 'Ignition', quantity: 0, min_stock: 4, price: 680, cost: 420, status: 'out_of_stock' },
        { id: 'p-5', name: 'Transmission Fluid ATF (1L)', sku: 'FLD-ATF-1L', category: 'Fluids', quantity: 15, min_stock: 8, price: 380, cost: 240, status: 'in_stock' },
        { id: 'p-6', name: 'Serpentine Belt - Honda Civic', sku: 'BLT-SRP-HC21', category: 'Belts', quantity: 2, min_stock: 3, price: 950, cost: 600, status: 'low_stock' },
      ]),
    });
  });

  // Invoices API
  await page.route(`${APP_BASE}/api/invoices`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'inv-1', invoice_number: 'INV-2026-0047', customer_name: 'Somchai P.', total: 2500, status: 'paid', issued_at: '2026-03-28', paid_at: '2026-03-28', job_card_id: 'jc-1' },
        { id: 'inv-2', invoice_number: 'INV-2026-0046', customer_name: 'Nattaya W.', total: 4200, status: 'paid', issued_at: '2026-03-27', paid_at: '2026-03-27', job_card_id: 'jc-2' },
        { id: 'inv-3', invoice_number: 'INV-2026-0045', customer_name: 'Prasert K.', total: 8500, status: 'pending', issued_at: '2026-03-27', paid_at: null, job_card_id: 'jc-3' },
        { id: 'inv-4', invoice_number: 'INV-2026-0044', customer_name: 'Arun T.', total: 3500, status: 'overdue', issued_at: '2026-03-20', paid_at: null, job_card_id: 'jc-5' },
      ]),
    });
  });

  // Suppliers API
  await page.route(`${APP_BASE}/api/suppliers`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 's-1', name: 'Thai Auto Parts Co.', contact_name: 'Kittisak M.', phone: '02-123-4567', email: 'sales@thaiAutoparts.co.th', address: '88 Bangna-Trad Rd, Bangkok 10260', categories: ['Filters', 'Belts', 'Ignition'], rating: 4.7 },
        { id: 's-2', name: 'Bangkok Brake Supply', contact_name: 'Piyarat S.', phone: '02-987-6543', email: 'orders@bkkbrake.com', address: '15 Lat Krabang Rd, Bangkok 10520', categories: ['Brakes', 'Suspension'], rating: 4.5 },
        { id: 's-3', name: 'Siam Lubricants Ltd.', contact_name: 'Chaiwat R.', phone: '02-555-1234', email: 'info@siamlube.co.th', address: '200 Rama II Rd, Bangkok 10150', categories: ['Fluids', 'Oils'], rating: 4.8 },
      ]),
    });
  });

  // Messages API
  await page.route(`${APP_BASE}/api/messages`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'msg-1', from: 'Somchai P.', subject: 'Oil change appointment', body: 'I would like to schedule an oil change for next Tuesday.', read: false, created_at: '2026-03-29T09:15:00Z' },
        { id: 'msg-2', from: 'Nattaya W.', subject: 'Invoice receipt request', body: 'Could you send me a copy of my latest invoice?', read: true, created_at: '2026-03-28T14:30:00Z' },
        { id: 'msg-3', from: 'Arun T.', subject: 'Parts status update?', body: 'Any update on when the transmission parts will arrive?', read: false, created_at: '2026-03-28T11:00:00Z' },
      ]),
    });
  });

  // Reminders API
  await page.route(`${APP_BASE}/api/reminders`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'rem-1', title: 'Follow up with Prasert K.', description: 'Confirm AC compressor repair approval', due_date: '2026-03-30', status: 'pending', customer_name: 'Prasert K.', type: 'follow_up' },
        { id: 'rem-2', title: 'Reorder air filters', description: 'Toyota Camry air filters running low (3 remaining)', due_date: '2026-03-31', status: 'pending', type: 'inventory' },
      ]),
    });
  });

  // Tasks API
  await page.route(`${APP_BASE}/api/tasks`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'task-1', title: 'Order spark plugs from Thai Auto Parts', status: 'pending', priority: 'high', assigned_to: 'Demo Owner', due_date: '2026-03-30', created_at: '2026-03-28' },
        { id: 'task-2', title: 'Complete quarterly inventory audit', status: 'in_progress', priority: 'medium', assigned_to: 'Somkiat C.', due_date: '2026-03-31', created_at: '2026-03-25' },
        { id: 'task-3', title: 'Update customer loyalty program pricing', status: 'completed', priority: 'low', assigned_to: 'Demo Owner', due_date: '2026-03-28', created_at: '2026-03-20' },
      ]),
    });
  });

  // All other API routes — return empty arrays (catch-all, must be last)
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
