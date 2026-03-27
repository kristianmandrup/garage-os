import { Bell, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { cn } from '@garageos/ui/utils';

const REMINDER_TYPE_LABELS: Record<string, string> = {
  oil_change: 'เปลี่ยนน้ำมันเครื่อง',
  tire_rotation: 'หมุนยาง',
  inspection: 'ตรวจสภาพรถ',
  insurance: 'ต่อประกัน',
  custom: 'แบบกำหนดเอง',
};

interface Reminder {
  id: string;
  reminder_type: string;
  description: string;
  due_date: string;
  vehicle: {
    license_plate: string;
  };
}

interface RemindersCardProps {
  reminders: Reminder[];
}

export function RemindersCard({ reminders }: RemindersCardProps) {
  if (reminders.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          การนัดหมาย ({reminders.length})
        </CardTitle>
        <CardDescription>การบำรุงรักษาที่กำลังจะมาถึง</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reminders.map(reminder => {
            const isOverdue = new Date(reminder.due_date) < new Date();
            return (
              <div key={reminder.id} className={cn(
                'flex items-center justify-between p-4 rounded-xl border',
                isOverdue ? 'border-red-200 bg-red-50 dark:bg-red-950/20' : 'bg-card'
              )}>
                <div>
                  <p className="font-medium">{REMINDER_TYPE_LABELS[reminder.reminder_type]}</p>
                  <p className="text-sm text-muted-foreground">
                    {reminder.vehicle.license_plate} - {reminder.description}
                  </p>
                  <p className={cn(
                    'text-xs mt-1',
                    isOverdue ? 'text-red-600' : 'text-muted-foreground'
                  )}>
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {isOverdue ? 'เกินกำหนด: ' : ''}{new Date(reminder.due_date).toLocaleDateString('th-TH')}
                  </p>
                </div>
                <Badge className={isOverdue ? 'bg-red-500' : 'bg-blue-500'}>
                  {isOverdue ? 'เกินกำหนด' : 'รอดำเนินการ'}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
