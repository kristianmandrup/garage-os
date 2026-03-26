'use client';

import { useState, useEffect } from 'react';
import { Calendar, Bell, CheckCircle, Clock, AlertTriangle, Plus, Car, User, Phone } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { cn } from '@garageos/ui/utils';

interface Reminder {
  id: string;
  vehicle_id: string;
  customer_id: string;
  reminder_type: string;
  description: string;
  due_date: string;
  due_mileage: number | null;
  status: string;
  created_at: string;
  vehicle: {
    id: string;
    license_plate: string;
    brand: string;
    model: string;
  };
  customer: {
    id: string;
    name: string;
    phone: string | null;
  };
}

const REMINDER_TYPE_LABELS: Record<string, string> = {
  oil_change: 'เปลี่ยนน้ำมันเครื่อง',
  tire_rotation: 'หมุนยาง',
  inspection: 'ตรวจสภาพรถ',
  insurance: 'ต่อประกัน',
  custom: 'แบบกำหนดเอง',
};

const STATUS_CONFIG = {
  pending: { label: 'รอดำเนินการ', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  sent: { label: 'ส่งแล้ว', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Bell },
  completed: { label: 'เสร็จสิ้น', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
  cancelled: { label: 'ยกเลิก', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: AlertTriangle },
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({
    vehicle_id: '',
    customer_id: '',
    reminder_type: 'oil_change',
    description: '',
    due_date: '',
    due_mileage: '',
  });
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchReminders();
    fetchVehicles();
    fetchCustomers();
  }, [statusFilter]);

  const fetchReminders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/reminders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReminders(data);
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const handleCreateReminder = async () => {
    if (!formData.vehicle_id || !formData.customer_id || !formData.due_date || !formData.description) {
      return;
    }

    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          due_mileage: formData.due_mileage ? parseInt(formData.due_mileage) : null,
        }),
      });

      if (response.ok) {
        setShowNew(false);
        setFormData({
          vehicle_id: '',
          customer_id: '',
          reminder_type: 'oil_change',
          description: '',
          due_date: '',
          due_mileage: '',
        });
        fetchReminders();
      }
    } catch (error) {
      console.error('Failed to create reminder:', error);
    }
  };

  const handleMarkComplete = async (id: string) => {
    try {
      await fetch(`/api/reminders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      fetchReminders();
    } catch (error) {
      console.error('Failed to update reminder:', error);
    }
  };

  const upcomingReminders = reminders.filter(r => r.status === 'pending');
  const todayReminders = reminders.filter(r => {
    const dueDate = new Date(r.due_date).toDateString();
    const today = new Date().toDateString();
    return dueDate === today && r.status === 'pending';
  });
  const overdueReminders = reminders.filter(r => {
    const dueDate = new Date(r.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && r.status === 'pending';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground">
            Manage predictive maintenance reminders
          </p>
        </div>
        <Button className="btn-gradient" onClick={() => setShowNew(!showNew)}>
          <Plus className="h-4 w-4 mr-2" />
          New Reminder
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Reminders', value: reminders.length, icon: Bell, color: 'blue' },
          { label: 'Due Today', value: todayReminders.length, icon: Calendar, color: 'amber' },
          { label: 'Overdue', value: overdueReminders.length, icon: AlertTriangle, color: 'red' },
          { label: 'Completed', value: reminders.filter(r => r.status === 'completed').length, icon: CheckCircle, color: 'emerald' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{loading ? '-' : stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30' :
                  'bg-red-100 dark:bg-red-900/30'
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'emerald' ? 'text-emerald-600' :
                    stat.color === 'amber' ? 'text-amber-600' :
                    'text-red-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Reminder Form */}
      {showNew && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>New Reminder</CardTitle>
            <CardDescription>Create a predictive maintenance reminder</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer *</Label>
                <select
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Select customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Vehicle *</Label>
                <select
                  value={formData.vehicle_id}
                  onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.license_plate} - {v.brand} {v.model}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reminder Type *</Label>
                <select
                  value={formData.reminder_type}
                  onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value })}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="oil_change">เปลี่ยนน้ำมันเครื่อง</option>
                  <option value="tire_rotation">หมุนยาง</option>
                  <option value="inspection">ตรวจสภาพรถ</option>
                  <option value="insurance">ต่อประกัน</option>
                  <option value="custom">แบบกำหนดเอง</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Input
                placeholder="e.g., เปลี่ยนน้ำมันเครื่อง Castrol 5W-30"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Mileage (optional)</Label>
              <Input
                type="number"
                placeholder="e.g., 80000"
                value={formData.due_mileage}
                onChange={(e) => setFormData({ ...formData, due_mileage: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button onClick={handleCreateReminder} className="btn-gradient">
                Create Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">All Status</option>
          <option value="pending">รอดำเนินการ</option>
          <option value="sent">ส่งแล้ว</option>
          <option value="completed">เสร็จสิ้น</option>
          <option value="cancelled">ยกเลิก</option>
        </select>
      </div>

      {/* Reminders List */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : reminders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reminders yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first maintenance reminder
            </p>
            <Button onClick={() => setShowNew(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Reminder
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {reminders.map((reminder) => {
                const status = STATUS_CONFIG[reminder.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                const isOverdue = new Date(reminder.due_date) < new Date() && reminder.status === 'pending';

                return (
                  <div key={reminder.id} className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          isOverdue ? 'bg-red-100 dark:bg-red-900/30' : 'bg-muted'
                        )}>
                          <Bell className={cn('h-5 w-5', isOverdue ? 'text-red-600' : 'text-muted-foreground')} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{REMINDER_TYPE_LABELS[reminder.reminder_type] || reminder.reminder_type}</p>
                            <Badge className={cn('text-xs', status.color)}>
                              <status.icon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {reminder.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              {reminder.vehicle?.license_plate}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {reminder.customer?.name}
                            </span>
                            {reminder.customer?.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {reminder.customer.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-sm',
                          isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'
                        )}>
                          {isOverdue ? 'เกินกำหนด' : ''} {new Date(reminder.due_date).toLocaleDateString('th-TH')}
                        </span>
                        {reminder.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkComplete(reminder.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
