'use client';

import { useState, useEffect } from 'react';
import {
  DashboardHeader,
  DashboardStatsCards,
  QuickActionsGrid,
  RecentJobCardsList,
  InventoryAlertsCard,
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
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    activeJobs: 0,
    totalVehicles: 0,
    totalCustomers: 0,
    lowStockCount: 0,
  });
  const [recentJobs, setRecentJobs] = useState<JobCard[]>([]);
  const [lowStockParts, setLowStockParts] = useState<Part[]>([]);

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

      <DashboardStatsCards stats={stats} loading={loading} />

      <QuickActionsGrid />

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentJobCardsList recentJobs={recentJobs} loading={loading} />
        <InventoryAlertsCard lowStockParts={lowStockParts} loading={loading} />
      </div>
    </div>
  );
}
