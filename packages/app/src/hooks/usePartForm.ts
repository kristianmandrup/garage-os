'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Supplier {
  id: string;
  name: string;
}

export interface PartFormData {
  name: string;
  part_number: string;
  category: string;
  brand: string;
  supplier_id: string;
  cost_price: string;
  sell_price: string;
  quantity: string;
  min_quantity: string;
}

export function usePartForm() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PartFormData>({
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

  return { formData, setFormData, suppliers, loading, saving, handleCreatePart };
}
