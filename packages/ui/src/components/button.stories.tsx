import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Plus, Trash2, Download } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'gradient'],
    },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: 'Button' } };
export const Destructive: Story = { args: { children: 'Delete', variant: 'destructive' } };
export const Outline: Story = { args: { children: 'Outline', variant: 'outline' } };
export const Secondary: Story = { args: { children: 'Secondary', variant: 'secondary' } };
export const Ghost: Story = { args: { children: 'Ghost', variant: 'ghost' } };
export const Link: Story = { args: { children: 'Link', variant: 'link' } };
export const Gradient: Story = { args: { children: 'Gradient', variant: 'gradient' } };
export const Large: Story = { args: { children: 'Large Button', size: 'lg' } };
export const Small: Story = { args: { children: 'Small', size: 'sm' } };
export const Loading: Story = { args: { children: 'Saving...', loading: true } };
export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button><Plus className="h-4 w-4 mr-2" />Add Item</Button>
      <Button variant="destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
      <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
    </div>
  ),
};
export const IconOnly: Story = {
  render: () => (
    <Button size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
  ),
};
