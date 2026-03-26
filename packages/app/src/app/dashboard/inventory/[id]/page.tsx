'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2, Package, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Progress } from '@garageos/ui/progress';
import { cn } from '@garageos/ui/utils';

interface Part {
  id: string;
  name: string;
  part_number: string | null;
  category: string;
  brand: string | null;
  cost_price: number;
  sell_price: number;
  quantity: number;
  min_quantity: number | null;
  status: string;
  supplier: { id: string; name: string } | null;
  created_at: string;
}

const STATUS_CONFIG = {
  in_stock: { label: 'In Stock', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  low_stock: { label: 'Low Stock', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  discontinued: { label: 'Discontinued', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400' },
};

const CATEGORIES = [
  'Engine', 'Brake', 'Suspension', 'Electrical', 'Transmission',
  'Body', 'Exhaust', 'Cooling', 'Filters', 'Wheels & Tires',
  'Interior', 'Exterior', 'Fluids', 'Other',
];

export default function PartDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [part, setPart] = useState<Part | null>(null);
  const [suppliers, setSuppliers] = useState<Array<{id: string; name: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    part_number: '',
    category: '',
    brand: '',
    supplier_id: '',
    cost_price: '',
    sell_price: '',
    quantity: '',
    min_quantity: '',
  });

  useEffect(() => {
    fetchPart();
    fetchSuppliers();
  }, [params.id]);

  const fetchPart = async () => {
    try {
      const response = await fetch(`/api/parts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPart(data);
        setFormData({
          name: data.name || '',
          part_number: data.part_number || '',
          category: data.category || '',
          brand: data.brand || '',
          supplier_id: data.supplier?.id || '',
          cost_price: data.cost_price?.toString() || '',
          sell_price: data.sell_price?.toString() || '',
          quantity: data.quantity?.toString() || '',
          min_quantity: data.min_quantity?.toString() || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch part:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    if (!part) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/parts/${params.id}`, {
        method: 'PATCH',
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
        setEditing(false);
        fetchPart();
      }
    } catch (error) {
      console.error('Failed to update part:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this part?')) return;

    try {
      const response = await fetch(`/api/parts/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/inventory');
      }
    } catch (error) {
      console.error('Failed to delete part:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!part) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Part not found</h2>
        <Link href="/dashboard/inventory" className="text-primary hover:underline mt-4 inline-block">
          Back to inventory
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[part.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.in_stock;
  const stockPercent = part.min_quantity ? Math.min((part.quantity / part.min_quantity) * 100, 100) : 100;
  const margin = part.cost_price > 0 ? ((part.sell_price - part.cost_price) / part.cost_price * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${part.quantity === 0 ? 'bg-red-100 dark:bg-red-900/30' : part.status === 'low_stock' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
              <Package className={`h-6 w-6 ${part.quantity === 0 ? 'text-red-600 dark:text-red-400' : part.status === 'low_stock' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{part.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                {part.part_number && <span>#{part.part_number}</span>}
                <span>•</span>
                <span>{part.category}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
          {!editing && (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Part Details</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Part Number</Label>
                    <Input
                      value={formData.part_number}
                      onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <Input
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <select
                    value={formData.supplier_id}
                    onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((sup) => (
                      <option key={sup.id} value={sup.id}>{sup.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
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
                  <p className="font-medium">{new Date(part.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Stock & Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cost Price (฿)</Label>
                    <Input
                      type="number"
                      value={formData.cost_price}
                      onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sell Price (฿)</Label>
                    <Input
                      type="number"
                      value={formData.sell_price}
                      onChange={(e) => setFormData({ ...formData, sell_price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Stock</Label>
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Stock Alert</Label>
                    <Input
                      type="number"
                      value={formData.min_quantity}
                      onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stock Level */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Stock Level</span>
                    <span className="text-sm text-muted-foreground">
                      {part.quantity} {part.min_quantity ? `/ ${part.min_quantity}` : ''}
                    </span>
                  </div>
                  <Progress
                    value={stockPercent}
                    className={cn(
                      'h-3',
                      part.quantity === 0 ? '[&>div]:bg-red-500' :
                      stockPercent < 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'
                    )}
                  />
                  {part.status === 'low_stock' && (
                    <div className="flex items-center gap-2 mt-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Stock is running low</span>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="text-lg font-bold">฿{part.cost_price.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Sell</p>
                    <p className="text-lg font-bold">฿{part.sell_price.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <p className="text-sm text-muted-foreground">Margin</p>
                    <p className="text-lg font-bold text-emerald-600">{margin}%</p>
                  </div>
                </div>

                {/* Total Value */}
                <div className="p-4 rounded-lg bg-primary/10">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Stock Value</span>
                    <span className="text-xl font-bold">
                      ฿{(part.quantity * part.sell_price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
