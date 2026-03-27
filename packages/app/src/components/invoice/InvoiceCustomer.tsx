'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface Customer {
  name: string;
  phone: string;
  email: string | null;
}

interface InvoiceCustomerProps {
  customer: Customer | null;
}

export function InvoiceCustomer({ customer }: InvoiceCustomerProps) {
  if (!customer) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-medium">{customer.name}</p>
          <p className="text-sm text-muted-foreground">{customer.phone}</p>
          {customer.email && (
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
