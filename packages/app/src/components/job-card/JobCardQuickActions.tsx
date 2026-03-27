'use client';

import Link from 'next/link';
import { Camera, Package, MessageSquare } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';
import { CreateInvoiceButton } from './CreateInvoiceButton';
import { ShareReportButton } from './ShareReportButton';

interface JobCardQuickActionsProps {
  jobCardId: string;
  customerId: string;
  status: string;
}

export function JobCardQuickActions({
  jobCardId,
  customerId,
  status,
}: JobCardQuickActionsProps) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.jobCard.quickActions}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href={`/dashboard/inspection?job_card_id=${jobCardId}`} className="block">
          <Button variant="outline" className="w-full justify-start">
            <Camera className="h-4 w-4 mr-2" />
            {t.jobCard.aiInspection}
          </Button>
        </Link>
        <Link href={`/dashboard/inventory?job_card_id=${jobCardId}`} className="block">
          <Button variant="outline" className="w-full justify-start">
            <Package className="h-4 w-4 mr-2" />
            {t.jobCard.addParts}
          </Button>
        </Link>
        <Link href={`/dashboard/messages?customer_id=${customerId}&job_card_id=${jobCardId}`} className="block">
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />
            {t.jobCard.sendMessage}
          </Button>
        </Link>
        {status === 'completed' && (
          <CreateInvoiceButton jobCardId={jobCardId} customerId={customerId} />
        )}
        <ShareReportButton jobCardId={jobCardId} />
      </CardContent>
    </Card>
  );
}
