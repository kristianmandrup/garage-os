'use client';

import Link from 'next/link';

export function PartLoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

export function PartNotFoundState() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold">Part Not Found</h2>
      <Link href="/dashboard/inventory" className="text-primary hover:underline mt-4 inline-block">
        Back to Inventory
      </Link>
    </div>
  );
}
