import * as React from 'react';
import { cn } from '../utils';
import { Button } from './button';
import {
  LucideIcon,
  PackageOpen,
  FileText,
  Users,
  Wrench,
  Car,
  Search,
  Inbox,
  BarChart3,
} from 'lucide-react';

type EmptyStateVariant = 'default' | 'jobs' | 'vehicles' | 'parts' | 'customers' | 'search' | 'inbox' | 'analytics';

const variantConfig: Record<EmptyStateVariant, { icon: LucideIcon; color: string; bgColor: string }> = {
  default: { icon: PackageOpen, color: 'text-muted-foreground', bgColor: 'bg-muted' },
  jobs: { icon: FileText, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  vehicles: { icon: Car, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  parts: { icon: Wrench, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  customers: { icon: Users, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  search: { icon: Search, color: 'text-gray-500 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  inbox: { icon: Inbox, color: 'text-sky-600 dark:text-sky-400', bgColor: 'bg-sky-100 dark:bg-sky-900/30' },
  analytics: { icon: BarChart3, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
};

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: LucideIcon;
  compact?: boolean;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, variant = 'default', title, description, action, icon, compact = false, ...props }, ref) => {
    const config = variantConfig[variant];
    const Icon = icon || config.icon;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          compact ? 'py-8 px-4' : 'py-16 px-6',
          className
        )}
        data-testid="empty-state"
        {...props}
      >
        <div className={cn(
          'rounded-2xl flex items-center justify-center mb-4',
          compact ? 'p-3' : 'p-5',
          config.bgColor
        )}>
          <Icon className={cn(compact ? 'h-6 w-6' : 'h-10 w-10', config.color)} strokeWidth={1.5} />
        </div>
        <h3 className={cn('font-semibold mb-1', compact ? 'text-base' : 'text-lg')} data-testid="empty-state-title">{title}</h3>
        {description && (
          <p className={cn('text-muted-foreground max-w-sm', compact ? 'text-xs mb-3' : 'text-sm mb-5')}>
            {description}
          </p>
        )}
        {action && (
          <Button onClick={action.onClick} size={compact ? 'sm' : 'default'} data-testid="empty-state-action">
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
