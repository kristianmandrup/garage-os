'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface Vehicle {
  license_plate: string;
  brand: string;
  model: string;
  year: number;
}

interface InvoiceJobCardInfoProps {
  jobCard: {
    title: string;
    description: string | null;
    vehicle: Vehicle;
  } | null;
  licenseLabel: string;
}

export function InvoiceJobCardInfo({ jobCard, licenseLabel }: InvoiceJobCardInfoProps) {
  if (!jobCard) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-lg">{jobCard.title}</p>
            <p className="text-sm text-muted-foreground">
              {jobCard.vehicle.brand} {jobCard.vehicle.model} ({jobCard.vehicle.year})
            </p>
            <p className="text-sm text-muted-foreground">
              {licenseLabel}: {jobCard.vehicle.license_plate}
            </p>
          </div>
          {jobCard.description && (
            <p className="text-sm text-muted-foreground">{jobCard.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
