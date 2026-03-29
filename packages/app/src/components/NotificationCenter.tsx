'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Wrench, Users, Package, FileText, X } from 'lucide-react';
import { cn } from '@garageos/ui/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@garageos/ui/button';
import { useTranslation } from '@/i18n';

interface Notification {
  id: string;
  type: 'job' | 'customer' | 'inventory' | 'invoice' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const iconMap = {
  job: { icon: Wrench, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  customer: { icon: Users, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  inventory: { icon: Package, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  invoice: { icon: FileText, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  system: { icon: Bell, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' },
};

export function NotificationCenter() {
  const t = useTranslation();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'job', title: 'Job Card Updated', message: 'Oil change for Honda Civic marked as completed', time: '5m ago', read: false },
    { id: '2', type: 'inventory', title: 'Low Stock Alert', message: 'Brake pads below minimum quantity', time: '1h ago', read: false },
    { id: '3', type: 'customer', title: 'New Customer', message: 'Somchai registered via the portal', time: '2h ago', read: true },
  ]);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Subscribe to Supabase realtime changes
  useEffect(() => {
    let channel: any;
    try {
      const supabase = createClient();
      channel = supabase
        .channel('notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'job_cards' }, (payload: any) => {
          setNotifications(prev => [{
            id: Math.random().toString(36).slice(2),
            type: 'job' as const,
            title: 'New Job Card',
            message: payload.new?.title || 'A new job card was created',
            time: 'Just now',
            read: false,
          }, ...prev]);
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'customers' }, (payload: any) => {
          setNotifications(prev => [{
            id: Math.random().toString(36).slice(2),
            type: 'customer' as const,
            title: 'New Customer',
            message: payload.new?.name || 'A new customer was added',
            time: 'Just now',
            read: false,
          }, ...prev]);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'parts' }, (payload: any) => {
          if (payload.new?.quantity <= (payload.new?.min_quantity || 0)) {
            setNotifications(prev => [{
              id: Math.random().toString(36).slice(2),
              type: 'inventory' as const,
              title: 'Low Stock Alert',
              message: `${payload.new?.name || 'A part'} is running low`,
              time: 'Just now',
              read: false,
            }, ...prev]);
          }
        })
        .subscribe();
    } catch {
      // Supabase not configured - use demo data only
    }
    return () => { channel?.unsubscribe(); };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        data-testid="notification-btn"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div data-testid="notification-panel" className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm">{t.dashboard.notifications}</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Check className="h-3 w-3" /> {t.dashboard.markAllRead}
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {t.dashboard.noNotifications}
              </div>
            ) : (
              notifications.map(notification => {
                const config = iconMap[notification.type];
                const Icon = config.icon;
                return (
                  <div
                    key={notification.id}
                    onClick={() => markRead(notification.id)}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-b border-border last:border-0',
                      !notification.read && 'bg-primary/5'
                    )}
                  >
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                      <Icon className={cn('h-4 w-4', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn('text-sm', !notification.read && 'font-medium')}>{notification.title}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); dismiss(notification.id); }}
                          className="text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
