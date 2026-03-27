'use client';

import { Car, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface JobCardVehicleCustomerProps {
  vehicle: {
    license_plate: string;
    brand: string;
    model: string;
    year: number;
  };
  customer: {
    name: string;
    phone: string;
  };
}

export function JobCardVehicleCustomer({ vehicle, customer }: JobCardVehicleCustomerProps) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.jobCard.vehicleAndCustomer}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Car className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium">{vehicle.license_plate}</p>
            <p className="text-sm text-muted-foreground">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <User className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
