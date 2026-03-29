// Performance monitoring utilities for GarageOS
// Tracks Web Vitals, route render times, and navigation timing

const STYLE_GOOD = 'color: #22c55e; font-weight: bold';
const STYLE_WARN = 'color: #eab308; font-weight: bold';
const STYLE_POOR = 'color: #ef4444; font-weight: bold';
const STYLE_INFO = 'color: #3b82f6; font-weight: bold';

// --- Web Vitals thresholds ---

type Rating = 'good' | 'needs-improvement' | 'poor';

interface ThresholdPair {
  good: number;
  needsImprovement: number;
}

const THRESHOLDS: Record<string, ThresholdPair> = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FCP: { good: 1800, needsImprovement: 3000 },
  INP: { good: 200, needsImprovement: 500 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

function rateMetric(name: string, value: number): Rating {
  const t = THRESHOLDS[name];
  if (!t) return 'good';
  if (value < t.good) return 'good';
  if (value < t.needsImprovement) return 'needs-improvement';
  return 'poor';
}

function styleForRating(rating: Rating): string {
  switch (rating) {
    case 'good':
      return STYLE_GOOD;
    case 'needs-improvement':
      return STYLE_WARN;
    case 'poor':
      return STYLE_POOR;
  }
}

function formatValue(name: string, value: number): string {
  if (name === 'CLS') return value.toFixed(4);
  return `${Math.round(value)}ms`;
}

// --- Web Vitals tracking ---

function trackWebVitals(): void {
  // Dynamic import so the library doesn't block rendering
  import('web-vitals')
    .then(({ onLCP, onFCP, onINP, onCLS, onTTFB }) => {
      const report = ({ name, value }: { name: string; value: number }) => {
        const rating = rateMetric(name, value);
        const style = styleForRating(rating);
        const formatted = formatValue(name, value);
        console.log(
          `%c[Perf] ${name}: ${formatted} (${rating})`,
          style,
        );
      };

      onLCP(report);
      onFCP(report);
      onINP(report);
      onCLS(report);
      onTTFB(report);
    })
    .catch(() => {
      // web-vitals not available; silently skip
    });
}

// --- Route render timing ---

const routeStartTimes = new Map<string, number>();

/**
 * Logs how long a route took to render.
 * Call at the top of a layout/page to start timing, then call again to finish,
 * or use the returned `end` function.
 *
 * Usage:
 *   const end = logRouteRender('/dashboard/vehicles');
 *   // ... render work ...
 *   end();
 *
 * Or simply call once -- it will log the elapsed time since the route first
 * started being tracked.
 */
export function logRouteRender(routeName: string): () => void {
  if (typeof window === 'undefined') return () => {};

  const existing = routeStartTimes.get(routeName);
  if (existing !== undefined) {
    const elapsed = performance.now() - existing;
    routeStartTimes.delete(routeName);
    console.log(
      `%c[Perf] Route: ${routeName} rendered in ${Math.round(elapsed)}ms`,
      elapsed < 100 ? STYLE_GOOD : elapsed < 300 ? STYLE_WARN : STYLE_POOR,
    );
    return () => {};
  }

  const start = performance.now();
  routeStartTimes.set(routeName, start);

  return () => {
    const elapsed = performance.now() - start;
    routeStartTimes.delete(routeName);
    console.log(
      `%c[Perf] Route: ${routeName} rendered in ${Math.round(elapsed)}ms`,
      elapsed < 100 ? STYLE_GOOD : elapsed < 300 ? STYLE_WARN : STYLE_POOR,
    );
  };
}

// --- Navigation Timing ---

/**
 * Reads `performance.getEntriesByType('navigation')` and logs
 * DOM Interactive, DOM Complete, and transfer sizes.
 */
export function logNavigationTiming(): void {
  if (typeof window === 'undefined') return;

  const entries = performance.getEntriesByType(
    'navigation',
  ) as PerformanceNavigationTiming[];
  if (!entries.length) return;

  const nav = entries[0];

  // DOM Interactive
  const domInteractive = Math.round(nav.domInteractive);
  const diRating = domInteractive < 1500 ? 'good' : domInteractive < 3000 ? 'needs-improvement' : 'poor';
  console.log(
    `%c[Perf] DOM Interactive: ${domInteractive}ms`,
    styleForRating(diRating as Rating),
  );

  // DOM Complete
  const domComplete = Math.round(nav.domComplete);
  const dcRating = domComplete < 2000 ? 'good' : domComplete < 4000 ? 'needs-improvement' : 'poor';
  console.log(
    `%c[Perf] DOM Complete: ${domComplete}ms`,
    styleForRating(dcRating as Rating),
  );

  // Transfer sizes
  const transferKB = (nav.transferSize / 1024).toFixed(1);
  const encodedKB = (nav.encodedBodySize / 1024).toFixed(1);
  const decodedKB = (nav.decodedBodySize / 1024).toFixed(1);
  const transferRating = nav.transferSize < 50_000 ? 'good' : nav.transferSize < 200_000 ? 'needs-improvement' : 'poor';
  console.log(
    `%c[Perf] Transfer: ${transferKB}KB (encoded: ${encodedKB}KB, decoded: ${decodedKB}KB)`,
    styleForRating(transferRating as Rating),
  );
}

// --- Init ---

let initialized = false;

/**
 * Initializes all performance monitoring.
 * Safe to call during SSR -- it will no-op on the server.
 */
export function initPerfMonitoring(): void {
  if (typeof window === 'undefined') return;
  if (initialized) return;
  initialized = true;

  console.log('%c[Perf] Performance monitoring initialized', STYLE_INFO);

  trackWebVitals();
  logNavigationTiming();
}
