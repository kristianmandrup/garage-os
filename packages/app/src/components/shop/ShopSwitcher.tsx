'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Building2, Check, Plus } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { cn } from '@garageos/ui/utils';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from '@garageos/ui/dropdown-menu';

interface Shop {
  id: string;
  name: string;
  logo_url: string | null;
  status: string;
}

interface ShopSwitcherProps {
  currentShopId?: string;
  onShopChange?: (shopId: string) => void;
}

export function ShopSwitcher({ currentShopId, onShopChange }: ShopSwitcherProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [activeShop, setActiveShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops/active');
      if (response.ok) {
        const data = await response.json();
        setShops(data.shops || []);
        setActiveShop(data.activeShop || null);
        if (data.activeShop && onShopChange && currentShopId !== data.activeShop.id) {
          onShopChange(data.activeShop.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchShop = async (shop: Shop) => {
    try {
      const response = await fetch('/api/shops/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shop_id: shop.id }),
      });

      if (response.ok) {
        setActiveShop(shop);
        localStorage.setItem('active_shop_id', shop.id);
        if (onShopChange) {
          onShopChange(shop.id);
        }
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to switch shop:', error);
    }
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="h-10 w-48 bg-muted animate-pulse rounded-lg" />
    );
  }

  if (shops.length === 0) {
    return (
      <Button variant="outline" size="sm" asChild>
        <a href="/dashboard/settings?new=shop">
          <Plus className="h-4 w-4 mr-2" />
          Add Shop
        </a>
      </Button>
    );
  }

  return (
    <Dropdown open={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 h-10 px-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            {activeShop?.logo_url ? (
              <img src={activeShop.logo_url} alt="" className="w-full h-full rounded object-contain" />
            ) : (
              <Building2 className="w-3 h-3 text-white" />
            )}
          </div>
          <span className="font-medium truncate max-w-[120px]">
            {activeShop?.name || 'Select Shop'}
          </span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end" className="w-64">
        <DropdownLabel>Your Shops</DropdownLabel>
        {shops.map((shop) => (
          <DropdownItem
            key={shop.id}
            onClick={() => switchShop(shop)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
              {shop.logo_url ? (
                <img src={shop.logo_url} alt="" className="w-full h-full rounded object-contain" />
              ) : (
                <Building2 className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{shop.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{shop.status}</p>
            </div>
            {activeShop?.id === shop.id && (
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            )}
          </DropdownItem>
        ))}
        <DropdownSeparator />
        <DropdownItem asChild>
          <a href="/dashboard/settings?new=shop" className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Add New Shop
          </a>
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

export default ShopSwitcher;
