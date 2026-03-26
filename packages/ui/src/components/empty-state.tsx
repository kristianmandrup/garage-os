import * as React from 'react';
import { cn } from '@/utils';
import { Button } from './button';
import { LucideIcon, PackageOpen, FileText, Users, Wrench } from 'lucide-react';

type EmptyStateVariant = 'default' | 'jobs' | 'vehicles' | 'parts' | 'customers';

const variantIcons: Record<EmptyStateVariant, LucideIcon> = {
  default: PackageOpen,
  jobs: FileText,
  vehicles: Wrench,
  parts: PackageOpen,
  customers: Users,
};

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, variant = 'default', title, description, action, ...props }, ref) => {
    const Icon = variantIcons[variant];

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}
        {...props}
      >
        <div className="rounded-full bg-muted p-4 mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
        {action && (
          <Button onClick={action.onClick}>{action.label}</Button>
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
