'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Car, User, Phone, Mail, CheckCircle, AlertTriangle, AlertOctagon, Wrench, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { cn } from '@garageos/ui/utils';

interface Photo {
  id: string;
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  is_damage_photo: boolean;
}

interface DetectionItem {
  label: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
  category: string;
  description?: string;
  estimatedRepairCost?: number;
}

interface InspectionResult {
  id: string;
  detections: DetectionItem[];
  overall_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  summary: string;
  confidence: number;
}

interface PartUsage {
  id: string;
  quantity: number;
  unit_price: number;
  part: {
    id: string;
    name: string;
    part_number: string;
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
}

interface ReportData {
  jobCard: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    estimated_cost: number | null;
    actual_cost: number | null;
    completed_at: string | null;
    created_at: string;
    vehicle: {
      id: string;
      license_plate: string;
      brand: string;
      model: string;
      year: number;
      color: string;
    };
    customer: {
      id: string;
      name: string;
      phone: string | null;
      email: string | null;
    };
    shop: {
      id: string;
      name: string;
      phone: string | null;
      email: string | null;
      logo_url: string | null;
    };
  };
  photos: Photo[];
  inspectionResults: InspectionResult[];
  partsUsed: PartUsage[];
  invoice: Invoice | null;
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

const CONDITION_CONFIG = {
  excellent: { label: 'ยอดเยี่ยม', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
  good: { label: 'ดี', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle },
  fair: { label: 'พอใช้', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: AlertTriangle },
  poor: { label: 'ไม่ดี', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertTriangle },
  critical: { label: 'วิกฤต', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertOctagon },
};

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
        {/* Vehicle Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              ข้อมูลรถ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ทะเบียน</p>
                <p className="font-semibold text-lg">{jobCard.vehicle.license_plate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ยี่ห้อ/รุ่น</p>
                <p className="font-semibold">{jobCard.vehicle.brand} {jobCard.vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ปี</p>
                <p className="font-semibold">{jobCard.vehicle.year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">สี</p>
                <p className="font-semibold">{jobCard.vehicle.color || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              ข้อมูลลูกค้า
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ชื่อ</p>
                <p className="font-semibold">{jobCard.customer.name}</p>
              </div>
              {jobCard.customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="font-semibold">{jobCard.customer.phone}</p>
                </div>
              )}
              {jobCard.customer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="font-semibold">{jobCard.customer.email}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              สถานะงาน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">งาน</p>
                <p className="font-semibold">{jobCard.title}</p>
                {jobCard.description && (
                  <p className="text-sm text-muted-foreground mt-1">{jobCard.description}</p>
                )}
              </div>
              <Badge className={cn(
                'text-sm px-3 py-1',
                jobCard.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
              )}>
                {STATUS_LABELS[jobCard.status] || jobCard.status}
              </Badge>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 inline mr-2" />
                วันที่สร้าง: {new Date(jobCard.created_at).toLocaleDateString('th-TH')}
              </p>
              {jobCard.completed_at && (
                <p className="text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  วันที่เสร็จสิ้น: {new Date(jobCard.completed_at).toLocaleDateString('th-TH')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overall Condition */}
        {inspectionResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>ผลตรวจสภาพโดยรวม</CardTitle>
              <CardDescription>จากการวิเคราะห์ด้วย AI</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const avgConfidence = inspectionResults.reduce((acc, r) => acc + r.confidence, 0) / inspectionResults.length;
                const conditionCounts = inspectionResults.reduce((acc, r) => {
                  acc[r.overall_condition] = (acc[r.overall_condition] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                const worstCondition = Object.entries(conditionCounts)
                  .sort(([, a], [, b]) => b - a)[0][0] as keyof typeof CONDITION_CONFIG;
                const config = CONDITION_CONFIG[worstCondition];

                return (
                  <div className="flex items-center gap-4">
                    <div className={cn('w-20 h-20 rounded-full flex items-center justify-center', config.color)}>
                      <config.icon className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{config.label}</p>
                      <p className="text-sm text-muted-foreground">ความมั่นใจ: {(avgConfidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Detection Results */}
        {inspectionResults.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <CardTitle>ผลการตรวจสอบ</CardTitle>
              <CardDescription>{result.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              {result.detections.length === 0 ? (
                <p className="text-muted-foreground">ไม่พบปัญหาที่ต้องสนใจ</p>
              ) : (
                <div className="space-y-3">
                  {result.detections.map((detection, idx) => (
                    <div key={idx} className={cn(
                      'p-3 rounded-lg border',
                      detection.severity === 'critical' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
                      detection.severity === 'warning' ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20' :
                      'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                    )}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{detection.label}</p>
                          <p className="text-sm text-muted-foreground">{detection.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ความมั่นใจ: {(detection.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                        <Badge className={cn(
                          detection.severity === 'critical' ? 'bg-red-500' :
                          detection.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        )}>
                          {detection.severity === 'critical' ? 'วิกฤต' :
                           detection.severity === 'warning' ? 'เตือน' : 'ข้อมูล'}
                        </Badge>
                      </div>
                      {detection.estimatedRepairCost && (
                        <p className="text-sm font-medium mt-2 text-emerald-600">
                          ประมาณการค่าซ่อม: ฿{detection.estimatedRepairCost.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Photos */}
        {photos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>รูปภาพ</CardTitle>
              <CardDescription>ภาพที่ถ่ายจากการตรวจสภาพ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={photo.thumbnail_url || photo.url}
                      alt={photo.caption || 'Vehicle photo'}
                      className="object-cover w-full h-full"
                    />
                    {photo.is_damage_photo && (
                      <Badge className="absolute top-2 right-2 bg-red-500">เสียหาย</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parts Used */}
        {partsUsed.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                อะไหล่ที่ใช้
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {partsUsed.map((usage) => (
                  <div key={usage.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{usage.part.name}</p>
                      <p className="text-sm text-muted-foreground">{usage.part.part_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">฿{usage.unit_price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">x{usage.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invoice */}
        {invoice && (
          <Card>
            <CardHeader>
              <CardTitle>ใบแจ้งหนี้</CardTitle>
              <CardDescription>เลขที่: {invoice.invoice_number}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ราคาอะไหล่</span>
                  <span>฿{invoice.subtotal.toLocaleString()}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>ส่วนลด</span>
                    <span>-฿{invoice.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ภาษี 7%</span>
                  <span>฿{invoice.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>รวมทั้งสิ้น</span>
                  <span className="text-emerald-600">฿{invoice.total.toLocaleString()}</span>
                </div>
                <div className="mt-4">
                  <Badge className={cn(
                    invoice.status === 'paid' ? 'bg-emerald-500' :
                    invoice.status === 'sent' ? 'bg-blue-500' : 'bg-amber-500'
                  )}>
                    {invoice.status === 'paid' ? 'ชำระแล้ว' :
                     invoice.status === 'sent' ? 'ส่งแล้ว' : 'รอดำเนินการ'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cost Summary */}
        {(jobCard.estimated_cost || jobCard.actual_cost) && (
          <Card>
            <CardHeader>
              <CardTitle>สรุปค่าใช้จ่าย</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {jobCard.estimated_cost && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ประมาณการ</span>
                    <span>฿{jobCard.estimated_cost.toLocaleString()}</span>
                  </div>
                )}
                {jobCard.actual_cost && (
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>ค่าใช้จ่ายจริง</span>
                    <span className="text-emerald-600">฿{jobCard.actual_cost.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
