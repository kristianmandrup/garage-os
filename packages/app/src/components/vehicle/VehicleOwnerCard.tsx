'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface VehicleOwnerCardProps {
  customer: Customer;
}

export function VehicleOwnerCard({ customer }: VehicleOwnerCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Owner</CardTitle>
        <Link href={`/dashboard/customers/${customer.id}`}>
          <Button variant="ghost" size="sm">
            View Profile
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-lg">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
