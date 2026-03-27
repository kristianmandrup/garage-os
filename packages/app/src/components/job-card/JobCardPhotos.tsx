'use client';

import Link from 'next/link';
import { Camera } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  is_damage_photo: boolean;
}

interface JobCardPhotosProps {
  photos: Photo[];
  jobCardId: string;
}

export function JobCardPhotos({ photos, jobCardId }: JobCardPhotosProps) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t.jobCard.photos}</CardTitle>
        <Link href={`/dashboard/job-cards/${jobCardId}/photos`}>
          <Button size="sm">
            <Camera className="h-4 w-4 mr-2" />
            {t.jobCard.addPhoto}
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo) => (
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
            {t.jobCard.noPhotosYet}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
