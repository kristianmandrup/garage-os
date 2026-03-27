'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Button } from '@garageos/ui/button';
import { useTranslation, useLocale, formatDateOnly } from '@/i18n';

const CATEGORIES = [
  'Engine', 'Brake', 'Suspension', 'Electrical', 'Transmission',
  'Body', 'Exhaust', 'Cooling', 'Filters', 'Wheels & Tires',
  'Interior', 'Exterior', 'Fluids', 'Other',
];

interface Supplier {
  id: string;
  name: string;
}

interface PartDetailsCardProps {
  part: {
    brand: string | null;
    supplier: { name: string } | null;
    created_at: string;
  };
  editing: boolean;
  formData: {
    name: string;
    part_number: string;
    category: string;
    brand: string;
    supplier_id: string;
  };
  suppliers: Supplier[];
  saving: boolean;
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function PartDetailsCard({
  part,
  editing,
  formData,
  suppliers,
  saving,
  onFormChange,
  onSave,
  onCancel,
}: PartDetailsCardProps) {
  const t = useTranslation();
  const { locale } = useLocale();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Part Details</CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Part Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => onFormChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Part Number</Label>
                <Input
                  value={formData.part_number}
                  onChange={(e) => onFormChange('part_number', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <select
                  value={formData.category}
                  onChange={(e) => onFormChange('category', e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) => onFormChange('brand', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Supplier</Label>
              <select
                value={formData.supplier_id}
                onChange={(e) => onFormChange('supplier_id', e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>{sup.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={onSave} disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Brand</p>
                <p className="font-medium">{part.brand || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supplier</p>
                <p className="font-medium">{part.supplier?.name || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Added On</p>
              <p className="font-medium">{formatDateOnly(new Date(part.created_at), locale)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
