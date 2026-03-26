'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Wrench, Camera, Edit2, Trash2, CheckCircle, Clock, AlertCircle, User, Car, FileText, Package, MessageSquare, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Input } from '@garageos/ui/input';
import { Textarea } from '@garageos/ui/textarea';
import { Label } from '@garageos/ui/label';
import { StatusBadge } from '@garageos/ui/status-badge';
import { cn } from '@garageos/ui/utils';

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

// Create Invoice Button Component
function CreateInvoiceButton({ jobCardId, customerId }: { jobCardId: string; customerId?: string }) {
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleCreateInvoice = async () => {
    if (!customerId) {
      alert('No customer linked to this job card');
      return;
    }

    setCreating(true);
    try {
      const jobRes = await fetch(`/api/job-cards/${jobCardId}`);
      if (!jobRes.ok) throw new Error('Failed to fetch job card');
      const jobData = await jobRes.json();

      const partsRes = await fetch(`/api/parts/usage?job_card_id=${jobCardId}`);
      const partsData = partsRes.ok ? await partsRes.json() : [];
      const partsTotal = partsData.reduce((sum: number, pu: any) => sum + (pu.quantity * pu.unit_price), 0) || 0;

      const subtotal = (jobData.actual_cost || 0) + partsTotal;
      const taxRate = 7;
      const tax = subtotal * (taxRate / 100);

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_card_id: jobCardId,
          customer_id: customerId,
          subtotal,
          tax_rate: taxRate,
        }),
      });

      if (response.ok) {
        const invoice = await response.json();
        router.push(`/dashboard/invoices/${invoice.id}`);
      }
    } catch (error) {
      console.error('Failed to create invoice:', error);
      alert('Failed to create invoice');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={handleCreateInvoice}
      disabled={creating}
    >
      <FileText className="h-4 w-4 mr-2" />
      {creating ? 'Creating...' : 'Create Invoice'}
    </Button>
  );
}

// Share Report Button Component
function ShareReportButton({ jobCardId }: { jobCardId: string }) {
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShareReport = async () => {
    setSharing(true);
    try {
      const response = await fetch(`/api/job-cards/${jobCardId}/report`, {
        method: 'POST',
      });

      if (response.ok) {
        const { report_url } = await response.json();
        await navigator.clipboard.writeText(report_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (error) {
      console.error('Failed to share report:', error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={handleShareReport}
      disabled={sharing}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2 text-emerald-500" />
          Link Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-2" />
          {sharing ? 'Generating...' : 'Share Report'}
        </>
      )}
    </Button>
  );
}

const statusOptions = [
  { value: 'inspection', label: 'Inspection' },
  { value: 'diagnosed', label: 'Diagnosed' },
  { value: 'parts_ordered', label: 'Parts Ordered' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function JobCardDetailPage() {
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
    if (!confirm('Are you sure you want to delete this job card?')) return;

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
        <h2 className="text-xl font-semibold">Job card not found</h2>
        <Link href="/dashboard/job-cards" className="text-primary hover:underline mt-4 inline-block">
          Back to job cards
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/job-cards">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{jobCard.title}</h1>
            <p className="text-muted-foreground">
              Created {new Date(jobCard.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={jobCard.status as any} />
          {!editing && (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle & Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle & Customer</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Car className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{jobCard.vehicle.license_plate}</p>
                  <p className="text-sm text-muted-foreground">
                    {jobCard.vehicle.brand} {jobCard.vehicle.model} ({jobCard.vehicle.year})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{jobCard.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{jobCard.customer.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add a description..."
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">
                  {jobCard.description || 'No description provided'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Photos</CardTitle>
              <Link href={`/dashboard/job-cards/${jobCard.id}/photos`}>
                <Button size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {jobCard.photos && jobCard.photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {jobCard.photos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Job card photo'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No photos yet. Add photos to document the job.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Parts Used */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Parts Used</CardTitle>
            </CardHeader>
            <CardContent>
              {jobCard.part_usages && jobCard.part_usages.length > 0 ? (
                <div className="space-y-3">
                  {jobCard.part_usages.map((pu) => (
                    <div key={pu.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{pu.part.name}</p>
                        <p className="text-sm text-muted-foreground">{pu.part.part_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">฿{(pu.quantity * pu.unit_price).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Qty: {pu.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No parts used yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status & Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select status</option>
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Cost (฿)</Label>
                    <Input
                      type="number"
                      value={formData.estimated_cost}
                      onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Actual Cost (฿)</Label>
                    <Input
                      type="number"
                      value={formData.actual_cost}
                      onChange={(e) => setFormData({ ...formData, actual_cost: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Est. Hours</Label>
                      <Input
                        type="number"
                        value={formData.estimated_hours}
                        onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Actual Hours</Label>
                      <Input
                        type="number"
                        value={formData.actual_hours}
                        onChange={(e) => setFormData({ ...formData, actual_hours: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving} className="flex-1">
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Cost</span>
                      <span className="font-medium">฿{jobCard.estimated_cost?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Actual Cost</span>
                      <span className="font-medium">฿{jobCard.actual_cost?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Parts Cost</span>
                      <span className="font-medium">฿{totalPartsCost.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-lg">
                        ฿{((jobCard.actual_cost || 0) + totalPartsCost).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Est. Hours</span>
                      <span className="font-medium">{jobCard.estimated_hours || 0}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Actual Hours</span>
                      <span className="font-medium">{jobCard.actual_hours || 0}h</span>
                    </div>
                  </div>
                  {jobCard.assigned_to && (
                    <div className="pt-4 border-t flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{jobCard.assigned_to.name}</p>
                        <p className="text-sm text-muted-foreground">Assigned to</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/dashboard/inspection?job_card_id=${jobCard.id}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="h-4 w-4 mr-2" />
                  AI Inspection
                </Button>
              </Link>
              <Link href={`/dashboard/inventory?job_card_id=${jobCard.id}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Add Parts
                </Button>
              </Link>
              <Link href={`/dashboard/messages?customer_id=${jobCard.customer?.id}&job_card_id=${jobCard.id}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </Link>
              {jobCard.status === 'completed' && (
                <CreateInvoiceButton jobCardId={jobCard.id} customerId={jobCard.customer?.id} />
              )}
              <ShareReportButton jobCardId={jobCard.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
