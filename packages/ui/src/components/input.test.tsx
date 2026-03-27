import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Input } from './input';
import { Search, Eye } from 'lucide-react';

describe('Input', () => {
  it('renders a text input', () => {
    const { container } = render(<Input placeholder="Enter text" />);
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input?.placeholder).toBe('Enter text');
  });

  it('handles value changes', () => {
    const onChange = vi.fn();
    const { container } = render(<Input onChange={onChange} />);
    const input = container.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('renders with start icon', () => {
    const { container } = render(<Input startIcon={Search} />);
    // Should have a wrapper div with the icon
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.className).toContain('relative');
    // Input should have left padding
    const input = container.querySelector('input');
    expect(input?.className).toContain('pl-10');
  });

  it('renders with end icon', () => {
    const { container } = render(<Input endIcon={Eye} />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('pr-10');
  });

  it('applies error styling', () => {
    const { container } = render(<Input error />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('destructive');
  });

  it('accepts custom className', () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('custom-class');
  });
});
