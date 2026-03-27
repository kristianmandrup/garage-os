'use client';

import Link from 'next/link';

export function CustomerLoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

export function CustomerNotFoundState() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold">Customer not found</h2>
      <Link href="/dashboard/customers" className="text-primary hover:underline mt-4 inline-block">
        Back to customers
      </Link>
    </div>
  );
}
