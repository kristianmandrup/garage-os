'use client';

import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2, Truck } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { useTranslation } from '@/i18n';

interface Supplier {
  name: string;
  contact_person: string | null;
}

interface SupplierHeaderProps {
  supplier: Supplier;
  editing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function SupplierHeader({ supplier, editing, onEdit, onDelete }: SupplierHeaderProps) {
  const t = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/suppliers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{supplier.name}</h1>
            {supplier.contact_person && (
              <p className="text-muted-foreground">{supplier.contact_person}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {!editing && (
          <>
            <Button variant="outline" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              {t.supplier.edit}
            </Button>
            <Button variant="destructive" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
