'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import type { Photo } from '../types';

interface PhotosSectionProps {
  photos: Photo[];
}

export function PhotosSection({ photos }: PhotosSectionProps) {
  if (photos.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>รูปภาพ</CardTitle>
        <CardDescription>ภาพที่ถ่ายจากการตรวจสภาพ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border">
              <img
                src={photo.thumbnail_url || photo.url}
                alt={photo.caption || 'Vehicle photo'}
                className="object-cover w-full h-full"
              />
              {photo.is_damage_photo && (
                <Badge className="absolute top-2 right-2 bg-red-500">เสียหาย</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
