import { CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

export const STATUS_LABELS: Record<string, string> = {
  inspection: 'กำลังตรวจสอบ',
  diagnosed: 'วินิจฉัยแล้ว',
  parts_ordered: 'รออะไหล่',
  in_progress: 'กำลังดำเนินการ',
  pending_approval: 'รอการอนุมัติ',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
};

export const CONDITION_CONFIG = {
  excellent: { label: 'ยอดเยี่ยม', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
  good: { label: 'ดี', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle },
  fair: { label: 'พอใช้', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: AlertTriangle },
  poor: { label: 'ไม่ดี', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertTriangle },
  critical: { label: 'วิกฤต', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertOctagon },
};
