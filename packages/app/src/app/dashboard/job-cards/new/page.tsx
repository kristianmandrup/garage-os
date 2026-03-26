'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Car, User } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Textarea } from '@garageos/ui/textarea';
import { cn } from '@garageos/ui/utils';

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

  // Selected values
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  // Form data
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

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/job-cards">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Job Card</h1>
          <p className="text-muted-foreground">Create a new repair job</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {['customer', 'vehicle', 'details'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                step === s
                  ? 'bg-primary text-primary-foreground'
                  : i < ['customer', 'vehicle', 'details'].indexOf(step)
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {i + 1}
            </div>
            {i < 2 && (
              <div
                className={cn(
                  'w-16 h-0.5 mx-2',
                  i < ['customer', 'vehicle', 'details'].indexOf(step)
                    ? 'bg-primary'
                    : 'bg-muted'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Customer */}
      {step === 'customer' && (
        <Card>
          <CardHeader>
            <CardTitle>Select Customer</CardTitle>
            <CardDescription>
              Choose the customer for this job card
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomerId(customer.id);
                    setStep('vehicle');
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                    selectedCustomerId === customer.id
                      ? 'bg-primary/10 border border-primary'
                      : 'hover:bg-muted'
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                </button>
              ))}
              {filteredCustomers.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">
                  No customers found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Vehicle */}
      {step === 'vehicle' && (
        <Card>
          <CardHeader>
            <CardTitle>Select Vehicle</CardTitle>
            <CardDescription>
              {selectedCustomer && `Vehicles for ${selectedCustomer.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCustomer && (
              <Button
                variant="ghost"
                onClick={() => {
                  setStep('customer');
                  setSelectedVehicleId('');
                }}
                className="text-muted-foreground"
              >
                Change customer
              </Button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredVehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => {
                    setSelectedVehicleId(vehicle.id);
                    setStep('details');
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                    selectedVehicleId === vehicle.id
                      ? 'bg-primary/10 border border-primary'
                      : 'hover:bg-muted'
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.license_plate}</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </p>
                  </div>
                </button>
              ))}
              {filteredVehicles.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No vehicles found for this customer
                  </p>
                  <Link href="/dashboard/vehicles/new">
                    <Button>Add Vehicle</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Job Details */}
      {step === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Enter the details for this repair job
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedVehicle && (
              <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                <Car className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{selectedVehicle.license_plate}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setStep('vehicle')}
                >
                  Change
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Oil change and inspection"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the work to be done..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimated_cost">Estimated Cost (฿)</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  value={formData.estimated_cost}
                  onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_hours">Estimated Hours</Label>
                <Input
                  id="estimated_hours"
                  type="number"
                  value={formData.estimated_hours}
                  onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Scheduled Date</Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep('vehicle')}
                disabled={saving}
              >
                Back
              </Button>
              <Button
                onClick={handleCreateJobCard}
                disabled={saving || !formData.title}
                className="flex-1 btn-gradient"
              >
                {saving ? 'Creating...' : 'Create Job Card'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
