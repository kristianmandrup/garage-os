'use client';

import { useState, useEffect } from 'react';
import {
  RemindersHeader,
  RemindersStatsCards,
  NewReminderForm,
  ReminderFilters,
  RemindersList,
} from '@/components/reminders';

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
  vehicle?: {
    id: string;
    license_plate: string;
    brand: string;
    model: string;
  };
  customer?: {
    id: string;
    name: string;
    phone: string | null;
  };
}

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  mileage: number | null;
}

interface Customer {
  id: string;
  name: string;
}

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

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

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      <RemindersHeader showNew={showNew} onToggleNew={() => setShowNew(!showNew)} />

      <RemindersStatsCards
        loading={loading}
        totalReminders={reminders.length}
        dueToday={todayReminders.length}
        overdue={overdueReminders.length}
        completed={reminders.filter(r => r.status === 'completed').length}
      />

      {showNew && (
        <NewReminderForm
          vehicles={vehicles}
          customers={customers}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleCreateReminder}
          onCancel={() => setShowNew(false)}
        />
      )}

      <ReminderFilters statusFilter={statusFilter} onStatusChange={setStatusFilter} />

      <RemindersList
        reminders={reminders}
        loading={loading}
        onMarkComplete={handleMarkComplete}
        onCreateNew={() => setShowNew(true)}
      />
    </div>
  );
}
