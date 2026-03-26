// Message templates for common scenarios

interface TemplateContext {
  customerName: string;
  vehiclePlate?: string;
  jobTitle?: string;
  shopName?: string;
  total?: number;
  readyDate?: string;
}

export function generateMessageTemplate(
  type: 'status_update' | 'approval' | 'payment' | 'ready' | 'reminder',
  context: TemplateContext
): string {
  switch (type) {
    case 'status_update':
      return `สวัสดีครับคุณ${context.customerName}

📋 อัปเดตสถานะงานซ่อม

${context.jobTitle ? `งาน: ${context.jobTitle}` : ''}
${context.vehiclePlate ? `รถ: ${context.vehiclePlate}` : ''}

สถานะปัจจุบัน: กำลังดำเนินการ
เราจะแจ้งให้ทราบเมื่อเสร็จสมบูรณ์ครับ

ขอบคุณครับ
${context.shopName || 'ร้านซ่อมรถ'}`;

    case 'approval':
      return `สวัสดีครับคุณ${context.customerName}

✅ งานซ่อมเสร็จสมบูรณ์แล้ว

${context.jobTitle ? `งาน: ${context.jobTitle}` : ''}
${context.vehiclePlate ? `รถ: ${context.vehiclePlate}` : ''}
${context.total ? `ยอดรวม: ฿${context.total.toLocaleString()}` : ''}

กรุณายืนยันการอนุมัติเพื่อดำเนินการต่อครับ

ขอบคุณครับ
${context.shopName || 'ร้านซ่อมรถ'}`;

    case 'payment':
      return `สวัสดีครับคุณ${context.customerName}

💳 แจ้งยอดชำระ

${context.jobTitle ? `งาน: ${context.jobTitle}` : ''}
${context.vehiclePlate ? `รถ: ${context.vehiclePlate}` : ''}
ยอดรวม: ฿${(context.total || 0).toLocaleString()}

กรุณาชำระเงินภายในกำหนดครับ

ขอบคุณครับ
${context.shopName || 'ร้านซ่อมรถ'}`;

    case 'ready':
      return `สวัสดีครับคุณ${context.customerName}

🚗 รถพร้อมรับแล้วครับ!

${context.jobTitle ? `งาน: ${context.jobTitle}` : ''}
${context.vehiclePlate ? `ทะเบียน: ${context.vehiclePlate}` : ''}

สามารถมารับรถได้เลยครับ
${context.readyDate ? `ตั้งแต่: ${context.readyDate}` : ''}

ขอบคุณครับ
${context.shopName || 'ร้านซ่อมรถ'}`;

    case 'reminder':
      return `สวัสดีครับคุณ${context.customerName}

📅 แจ้งเตือนการนัดหมาย

${context.jobTitle || 'ถึงเวลาบริการตรวจเช็ครถของคุณแล้วครับ'}

กรุณานัดหมายล่วงหน้าหรือมาตามนัดเดิมครับ

ขอบคุณครับ
${context.shopName || 'ร้านซ่อมรถ'}`;

    default:
      return `สวัสดีครับคุณ${context.customerName}`;
  }
}

export const CHANNELS = [
  { value: 'sms', label: 'SMS', icon: '📱', description: 'Send via SMS' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬', description: 'Send via WhatsApp' },
  { value: 'line', label: 'LINE', icon: '💚', description: 'Send via LINE Official' },
  { value: 'app', label: 'In-App', icon: '🔔', description: 'Notification in app' },
] as const;

export const MESSAGE_TYPES = [
  { value: 'status_update', label: 'Status Update', description: 'Job card status change' },
  { value: 'repair_approved', label: 'Repair Approval', description: 'Request customer approval' },
  { value: 'payment_reminder', label: 'Payment Reminder', description: 'Remind about payment' },
  { value: 'ready_for_pickup', label: 'Ready for Pickup', description: 'Vehicle ready to collect' },
  { value: 'custom', label: 'Custom Message', description: 'Write your own message' },
] as const;
