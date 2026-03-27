import { MessageSquare } from 'lucide-react';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface TwilioSettingsCardProps {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  whatsappFrom: string;
  onChange: (field: string, value: string) => void;
}

export function TwilioSettingsCard({
  accountSid,
  authToken,
  phoneNumber,
  whatsappFrom,
  onChange,
}: TwilioSettingsCardProps) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t.settings.twilioConfiguration}
        </CardTitle>
        <CardDescription>
          {t.settings.twilioDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="twilio_account_sid">{t.settings.accountSid}</Label>
          <Input
            id="twilio_account_sid"
            type="password"
            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={accountSid}
            onChange={(e) => onChange('twilio_account_sid', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twilio_auth_token">{t.settings.authToken}</Label>
          <Input
            id="twilio_auth_token"
            type="password"
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={authToken}
            onChange={(e) => onChange('twilio_auth_token', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="twilio_phone_number">{t.settings.smsPhoneNumber}</Label>
            <Input
              id="twilio_phone_number"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => onChange('twilio_phone_number', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twilio_whatsapp_from">{t.settings.whatsappFrom}</Label>
            <Input
              id="twilio_whatsapp_from"
              placeholder="+1234567890"
              value={whatsappFrom}
              onChange={(e) => onChange('twilio_whatsapp_from', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
