import * as React from 'react';
import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('animate-spin text-muted-foreground', className)}
        {...props}
      >
        <Loader2 className={cn(sizeClasses[size])} />
      </div>
    );
  }
);
Spinner.displayName = 'Spinner';

export { Spinner };
