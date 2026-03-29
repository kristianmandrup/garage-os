'use client';

import * as React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download } from 'lucide-react';
import { cn } from '../utils';
import { Pagination } from './pagination';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
  getRowKey: (item: T) => string;
  pageSize?: number;
  exportable?: boolean;
  exportFilename?: string;
}

type SortDir = 'asc' | 'desc' | null;

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = 'Search...',
  onRowClick,
  emptyMessage = 'No data found',
  className,
  getRowKey,
  pageSize = 10,
  exportable = false,
  exportFilename = 'export',
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState('');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc');
      if (sortDir === 'desc') setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = React.useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        columns.some((col) => {
          const val = item[col.key];
          return val != null && String(val).toLowerCase().includes(q);
        })
      );
    }
    if (sortKey && sortDir) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, sortKey, sortDir, columns]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const startItem = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, filtered.length);

  const exportCSV = () => {
    const headers = columns.map(c => c.header).join(',');
    const rows = filtered.map(item =>
      columns.map(col => {
        const val = item[col.key];
        const str = val == null ? '' : String(val);
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportFilename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {(searchable || exportable) && (
        <div className="flex items-center gap-2">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                data-testid="data-table-search"
              />
            </div>
          )}
          {exportable && (
            <button
              onClick={exportCSV}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
              title="Export CSV"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
        </div>
      )}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm" data-testid="data-table">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'h-11 px-4 text-left font-medium text-muted-foreground',
                    col.sortable && 'cursor-pointer select-none hover:text-foreground transition-colors',
                    col.className
                  )}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key ? (
                        sortDir === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr data-testid="data-table-empty">
                <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr
                  key={getRowKey(item)}
                  className={cn(
                    'border-b border-border last:border-0 transition-colors hover:bg-muted/50',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  data-testid="data-table-row"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3', col.className)}>
                      {col.render ? col.render(item) : (item[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startItem}-{endItem} of {filtered.length} results
          </p>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
    </div>
  );
}

export { DataTable };
export type { DataTableProps, Column };
