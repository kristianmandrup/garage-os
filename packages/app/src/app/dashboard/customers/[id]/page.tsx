'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@garageos/ui/breadcrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@garageos/ui/dialog';
import { Button } from '@garageos/ui/button';
import {
  CustomerHeader,
  CustomerContactCard,
  CustomerVehiclesCard,
  CustomerLoadingState,
  CustomerNotFoundState,
} from '@/components/customer';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  vehicles: Array<{
    id: string;
    license_plate: string;
    brand: string;
    model: string;
    year: number;
  }>;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    fetchCustomer();
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          notes: data.notes || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!customer) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/customers/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          address: formData.address || null,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        setEditing(false);
        fetchCustomer();
      }
    } catch (error) {
      console.error('Failed to update customer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    setDeleteDialogOpen(false);
    try {
      const response = await fetch(`/api/customers/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/customers');
      }
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  if (loading) {
    return <CustomerLoadingState />;
  }

  if (!customer) {
    return <CustomerNotFoundState />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/dashboard/customers">Customers</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Customer Details</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CustomerHeader
        customer={customer}
        editing={editing}
        onEdit={() => setEditing(true)}
        onDelete={handleDeleteClick}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CustomerContactCard
          customer={customer}
          editing={editing}
          saving={saving}
          formData={formData}
          onFormChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />

        <CustomerVehiclesCard
          customerId={customer.id}
          vehicles={customer.vehicles || []}
        />
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
