# GarageOS App Design Fix Proposal

## Current Problems

1. **Invisible Text (Zinc on White)**
   - `muted-foreground: oklch(0.5 0 0)` is ~50% gray on ~99% white background
   - Contrast ratio ~2:1, far below WCAG AA requirement of 4.5:1

2. **Blue-Tinted Dark Mode**
   - Uses `oklch(0.12 0.02 240)` - a dark blue
   - Site uses proper `gray-900` (#111827) for dark backgrounds
   - Creates jarring color shift when toggling themes

3. **Missing Visual Elements**
   - No hero/feature images like the site has
   - Cards lack proper shadows and hover states
   - No gradient accents or glassmorphism

4. **Inconsistent Typography**
   - Using Inter for body but display font not consistently applied
   - Font weights not optimized for readability

## Proposed Solution

### 1. Fix Color Palette in `globals.css`

Replace the oklch-based colors with proper gray-scale values:

```css
/* Light Mode - Proper Contrast */
--muted: oklch(0.96 0 0);           /* gray-50 equivalent */
--muted-foreground: oklch(0.4 0 0); /* gray-600 - readable on white */
--foreground: oklch(0.15 0 0);      /* gray-900 - high contrast */

/* Dark Mode - Proper Gray Scale */
.dark {
  --background: oklch(0.11 0 0);    /* gray-950 equivalent */
  --foreground: oklch(0.98 0 0);    /* white */
  --muted: oklch(0.18 0 0);         /* gray-800 */
  --muted-foreground: oklch(0.65 0 0); /* gray-400 - readable on dark */
}
```

### 2. Add Hero Images to Key Pages

- Login page: Add Unsplash garage/auto repair hero image
- Dashboard: Add subtle background texture or pattern
- Feature highlights on dashboard cards

### 3. Update Card Styling

```css
.card {
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.dark .card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
```

### 4. Add Gradient Accent to Primary Actions

Keep the blue gradient for primary buttons but ensure text is always white.

## Implementation Plan

### Phase 1: CSS Fixes (Quick Wins)
- [ ] Fix `muted-foreground` contrast in globals.css
- [ ] Fix dark mode colors to use proper grays
- [ ] Update `--color-primary` to a more vibrant blue

### Phase 2: Component Updates
- [ ] Update Card component with proper borders and shadows
- [ ] Add `bg-gradient` utility classes
- [ ] Update Button component with better hover states

### Phase 3: Page Enhancements
- [ ] Add hero image to login page
- [ ] Add Unsplash images to dashboard stat cards
- [ ] Update analytics page with feature images

### Phase 4: Dark Mode Polish
- [ ] Ensure all pages properly support dark mode
- [ ] Add subtle background patterns
- [ ] Ensure theme toggle works consistently

## Reference: Site Design Tokens

From `packages/site/src/components/FeaturesSection.tsx`:

```css
/* Site uses standard Tailwind gray scale */
bg-gray-50 dark:bg-gray-800      /* Card backgrounds */
bg-gray-100 dark:bg-gray-900      /* Subtle backgrounds */
text-gray-900 dark:text-white      /* Primary text */
text-gray-600 dark:text-gray-400   /* Secondary text */
border-gray-200 dark:border-gray-700 /* Borders */
```

## Success Criteria

- [ ] All text meets WCAG AA contrast ratio (4.5:1)
- [ ] Dark mode uses proper gray-scale colors (no blue tint)
- [ ] Theme toggle works without flash or layout shift
- [ ] Login page matches site's visual quality
- [ ] Dashboard cards have proper shadows and hover states
