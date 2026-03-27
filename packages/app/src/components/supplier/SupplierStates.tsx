'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n';

export function SupplierLoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

export function SupplierNotFoundState() {
  const t = useTranslation();
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold">{t.supplier.supplierNotFound}</h2>
      <Link href="/dashboard/suppliers" className="text-primary hover:underline mt-4 inline-block">
        {t.supplier.backToSuppliers}
      </Link>
    </div>
  );
}
