'use client';

import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Button } from '@garageos/ui/button';
import { Progress } from '@garageos/ui/progress';
import { cn } from '@garageos/ui/utils';
import { useTranslation, useLocale, formatCurrency } from '@/i18n';

interface StockPricingCardProps {
  part: {
    cost_price: number;
    sell_price: number;
    quantity: number;
    min_quantity: number | null;
    status: string;
  };
  stockPercent: number;
  margin: string;
  editing: boolean;
  formData: {
    cost_price: string;
    sell_price: string;
    quantity: string;
    min_quantity: string;
  };
  saving: boolean;
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function StockPricingCard({
  part,
  stockPercent,
  margin,
  editing,
  formData,
  saving,
  onFormChange,
  onSave,
  onCancel,
}: StockPricingCardProps) {
  const t = useTranslation();
  const { locale } = useLocale();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock & Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cost Price (฿)</Label>
                <Input
                  type="number"
                  value={formData.cost_price}
                  onChange={(e) => onFormChange('cost_price', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Sell Price (฿)</Label>
                <Input
                  type="number"
                  value={formData.sell_price}
                  onChange={(e) => onFormChange('sell_price', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Stock</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => onFormChange('quantity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Min Stock Alert</Label>
                <Input
                  type="number"
                  value={formData.min_quantity}
                  onChange={(e) => onFormChange('min_quantity', e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={onSave} disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stock Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Stock Level</span>
                <span className="text-sm text-muted-foreground">
                  {part.quantity} {part.min_quantity ? `/ ${part.min_quantity}` : ''}
                </span>
              </div>
              <Progress
                value={stockPercent}
                className={cn(
                  'h-3',
                  part.quantity === 0 ? '[&>div]:bg-red-500' :
                  stockPercent < 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'
                )}
              />
              {part.status === 'low_stock' && (
                <div className="flex items-center gap-2 mt-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Stock is running low</span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Cost</p>
                <p className="text-lg font-bold">{formatCurrency(part.cost_price, locale)}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Sell</p>
                <p className="text-lg font-bold">{formatCurrency(part.sell_price, locale)}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <p className="text-sm text-muted-foreground">Margin</p>
                <p className="text-lg font-bold text-emerald-600">{margin}%</p>
              </div>
            </div>

            {/* Total Value */}
            <div className="p-4 rounded-lg bg-primary/10">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Stock Value</span>
                <span className="text-xl font-bold">
                  {formatCurrency(part.quantity * part.sell_price, locale)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
