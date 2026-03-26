'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wrench, Plus, Search, Filter, Car, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Input } from '@garageos/ui/input';
import { cn } from '@garageos/ui/utils';

interface JobCard {
  id: string;
  title: string;
  status: string;
  created_at: string;
  vehicle: { license_plate: string; brand: string; model: string };
  customer: { name: string; phone: string };
  assigned_to: { name: string } | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  inspection: { label: 'Inspection', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  diagnosed: { label: 'Diagnosed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: AlertCircle },
  parts_ordered: { label: 'Parts Ordered', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: AlertCircle },
  in_progress: { label: 'In Progress', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Wrench },
  pending_approval: { label: 'Pending Approval', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertCircle },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400', icon: AlertCircle },
};

export default function JobCardsPage() {
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchJobCards();
  }, [statusFilter]);

  const fetchJobCards = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/job-cards?${params}`);
      if (response.ok) {
        const data = await response.json();
        setJobCards(data);
      }
    } catch (error) {
      console.error('Failed to fetch job cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobCards = jobCards.filter(card =>
    card.title.toLowerCase().includes(search.toLowerCase()) ||
    card.vehicle?.license_plate.toLowerCase().includes(search.toLowerCase()) ||
    card.customer?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Cards</h1>
          <p className="text-muted-foreground">
            Manage your repair jobs and track progress
          </p>
        </div>
        <Link href="/dashboard/job-cards/new">
          <Button className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            New Job Card
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, vehicle, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">All Status</option>
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Object.entries(statusConfig).slice(0, 4).map(([key, { label, color }]) => {
          const count = jobCards.filter(c => c.status === key).length;
          return (
            <Card
              key={key}
              className={cn('cursor-pointer transition-all hover:scale-105', statusFilter === key && 'ring-2 ring-primary')}
              onClick={() => setStatusFilter(statusFilter === key ? '' : key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{label}</span>
                  <Badge className={color}>{count}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Job Cards List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredJobCards.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No job cards found</h3>
            <p className="text-muted-foreground mb-4">
              {search ? 'Try adjusting your search' : 'Create your first job card to get started'}
            </p>
            <Link href="/dashboard/job-cards/new">
              <Button>Create Job Card</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredJobCards.map((card) => {
            const status = statusConfig[card.status];
            return (
              <Link key={card.id} href={`/dashboard/job-cards/${card.id}`}>
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Wrench className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{card.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              {card.vehicle?.brand} {card.vehicle?.model} - {card.vehicle?.license_plate}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {card.customer?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={status.color}>
                          <status.icon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                        {card.assigned_to && (
                          <span className="text-sm text-muted-foreground">
                            {card.assigned_to.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
