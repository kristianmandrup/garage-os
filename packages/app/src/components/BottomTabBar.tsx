'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wrench, Car, Users, Menu } from 'lucide-react';
import { cn } from '@garageos/ui/utils';

interface BottomTabBarProps {
  onMenuPress: () => void;
}

const tabs = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/job-cards', icon: Wrench, label: 'Jobs' },
  { href: '/dashboard/vehicles', icon: Car, label: 'Vehicles' },
  { href: '/dashboard/customers', icon: Users, label: 'Customers' },
];

export function BottomTabBar({ onMenuPress }: BottomTabBarProps) {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <tab.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
              <span className={cn('text-[10px] font-medium', isActive && 'text-primary')}>{tab.label}</span>
            </Link>
          );
        })}
        <button
          onClick={onMenuPress}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          aria-label="More navigation options"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}
