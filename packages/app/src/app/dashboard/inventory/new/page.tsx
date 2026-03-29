'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { useTranslation } from '@/i18n';

interface Supplier {
  id: string;
  name: string;
}

const CATEGORIES = [
  'Engine',
  'Brake',
  'Suspension',
  'Electrical',
  'Transmission',
  'Body',
  'Exhaust',
  'Cooling',
  'Filters',
  'Wheels & Tires',
  'Interior',
  'Exterior',
  'Fluids',
  'Other',
];

export default function NewPartPage() {
  const t = useTranslation();
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    part_number: '',
    category: '',
    brand: '',
    supplier_id: '',
    cost_price: '',
    sell_price: '',
    quantity: '0',
    min_quantity: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const handleCreatePart = async () => {
    if (!formData.name || !formData.category) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          part_number: formData.part_number || null,
          category: formData.category,
          brand: formData.brand || null,
          supplier_id: formData.supplier_id || null,
          cost_price: parseFloat(formData.cost_price) || 0,
          sell_price: parseFloat(formData.sell_price) || 0,
          quantity: parseInt(formData.quantity) || 0,
          min_quantity: formData.min_quantity ? parseInt(formData.min_quantity) : null,
        }),
      });

      if (response.ok) {
        const part = await response.json();
        router.push(`/dashboard/inventory/${part.id}`);
      }
    } catch (error) {
      console.error('Failed to create part:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.inventory.form.title}</h1>
          <p className="text-muted-foreground">
            {t.inventory.form.description}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.inventory.form.partInformation}</CardTitle>
          <CardDescription>
            {t.inventory.form.partInformationDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">{t.inventory.form.partName} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Brake Pad Set"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="part_number">{t.inventory.form.partNumber}</Label>
              <Input
                id="part_number"
                value={formData.part_number}
                onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                placeholder="e.g., BP-12345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">{t.inventory.form.brand}</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g., Bosch"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="category">{t.inventory.form.category} *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">{t.inventory.form.selectCategory}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="supplier">{t.inventory.form.supplier}</Label>
              <select
                id="supplier"
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sell_price">{t.inventory.form.sellPrice} (฿)</Label>
                <Input
                  id="sell_price"
                  type="number"
                  value={formData.sell_price}
                  onChange={(e) => setFormData({ ...formData, sell_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">{t.inventory.form.currentStock}</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_quantity">{t.inventory.form.minStockAlert}</Label>
                <Input
                  id="min_quantity"
                  type="number"
                  value={formData.min_quantity}
                  onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
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
              onClick={handleCreatePart}
              disabled={saving || !formData.name || !formData.category}
              className="flex-1 btn-gradient"
            >
              {saving ? t.inventory.form.creating : t.inventory.form.addPart}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
