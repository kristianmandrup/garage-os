import * as React from 'react';
import { cn } from '../utils';
import { Badge } from './badge';
import type { JobCardStatus } from '@garageos/shared/types';

type StatusConfig = {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline';
  className?: string;
};

const jobCardStatusConfig: Record<JobCardStatus, StatusConfig> = {
  inspection: { label: 'Inspection', variant: 'secondary' },
  diagnosed: { label: 'Diagnosed', variant: 'warning' },
  parts_ordered: { label: 'Parts Ordered', variant: 'outline' },
  in_progress: { label: 'In Progress', variant: 'default' },
  pending_approval: { label: 'Pending Approval', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: JobCardStatus;
  type?: 'jobCard';
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, type = 'jobCard', ...props }, ref) => {
    if (type === 'jobCard') {
      const config = jobCardStatusConfig[status];
      return (
        <Badge ref={ref} variant={config.variant} className={cn(config.className, className)} {...props}>
          {config.label}
        </Badge>
      );
    }
    return <Badge ref={ref} className={className} {...props} />;
  }
);
StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };
