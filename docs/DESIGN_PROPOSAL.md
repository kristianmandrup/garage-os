# GarageOS Design Proposal & Roadmap

## Current State Assessment

GarageOS has a solid foundation: Tailwind CSS v4 with OKLch colors, a growing shared UI library (`@garageos/ui`), dark mode support, and i18n. The recent improvements added visual depth (gradient backgrounds, glassmorphism, hover lift effects, decorative blobs) to the site landing page and app auth flows.

**What works well:**
- Consistent blue brand identity across app and site
- Plus Jakarta Sans / Inter font pairing
- OKLch color space for perceptually uniform dark mode
- Feature card hover effects (lift + image zoom)
- Glassmorphism on onboarding card

**Key gaps identified:**
- No unified design token system (shadows, spacing, border-radius are ad-hoc)
- Site buttons are raw `<button>` elements instead of the shared `Button` component
- Dashboard pages have inline color logic instead of component variants
- No micro-interactions beyond hover (no loading skeletons, page transitions, or entrance animations)
- Limited accessibility (inconsistent focus rings, no skip-nav, no ARIA live regions)
- Missing core components: Tooltip, Breadcrumb, Pagination, DataTable, Modal/Dialog

---

## Phase 1: Design System Foundation (Week 1-2)

### 1.1 Design Tokens

Create a centralized token file and align both app and site CSS.

```
packages/ui/src/tokens.ts
```

| Token Category | Examples |
|---|---|
| **Spacing** | `xs: 4px`, `sm: 8px`, `md: 16px`, `lg: 24px`, `xl: 32px`, `2xl: 48px` |
| **Border Radius** | `sm: 6px`, `md: 8px`, `lg: 12px`, `xl: 16px`, `2xl: 24px`, `full` |
| **Shadows** | `sm`, `md`, `lg`, `xl` (defined once, used everywhere) |
| **Typography Scale** | `display`, `h1`-`h4`, `body-lg`, `body`, `body-sm`, `caption` |
| **Transitions** | `fast: 150ms`, `normal: 200ms`, `slow: 300ms` |

### 1.2 Unify Site Buttons

Replace all raw `<button>` elements in site components with the shared `Button` component from `@garageos/ui`. This eliminates ~15 instances of duplicated button styling.

### 1.3 Align CSS Variables

Sync the site's `globals.css` with the app's more comprehensive OKLch variable set. Both should share the same `--color-*` tokens so components render identically in both apps.

---

## Phase 2: Component Library Expansion (Week 2-4)

### 2.1 New Core Components

| Component | Priority | Use Case |
|---|---|---|
| **Dialog/Modal** | High | Contact form, confirmations, detail views |
| **Tooltip** | High | Icon buttons, truncated text, info hints |
| **Breadcrumb** | High | Dashboard navigation hierarchy |
| **DataTable** | High | Customers, inventory, invoices lists |
| **Pagination** | High | All list views |
| **Skeleton** | High | Loading states for cards, tables, forms |
| **Popover** | Medium | Filters, quick actions |
| **Accordion** | Medium | FAQ, settings groups |
| **Command Palette** | Medium | Quick navigation (Cmd+K) |
| **Alert** | Low | Inline notifications, warnings |

### 2.2 Compound Component Variants

Extend existing components with purpose-built variants:

- **Card.Stat** - Dashboard stat cards with icon, value, label, trend indicator
- **Card.Feature** - Feature showcase cards (currently inline in site)
- **Card.Pricing** - Pricing tier cards with popular highlight
- **Button** - Add `loading` prop with built-in spinner state
- **Input** - Add `error`, `hint`, `startIcon`, `endIcon` props
- **Badge** - Add `dot` variant for status indicators

### 2.3 Form System

Build a `FormField` wrapper that composes Label + Input + error message + hint text:

```tsx
<FormField label="Shop Name" error={errors.shopName} required>
  <Input placeholder="Bangkok Auto Repair" {...register('shopName')} />
</FormField>
```

---

## Phase 3: Micro-Interactions & Animation (Week 4-5)

### 3.1 Page Transitions

Add subtle fade-in on route changes using Next.js layout transitions:
- Dashboard pages: slide-up fade-in (200ms)
- Auth pages: crossfade (300ms)
- Site sections: scroll-triggered entrance (staggered children)

### 3.2 Loading States

| Location | Pattern |
|---|---|
| Dashboard page load | Skeleton cards matching stat card layout |
| Table data fetch | Skeleton rows with shimmer animation |
| Button submit | Spinner replaces label, button disabled |
| Image loading | Blur placeholder (Next.js `placeholder="blur"`) |
| Full page load | Branded spinner (wrench icon rotating) |

### 3.3 Scroll Animations (Site)

Add intersection-observer-based entrance animations to site sections:
- Hero: fade-in + slide-up (title), scale-in (image)
- Features: staggered card entrance (50ms delay each)
- Pricing: slide-up with spring easing
- CTA: background parallax on scroll

Implementation: Use `framer-motion` (already in app deps) or lightweight `motion` library.

### 3.4 Hover & Focus Polish

- All interactive elements: consistent `ring-2 ring-blue-500/50 ring-offset-2` focus style
- Sidebar nav items: smooth background color transition (not instant)
- Cards: subtle shadow depth change on hover (not just translate)
- Buttons: slight scale (1.02) on press (active state)

