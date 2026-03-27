'use client';

import { User } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface VehicleFormCardProps {
  selectedCustomer: { id: string; name: string; phone: string } | undefined;
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
  onCustomerChange: () => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function VehicleFormCard({
  selectedCustomer,
  formData,
  saving,
  onFormChange,
  onCustomerChange,
  onSubmit,
  onBack,
}: VehicleFormCardProps) {
  const t = useTranslation();

  const isValid = formData.license_plate && formData.brand && formData.model;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.newVehicle.vehicleDetails}</CardTitle>
        <CardDescription>
          {t.newVehicle.vehicleDetailsDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedCustomer && (
          <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{selectedCustomer.name}</p>
              <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={onCustomerChange}
            >
              {t.newVehicle.change}
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="license_plate">{t.newVehicle.licensePlate} *</Label>
            <Input
              id="license_plate"
              value={formData.license_plate}
              onChange={(e) => onFormChange('license_plate', e.target.value)}
              placeholder="e.g., กข 1234"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vin">{t.newVehicle.vin}</Label>
            <Input
              id="vin"
              value={formData.vin}
              onChange={(e) => onFormChange('vin', e.target.value)}
              placeholder="Vehicle Identification Number"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">{t.newVehicle.brand} *</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => onFormChange('brand', e.target.value)}
              placeholder="e.g., Toyota"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">{t.newVehicle.model} *</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => onFormChange('model', e.target.value)}
              placeholder="e.g., Camry"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">{t.newVehicle.year}</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => onFormChange('year', e.target.value)}
              placeholder="2020"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">{t.newVehicle.color}</Label>
            <Input
              id="color"
              value={formData.color}
              onChange={(e) => onFormChange('color', e.target.value)}
              placeholder="e.g., White"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mileage">{t.newVehicle.mileage}</Label>
            <Input
              id="mileage"
              type="number"
              value={formData.mileage}
              onChange={(e) => onFormChange('mileage', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fuel_type">{t.newVehicle.fuelType}</Label>
            <select
              id="fuel_type"
              value={formData.fuel_type}
              onChange={(e) => onFormChange('fuel_type', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t.newVehicle.selectFuelType}</option>
              <option value="gasoline">{t.newVehicle.gasoline}</option>
              <option value="diesel">{t.newVehicle.diesel}</option>
              <option value="electric">{t.newVehicle.electric}</option>
              <option value="hybrid">{t.newVehicle.hybrid}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="transmission">{t.newVehicle.transmission}</Label>
            <select
              id="transmission"
              value={formData.transmission}
              onChange={(e) => onFormChange('transmission', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t.newVehicle.selectTransmission}</option>
              <option value="automatic">{t.newVehicle.automatic}</option>
              <option value="manual">{t.newVehicle.manual}</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={saving}
          >
            {t.newVehicle.back}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={saving || !isValid}
            className="flex-1 btn-gradient"
          >
            {saving ? t.newVehicle.creating : t.newVehicle.addVehicle}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
