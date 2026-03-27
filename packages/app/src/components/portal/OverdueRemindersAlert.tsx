import { Bell } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';

const REMINDER_TYPE_LABELS: Record<string, string> = {
  oil_change: 'เปลี่ยนน้ำมันเครื่อง',
  tire_rotation: 'หมุนยาง',
  inspection: 'ตรวจสภาพรถ',
  insurance: 'ต่อประกัน',
  custom: 'แบบกำหนดเอง',
};

interface OverdueReminder {
  id: string;
  reminder_type: string;
  description: string;
  due_date: string;
  vehicle: {
    license_plate: string;
  };
}

interface OverdueRemindersAlertProps {
  reminders: OverdueReminder[];
}

export function OverdueRemindersAlert({ reminders }: OverdueRemindersAlertProps) {
  if (reminders.length === 0) return null;

  return (
    <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
            <Bell className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-800 dark:text-orange-200">
              งานที่เกินกำหนด ({reminders.length})
            </h3>
            <div className="mt-3 space-y-2">
              {reminders.slice(0, 3).map(reminder => (
                <div key={reminder.id} className="p-3 bg-white dark:bg-orange-900/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{REMINDER_TYPE_LABELS[reminder.reminder_type]}</p>
                      <p className="text-sm text-muted-foreground">
                        {reminder.vehicle.license_plate} - {reminder.description}
                      </p>
                    </div>
                    <Badge className="bg-red-500">เกินกำหนด</Badge>
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
