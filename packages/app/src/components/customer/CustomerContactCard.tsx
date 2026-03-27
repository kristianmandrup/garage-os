'use client';

import { Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Textarea } from '@garageos/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface Customer {
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
}

interface CustomerContactCardProps {
  customer: Customer;
  editing: boolean;
  saving: boolean;
  formData: {
    name: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function CustomerContactCard({
  customer,
  editing,
  saving,
  formData,
  onFormChange,
  onSave,
  onCancel,
}: CustomerContactCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => onFormChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => onFormChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => onFormChange('address', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => onFormChange('notes', e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={onSave} disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>
            {customer.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{customer.address}</p>
                </div>
              </div>
            )}
            {customer.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="font-medium">{customer.notes}</p>
              </div>
            )}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Customer Since</p>
              <p className="font-medium">{new Date(customer.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
