import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './form-field';
import { Input } from './input';
import { Search } from 'lucide-react';

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: () => (
    <FormField label="Name" htmlFor="name">
      <Input id="name" placeholder="Enter your name" />
    </FormField>
  ),
};

export const Required: Story = {
  render: () => (
    <FormField label="Email" required htmlFor="email">
      <Input id="email" type="email" placeholder="you@example.com" />
    </FormField>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormField label="Password" error="Password must be at least 8 characters" htmlFor="pass">
      <Input id="pass" type="password" error />
    </FormField>
  ),
};

export const WithHint: Story = {
  render: () => (
    <FormField label="Username" hint="Only letters, numbers, and underscores" htmlFor="user">
      <Input id="user" placeholder="johndoe" />
    </FormField>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <FormField label="Search" htmlFor="search">
      <Input id="search" placeholder="Search..." startIcon={Search} />
    </FormField>
  ),
};
