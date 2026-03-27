'use client';

import Link from 'next/link';
import { Car } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Textarea } from '@garageos/ui/textarea';

interface Vehicle {
  license_plate: string;
  brand: string;
  model: string;
}

interface JobDetailsFormProps {
  vehicle: Vehicle | null;
  formData: {
    title: string;
    description: string;
    estimated_cost: string;
    estimated_hours: string;
    scheduled_date: string;
  };
  saving: boolean;
  onFormChange: (field: string, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function JobDetailsForm({
  vehicle,
  formData,
  saving,
  onFormChange,
  onBack,
  onSubmit,
}: JobDetailsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
        <CardDescription>
          Enter the details for this repair job
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {vehicle && (
          <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
            <Car className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{vehicle.license_plate}</p>
              <p className="text-sm text-muted-foreground">
                {vehicle.brand} {vehicle.model}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={onBack}
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
            onChange={(e) => onFormChange('title', e.target.value)}
            placeholder="e.g., Oil change and inspection"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onFormChange('description', e.target.value)}
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
              onChange={(e) => onFormChange('estimated_cost', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimated_hours">Estimated Hours</Label>
            <Input
              id="estimated_hours"
              type="number"
              value={formData.estimated_hours}
              onChange={(e) => onFormChange('estimated_hours', e.target.value)}
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
            onChange={(e) => onFormChange('scheduled_date', e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={saving}
          >
            Back
          </Button>
          <Button
            onClick={onSubmit}
            disabled={saving || !formData.title}
            className="flex-1 btn-gradient"
          >
            {saving ? 'Creating...' : 'Create Job Card'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
