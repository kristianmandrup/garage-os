import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    const { getByTestId } = render(<Button>Click me</Button>);
    expect(getByTestId('button')).toBeTruthy();
    expect(getByTestId('button').textContent).toBe('Click me');
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    const { getByTestId } = render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(getByTestId('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('shows loading spinner and disables button', () => {
    const { getByTestId } = render(<Button loading>Submit</Button>);
    const btn = getByTestId('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    // Loader2 icon should be present (has animate-spin class)
    expect(btn.innerHTML).toContain('animate-spin');
  });

  it('applies variant classes', () => {
    const { getByTestId } = render(<Button variant="destructive">Delete</Button>);
    expect(getByTestId('button').className).toContain('destructive');
  });

  it('applies size classes', () => {
    const { getByTestId } = render(<Button size="lg">Large</Button>);
    expect(getByTestId('button').className).toContain('h-11');
  });

  it('can be disabled', () => {
    const onClick = vi.fn();
    const { getByTestId } = render(<Button disabled onClick={onClick}>Disabled</Button>);
    fireEvent.click(getByTestId('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
