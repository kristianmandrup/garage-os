import { Wrench, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';

interface ServiceRecord {
  id: string;
  title: string;
  completed_at: string | null;
  actual_cost: number | null;
  vehicle: {
    license_plate: string;
    brand: string;
    model: string;
  };
}

interface ServiceHistoryCardProps {
  records: ServiceRecord[];
}

export function ServiceHistoryCard({ records }: ServiceHistoryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          ประวัติการซ่อม
        </CardTitle>
        <CardDescription>งานที่เสร็จสิ้นแล้ว</CardDescription>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">ยังไม่มีประวัติการซ่อม</p>
        ) : (
          <div className="space-y-4">
            {records.map(record => (
              <div key={record.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{record.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {record.vehicle.brand} {record.vehicle.model} - {record.vehicle.license_plate}
                  </p>
                  {record.completed_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      เสร็จเมื่อ: {new Date(record.completed_at).toLocaleDateString('th-TH')}
                    </p>
                  )}
                </div>
                {record.actual_cost && (
                  <p className="font-semibold text-emerald-600">
                    {formatCurrency(record.actual_cost)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
