'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  PartDetailHeader,
  PartDetailsCard,
  StockPricingCard,
  PartLoadingState,
  PartNotFoundState,
} from '@/components/inventory';
import { useTranslation } from '@/i18n';

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
  in_stock: { labelKey: 'inStock', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  low_stock: { labelKey: 'lowStock', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  out_of_stock: { labelKey: 'outOfStock', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  discontinued: { labelKey: 'discontinued', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400' },
};

export default function PartDetailPage() {
  const t = useTranslation();
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
    if (!confirm(t.inventory.detail.confirmDelete)) return;

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

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <PartLoadingState />;
  }

  if (!part) {
    return <PartNotFoundState />;
  }

  const statusConfig = STATUS_CONFIG[part.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.in_stock;
  const topLevel = t.inventory as Record<string, unknown>;
  const statusLabel = (typeof topLevel[statusConfig.labelKey] === 'string' ? topLevel[statusConfig.labelKey] : statusConfig.labelKey) as string;
  const stockPercent = part.min_quantity ? Math.min((part.quantity / part.min_quantity) * 100, 100) : 100;
  const margin = part.cost_price > 0 ? ((part.sell_price - part.cost_price) / part.cost_price * 100).toFixed(0) : '0';

  return (
    <div className="space-y-6">
      <PartDetailHeader
        part={part}
        statusConfig={statusConfig}
        statusLabel={statusLabel}
        editing={editing}
        onEdit={() => setEditing(true)}
        onDelete={handleDelete}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PartDetailsCard
          part={part}
          editing={editing}
          formData={formData}
          suppliers={suppliers}
          saving={saving}
          onFormChange={handleFormChange}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />

        <StockPricingCard
          part={part}
          stockPercent={stockPercent}
          margin={margin}
          editing={editing}
          formData={formData}
          saving={saving}
          onFormChange={handleFormChange}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      </div>
    </div>
  );
}
