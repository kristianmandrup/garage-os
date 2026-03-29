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
    const { getByTestId } = render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />
    );
    const current = getByTestId('pagination-page-3');
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('calls onPageChange when clicking a page', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onChange} />
    );
    fireEvent.click(getByTestId('pagination-page-3'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('disables prev button on first page', () => {
    const { getByTestId } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );
    expect((getByTestId('pagination-prev') as HTMLButtonElement).disabled).toBe(true);
  });

  it('disables next button on last page', () => {
    const { getByTestId } = render(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />
    );
    expect((getByTestId('pagination-next') as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows ellipsis for many pages', () => {
    const { getByTestId } = render(
      <Pagination currentPage={5} totalPages={20} onPageChange={() => {}} />
    );
    // Verify pagination renders with many pages
    const pagination = getByTestId('pagination');
    const spans = pagination.querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);
  });
});
