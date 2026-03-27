import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('renders correct number of page buttons', () => {
    const { getAllByRole } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );
    // 5 page buttons + prev + next = 7
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(7);
  });

  it('highlights current page', () => {
    const { getByText } = render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />
    );
    const current = getByText('3');
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('calls onPageChange when clicking a page', () => {
    const onChange = vi.fn();
    const { getByText } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onChange} />
    );
    fireEvent.click(getByText('3'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('disables prev button on first page', () => {
    const { getByLabelText } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );
    expect((getByLabelText('Previous page') as HTMLButtonElement).disabled).toBe(true);
  });

  it('disables next button on last page', () => {
    const { getByLabelText } = render(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />
    );
    expect((getByLabelText('Next page') as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows ellipsis for many pages', () => {
    const { container } = render(
      <Pagination currentPage={5} totalPages={20} onPageChange={() => {}} />
    );
    // Ellipsis renders MoreHorizontal SVG icon; check for the span wrappers
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);
  });
});
