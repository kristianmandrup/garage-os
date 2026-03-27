'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { useTranslation } from '@/i18n';

interface CreateInvoiceButtonProps {
  jobCardId: string;
  customerId?: string;
}

export function CreateInvoiceButton({ jobCardId, customerId }: CreateInvoiceButtonProps) {
  const t = useTranslation();
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleCreateInvoice = async () => {
    if (!customerId) {
      alert('No customer linked to this job card');
      return;
    }

    setCreating(true);
    try {
      const jobRes = await fetch(`/api/job-cards/${jobCardId}`);
      if (!jobRes.ok) throw new Error('Failed to fetch job card');
      const jobData = await jobRes.json();

      const partsRes = await fetch(`/api/parts/usage?job_card_id=${jobCardId}`);
      const partsData = partsRes.ok ? await partsRes.json() : [];
      const partsTotal = partsData.reduce((sum: number, pu: any) => sum + (pu.quantity * pu.unit_price), 0) || 0;

      const subtotal = (jobData.actual_cost || 0) + partsTotal;
      const taxRate = 7;
      const tax = subtotal * (taxRate / 100);

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_card_id: jobCardId,
          customer_id: customerId,
          subtotal,
          tax_rate: taxRate,
        }),
      });

      if (response.ok) {
        const invoice = await response.json();
        router.push(`/dashboard/invoices/${invoice.id}`);
      }
    } catch (error) {
      console.error('Failed to create invoice:', error);
      alert('Failed to create invoice');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={handleCreateInvoice}
      disabled={creating}
    >
      <FileText className="h-4 w-4 mr-2" />
      {creating ? t.jobCard.creating : t.jobCard.createInvoice}
    </Button>
  );
}
