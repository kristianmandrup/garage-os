'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import { Skeleton } from '@garageos/ui/skeleton';
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
      <div className="min-h-screen bg-background p-4 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (error || !portalData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-bold">Portal Unavailable</h1>
          <p className="text-muted-foreground max-w-sm">
            Unable to load your portal. Please check the link or contact the shop.
          </p>
        </div>
      </div>
    );
  }

  const { customer, vehicles, pendingApprovals, invoices, reminders, serviceHistory } = portalData;

  const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue');
  const overdueReminders = reminders.filter(r => new Date(r.due_date) < new Date());

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-background dark:from-gray-950 dark:to-background">
      <PortalHeader
        shopName={customer.shop.name}
        shopLogoUrl={customer.shop.logo_url}
        customerName={customer.name}
      />

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
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
