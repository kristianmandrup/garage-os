import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';

interface PendingApprovalJob {
  id: string;
  title: string;
  vehicle: {
    brand: string;
    model: string;
    license_plate: string;
  };
}

interface PendingApprovalsAlertProps {
  jobs: PendingApprovalJob[];
}

export function PendingApprovalsAlert({ jobs }: PendingApprovalsAlertProps) {
  if (jobs.length === 0) return null;

  return (
    <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
              รอการอนุมัติ ({jobs.length})
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              คุณมีงานที่ต้องอนุมัติก่อนดำเนินการต่อ
            </p>
            <div className="mt-3 space-y-2">
              {jobs.slice(0, 3).map(job => (
                <div key={job.id} className="p-3 bg-white dark:bg-amber-900/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.vehicle.brand} {job.vehicle.model} - {job.vehicle.license_plate}
                      </p>
                    </div>
                    <Badge className="bg-amber-500">รออนุมัติ</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
