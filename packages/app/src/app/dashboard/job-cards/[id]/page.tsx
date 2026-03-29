'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  JobCardHeader,
  JobCardVehicleCustomer,
  JobCardDescription,
  JobCardPhotos,
  JobCardPartsUsed,
  JobCardSidebar,
  JobCardQuickActions,
} from '@/components/job-card';
import { useTranslation } from '@/i18n';

interface JobCard {
  id: string;
  title: string;
  description: string | null;
  status: string;
  estimated_cost: number | null;
  actual_cost: number | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  scheduled_date: string | null;
  completed_at: string | null;
  created_at: string;
  vehicle: {
    id: string;
    license_plate: string;
    brand: string;
    model: string;
    year: number;
  };
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  assigned_to: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
  photos: Array<{
    id: string;
    url: string;
    caption: string | null;
    is_damage_photo: boolean;
  }>;
  part_usages: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    part: {
      id: string;
      name: string;
      part_number: string;
    };
  }>;
}

export default function JobCardDetailPage() {
  const t = useTranslation();
  const params = useParams();
  const router = useRouter();
  const [jobCard, setJobCard] = useState<JobCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    estimated_cost: '',
    actual_cost: '',
    estimated_hours: '',
    actual_hours: '',
  });

  useEffect(() => {
    fetchJobCard();
  }, [params.id]);

  const fetchJobCard = async () => {
    try {
      const response = await fetch(`/api/job-cards/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setJobCard(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          status: data.status || '',
          estimated_cost: data.estimated_cost?.toString() || '',
          actual_cost: data.actual_cost?.toString() || '',
          estimated_hours: data.estimated_hours?.toString() || '',
          actual_hours: data.actual_hours?.toString() || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch job card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!jobCard) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/job-cards/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
          actual_cost: formData.actual_cost ? parseFloat(formData.actual_cost) : null,
          estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
          actual_hours: formData.actual_hours ? parseFloat(formData.actual_hours) : null,
        }),
      });

      if (response.ok) {
        setEditing(false);
        fetchJobCard();
      }
    } catch (error) {
      console.error('Failed to update job card:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t.jobCards.detail.confirmDelete)) return;

    try {
      const response = await fetch(`/api/job-cards/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/job-cards');
      }
    } catch (error) {
      console.error('Failed to delete job card:', error);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!jobCard) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">{t.jobCards.detail.jobNotFound}</h2>
        <Link href="/dashboard/job-cards" className="text-primary hover:underline mt-4 inline-block">
          {t.jobCards.detail.backToJobCards}
        </Link>
      </div>
    );
  }

  const totalPartsCost = jobCard.part_usages?.reduce(
    (sum, pu) => sum + pu.quantity * pu.unit_price,
    0
  ) || 0;

  return (
    <div className="space-y-6">
      <JobCardHeader
        title={jobCard.title}
        status={jobCard.status}
        createdAt={jobCard.created_at}
        editing={editing}
        onEdit={() => setEditing(true)}
        onDelete={handleDelete}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <JobCardVehicleCustomer
            vehicle={jobCard.vehicle}
            customer={jobCard.customer}
          />

          <JobCardDescription
            description={jobCard.description}
            editing={editing}
            value={formData.description}
            onChange={(value) => handleFormChange('description', value)}
          />

          <JobCardPhotos
            photos={jobCard.photos}
            jobCardId={jobCard.id}
          />

          <JobCardPartsUsed partUsages={jobCard.part_usages} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <JobCardSidebar
            estimatedCost={jobCard.estimated_cost}
            actualCost={jobCard.actual_cost}
            partsCost={totalPartsCost}
            estimatedHours={jobCard.estimated_hours}
            actualHours={jobCard.actual_hours}
            assignedTo={jobCard.assigned_to}
            editing={editing}
            formData={formData}
            onFormChange={handleFormChange}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
            saving={saving}
          />

          <JobCardQuickActions
            jobCardId={jobCard.id}
            customerId={jobCard.customer.id}
            status={jobCard.status}
          />
        </div>
      </div>
    </div>
  );
}
