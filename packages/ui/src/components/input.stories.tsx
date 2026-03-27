import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Search, Mail, Eye } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Enter text...' } };
export const WithStartIcon: Story = { args: { placeholder: 'Search...', startIcon: Search } };
export const WithEndIcon: Story = { args: { placeholder: 'Password', type: 'password', endIcon: Eye } };
export const WithBothIcons: Story = { args: { placeholder: 'Email', startIcon: Mail, endIcon: Eye } };
export const WithError: Story = { args: { placeholder: 'Required field', error: true, value: '' } };
export const Disabled: Story = { args: { placeholder: 'Disabled', disabled: true } };
