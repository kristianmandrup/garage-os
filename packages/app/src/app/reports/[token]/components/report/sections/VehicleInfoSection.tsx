'use client';

import { Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import type { ReportData } from '../types';

interface VehicleInfoSectionProps {
  vehicle: ReportData['jobCard']['vehicle'];
}

export function VehicleInfoSection({ vehicle }: VehicleInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          ข้อมูลรถ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">ทะเบียน</p>
            <p className="font-semibold text-lg">{vehicle.license_plate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ยี่ห้อ/รุ่น</p>
            <p className="font-semibold">{vehicle.brand} {vehicle.model}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ปี</p>
            <p className="font-semibold">{vehicle.year}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">สี</p>
            <p className="font-semibold">{vehicle.color || '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
