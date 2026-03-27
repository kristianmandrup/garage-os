'use client';

import { useState, useEffect } from 'react';
import {
  DashboardHeader,
  DashboardStatsCards,
  QuickActionsGrid,
  RecentJobCardsList,
  InventoryAlertsCard,
  TodayOverview,
  ActivityFeed,
} from '@/components/dashboard';

interface JobCard {
  id: string;
  title: string;
  status: string;
  created_at: string;
  vehicle: { license_plate: string; brand: string; model: string };
}

interface Part {
  id: string;
  name: string;
  quantity: number;
  min_quantity: number | null;
}

interface Stats {
  activeJobs: number;
  totalVehicles: number;
  totalCustomers: number;
  lowStockCount: number;
  completedToday: number;
  pendingApprovals: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    activeJobs: 0,
    totalVehicles: 0,
    totalCustomers: 0,
    lowStockCount: 0,
    completedToday: 0,
    pendingApprovals: 0,
  });
  const [recentJobs, setRecentJobs] = useState<JobCard[]>([]);
  const [lowStockParts, setLowStockParts] = useState<Part[]>([]);
  const [activities, setActivities] = useState<Array<{
    id: string;
    type: 'job_created' | 'job_completed' | 'vehicle_added' | 'customer_added' | 'invoice_sent';
    title: string;
    description: string;
    time: string;
  }>>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch job cards
      const jobsRes = await fetch('/api/job-cards');
      if (jobsRes.ok) {
        const jobs = await jobsRes.json();
        const activeStatuses = ['inspection', 'diagnosed', 'parts_ordered', 'in_progress', 'pending_approval'];
        const activeJobs = jobs.filter((j: JobCard) => activeStatuses.includes(j.status)).length;
        setStats(prev => ({ ...prev, activeJobs }));
        setRecentJobs(jobs.slice(0, 5));

        // Derive activities from recent jobs
        const recentActivities = jobs.slice(0, 8).map((job: any) => {
          const isCompleted = job.status === 'completed';
          const hoursAgo = Math.floor((Date.now() - new Date(job.created_at).getTime()) / 3600000);
          const timeLabel = hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`;
          return {
            id: job.id,
            type: isCompleted ? 'job_completed' as const : 'job_created' as const,
            title: isCompleted ? `Job completed: ${job.title}` : `New job: ${job.title}`,
            description: `${job.vehicle?.brand || ''} ${job.vehicle?.model || ''} - ${job.vehicle?.license_plate || ''}`.trim(),
            time: timeLabel,
          };
        });
        setActivities(recentActivities);
      }

      // Fetch vehicles
      const vehiclesRes = await fetch('/api/vehicles');
      if (vehiclesRes.ok) {
        const vehicles = await vehiclesRes.json();
        setStats(prev => ({ ...prev, totalVehicles: vehicles.length }));
      }

      // Fetch customers
      const customersRes = await fetch('/api/customers');
      if (customersRes.ok) {
        const customers = await customersRes.json();
        setStats(prev => ({ ...prev, totalCustomers: customers.length }));
      }

      // Fetch low stock parts
      const partsRes = await fetch('/api/parts?low_stock=true');
      if (partsRes.ok) {
        const parts = await partsRes.json();
        setLowStockParts(parts.slice(0, 5));
        setStats(prev => ({ ...prev, lowStockCount: parts.length }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <TodayOverview activeJobs={stats.activeJobs} completedToday={stats.completedToday} pendingApprovals={stats.pendingApprovals} />

      <DashboardStatsCards stats={stats} loading={loading} />

      <QuickActionsGrid />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentJobCardsList recentJobs={recentJobs} loading={loading} />
        </div>
        <div className="space-y-6">
          <InventoryAlertsCard lowStockParts={lowStockParts} loading={loading} />
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}
