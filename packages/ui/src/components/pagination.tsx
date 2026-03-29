import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav aria-label="pagination" className={cn('flex items-center justify-center gap-1', className)} data-testid="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
        aria-label="Previous page"
        data-testid="pagination-prev"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {getPageNumbers().map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-background hover:bg-accent hover:text-accent-foreground'
            )}
            aria-current={page === currentPage ? 'page' : undefined}
            data-testid={`pagination-page-${page}`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
        aria-label="Next page"
        data-testid="pagination-next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

export { Pagination };
export type { PaginationProps };
