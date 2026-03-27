'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, Plus, Search, User, MapPin } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Input } from '@garageos/ui/input';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@garageos/ui/breadcrumb';
import { useTranslation, useLocale, formatNumber } from '@/i18n';

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  customer: { name: string; phone: string };
  created_at: string;
}

export default function VehiclesPage() {
  const t = useTranslation();
  const { locale } = useLocale();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.license_plate.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.customer?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Vehicles</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.nav.vehicles}</h1>
          <p className="text-muted-foreground">
            {t.vehicle.description}
          </p>
        </div>
        <Link href="/dashboard/vehicles/new">
          <Button className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            {t.vehicle.addVehicle}
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t.vehicle.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t.vehicle.noVehiclesFound}</h3>
            <p className="text-muted-foreground mb-4">
              {search ? t.vehicle.tryAdjustingSearch : t.vehicle.noVehiclesDescription}
            </p>
            <Link href="/dashboard/vehicles/new">
              <Button>{t.vehicle.addVehicle}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <Link key={vehicle.id} href={`/dashboard/vehicles/${vehicle.id}`}>
              <Card className="card-hover h-full">
                <CardContent className="p-6">
                  {/* Vehicle Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Car className="h-7 w-7 text-white" />
                    </div>
                    <Badge variant="outline">{vehicle.year}</Badge>
                  </div>

                  {/* Vehicle Info */}
                  <h3 className="font-bold text-lg mb-1">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {vehicle.license_plate}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{vehicle.customer?.name}</span>
                    </div>
                    {vehicle.mileage && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{formatNumber(vehicle.mileage, locale)} km</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {vehicle.fuel_type && (
                        <Badge variant="secondary">{vehicle.fuel_type}</Badge>
                      )}
                      {vehicle.transmission && (
                        <Badge variant="secondary">{vehicle.transmission}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
