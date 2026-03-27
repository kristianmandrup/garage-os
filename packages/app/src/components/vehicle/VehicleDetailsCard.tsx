'use client';

import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface Vehicle {
  vin: string | null;
  color: string | null;
  mileage: number | null;
  fuel_type: string | null;
  transmission: string | null;
  created_at: string;
}

interface VehicleDetailsCardProps {
  vehicle: Vehicle;
  editing: boolean;
  formData: {
    license_plate: string;
    brand: string;
    model: string;
    year: string;
    vin: string;
    color: string;
    mileage: string;
    fuel_type: string;
    transmission: string;
  };
  saving: boolean;
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const fuelTypeLabels: Record<string, string> = {
  gasoline: 'Gasoline',
  diesel: 'Diesel',
  electric: 'Electric',
  hybrid: 'Hybrid',
};

const transmissionLabels: Record<string, string> = {
  automatic: 'Automatic',
  manual: 'Manual',
};

export function VehicleDetailsCard({
  vehicle,
  editing,
  formData,
  saving,
  onFormChange,
  onSave,
  onCancel,
}: VehicleDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>License Plate *</Label>
                <Input
                  value={formData.license_plate}
                  onChange={(e) => onFormChange('license_plate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>VIN</Label>
                <Input
                  value={formData.vin}
                  onChange={(e) => onFormChange('vin', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Brand *</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) => onFormChange('brand', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Model *</Label>
                <Input
                  value={formData.model}
                  onChange={(e) => onFormChange('model', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => onFormChange('year', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  value={formData.color}
                  onChange={(e) => onFormChange('color', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Mileage</Label>
                <Input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => onFormChange('mileage', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <select
                  value={formData.fuel_type}
                  onChange={(e) => onFormChange('fuel_type', e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select fuel type</option>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Transmission</Label>
                <select
                  value={formData.transmission}
                  onChange={(e) => onFormChange('transmission', e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select transmission</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={onSave} disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">VIN</p>
                <p className="font-medium">{vehicle.vin || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Color</p>
                <p className="font-medium">{vehicle.color || 'Not specified'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="font-medium">{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p className="font-medium">{vehicle.fuel_type ? fuelTypeLabels[vehicle.fuel_type] : 'Not specified'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transmission</p>
              <p className="font-medium">{vehicle.transmission ? transmissionLabels[vehicle.transmission] : 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Added On</p>
              <p className="font-medium">{new Date(vehicle.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
