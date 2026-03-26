'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Plus, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Input } from '@garageos/ui/input';
import { Progress } from '@garageos/ui/progress';

interface Part {
  id: string;
  name: string;
  part_number: string | null;
  category: string;
  brand: string | null;
  quantity: number;
  min_quantity: number | null;
  cost_price: number;
  sell_price: number;
  status: string;
  supplier: { name: string } | null;
}

export default function InventoryPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  useEffect(() => {
    fetchParts();
  }, [lowStockOnly]);

  const fetchParts = async () => {
    try {
      const params = new URLSearchParams();
      if (lowStockOnly) params.set('low_stock', 'true');

      const response = await fetch(`/api/parts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setParts(data);
      }
    } catch (error) {
      console.error('Failed to fetch parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(search.toLowerCase()) ||
    part.part_number?.toLowerCase().includes(search.toLowerCase()) ||
    part.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = parts.filter(p => p.quantity <= (p.min_quantity || 0)).length;
  const totalValue = parts.reduce((sum, p) => sum + (p.quantity * p.sell_price), 0);

  const getStockStatus = (part: Part) => {
    if (part.quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
    if (part.min_quantity && part.quantity <= part.min_quantity) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' };
    return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your parts and supplies
          </p>
        </div>
        <Link href="/dashboard/inventory/new">
          <Button className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            Add Part
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{parts.length}</p>
                <p className="text-sm text-muted-foreground">Total Parts</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={lowStockCount > 0 ? 'border-amber-500' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{lowStockCount}</p>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                {lowStockCount > 0 ? (
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">฿{totalValue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Inventory Value</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parts by name, number, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={lowStockOnly ? 'default' : 'outline'}
          onClick={() => setLowStockOnly(!lowStockOnly)}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Low Stock Only
        </Button>
      </div>

      {/* Parts Table */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : filteredParts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No parts found</h3>
            <p className="text-muted-foreground mb-4">
              {search ? 'Try adjusting your search' : 'Add your first part to get started'}
            </p>
            <Link href="/dashboard/inventory/new">
              <Button>Add Part</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredParts.map((part) => {
                const status = getStockStatus(part);
                const stockPercent = part.min_quantity ? Math.min((part.quantity / part.min_quantity) * 100, 100) : 100;

                return (
                  <Link key={part.id} href={`/dashboard/inventory/${part.id}`} className="block p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${part.quantity === 0 ? 'bg-red-100 dark:bg-red-900/30' : part.min_quantity && part.quantity <= part.min_quantity ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                          <Package className={`h-5 w-5 ${part.quantity === 0 ? 'text-red-600 dark:text-red-400' : part.min_quantity && part.quantity <= part.min_quantity ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{part.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {part.part_number && <span>#{part.part_number}</span>}
                            <span>•</span>
                            <span>{part.category}</span>
                            {part.brand && <><span>•</span><span>{part.brand}</span></>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right min-w-[120px]">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{part.quantity}</span>
                            {part.min_quantity && (
                              <span className="text-xs text-muted-foreground">/ {part.min_quantity}</span>
                            )}
                          </div>
                          <Progress
                            value={stockPercent}
                            className={`h-1.5 mt-1 ${part.quantity === 0 ? '[&>div]:bg-red-500' : stockPercent < 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
                          />
                        </div>

                        <div className="text-right min-w-[80px]">
                          <p className="font-medium">฿{part.sell_price}</p>
                          <p className="text-xs text-muted-foreground">sell price</p>
                        </div>

                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
