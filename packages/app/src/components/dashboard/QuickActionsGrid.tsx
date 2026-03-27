'use client';

import Link from 'next/link';
import { Wrench, Car, Users, Camera } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

export function QuickActionsGrid() {
  const t = useTranslation();

  const quickActions = [
    { nameKey: 'newJobCard' as const, href: '/dashboard/job-cards/new', icon: Wrench, color: 'blue' },
    { nameKey: 'addVehicle' as const, href: '/dashboard/vehicles/new', icon: Car, color: 'emerald' },
    { nameKey: 'addCustomer' as const, href: '/dashboard/customers/new', icon: Users, color: 'purple' },
    { nameKey: 'aiInspection' as const, href: '/dashboard/inspection', icon: Camera, color: 'amber' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {quickActions.map((action) => (
        <Link key={action.nameKey} href={action.href}>
          <Card className="card-hover cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                action.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                'bg-amber-100 dark:bg-amber-900/30'
              }`}>
                <action.icon className={`h-7 w-7 ${
                  action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  action.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                  action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  'text-amber-600 dark:text-amber-400'
                }`} />
              </div>
              <p className="font-medium">{t.dashboard.quickActionsLabels[action.nameKey]}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
