'use client';

import Link from 'next/link';
import { Search, Car } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Input } from '@garageos/ui/input';
import { cn } from '@garageos/ui/utils';

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
}

interface Customer {
  name: string;
}

interface VehicleSelectionProps {
  vehicles: Vehicle[];
  selectedCustomer: Customer | null;
  selectedVehicleId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectVehicle: (vehicleId: string) => void;
  onChangeCustomer: () => void;
}

export function VehicleSelection({
  vehicles,
  selectedCustomer,
  selectedVehicleId,
  searchQuery,
  onSearchChange,
  onSelectVehicle,
  onChangeCustomer,
}: VehicleSelectionProps) {
  const filteredVehicles = vehicles.filter(
    (v) =>
      v.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
            onClick={onChangeCustomer}
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredVehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => onSelectVehicle(vehicle.id)}
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
  );
}
