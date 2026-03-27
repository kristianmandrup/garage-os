import { MessageSquare, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { cn } from '@garageos/ui/utils';
import { useTranslation } from '@/i18n';

interface MessagingStatusCardProps {
  twilio: boolean;
  line: boolean;
}

export function MessagingStatusCard({ twilio, line }: MessagingStatusCardProps) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t.settings.messagingStatus}
        </CardTitle>
        <CardDescription>
          {t.settings.messagingStatusDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className={cn(
            'flex items-center gap-2 p-3 rounded-lg border',
            twilio ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-muted'
          )}>
            <CheckCircle className={cn('h-5 w-5', twilio ? 'text-emerald-600' : 'text-muted-foreground')} />
            <div>
              <p className="font-medium">{t.settings.twilioSMSWhatsApp}</p>
              <p className="text-sm text-muted-foreground">
                {twilio ? t.settings.configured : t.settings.notConfigured}
              </p>
            </div>
          </div>
          <div className={cn(
            'flex items-center gap-2 p-3 rounded-lg border',
            line ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-muted'
          )}>
            <CheckCircle className={cn('h-5 w-5', line ? 'text-emerald-600' : 'text-muted-foreground')} />
            <div>
              <p className="font-medium">{t.settings.lineMessaging}</p>
              <p className="text-sm text-muted-foreground">
                {line ? t.settings.configured : t.settings.notConfigured}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
