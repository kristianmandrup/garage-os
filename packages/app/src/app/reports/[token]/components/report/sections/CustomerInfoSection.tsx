'use client';

import { User, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import type { ReportData } from '../types';

interface CustomerInfoSectionProps {
  customer: ReportData['jobCard']['customer'];
}

export function CustomerInfoSection({ customer }: CustomerInfoSectionProps) {
  return (
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
            <p className="font-semibold">{customer.name}</p>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">{customer.phone}</p>
            </div>
          )}
          {customer.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">{customer.email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
