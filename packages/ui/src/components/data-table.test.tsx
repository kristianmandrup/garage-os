import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { DataTable, type Column } from './data-table';

interface TestItem {
  id: string;
  name: string;
  value: number;
}

const columns: Column<TestItem>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'value', header: 'Value', sortable: true },
];

const data: TestItem[] = [
  { id: '1', name: 'Alpha', value: 30 },
  { id: '2', name: 'Beta', value: 10 },
  { id: '3', name: 'Charlie', value: 20 },
];

describe('DataTable', () => {
  it('renders all rows', () => {
    const { getAllByTestId } = render(
      <DataTable data={data} columns={columns} getRowKey={(d) => d.id} />
    );
    const rows = getAllByTestId('data-table-row');
    expect(rows.length).toBe(3);
  });

  it('renders column headers', () => {
    const { getAllByRole } = render(
      <DataTable data={data} columns={columns} getRowKey={(d) => d.id} />
    );
    const headers = getAllByRole('columnheader');
    expect(headers.length).toBeGreaterThanOrEqual(2);
  });

  it('shows empty message when no data', () => {
    const { getByTestId } = render(
      <DataTable data={[]} columns={columns} getRowKey={(d) => d.id} emptyMessage="Nothing here" />
    );
    expect(getByTestId('data-table-empty')).toBeTruthy();
  });

  it('filters data with search', () => {
    const { getByTestId, getAllByTestId, queryAllByTestId } = render(
      <DataTable data={data} columns={columns} getRowKey={(d) => d.id} searchable searchPlaceholder="Search..." />
    );
    const input = getByTestId('data-table-search');
    fireEvent.change(input, { target: { value: 'Beta' } });
    const rows = getAllByTestId('data-table-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Beta');
  });

  it('calls onRowClick', () => {
    const onClick = vi.fn();
    const { getAllByTestId } = render(
      <DataTable data={data} columns={columns} getRowKey={(d) => d.id} onRowClick={onClick} />
    );
    const rows = getAllByTestId('data-table-row');
    fireEvent.click(rows[0]);
    expect(onClick).toHaveBeenCalledWith(data[0]);
  });

  it('sorts by column when clicked', () => {
    const { getAllByRole, getAllByTestId } = render(
      <DataTable data={data} columns={columns} getRowKey={(d) => d.id} />
    );
    // Click Name header to sort
    const headers = getAllByRole('columnheader');
    fireEvent.click(headers[0]);
    const rows = getAllByTestId('data-table-row');
    // First data row should be Alpha (ascending)
    expect(rows[0].textContent).toContain('Alpha');
  });

  it('paginates with default page size', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: String(i),
      name: `Item ${i}`,
      value: i,
    }));
    const { getAllByTestId } = render(
      <DataTable data={largeData} columns={columns} getRowKey={(d) => d.id} />
    );
    // Default page size is 10
    const rows = getAllByTestId('data-table-row');
    expect(rows.length).toBe(10);
  });
});
