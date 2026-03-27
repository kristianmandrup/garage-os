'use client';

import { Search, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Input } from '@garageos/ui/input';
import { cn } from '@garageos/ui/utils';

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface CustomerSelectionProps {
  customers: Customer[];
  selectedCustomerId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCustomer: (customerId: string) => void;
}

export function CustomerSelection({
  customers,
  selectedCustomerId,
  searchQuery,
  onSearchChange,
  onSelectCustomer,
}: CustomerSelectionProps) {
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Customer</CardTitle>
        <CardDescription>
          Choose the customer for this job card
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => onSelectCustomer(customer.id)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                selectedCustomerId === customer.id
                  ? 'bg-primary/10 border border-primary'
                  : 'hover:bg-muted'
              )}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              </div>
            </button>
          ))}
          {filteredCustomers.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">
              No customers found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
