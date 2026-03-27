'use client';

import { MessageSquare, Plus, Phone, MessageCircle, Bell, Clock, Send, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@garageos/ui/badge';
import { Button } from '@garageos/ui/button';
import { Card, CardContent } from '@garageos/ui/card';
import { cn } from '@garageos/ui/utils';
import { CHANNELS } from '@/lib/messaging/templates';
import { useTranslation, useLocale, formatDateOnly } from '@/i18n';

interface Customer {
  name: string;
  phone: string;
}

interface JobCard {
  title: string;
}

interface Message {
  id: string;
  type: string;
  channel: string;
  content: string;
  status: string;
  sent_at: string;
  customer?: Customer;
  job_card?: JobCard | null;
}

interface MessagesListProps {
  messages: Message[];
  loading: boolean;
  onNewMessage: () => void;
}

const STATUS_CONFIG = {
  pending: { labelKey: 'pending', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  sent: { labelKey: 'sent', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Send },
  delivered: { labelKey: 'delivered', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
  read: { labelKey: 'read', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: CheckCircle },
  failed: { labelKey: 'failed', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

export function MessagesList({ messages, loading, onNewMessage }: MessagesListProps) {
  const t = useTranslation();
  const { locale } = useLocale();

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Phone className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      case 'line': return <span className="text-lg">💚</span>;
      case 'app': return <Bell className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t.message.noMessagesYet}</h3>
          <p className="text-muted-foreground mb-4">
            {t.message.noMessagesDescription}
          </p>
          <Button onClick={onNewMessage}>
            <Plus className="h-4 w-4 mr-2" />
            {t.message.newMessage}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {messages.map((message) => {
            const status = STATUS_CONFIG[message.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
            return (
              <div key={message.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {getChannelIcon(message.channel)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{message.customer?.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {CHANNELS.find(c => c.value === message.channel)?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {message.content}
                      </p>
                      {message.job_card && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Job: {message.job_card.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn('text-xs', status.color)}>
                      <status.icon className="h-3 w-3 mr-1" />
                      {t.message.statuses[status.labelKey as keyof typeof t.message.statuses]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateOnly(new Date(message.sent_at), locale)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
