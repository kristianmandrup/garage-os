'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AlertOctagon } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import type { ReportData } from './components/report/types';
import { VehicleInfoSection } from './components/report/sections/VehicleInfoSection';
import { CustomerInfoSection } from './components/report/sections/CustomerInfoSection';
import { JobStatusSection } from './components/report/sections/JobStatusSection';
import { OverallConditionSection } from './components/report/sections/OverallConditionSection';
import { DetectionsSection } from './components/report/sections/DetectionsSection';
import { PhotosSection } from './components/report/sections/PhotosSection';
import { PartsUsedSection } from './components/report/sections/PartsUsedSection';
import { InvoiceSection } from './components/report/sections/InvoiceSection';
import { CostSummarySection } from './components/report/sections/CostSummarySection';

export default function ReportPage() {
  const params = useParams();
  const token = params.token as string;
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [token]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/${token}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('ไม่พบรายงานนี้');
        } else {
          setError('เกิดข้อผิดพลาดในการโหลดรายงาน');
        }
        return;
      }
      const data = await response.json();
      setReport(data);
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
          <p className="text-muted-foreground">กำลังโหลดรายงาน...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertOctagon className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">ไม่พบรายงาน</h1>
            <p className="text-muted-foreground">{error || 'รายงานนี้อาจหมดอายุหรือถูกลบแล้ว'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { jobCard, photos, inspectionResults, partsUsed, invoice } = report;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{jobCard.shop.name}</h1>
              <p className="text-primary-foreground/80">รายงานผลตรวจสภาพรถ</p>
            </div>
            {jobCard.shop.logo_url && (
              <img src={jobCard.shop.logo_url} alt={jobCard.shop.name} className="h-12 w-12 rounded-lg object-contain bg-white" />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <VehicleInfoSection vehicle={jobCard.vehicle} />
        <CustomerInfoSection customer={jobCard.customer} />
        <JobStatusSection jobCard={jobCard} />
        <OverallConditionSection inspectionResults={inspectionResults} />
        <DetectionsSection inspectionResults={inspectionResults} />
        <PhotosSection photos={photos} />
        <PartsUsedSection partsUsed={partsUsed} />
        {invoice && <InvoiceSection invoice={invoice} />}
        <CostSummarySection estimated_cost={jobCard.estimated_cost} actual_cost={jobCard.actual_cost} />

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>รายงานนี้สร้างโดย {jobCard.shop.name}</p>
          {jobCard.shop.phone && <p>ติดต่อ: {jobCard.shop.phone}</p>}
          {jobCard.shop.email && <p>อีเมล: {jobCard.shop.email}</p>}
        </footer>
      </main>
    </div>
  );
}
