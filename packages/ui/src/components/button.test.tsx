import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    const { getByText } = render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(getByText('Click'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('shows loading spinner and disables button', () => {
    const { container, getByText } = render(<Button loading>Submit</Button>);
    const btn = container.querySelector('button');
    expect(btn?.disabled).toBe(true);
    // Loader2 icon should be present (has animate-spin class)
    expect(container.innerHTML).toContain('animate-spin');
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const btn = container.querySelector('button');
    expect(btn?.className).toContain('destructive');
  });

  it('applies size classes', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const btn = container.querySelector('button');
    expect(btn?.className).toContain('h-11');
  });

  it('can be disabled', () => {
    const onClick = vi.fn();
    const { container } = render(<Button disabled onClick={onClick}>Disabled</Button>);
    const btn = container.querySelector('button')!;
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
