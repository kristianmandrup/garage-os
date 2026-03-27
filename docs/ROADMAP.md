# GarageOS Roadmap

## Completed

### Design System & UI (Done)
- [x] Design tokens (spacing, radius, shadows, typography, transitions, colors)
- [x] OKLch color system aligned across app and site
- [x] 22+ shared UI components (Dialog, Tooltip, Skeleton, Breadcrumb, Pagination, DataTable, FormField, etc.)
- [x] Enhanced Button (loading), Input (icons, error), Badge (dark mode), EmptyState (8 variants)
- [x] Site scroll animations (AnimateIn) and dashboard page transitions
- [x] Storybook 10.x with 9 documented stories

### Dashboard (Done)
- [x] Grouped sidebar navigation (Operations, Intelligence, Communication)
- [x] Mobile bottom tab bar
- [x] Command palette (Cmd+K)
- [x] Keyboard shortcuts help (?)
- [x] Notification center with Supabase realtime
- [x] TodayOverview strip and ActivityFeed
- [x] DataTable with pagination + CSV export on all list pages
- [x] Breadcrumb navigation on all pages
- [x] FormField in all forms
- [x] Dialog delete confirmations
- [x] Skeleton loading states
- [x] Tooltip on collapsed sidebar

### Accessibility & Performance (Done)
- [x] Lighthouse: Accessibility 100, SEO 100, Best Practices 96
- [x] Skip-to-content links, ARIA labels, reduced motion
- [x] Dark mode cookie persistence (no SSR flash)
- [x] Next.js Image optimization, font preloading

### Infrastructure (Done)
- [x] PWA (manifest, service worker, offline page, icons)
- [x] GitHub Actions CI (typecheck, test, build, e2e)
- [x] 49 unit tests + 33 E2E tests
- [x] Full i18n (EN/TH) across all components
- [x] CLAUDE.md project context
- [x] Supabase connected (schema deployed)

---

## Manual Steps Required

- [ ] **Google OAuth** - Set up Google Cloud OAuth client, configure in Supabase Dashboard (see Operations Guide)
- [ ] **Vercel deploy** - Import projects, set env vars (see Operations Guide)
- [ ] **Supabase Realtime** - Enable replication on job_cards, customers, parts tables
- [ ] **Supabase Storage** - Create job-photos bucket for AI inspection
- [ ] **Twilio** - Account setup for SMS/WhatsApp messaging
- [ ] **LINE API** - Channel setup for Thai market messaging
- [ ] **Resend** - API key for site contact form emails
- [ ] **Custom domain** - DNS configuration for production URLs

---

## Next Up (Proposed)

### Production Hardening
- [ ] Add Error Boundary components wrapping each dashboard section
- [ ] Add `loading.tsx` files for Next.js Suspense/streaming on dashboard routes
- [ ] Add rate limiting to API routes (use Upstash Redis or in-memory)
- [ ] Input sanitization audit on all API routes
- [ ] Add CSP headers via next.config.ts

### Developer Experience
- [ ] Database seed script for local development (sample shop, customers, vehicles, jobs)
- [ ] Add bundle analysis (`@next/bundle-analyzer`) to identify optimization targets
- [ ] Pre-commit hook for type-checking (husky + lint-staged)
- [ ] Component documentation page (deploy Storybook to Chromatic or Vercel)

### SEO & Marketing
- [ ] Open Graph images for site (dynamic OG with `@vercel/og`)
- [ ] JSON-LD structured data for pricing page
- [ ] Sitemap generation (`next-sitemap`)
- [ ] Blog section for SEO content

### Feature Enhancements
- [ ] PDF invoice generation (use `@react-pdf/renderer`)
- [ ] Multi-shop dashboard (aggregate analytics across shops)
- [ ] Customer portal improvements (job tracking, invoice payment link)
- [ ] Push notifications via web push API
- [ ] Offline data sync for mechanics in the field
- [ ] Photo annotation tool for AI inspection results
- [ ] Calendar view for scheduled jobs and reminders
- [ ] Barcode/QR scanning for parts inventory

### Analytics & AI
- [ ] Real chart library integration (Recharts or Chart.js) for analytics
- [ ] AI-powered predictive maintenance alerts
- [ ] Smart pricing suggestions based on job history
- [ ] Automated customer follow-up recommendations
