'use client';

import Link from 'next/link';
import { Plus, Car } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
}

interface CustomerVehiclesCardProps {
  customerId: string;
  vehicles: Vehicle[];
}

export function CustomerVehiclesCard({ customerId, vehicles }: CustomerVehiclesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vehicles</CardTitle>
        <Link href={`/dashboard/vehicles/new?customer_id=${customerId}`}>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {vehicles && vehicles.length > 0 ? (
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <Link key={vehicle.id} href={`/dashboard/vehicles/${vehicle.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{vehicle.license_plate}</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No vehicles registered
          </p>
        )}
      </CardContent>
    </Card>
  );
}
