'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  NewVehicleHeader,
  CustomerSelectorCard,
  VehicleFormCard,
} from '@/components/vehicle';

interface Customer {
  id: string;
  name: string;
  phone: string;
}

export default function NewVehiclePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [formData, setFormData] = useState({
    license_plate: '',
    brand: '',
    model: '',
    year: '',
    vin: '',
    color: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  const handleCreateVehicle = async () => {
    if (!selectedCustomerId || !formData.license_plate || !formData.brand || !formData.model) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selectedCustomerId,
          license_plate: formData.license_plate,
          brand: formData.brand,
          model: formData.model,
          year: formData.year ? parseInt(formData.year) : null,
          vin: formData.vin || null,
          color: formData.color || null,
          mileage: formData.mileage ? parseInt(formData.mileage) : null,
          fuel_type: formData.fuel_type || null,
          transmission: formData.transmission || null,
        }),
      });

      if (response.ok) {
        const vehicle = await response.json();
        router.push(`/dashboard/vehicles/${vehicle.id}`);
      }
    } catch (error) {
      console.error('Failed to create vehicle:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <NewVehicleHeader />

      {!selectedCustomerId && (
        <CustomerSelectorCard
          customers={customers}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCustomerSelect={setSelectedCustomerId}
        />
      )}

      {selectedCustomerId && (
        <VehicleFormCard
          selectedCustomer={selectedCustomer}
          formData={formData}
          saving={saving}
          onFormChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onCustomerChange={() => setSelectedCustomerId('')}
          onSubmit={handleCreateVehicle}
          onBack={() => setSelectedCustomerId('')}
        />
      )}
    </div>
  );
}