---

## Phase 4: Dashboard UI Overhaul (Week 5-7)

### 4.1 Sidebar Redesign

Current sidebar is functional but basic. Proposed improvements:
- **Grouped navigation** with collapsible sections (Operations, Finance, Settings)
- **Badge counters** on nav items (e.g., "3" on Messages, "5" on pending Job Cards)
- **Quick actions** at top of sidebar (New Job Card, New Customer)
- **Search bar** in sidebar for fast navigation
- **Smooth collapse animation** (not instant width change)

### 4.2 Dashboard Home

Redesign the main dashboard as a command center:
- **Today's overview** strip: jobs in progress, pending approvals, revenue today
- **Activity timeline** replacing static cards
- **Quick action grid**: most-used actions as icon tiles
- **Chart cards**: revenue trend (7d), job completion rate, customer satisfaction

### 4.3 Data Table Component

Build a reusable, sortable, filterable data table for:
- Customers list, Inventory list, Invoices list, Job Cards list
- Column sorting (click header)
- Inline search/filter
- Row selection with bulk actions
- Responsive: collapses to card list on mobile

### 4.4 Mobile Dashboard

- Bottom tab navigation instead of hamburger menu
- Swipe gestures between dashboard sections
- Pull-to-refresh on data lists
- Floating action button (FAB) for primary action per page

---

## Phase 5: Visual Polish & Consistency (Week 7-8)

### 5.1 Iconography

Standardize icon usage:
- **Navigation**: outlined style (current Lucide)
- **Status indicators**: filled/solid style
- **Feature showcase**: duotone or colored backgrounds
- Consider custom icon set for brand-specific concepts (job card, inspection, etc.)

### 5.2 Illustration System

Add lightweight illustrations to:
- Empty states (no customers yet, no job cards, etc.)
- Onboarding flow (step illustrations)
- Error pages (404, 500)
- Success states (shop created, invoice sent)

Options: Use open-source illustration packs (unDraw, Storyset) or commission custom SVGs matching the blue brand.

### 5.3 Color Palette Refinement

Current palette is blue-dominant. Proposal:
- **Primary**: Blue 600 (keep)
- **Secondary**: Slate 600 (keep)
- **Success**: Emerald 500 (slightly warmer)
- **Warning**: Amber 500 (keep)
- **Danger**: Rose 500 (instead of Red - more modern)
- **Info**: Sky 500 (new - distinguish from primary)
- **Surface accents**: Use subtle colored backgrounds for different dashboard sections (blue tint for jobs, green tint for finance, purple tint for analytics)

### 5.4 Dark Mode Refinement

- Use `gray-950` as base (deeper than current `gray-900`)
- Add subtle colored surface tints in dark mode (not pure gray)
- Ensure all shadows are visible in dark mode (use colored shadows)
- Card borders: `gray-800` not `gray-700` (too prominent currently)

---

## Phase 6: Accessibility & Performance (Week 8-9)

### 6.1 Accessibility (WCAG 2.1 AA)

| Area | Action |
|---|---|
| **Focus management** | Visible focus rings on all interactive elements |
| **Skip navigation** | "Skip to content" link on all pages |
| **ARIA labels** | Label all icon-only buttons, form fields, regions |
| **Color contrast** | Audit all text/background combinations (4.5:1 minimum) |
| **Keyboard navigation** | Tab order, arrow keys in menus, Escape to close |
| **Screen reader** | Live regions for toasts, loading states, form errors |
| **Reduced motion** | Respect `prefers-reduced-motion` for all animations |

### 6.2 Performance

- **Image optimization**: Convert Unsplash URLs to Next.js `<Image>` with `sizes` and `priority`
- **Font subsetting**: Only load Latin + Thai character subsets
- **CSS purging**: Ensure unused Tailwind classes are tree-shaken
- **Component lazy loading**: Dynamic imports for heavy dashboard components
- **Skeleton-first rendering**: Show layout immediately, hydrate data

---

## Implementation Priority Matrix

```
                    HIGH IMPACT
                        |
   Phase 1 (Tokens)     |     Phase 3 (Animations)
   Phase 2.2 (Variants) |     Phase 4.2 (Dashboard Home)
                        |
  LOW EFFORT -----------+----------- HIGH EFFORT
                        |
   Phase 1.2 (Buttons)  |     Phase 4.3 (DataTable)
   Phase 5.4 (Dark)     |     Phase 6.1 (Accessibility)
                        |
                    LOW IMPACT
```

**Recommended order:**
1. Phase 1 (Foundation) - unblocks everything else
2. Phase 2.1-2.2 (Components) - most reuse value
3. Phase 3.1-3.2 (Loading/Transitions) - biggest perceived quality jump
4. Phase 4 (Dashboard) - core product experience
5. Phase 5 (Polish) - refinement
6. Phase 6 (A11y/Perf) - production readiness

---

## Success Metrics

| Metric | Current | Target |
|---|---|---|
| Lighthouse Performance (site) | ~75 | 95+ |
| Lighthouse Accessibility | ~80 | 95+ |
| Shared UI components used | ~60% | 95% |
| Dark mode coverage | ~90% | 100% |
| Mobile responsiveness | Good | Excellent |
| Page load (site, 3G) | ~3s | <1.5s |
| Time to interactive (app) | ~2s | <1s |
