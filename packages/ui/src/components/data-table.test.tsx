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
    const { getByText } = render(
      <DataTable data={data} columns={columns} getRowKey={(d) => d.id} />
    );
    expect(getByText('Alpha')).toBeTruthy();
    expect(getByText('Beta')).toBeTruthy();
    expect(getByText('Charlie')).toBeTruthy();
  });

  it('renders column headers', () => {
    const { getByText } = render(
      <DataTable data={data} columns={columns} getRowKey={(d) => d.id} />
    );
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('Value')).toBeTruthy();
  });

  it('shows empty message when no data', () => {
    const { getByText } = render(
      <DataTable data={[]} columns={columns} getRowKey={(d) => d.id} emptyMessage="Nothing here" />
    );
    expect(getByText('Nothing here')).toBeTruthy();
  });

  it('filters data with search', () => {
    const { getByPlaceholderText, queryByText } = render(
      <DataTable data={data} columns={columns} getRowKey={(d) => d.id} searchable searchPlaceholder="Search..." />
    );
    const input = getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'Beta' } });
    expect(queryByText('Alpha')).toBeNull();
    expect(queryByText('Beta')).toBeTruthy();
  });

  it('calls onRowClick', () => {
    const onClick = vi.fn();
    const { getByText } = render(
      <DataTable data={data} columns={columns} getRowKey={(d) => d.id} onRowClick={onClick} />
    );
    fireEvent.click(getByText('Alpha'));
    expect(onClick).toHaveBeenCalledWith(data[0]);
  });

  it('sorts by column when clicked', () => {
    const { getByText, getAllByRole } = render(
      <DataTable data={data} columns={columns} getRowKey={(d) => d.id} />
    );
    // Click Name header to sort
    fireEvent.click(getByText('Name'));
    const rows = getAllByRole('row');
    // First data row (index 1) should be Alpha (ascending)
    expect(rows[1].textContent).toContain('Alpha');
  });

  it('paginates with default page size', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: String(i),
      name: `Item ${i}`,
      value: i,
    }));
    const { queryByText } = render(
      <DataTable data={largeData} columns={columns} getRowKey={(d) => d.id} />
    );
    // Default page size is 10, so Item 0 visible, Item 15 not
    expect(queryByText('Item 0')).toBeTruthy();
    expect(queryByText('Item 15')).toBeNull();
  });
});
