'use client';

import { Label } from '@garageos/ui/label';
import { Textarea } from '@garageos/ui/textarea';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';
import { CHANNELS, generateMessageTemplate } from '@/lib/messaging/templates';

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface NewMessageFormProps {
  customers: Customer[];
  formData: {
    customer_id: string;
    type: string;
    channel: string;
    content: string;
  };
  sending: boolean;
  onFormChange: (field: string, value: string) => void;
  onTemplateSelect: (type: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function NewMessageForm({
  customers,
  formData,
  sending,
  onFormChange,
  onTemplateSelect,
  onSubmit,
  onCancel,
}: NewMessageFormProps) {
  const t = useTranslation();

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle>{t.message.newMessage}</CardTitle>
        <CardDescription>{t.message.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Customer *</Label>
          <select
            value={formData.customer_id}
            onChange={(e) => onFormChange('customer_id', e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">Select customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Channel *</Label>
            <select
              value={formData.channel}
              onChange={(e) => onFormChange('channel', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              {CHANNELS.map(ch => (
                <option key={ch.value} value={ch.value}>{ch.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Template</Label>
            <select
              onChange={(e) => onTemplateSelect(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">Custom message</option>
              <option value="status_update">Status Update</option>
              <option value="approval">Approval Request</option>
              <option value="ready">Ready for Pickup</option>
              <option value="payment">Payment Reminder</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Message *</Label>
          <Textarea
            value={formData.content}
            onChange={(e) => onFormChange('content', e.target.value)}
            placeholder="Type your message..."
            rows={5}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            {t.common.cancel}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={sending || !formData.customer_id || !formData.content}
            className="btn-gradient"
          >
            {sending ? t.message.sending : t.message.sendMessage}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
