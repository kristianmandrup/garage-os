'use client';

import { useRef } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface ImageUploadCardProps {
  selectedImage: string | null;
  analyzing: boolean;
  error: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyze: () => void;
  onReset: () => void;
}

export function ImageUploadCard({
  selectedImage,
  analyzing,
  error,
  onFileSelect,
  onAnalyze,
  onReset,
}: ImageUploadCardProps) {
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.inspection.uploadPhoto}</CardTitle>
        <CardDescription>
          {t.inspection.uploadDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFileSelect}
          className="hidden"
        />

        {selectedImage ? (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black/5">
              <img
                src={`data:image/jpeg;base64,${selectedImage}`}
                alt="Vehicle to inspect"
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={onAnalyze}
                disabled={analyzing}
                className="flex-1 btn-gradient"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t.inspection.analyzing}
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    {t.inspection.analyzeWithAI}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onReset}>
                {t.inspection.reset}
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">{t.inspection.clickToUpload}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t.inspection.supportsFormat}
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
