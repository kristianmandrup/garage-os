import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Input } from './input';
import { Search, Eye } from 'lucide-react';

describe('Input', () => {
  it('renders a text input', () => {
    const { getByTestId } = render(<Input placeholder="Enter text" />);
    const input = getByTestId('input') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Enter text');
  });

  it('handles value changes', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(<Input onChange={onChange} />);
    fireEvent.change(getByTestId('input'), { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('renders with start icon', () => {
    const { getByTestId } = render(<Input startIcon={Search} />);
    // Should have a wrapper div with the icon
    const wrapper = getByTestId('input-wrapper');
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.className).toContain('relative');
    // Input should have left padding
    const input = getByTestId('input');
    expect(input.className).toContain('pl-10');
  });

  it('renders with end icon', () => {
    const { getByTestId } = render(<Input endIcon={Eye} />);
    const input = getByTestId('input');
    expect(input.className).toContain('pr-10');
  });

  it('applies error styling', () => {
    const { getByTestId } = render(<Input error />);
    const input = getByTestId('input');
    expect(input.className).toContain('destructive');
  });

  it('accepts custom className', () => {
    const { getByTestId } = render(<Input className="custom-class" />);
    const input = getByTestId('input');
    expect(input.className).toContain('custom-class');
  });
});
