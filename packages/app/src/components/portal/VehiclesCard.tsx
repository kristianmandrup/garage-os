import { Car, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { cn } from '@garageos/ui/utils';

interface VehicleJobCard {
  id: string;
  title: string;
  status: string;
}

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  job_cards: VehicleJobCard[];
}

interface VehiclesCardProps {
  vehicles: Vehicle[];
}

export function VehiclesCard({ vehicles }: VehiclesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          รถของคุณ ({vehicles.length})
        </CardTitle>
        <CardDescription>รายการรถที่ลงทะเบียนกับร้าน</CardDescription>
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">ยังไม่มีรถที่ลงทะเบียน</p>
        ) : (
          <div className="space-y-4">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="p-4 rounded-xl border bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.license_plate} | ปี {vehicle.year}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                {vehicle.job_cards.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium mb-2">งานล่าสุด</p>
                    <div className="flex gap-2 overflow-x-auto">
                      {vehicle.job_cards.slice(0, 3).map(jc => (
                        <Badge
                          key={jc.id}
                          className={cn(
                            'whitespace-nowrap',
                            jc.status === 'completed' ? 'bg-emerald-500' :
                            jc.status === 'pending_approval' ? 'bg-amber-500' :
                            jc.status === 'cancelled' ? 'bg-slate-500' : 'bg-blue-500'
                          )}
                        >
                          {jc.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
