import { Settings } from 'lucide-react';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Textarea } from '@garageos/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface ShopInfoCardProps {
  name: string;
  phone: string;
  description: string;
  onChange: (field: string, value: string) => void;
}

export function ShopInfoCard({ name, phone, description, onChange }: ShopInfoCardProps) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t.settings.shopInformation}
        </CardTitle>
        <CardDescription>
          {t.settings.shopDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.settings.shopName}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => onChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t.settings.phone}</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t.settings.descriptionLabel}</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
