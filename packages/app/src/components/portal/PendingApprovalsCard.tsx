import { AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Button } from '@garageos/ui/button';

interface PendingApprovalJob {
  id: string;
  title: string;
  created_at: string;
  vehicle: {
    brand: string;
    model: string;
    license_plate: string;
  };
}

interface PendingApprovalsCardProps {
  jobs: PendingApprovalJob[];
}

export function PendingApprovalsCard({ jobs }: PendingApprovalsCardProps) {
  if (jobs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          รอการอนุมัติ ({jobs.length})
        </CardTitle>
        <CardDescription>งานที่รอคุณอนุมัติก่อนดำเนินการต่อ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {job.vehicle.brand} {job.vehicle.model} - {job.vehicle.license_plate}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3 inline mr-1" />
                    สร้างเมื่อ: {new Date(job.created_at).toLocaleDateString('th-TH')}
                  </p>
                </div>
                <Badge className="bg-amber-500">รออนุมัติ</Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">อนุมัติ</Button>
                <Button size="sm" variant="outline">ดูรายละเอียด</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
