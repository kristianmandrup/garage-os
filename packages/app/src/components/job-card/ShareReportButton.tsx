'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { useTranslation } from '@/i18n';

interface ShareReportButtonProps {
  jobCardId: string;
}

export function ShareReportButton({ jobCardId }: ShareReportButtonProps) {
  const t = useTranslation();
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShareReport = async () => {
    setSharing(true);
    try {
      const response = await fetch(`/api/job-cards/${jobCardId}/report`, {
        method: 'POST',
      });

      if (response.ok) {
        const { report_url } = await response.json();
        await navigator.clipboard.writeText(report_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (error) {
      console.error('Failed to share report:', error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={handleShareReport}
      disabled={sharing}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2 text-emerald-500" />
          Link Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-2" />
          {sharing ? t.jobCards.detail.creating : t.jobCards.detail.shareReport}
        </>
      )}
    </Button>
  );
}
