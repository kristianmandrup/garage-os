'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import {
  PortalHeader,
  CustomerInfoCard,
  PendingApprovalsAlert,
  PendingInvoicesAlert,
  OverdueRemindersAlert,
  VehiclesCard,
  PendingApprovalsCard,
  InvoicesCard,
  RemindersCard,
  ServiceHistoryCard,
} from '@/components/portal';

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
  } | null;
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
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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

  const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue');
  const overdueReminders = reminders.filter(r => new Date(r.due_date) < new Date());

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader
        shopName={customer.shop.name}
        shopLogoUrl={customer.shop.logo_url}
        customerName={customer.name}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <CustomerInfoCard
          name={customer.name}
          phone={customer.phone}
          email={customer.email}
        />

        {/* Alert Cards */}
        <PendingApprovalsAlert jobs={pendingApprovals} />
        <PendingInvoicesAlert invoices={pendingInvoices} />
        <OverdueRemindersAlert reminders={overdueReminders} />

        {/* Vehicles */}
        <VehiclesCard vehicles={vehicles} />

        {/* Pending Approvals */}
        <PendingApprovalsCard jobs={pendingApprovals} />

        {/* Invoices */}
        <InvoicesCard invoices={invoices} />

        {/* Reminders */}
        <RemindersCard reminders={reminders} />

        {/* Service History */}
        <ServiceHistoryCard records={serviceHistory} />

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
