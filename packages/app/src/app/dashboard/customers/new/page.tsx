'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Input } from '@garageos/ui/input';
import { Textarea } from '@garageos/ui/textarea';
import { FormField } from '@garageos/ui/form-field';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@garageos/ui/breadcrumb';
import { useTranslation } from '@/i18n';

export default function NewCustomerPage() {
  const t = useTranslation();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const handleCreateCustomer = async () => {
    if (!formData.name || !formData.phone) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          address: formData.address || null,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        const customer = await response.json();
        router.push(`/dashboard/customers/${customer.id}`);
      }
    } catch (error) {
      console.error('Failed to create customer:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/customers">Customers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Customer</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.newCustomer.title}</h1>
          <p className="text-muted-foreground">
            {t.newCustomer.description}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.newCustomer.customerInformation}</CardTitle>
          <CardDescription>
            {t.newCustomer.customerInformationDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label={t.newCustomer.name} required htmlFor="name">
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.newCustomer.namePlaceholder}
            />
          </FormField>

          <FormField label={t.newCustomer.phone} required htmlFor="phone">
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t.newCustomer.phonePlaceholder}
            />
          </FormField>

          <FormField label={t.newCustomer.email} htmlFor="email">
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t.newCustomer.emailPlaceholder}
            />
          </FormField>

          <FormField label={t.newCustomer.address} htmlFor="address">
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t.newCustomer.addressPlaceholder}
              rows={3}
            />
          </FormField>

          <FormField label={t.newCustomer.notes} htmlFor="notes">
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t.newCustomer.notesPlaceholder}
              rows={3}
            />
          </FormField>

          <div className="flex gap-3 pt-4">
            <Link href="/dashboard/customers" className="flex-1">
              <Button variant="outline" className="w-full">
                {t.newCustomer.cancel}
              </Button>
            </Link>
            <Button
              onClick={handleCreateCustomer}
              disabled={saving || !formData.name || !formData.phone}
              className="flex-1 btn-gradient"
            >
              {saving ? t.newCustomer.creating : t.newCustomer.addCustomer}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
