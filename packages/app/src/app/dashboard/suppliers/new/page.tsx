'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Textarea } from '@garageos/ui/textarea';
import { cn } from '@garageos/ui/utils';
import { useTranslation } from '@/i18n';

export default function NewSupplierPage() {
  const t = useTranslation();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const handleCreateSupplier = async () => {
    if (!formData.name) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          contact_person: formData.contact_person || null,
          phone: formData.phone || null,
          email: formData.email || null,
          address: formData.address || null,
          notes: formData.notes || null,
          rating: rating || null,
        }),
      });

      if (response.ok) {
        const supplier = await response.json();
        router.push(`/dashboard/suppliers/${supplier.id}`);
      }
    } catch (error) {
      console.error('Failed to create supplier:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/suppliers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.newSupplier.title}</h1>
          <p className="text-muted-foreground">
            {t.newSupplier.description}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.newSupplier.supplierInformation}</CardTitle>
          <CardDescription>
            {t.newSupplier.supplierInformationDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.newSupplier.companyName} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.newSupplier.companyNamePlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_person">{t.newSupplier.contactPerson}</Label>
            <Input
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              placeholder={t.newSupplier.contactPersonPlaceholder}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t.newSupplier.phone}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t.newSupplier.phonePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.newSupplier.email}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t.newSupplier.emailPlaceholder}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t.newSupplier.address}</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t.newSupplier.addressPlaceholder}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.newSupplier.rating}</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star === rating ? 0 : star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={cn(
                      'h-6 w-6',
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-200'
                    )}
                  />
                </button>
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {rating > 0 ? `${rating}/5` : t.newSupplier.notRated}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t.newSupplier.notes}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t.newSupplier.notesPlaceholder}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href="/dashboard/suppliers" className="flex-1">
              <Button variant="outline" className="w-full">
                {t.newSupplier.cancel}
              </Button>
            </Link>
            <Button
              onClick={handleCreateSupplier}
              disabled={saving || !formData.name}
              className="flex-1 btn-gradient"
            >
              {saving ? t.newSupplier.creating : t.newSupplier.addSupplier}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
