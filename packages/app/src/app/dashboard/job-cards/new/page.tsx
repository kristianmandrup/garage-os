'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  NewJobCardHeader,
  ProgressSteps,
  CustomerSelection,
  VehicleSelection,
  JobDetailsForm,
} from '@/components/job-card';

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  customer: { name: string; phone: string };
}

interface Customer {
  id: string;
  name: string;
  phone: string;
}

export default function NewJobCardPage() {
  const router = useRouter();
  const [step, setStep] = useState<'customer' | 'vehicle' | 'details'>('customer');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimated_cost: '',
    estimated_hours: '',
    scheduled_date: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomerId) {
      fetchVehicles(selectedCustomerId);
    }
  }, [selectedCustomerId]);

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

  const fetchVehicles = async (customerId: string) => {
    try {
      const response = await fetch(`/api/vehicles?customer_id=${customerId}`);
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const handleCreateJobCard = async () => {
    if (!selectedVehicleId || !formData.title) return;

    setSaving(true);
    try {
      const response = await fetch('/api/job-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: selectedVehicleId,
          customer_id: selectedCustomerId,
          title: formData.title,
          description: formData.description,
          estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
          estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
          scheduled_date: formData.scheduled_date || null,
        }),
      });

      if (response.ok) {
        const jobCard = await response.json();
        router.push(`/dashboard/job-cards/${jobCard.id}`);
      }
    } catch (error) {
      console.error('Failed to create job card:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <NewJobCardHeader />
      <ProgressSteps currentStep={step} />

      {step === 'customer' && (
        <CustomerSelection
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectCustomer={(id) => {
            setSelectedCustomerId(id);
            setStep('vehicle');
          }}
        />
      )}

      {step === 'vehicle' && (
        <VehicleSelection
          vehicles={vehicles}
          selectedCustomer={selectedCustomer || null}
          selectedVehicleId={selectedVehicleId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectVehicle={(id) => {
            setSelectedVehicleId(id);
            setStep('details');
          }}
          onChangeCustomer={() => {
            setStep('customer');
            setSelectedVehicleId('');
          }}
        />
      )}

      {step === 'details' && (
        <JobDetailsForm
          vehicle={selectedVehicle || null}
          formData={formData}
          saving={saving}
          onFormChange={handleFormChange}
          onBack={() => setStep('vehicle')}
          onSubmit={handleCreateJobCard}
        />
      )}
    </div>
  );
}
