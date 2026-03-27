import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../utils';

function Breadcrumb({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <nav aria-label="breadcrumb" className={cn('flex', className)} {...props} />;
}

function BreadcrumbList({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol className={cn('flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground', className)} {...props} />
  );
}

function BreadcrumbItem({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
}

function BreadcrumbLink({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn('transition-colors hover:text-foreground font-medium', className)} {...props} />
  );
}

function BreadcrumbPage({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span role="link" aria-current="page" className={cn('font-medium text-foreground', className)} {...props} />
  );
}

function BreadcrumbSeparator({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span role="presentation" aria-hidden="true" className={cn('text-muted-foreground', className)} {...props}>
      {props.children ?? <ChevronRight className="h-3.5 w-3.5" />}
    </span>
  );
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator };
