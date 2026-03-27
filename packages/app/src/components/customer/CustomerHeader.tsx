'use client';

import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2, User } from 'lucide-react';
import { Button } from '@garageos/ui/button';

interface Customer {
  name: string;
  phone: string;
}

interface CustomerHeaderProps {
  customer: Customer;
  editing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerHeader({ customer, editing, onEdit, onDelete }: CustomerHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
            <p className="text-muted-foreground">{customer.phone}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {!editing && (
          <>
            <Button variant="outline" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
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
