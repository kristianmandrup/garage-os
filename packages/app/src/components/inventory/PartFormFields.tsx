'use client';

import Link from 'next/link';
import { Button } from '@garageos/ui/button';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import type { PartFormData } from '@/hooks/usePartForm';

interface Supplier {
  id: string;
  name: string;
}

interface PartFormFieldsProps {
  formData: PartFormData;
  onChange: (data: PartFormData) => void;
  suppliers: Supplier[];
  categories: string[];
  saving: boolean;
  onSubmit: () => void;
  t: Record<string, any>;
}

export function PartFormFields({ formData, onChange, suppliers, categories, saving, onSubmit, t }: PartFormFieldsProps) {
  const update = (field: keyof PartFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="name">{t.inventory.form.partName} *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g., Brake Pad Set"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="part_number">{t.inventory.form.partNumber}</Label>
          <Input
            id="part_number"
            value={formData.part_number}
            onChange={(e) => update('part_number', e.target.value)}
            placeholder="e.g., BP-12345"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">{t.inventory.form.brand}</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => update('brand', e.target.value)}
            placeholder="e.g., Bosch"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="category">{t.inventory.form.category} *</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => update('category', e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">{t.inventory.form.selectCategory}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="supplier">{t.inventory.form.supplier}</Label>
          <select
            id="supplier"
            value={formData.supplier_id}
            onChange={(e) => update('supplier_id', e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">{t.inventory.form.selectSupplier}</option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>{sup.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">{t.inventory.form.pricingAndStock}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cost_price">{t.inventory.form.costPrice} (฿)</Label>
            <Input
              id="cost_price"
              type="number"
              value={formData.cost_price}
              onChange={(e) => update('cost_price', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sell_price">{t.inventory.form.sellPrice} (฿)</Label>
            <Input
              id="sell_price"
              type="number"
              value={formData.sell_price}
              onChange={(e) => update('sell_price', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">{t.inventory.form.currentStock}</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => update('quantity', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_quantity">{t.inventory.form.minStockAlert}</Label>
            <Input
              id="min_quantity"
              type="number"
              value={formData.min_quantity}
              onChange={(e) => update('min_quantity', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Link href="/dashboard/inventory" className="flex-1">
          <Button variant="outline" className="w-full">
            {t.inventory.form.cancel}
          </Button>
        </Link>
        <Button
          onClick={onSubmit}
          disabled={saving || !formData.name || !formData.category}
          className="flex-1 btn-gradient"
        >
          {saving ? t.inventory.form.creating : t.inventory.form.addPart}
        </Button>
      </div>
    </>
  );
}
