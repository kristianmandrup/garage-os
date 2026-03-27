import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './empty-state';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'jobs', 'vehicles', 'parts', 'customers', 'search', 'inbox', 'analytics'],
    },
    compact: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: { title: 'No items found', description: 'Try adjusting your search or filters.' },
};

export const WithAction: Story = {
  args: {
    title: 'No customers yet',
    description: 'Add your first customer to get started.',
    variant: 'customers',
    action: { label: 'Add Customer', onClick: () => alert('clicked') },
  },
};

export const Compact: Story = {
  args: { title: 'No results', description: 'Try a different search.', variant: 'search', compact: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(['default', 'jobs', 'vehicles', 'parts', 'customers', 'search', 'inbox', 'analytics'] as const).map(v => (
        <EmptyState key={v} title={`${v} variant`} variant={v} compact />
      ))}
    </div>
  ),
};
