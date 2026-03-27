'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  Car,
  Users,
  Package,
  FileText,
  Settings,
  Search,
  BarChart3,
  MessageSquare,
  Plus,
  Bell,
} from 'lucide-react';
import { cn } from '@garageos/ui/utils';
import { useTranslation } from '@/i18n';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  group: string;
  keywords?: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslation();

  const commands: CommandItem[] = [
    { id: 'dashboard', label: `${t.dashboard.goTo} ${t.nav.dashboard}`, icon: LayoutDashboard, href: '/dashboard', group: t.dashboard.navigation },
    { id: 'job-cards', label: `${t.dashboard.goTo} ${t.nav.jobCards}`, icon: Wrench, href: '/dashboard/job-cards', group: t.dashboard.navigation },
    { id: 'vehicles', label: `${t.dashboard.goTo} ${t.nav.vehicles}`, icon: Car, href: '/dashboard/vehicles', group: t.dashboard.navigation },
    { id: 'customers', label: `${t.dashboard.goTo} ${t.nav.customers}`, icon: Users, href: '/dashboard/customers', group: t.dashboard.navigation },
    { id: 'inventory', label: `${t.dashboard.goTo} ${t.nav.inventory}`, icon: Package, href: '/dashboard/inventory', group: t.dashboard.navigation },
    { id: 'invoices', label: `${t.dashboard.goTo} ${t.nav.invoices}`, icon: FileText, href: '/dashboard/invoices', group: t.dashboard.navigation },
    { id: 'analytics', label: `${t.dashboard.goTo} ${t.nav.analytics}`, icon: BarChart3, href: '/dashboard/analytics', group: t.dashboard.navigation },
    { id: 'messages', label: `${t.dashboard.goTo} ${t.nav.messages}`, icon: MessageSquare, href: '/dashboard/messages', group: t.dashboard.navigation },
    { id: 'reminders', label: `${t.dashboard.goTo} ${t.nav.reminders}`, icon: Bell, href: '/dashboard/reminders', group: t.dashboard.navigation },
    { id: 'settings', label: `${t.dashboard.goTo} ${t.nav.settings}`, icon: Settings, href: '/dashboard/settings', group: t.dashboard.navigation },
    { id: 'new-job', label: `${t.dashboard.createNew} ${t.nav.jobCards}`, icon: Plus, href: '/dashboard/job-cards/new', group: t.dashboard.actions, keywords: ['add', 'create', 'job'] },
    { id: 'new-vehicle', label: `${t.dashboard.addNew} ${t.nav.vehicles}`, icon: Plus, href: '/dashboard/vehicles/new', group: t.dashboard.actions, keywords: ['add', 'create', 'vehicle'] },
    { id: 'new-customer', label: `${t.dashboard.addNew} ${t.nav.customers}`, icon: Plus, href: '/dashboard/customers/new', group: t.dashboard.actions, keywords: ['add', 'create', 'customer'] },
    { id: 'new-part', label: `${t.dashboard.addNew} ${t.nav.inventory}`, icon: Plus, href: '/dashboard/inventory/new', group: t.dashboard.actions, keywords: ['add', 'create', 'part'] },
  ];

  const filtered = query
    ? commands.filter(cmd => {
        const q = query.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(q) ||
          cmd.id.includes(q) ||
          cmd.keywords?.some(k => k.includes(q))
        );
      })
    : commands;

  const groups = [...new Set(filtered.map(c => c.group))];

  const handleSelect = useCallback((cmd: CommandItem) => {
    setOpen(false);
    setQuery('');
    if (cmd.href) router.push(cmd.href);
    else cmd.action?.();
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (!open) return;
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex]);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, filtered, selectedIndex, handleSelect]);

  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  let flatIndex = -1;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => { setOpen(false); setQuery(''); }} />
      <div className="fixed inset-x-0 top-[20%] z-50 mx-auto w-full max-w-lg">
        <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              placeholder={t.dashboard.typeCommand}
              className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">{t.dashboard.noResults}</p>
            ) : (
              groups.map(group => (
                <div key={group}>
                  <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{group}</p>
                  {filtered
                    .filter(c => c.group === group)
                    .map(cmd => {
                      flatIndex++;
                      const idx = flatIndex;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => handleSelect(cmd)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                            idx === selectedIndex
                              ? 'bg-accent text-accent-foreground'
                              : 'text-foreground hover:bg-accent/50'
                          )}
                        >
                          <cmd.icon className="h-4 w-4 text-muted-foreground" />
                          <span>{cmd.label}</span>
                        </button>
                      );
                    })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1">↑↓</kbd> {t.dashboard.navigate}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1">↵</kbd> {t.dashboard.select}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1">esc</kbd> {t.dashboard.closeLabel}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
