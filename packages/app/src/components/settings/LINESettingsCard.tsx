import { MessageSquare, Plus } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Textarea } from '@garageos/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface LINESettingsCardProps {
  channelAccessToken: string;
  userId: string;
  creatingRichMenu: boolean;
  onChange: (field: string, value: string) => void;
  onCreateRichMenu: () => void;
}

export function LINESettingsCard({
  channelAccessToken,
  userId,
  creatingRichMenu,
  onChange,
  onCreateRichMenu,
}: LINESettingsCardProps) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t.settings.lineConfiguration}
        </CardTitle>
        <CardDescription>
          {t.settings.lineDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="line_channel_access_token">{t.settings.channelAccessToken}</Label>
          <Textarea
            id="line_channel_access_token"
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={channelAccessToken}
            onChange={(e) => onChange('line_channel_access_token', e.target.value)}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="line_user_id">{t.settings.yourLineUserId}</Label>
          <Input
            id="line_user_id"
            placeholder="U1234567890abcdef..."
            value={userId}
            onChange={(e) => onChange('line_user_id', e.target.value)}
          />
        </div>
        {channelAccessToken && (
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={onCreateRichMenu}
              disabled={creatingRichMenu}
              className="flex items-center gap-2"
            >
              {creatingRichMenu ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  {t.settings.creating}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  {t.settings.createRichMenu}
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {t.settings.richMenuDescription}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
