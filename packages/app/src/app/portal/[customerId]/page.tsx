'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Car,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
  FileText,
  Bell,
  Calendar,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Button } from '@garageos/ui/button';
import { cn } from '@garageos/ui/utils';

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  job_cards: Array<{
    id: string;
    title: string;
    status: string;
    created_at: string;
    completed_at: string | null;
  }>;
}

interface JobCard {
  id: string;
  title: string;
  status: string;
  created_at: string;
  vehicle: {
    license_plate: string;
    brand: string;
    model: string;
  };
  shop: {
    name: string;
  };
}

interface Invoice {
  id: string;
  invoice_number: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  due_date: string | null;
  job_card: {
    title: string;
    vehicle: {
      license_plate: string;
      brand: string;
      model: string;
    };
  };
}

interface Reminder {
  id: string;
  reminder_type: string;
  description: string;
  due_date: string;
  vehicle: {
    license_plate: string;
    brand: string;
    model: string;
  };
}

interface ServiceRecord {
  id: string;
  title: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  actual_cost: number | null;
  vehicle: {
    license_plate: string;
    brand: string;
    model: string;
    year: number;
  };
}

interface PortalData {
  customer: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    shop: {
      id: string;
      name: string;
      phone: string | null;
      email: string | null;
      logo_url: string | null;
    };
  };
  vehicles: Vehicle[];
  pendingApprovals: JobCard[];
  invoices: Invoice[];
  reminders: Reminder[];
  serviceHistory: ServiceRecord[];
}

const STATUS_LABELS: Record<string, string> = {
  inspection: 'กำลังตรวจสอบ',
  diagnosed: 'วินิจฉัยแล้ว',
  parts_ordered: 'รออะไหล่',
  in_progress: 'กำลังดำเนินการ',
  pending_approval: 'รอการอนุมัติ',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
};

const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: 'แบบร่าง',
  sent: 'ส่งแล้ว',
  paid: 'ชำระแล้ว',
  overdue: 'เกินกำหนด',
  cancelled: 'ยกเลิก',
};

const REMINDER_TYPE_LABELS: Record<string, string> = {
  oil_change: 'เปลี่ยนน้ำมันเครื่อง',
  tire_rotation: 'หมุนยาง',
  inspection: 'ตรวจสภาพรถ',
  insurance: 'ต่อประกัน',
  custom: 'แบบกำหนดเอง',
};

export default function CustomerPortalPage() {
  const params = useParams();
  const customerId = params.customerId as string;
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortalData();
  }, [customerId]);

  const fetchPortalData = async () => {
    try {
      const response = await fetch(`/api/portal/customers/${customerId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('ไม่พบข้อมูลลูกค้า');
        } else {
          setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
        return;
      }
      const data = await response.json();
      setPortalData(data);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error || !portalData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h1>
            <p className="text-muted-foreground">{error || 'ไม่สามารถโหลดข้อมูลได้'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { customer, vehicles, pendingApprovals, invoices, reminders, serviceHistory } = portalData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
  };

  const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue');
  const overdueReminders = reminders.filter(r => new Date(r.due_date) < new Date());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{customer.shop.name}</h1>
              <p className="text-blue-100">ลูกค้า: {customer.name}</p>
            </div>
            {customer.shop.logo_url && (
              <img src={customer.shop.logo_url} alt={customer.shop.name} className="h-12 w-12 rounded-lg object-contain bg-white" />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Customer Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              ข้อมูลลูกค้า
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ชื่อ</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{customer.phone}</p>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{customer.email}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alert Cards */}
        {pendingApprovals.length > 0 && (
          <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    รอการอนุมัติ ({pendingApprovals.length})
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    คุณมีงานที่ต้องอนุมัติก่อนดำเนินการต่อ
                  </p>
                  <div className="mt-3 space-y-2">
                    {pendingApprovals.slice(0, 3).map(job => (
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
        )}

        {pendingInvoices.length > 0 && (
          <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 dark:text-red-200">
                    รอชำระเงิน ({pendingInvoices.length})
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    คุณมีใบแจ้งหนี้ที่ต้องชำระ รวม {formatCurrency(pendingInvoices.reduce((sum, inv) => sum + inv.total, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Reminders */}
        {overdueReminders.length > 0 && (
          <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                    งานที่เกินกำหนด ({overdueReminders.length})
                  </h3>
                  <div className="mt-3 space-y-2">
                    {overdueReminders.slice(0, 3).map(reminder => (
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
        )}

        {/* Vehicles */}
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

        {/* Pending Approvals */}
        {pendingApprovals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                รอการอนุมัติ ({pendingApprovals.length})
              </CardTitle>
              <CardDescription>งานที่รอคุณอนุมัติก่อนดำเนินการต่อ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map(job => (
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
                      <Button size="sm" className="btn-gradient">อนุมัติ</Button>
                      <Button size="sm" variant="outline">ดูรายละเอียด</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              ใบแจ้งหนี้ ({invoices.length})
            </CardTitle>
            <CardDescription>ประวัติใบแจ้งหนี้</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">ยังไม่มีใบแจ้งหนี้</p>
            ) : (
              <div className="space-y-3">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl border bg-card">
                    <div>
                      <p className="font-medium">{invoice.invoice_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.job_card?.vehicle?.brand} {invoice.job_card?.vehicle?.model}
                      </p>
                      {invoice.due_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          กำหนดชำระ: {new Date(invoice.due_date).toLocaleDateString('th-TH')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(invoice.total)}</p>
                      <Badge className={cn(
                        'mt-1',
                        invoice.status === 'paid' ? 'bg-emerald-500' :
                        invoice.status === 'overdue' ? 'bg-red-500' :
                        invoice.status === 'sent' ? 'bg-blue-500' : 'bg-slate-500'
                      )}>
                        {INVOICE_STATUS_LABELS[invoice.status]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reminders */}
        {reminders.length > 0 && (
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
        )}

        {/* Service History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              ประวัติการซ่อม
            </CardTitle>
            <CardDescription>งานที่เสร็จสิ้นแล้ว</CardDescription>
          </CardHeader>
          <CardContent>
            {serviceHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">ยังไม่มีประวัติการซ่อม</p>
            ) : (
              <div className="space-y-4">
                {serviceHistory.map(record => (
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

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>ข้อมูลจาก {customer.shop.name}</p>
          {customer.shop.phone && <p>ติดต่อ: {customer.shop.phone}</p>}
          {customer.shop.email && <p>อีเมล: {customer.shop.email}</p>}
        </footer>
      </main>
    </div>
  );
}
