'use client';

import { User } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Input } from '@garageos/ui/input';
import { FormField } from '@garageos/ui/form-field';
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
        <CardTitle>{t.vehicles.form.vehicleDetails}</CardTitle>
        <CardDescription>
          {t.vehicles.form.vehicleDetailsDescription}
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
              {t.vehicles.form.change}
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label={t.vehicles.form.licensePlate} required htmlFor="license_plate">
            <Input
              id="license_plate"
              value={formData.license_plate}
              onChange={(e) => onFormChange('license_plate', e.target.value)}
              placeholder="e.g., กข 1234"
            />
          </FormField>
          <FormField label={t.vehicles.form.vin} htmlFor="vin">
            <Input
              id="vin"
              value={formData.vin}
              onChange={(e) => onFormChange('vin', e.target.value)}
              placeholder="Vehicle Identification Number"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label={t.vehicles.form.brand} required htmlFor="brand">
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => onFormChange('brand', e.target.value)}
              placeholder="e.g., Toyota"
            />
          </FormField>
          <FormField label={t.vehicles.form.model} required htmlFor="model">
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => onFormChange('model', e.target.value)}
              placeholder="e.g., Camry"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField label={t.vehicles.form.year} htmlFor="year">
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => onFormChange('year', e.target.value)}
              placeholder="2020"
            />
          </FormField>
          <FormField label={t.vehicles.form.color} htmlFor="color">
            <Input
              id="color"
              value={formData.color}
              onChange={(e) => onFormChange('color', e.target.value)}
              placeholder="e.g., White"
            />
          </FormField>
          <FormField label={t.vehicles.form.mileage} htmlFor="mileage">
            <Input
              id="mileage"
              type="number"
              value={formData.mileage}
              onChange={(e) => onFormChange('mileage', e.target.value)}
              placeholder="0"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label={t.vehicles.form.fuelType} htmlFor="fuel_type">
            <select
              id="fuel_type"
              value={formData.fuel_type}
              onChange={(e) => onFormChange('fuel_type', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t.vehicles.form.selectFuelType}</option>
              <option value="gasoline">{t.vehicles.form.gasoline}</option>
              <option value="diesel">{t.vehicles.form.diesel}</option>
              <option value="electric">{t.vehicles.form.electric}</option>
              <option value="hybrid">{t.vehicles.form.hybrid}</option>
            </select>
          </FormField>
          <FormField label={t.vehicles.form.transmission} htmlFor="transmission">
            <select
              id="transmission"
              value={formData.transmission}
              onChange={(e) => onFormChange('transmission', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t.vehicles.form.selectTransmission}</option>
              <option value="automatic">{t.vehicles.form.automatic}</option>
              <option value="manual">{t.vehicles.form.manual}</option>
            </select>
          </FormField>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={saving}
          >
            {t.vehicles.form.back}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={saving || !isValid}
            className="flex-1 btn-gradient"
          >
            {saving ? t.vehicles.form.creating : t.vehicles.form.addVehicle}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
