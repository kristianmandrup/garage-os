'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  SupplierHeader,
  SupplierContactCard,
  SupplierStatsCard,
  SupplierLoadingState,
  SupplierNotFoundState,
} from '@/components/supplier';
import { useTranslation } from '@/i18n';

interface Supplier {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  rating: number | null;
  created_at: string;
}

export default function SupplierDetailPage() {
  const t = useTranslation();
  const params = useParams();
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    fetchSupplier();
  }, [params.id]);

  const fetchSupplier = async () => {
    try {
      const response = await fetch(`/api/suppliers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setSupplier(data);
        setRating(data.rating || 0);
        setFormData({
          name: data.name || '',
          contact_person: data.contact_person || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          notes: data.notes || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!supplier) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/suppliers/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          contact_person: formData.contact_person || null,
          phone: formData.phone || null,
          email: formData.email || null,
          address: formData.address || null,
          notes: formData.notes || null,
          rating: rating || null,
        }),
      });

      if (response.ok) {
        setEditing(false);
        fetchSupplier();
      }
    } catch (error) {
      console.error('Failed to update supplier:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t.suppliers.confirmDelete)) return;

    try {
      const response = await fetch(`/api/suppliers/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/suppliers');
      }
    } catch (error) {
      console.error('Failed to delete supplier:', error);
    }
  };

  if (loading) {
    return <SupplierLoadingState />;
  }

  if (!supplier) {
    return <SupplierNotFoundState />;
  }

  return (
    <div className="space-y-6">
      <SupplierHeader
        supplier={supplier}
        editing={editing}
        onEdit={() => setEditing(true)}
        onDelete={handleDelete}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SupplierContactCard
          supplier={supplier}
          editing={editing}
          saving={saving}
          rating={rating}
          formData={formData}
          onFormChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onRatingChange={setRating}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />

        <SupplierStatsCard />
      </div>
    </div>
  );
}
