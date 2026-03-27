import { describe, it, expect } from 'vitest';
import { spacing, radius, shadows, typography, transitions, zIndex, colors } from './tokens';

describe('Design Tokens', () => {
  it('has spacing scale', () => {
    expect(spacing.xs).toBe('0.25rem');
    expect(spacing.md).toBe('1rem');
    expect(spacing.xl).toBe('2rem');
  });

  it('has radius scale', () => {
    expect(radius.sm).toBe('0.375rem');
    expect(radius.full).toBe('9999px');
  });

  it('has shadows', () => {
    expect(shadows.sm).toContain('rgb(0 0 0');
    expect(shadows.none).toBe('none');
  });

  it('has typography scale', () => {
    expect(typography.h1.size).toBe('2.25rem');
    expect(typography.body.weight).toBe('400');
  });

  it('has transitions', () => {
    expect(transitions.fast).toContain('150ms');
    expect(transitions.slow).toContain('300ms');
  });

  it('has z-index scale', () => {
    expect(zIndex.modal).toBe(50);
    expect(zIndex.toast).toBe(100);
  });

  it('has brand colors', () => {
    expect(colors.brand.primary).toBe('#2563eb');
  });
});
