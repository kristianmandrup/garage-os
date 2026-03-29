'use client';

import { Phone, Mail, MapPin, Star } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Textarea } from '@garageos/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { cn } from '@garageos/ui/utils';
import { useTranslation, useLocale, formatDateOnly } from '@/i18n';

interface Supplier {
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  rating: number | null;
  created_at: string;
}

interface SupplierContactCardProps {
  supplier: Supplier;
  editing: boolean;
  saving: boolean;
  rating: number;
  formData: {
    name: string;
    contact_person: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
  };
  onFormChange: (field: string, value: string) => void;
  onRatingChange: (rating: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function SupplierContactCard({
  supplier,
  editing,
  saving,
  rating,
  formData,
  onFormChange,
  onRatingChange,
  onSave,
  onCancel,
}: SupplierContactCardProps) {
  const t = useTranslation();
  const { locale } = useLocale();

  const renderStars = (r: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => editing && onRatingChange(star)}
          className={cn(
            'h-4 w-4',
            star <= r ? 'fill-amber-400 text-amber-400' : 'text-gray-300',
            editing && 'cursor-pointer hover:scale-110 transition-transform'
          )}
        >
          <Star className="h-4 w-4" />
        </button>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.suppliers.contactInformation}</CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.suppliers.companyName} *</Label>
              <Input
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.suppliers.contactPerson}</Label>
              <Input
                value={formData.contact_person}
                onChange={(e) => onFormChange('contact_person', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.suppliers.phone}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => onFormChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.suppliers.email}</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => onFormChange('email', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.suppliers.address}</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => onFormChange('address', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.suppliers.notes}</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => onFormChange('notes', e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={onSave} disabled={saving} className="flex-1">
                {saving ? t.suppliers.saving : t.suppliers.save}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                {t.suppliers.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {supplier.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.suppliers.phone}</p>
                  <p className="font-medium">{supplier.phone}</p>
                </div>
              </div>
            )}
            {supplier.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.suppliers.email}</p>
                  <p className="font-medium">{supplier.email}</p>
                </div>
              </div>
            )}
            {supplier.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.suppliers.address}</p>
                  <p className="font-medium">{supplier.address}</p>
                </div>
              </div>
            )}
            {supplier.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">{t.suppliers.notes}</p>
                <p className="font-medium">{supplier.notes}</p>
              </div>
            )}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">{t.suppliers.rating}</p>
              {supplier.rating ? renderStars(supplier.rating) : <p className="text-muted-foreground">{t.suppliers.notRated}</p>}
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">{t.suppliers.addedOn}</p>
              <p className="font-medium">{formatDateOnly(new Date(supplier.created_at), locale)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
