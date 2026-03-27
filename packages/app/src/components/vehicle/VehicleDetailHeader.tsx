'use client';

import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2, Car } from 'lucide-react';
import { Button } from '@garageos/ui/button';

interface Vehicle {
  license_plate: string;
  brand: string;
  model: string;
  year: number;
}

interface VehicleDetailHeaderProps {
  vehicle: Vehicle;
  editing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function VehicleDetailHeader({
  vehicle,
  editing,
  onEdit,
  onDelete,
}: VehicleDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/vehicles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{vehicle.license_plate}</h1>
            <p className="text-muted-foreground">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {!editing && (
          <>
            <Button variant="outline" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
