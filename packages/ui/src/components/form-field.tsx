import * as React from 'react';
import { cn } from '../utils';
import { Label } from './label';

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

function FormField({ label, error, hint, required, className, children, htmlFor }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)} data-testid="form-field">
      <Label htmlFor={htmlFor} className={cn('text-sm font-medium', error && 'text-destructive')}>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1" data-testid="form-field-error">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground mt-1" data-testid="form-field-hint">{hint}</p>}
    </div>
  );
}

export { FormField };
export type { FormFieldProps };
