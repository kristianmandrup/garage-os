'use client';

import { Label } from '@garageos/ui/label';
import { Input } from '@garageos/ui/input';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
}

interface Customer {
  id: string;
  name: string;
}

interface NewReminderFormProps {
  vehicles: Vehicle[];
  customers: Customer[];
  formData: {
    vehicle_id: string;
    customer_id: string;
    reminder_type: string;
    description: string;
    due_date: string;
    due_mileage: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function NewReminderForm({
  vehicles,
  customers,
  formData,
  onFormChange,
  onSubmit,
  onCancel,
}: NewReminderFormProps) {
  const t = useTranslation();

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle>{t.reminder.newReminder}</CardTitle>
        <CardDescription>{t.reminder.createDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.jobCards.detail.customer} *</Label>
            <select
              value={formData.customer_id}
              onChange={(e) => onFormChange('customer_id', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">{t.reminder.selectCustomer}</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>{t.jobCards.detail.vehicle} *</Label>
            <select
              value={formData.vehicle_id}
              onChange={(e) => onFormChange('vehicle_id', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">{t.reminder.selectVehicle}</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.license_plate} - {v.brand} {v.model}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.reminder.type} *</Label>
            <select
              value={formData.reminder_type}
              onChange={(e) => onFormChange('reminder_type', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="oil_change">{t.reminder.types.oilChange}</option>
              <option value="tire_rotation">{t.reminder.types.tireRotation}</option>
              <option value="inspection">{t.reminder.types.inspection}</option>
              <option value="insurance">{t.reminder.types.insurance}</option>
              <option value="custom">{t.reminder.types.custom}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>{t.reminder.dueDate} *</Label>
            <Input
              type="date"
              value={formData.due_date}
              onChange={(e) => onFormChange('due_date', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>{t.reminder.reminderDescription} *</Label>
          <Input
            placeholder={t.reminder.descriptionPlaceholder}
            value={formData.description}
            onChange={(e) => onFormChange('description', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t.reminder.dueMileageOptional}</Label>
          <Input
            type="number"
            placeholder="e.g., 80000"
            value={formData.due_mileage}
            onChange={(e) => onFormChange('due_mileage', e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>{t.common.cancel}</Button>
          <Button onClick={onSubmit} className="btn-gradient">
            {t.reminder.createReminder}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
