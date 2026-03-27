/**
 * GarageOS Design Tokens
 * Centralized design constants for consistent UI across app and site.
 */

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

export const radius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  glow: '0 0 20px -5px rgb(37 99 235 / 0.4)',
  none: 'none',
} as const;

export const typography = {
  display: { size: '3.5rem', lineHeight: '1.1', weight: '800', tracking: '-0.02em' },
  h1: { size: '2.25rem', lineHeight: '1.2', weight: '700', tracking: '-0.02em' },
  h2: { size: '1.875rem', lineHeight: '1.25', weight: '700', tracking: '-0.01em' },
  h3: { size: '1.5rem', lineHeight: '1.3', weight: '600', tracking: '0' },
  h4: { size: '1.25rem', lineHeight: '1.4', weight: '600', tracking: '0' },
  'body-lg': { size: '1.125rem', lineHeight: '1.6', weight: '400', tracking: '0' },
  body: { size: '1rem', lineHeight: '1.6', weight: '400', tracking: '0' },
  'body-sm': { size: '0.875rem', lineHeight: '1.5', weight: '400', tracking: '0' },
  caption: { size: '0.75rem', lineHeight: '1.5', weight: '500', tracking: '0.02em' },
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const zIndex = {
  dropdown: 50,
  sticky: 40,
  overlay: 30,
  modal: 50,
  popover: 50,
  toast: 100,
} as const;

export const colors = {
  brand: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: '#dbeafe',
    primaryDark: '#1e40af',
  },
  semantic: {
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    danger: '#f43f5e',
    dangerLight: '#ffe4e6',
    info: '#0ea5e9',
    infoLight: '#e0f2fe',
  },
} as const;

export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radius;
export type Shadow = keyof typeof shadows;
export type Typography = keyof typeof typography;
export type Transition = keyof typeof transitions;
