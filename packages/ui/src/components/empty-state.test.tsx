import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders title', () => {
    const { getByTestId } = render(<EmptyState title="No items" />);
    expect(getByTestId('empty-state')).toBeTruthy();
    expect(getByTestId('empty-state-title').textContent).toBe('No items');
  });

  it('renders description', () => {
    const { getByTestId } = render(<EmptyState title="Empty" description="Nothing here yet" />);
    expect(getByTestId('empty-state').textContent).toContain('Nothing here yet');
  });

  it('renders action button', () => {
    const onClick = vi.fn();
    const { getByTestId } = render(
      <EmptyState title="Empty" action={{ label: 'Add Item', onClick }} />
    );
    const btn = getByTestId('empty-state-action');
    expect(btn).toBeTruthy();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies variant-specific colors', () => {
    const { getByTestId } = render(<EmptyState title="No jobs" variant="jobs" />);
    expect(getByTestId('empty-state').innerHTML).toContain('blue');
  });

  it('renders compact size', () => {
    const { container } = render(<EmptyState title="Empty" compact />);
    expect(container.innerHTML).toContain('py-8');
  });

  it('renders default size', () => {
    const { container } = render(<EmptyState title="Empty" />);
    expect(container.innerHTML).toContain('py-16');
  });

  it('supports all variants without crashing', () => {
    const variants = ['default', 'jobs', 'vehicles', 'parts', 'customers', 'search', 'inbox', 'analytics'] as const;
    variants.forEach(variant => {
      const { unmount } = render(<EmptyState title="Test" variant={variant} />);
      unmount();
    });
  });
});
