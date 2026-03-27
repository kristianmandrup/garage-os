'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VehicleDetailHeader } from '@/components/vehicle/VehicleDetailHeader';
import { VehicleDetailsCard } from '@/components/vehicle/VehicleDetailsCard';
import { VehicleOwnerCard } from '@/components/vehicle/VehicleOwnerCard';
import { VehicleLoadingState, VehicleNotFoundState } from '@/components/vehicle/VehicleStates';

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  vin: string | null;
  color: string | null;
  mileage: number | null;
  fuel_type: string | null;
  transmission: string | null;
  created_at: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
}

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
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
    fetchVehicle();
  }, [params.id]);

  const fetchVehicle = async () => {
    try {
      const response = await fetch(`/api/vehicles/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setVehicle(data);
        setFormData({
          license_plate: data.license_plate || '',
          brand: data.brand || '',
          model: data.model || '',
          year: data.year?.toString() || '',
          vin: data.vin || '',
          color: data.color || '',
          mileage: data.mileage?.toString() || '',
          fuel_type: data.fuel_type || '',
          transmission: data.transmission || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!vehicle) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/vehicles/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        setEditing(false);
        fetchVehicle();
      }
    } catch (error) {
      console.error('Failed to update vehicle:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      const response = await fetch(`/api/vehicles/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/vehicles');
      }
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    }
  };

  if (loading) {
    return <VehicleLoadingState />;
  }

  if (!vehicle) {
    return <VehicleNotFoundState />;
  }

  return (
    <div className="space-y-6">
      <VehicleDetailHeader
        vehicle={vehicle}
        editing={editing}
        onEdit={() => setEditing(true)}
        onDelete={handleDelete}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <VehicleDetailsCard
          vehicle={vehicle}
          editing={editing}
          formData={formData}
          saving={saving}
          onFormChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />

        <VehicleOwnerCard customer={vehicle.customer} />
      </div>
    </div>
  );
}
