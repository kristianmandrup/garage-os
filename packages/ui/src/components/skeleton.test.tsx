import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { getByTestId } = render(<Skeleton />);
    const el = getByTestId('skeleton');
    expect(el.className).toContain('animate-pulse');
    expect(el.className).toContain('rounded-md');
    expect(el.className).toContain('bg-muted');
  });

  it('accepts custom className', () => {
    const { getByTestId } = render(<Skeleton className="h-8 w-32" />);
    const el = getByTestId('skeleton');
    expect(el.className).toContain('h-8');
    expect(el.className).toContain('w-32');
  });
});
