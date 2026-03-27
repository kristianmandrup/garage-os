'use client';

import { Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
}

interface VehicleSelectionCardProps {
  vehicles: Vehicle[];
  selectedVehicle: string;
  onSelectVehicle: (vehicleId: string) => void;
}

export function VehicleSelectionCard({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}: VehicleSelectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Select Vehicle (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <select
          value={selectedVehicle}
          onChange={(e) => onSelectVehicle(e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
        >
          <option value="">No vehicle selected</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>
              {v.license_plate} - {v.brand} {v.model}
            </option>
          ))}
        </select>
      </CardContent>
    </Card>
  );
}
