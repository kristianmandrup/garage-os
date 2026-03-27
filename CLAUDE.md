# CLAUDE.md - GarageOS Project Context

## What is this project?
GarageOS is "Shopify for Auto Repair" - a mobile-first, AI-powered shop management system for auto repair shops in Thailand and Southeast Asia. It's a monorepo with two Next.js apps and shared packages.

## Architecture

### Monorepo Structure (Turborepo + npm workspaces)
```
packages/
  app/     - Main SaaS dashboard (Next.js 16, port 3330)
  site/    - Marketing landing page (Next.js 16, port 3002)
  ui/      - Shared component library (@garageos/ui)
  shared/  - Shared utilities and types
  db/      - Database layer (Drizzle ORM)
```

### Tech Stack
- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4 with OKLch color system
- **UI**: Custom component library with Radix UI primitives, CVA variants, Lucide icons
- **State**: Zustand (app store with theme/locale persistence)
- **Database**: Supabase PostgreSQL with RLS
- **Auth**: Supabase Auth (Google OAuth)
- **ORM**: Drizzle ORM
- **i18n**: Custom provider with EN/TH translations
- **Testing**: Vitest (unit), Playwright (E2E + visual regression)
- **Build**: Turborepo, tsup (UI lib)

## Key Commands
```bash
# Install
npm install

# Dev servers
npx turbo run build --filter=@garageos/ui  # Must build UI first
cd packages/app && npx next dev --port 3330
cd packages/site && npx next dev --port 3002

# Type check
npx tsc --noEmit -p packages/ui/tsconfig.json
npx tsc --noEmit -p packages/app/tsconfig.json
npx tsc --noEmit -p packages/site/tsconfig.json

# Tests
cd packages/ui && npx vitest run        # UI unit tests
cd packages/app && npx vitest run       # App unit tests
cd packages/site && npx playwright test # Site E2E tests

# Build
npx turbo run build --filter=@garageos/site
npx turbo run build --filter=@garageos/app
```

## UI Component Library (@garageos/ui)
Import pattern: `import { Button } from '@garageos/ui/button'`

### Components
- **Layout**: Card, Dialog, Tabs, Breadcrumb
- **Form**: Button (loading prop), Input (startIcon/endIcon/error), Textarea, Label, FormField
- **Data**: DataTable (search, sort, pagination, CSV export), Badge, StatusBadge, Pagination
- **Feedback**: Toast/Toaster, Spinner, Skeleton, EmptyState (8 variants), Progress, Tooltip
- **Navigation**: Dropdown, Avatar

### Design Tokens
`import { spacing, radius, shadows, typography, transitions, colors } from '@garageos/ui/tokens'`

## App Architecture

### Routing
- `/auth/login` - Google OAuth login
- `/auth/onboarding` - Shop setup
- `/dashboard` - Main dashboard with sidebar
- `/dashboard/[section]` - Job cards, vehicles, customers, inventory, invoices, analytics, messages, reminders, settings, tasks, diagnostics
- `/portal/[customerId]` - Customer-facing portal

### Dashboard Features
- Grouped sidebar navigation (Operations, Intelligence, Communication)
- Mobile bottom tab bar (Home, Jobs, Vehicles, Customers, More)
- Command palette (Cmd+K)
- Keyboard shortcuts help (?)
- Notification center with Supabase realtime
- Page transitions, skeleton loading
- TodayOverview strip, ActivityFeed

### i18n
Translations in `src/i18n/translations/{en,th}/`. Each domain has its own file.
Use: `const t = useTranslation()` then `t.nav.dashboard`, `t.dashboard.title`, etc.

### API Routes
All at `/api/*` using Supabase server client with shop-scoped queries.
Pattern: authenticate user → get shop → query with shop_id filter.

## Site Architecture
- Single landing page with sections: Hero, Features, Benefits, Pricing, CTA, Footer
- AnimateIn component for scroll-triggered entrance animations
- All buttons use shared Button component
- Next.js Image for optimized images
- Full dark mode + i18n (EN/TH)

## Dark Mode
- OKLch color system in globals.css
- Zustand store persists to cookie + localStorage
- Server reads cookie in layout.tsx for SSR (no flash)
- Use `dark:` prefix for Tailwind classes

## PWA
- Web manifest at `/manifest.json`
- Service worker at `/sw.js` (offline fallback)
- Icons: 192px + 512px PNGs

## CI
GitHub Actions: typecheck → test → build → e2e (on push to main and PRs)

## Conventions
- Components use 'use client' directive when needed
- Forms use react-hook-form + Zod (or controlled state)
- All list pages use DataTable with Breadcrumb
- Detail pages use Dialog for delete confirmations
- Skeleton loading for all async data
- Status colors follow consistent pattern: blue (active), emerald (success), amber (warning), red (danger), purple (parts), indigo (in-progress)

## Environment Variables (App)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Deployment
Vercel with per-package configs. Each package has its own `vercel.json` with project IDs.
