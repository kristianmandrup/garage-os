'use client';

import { User } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation, useLocale, formatCurrency } from '@/i18n';

interface JobCardSidebarProps {
  estimatedCost: number | null;
  actualCost: number | null;
  partsCost: number;
  estimatedHours: number | null;
  actualHours: number | null;
  assignedTo: { id: string; name: string } | null;
  editing: boolean;
  formData: {
    status: string;
    estimated_cost: string;
    actual_cost: string;
    estimated_hours: string;
    actual_hours: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

export function JobCardSidebar({
  estimatedCost,
  actualCost,
  partsCost,
  estimatedHours,
  actualHours,
  assignedTo,
  editing,
  formData,
  onFormChange,
  onSave,
  onCancel,
  saving,
}: JobCardSidebarProps) {
  const t = useTranslation();
  const { locale } = useLocale();
  const totalPartsCost = partsCost;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.jobCard.statusAndAssignment}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <>
            <div className="space-y-2">
              <Label>{t.jobCard.status}</Label>
              <select
                value={formData.status}
                onChange={(e) => onFormChange('status', e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select status</option>
                {Object.entries(t.jobCard.statuses).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{t.jobCard.estimatedCost}</Label>
              <Input
                type="number"
                value={formData.estimated_cost}
                onChange={(e) => onFormChange('estimated_cost', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.jobCard.actualCost}</Label>
              <Input
                type="number"
                value={formData.actual_cost}
                onChange={(e) => onFormChange('actual_cost', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.jobCard.estimatedHours}</Label>
                <Input
                  type="number"
                  value={formData.estimated_hours}
                  onChange={(e) => onFormChange('estimated_hours', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.jobCard.actualHours}</Label>
                <Input
                  type="number"
                  value={formData.actual_hours}
                  onChange={(e) => onFormChange('actual_hours', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onSave} disabled={saving} className="flex-1">
                {saving ? t.jobCard.saving : t.common.save}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                {t.jobCard.cancel}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.jobCard.estimatedCost}</span>
                <span className="font-medium">{formatCurrency(estimatedCost || 0, locale)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.jobCard.actualCost}</span>
                <span className="font-medium">{formatCurrency(actualCost || 0, locale)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.jobCard.partsCost}</span>
                <span className="font-medium">{formatCurrency(totalPartsCost, locale)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-medium">{t.jobCard.total}</span>
                <span className="font-bold text-lg">
                  {formatCurrency((actualCost || 0) + totalPartsCost, locale)}
                </span>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.jobCard.estimatedHours}</span>
                <span className="font-medium">{estimatedHours || 0}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.jobCard.actualHours}</span>
                <span className="font-medium">{actualHours || 0}h</span>
              </div>
            </div>
            {assignedTo && (
              <div className="pt-4 border-t flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{assignedTo.name}</p>
                  <p className="text-sm text-muted-foreground">{t.jobCard.assignedTo}</p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
