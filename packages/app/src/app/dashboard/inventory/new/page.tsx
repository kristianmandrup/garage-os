'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';
import { usePartForm } from '@/hooks/usePartForm';
import { PartFormFields } from '@/components/inventory/PartFormFields';
import { PART_CATEGORIES } from '@/constants/partCategories';

export default function NewPartPage() {
  const t = useTranslation();
  const { formData, setFormData, suppliers, saving, handleCreatePart } = usePartForm();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.inventory.form.title}</h1>
          <p className="text-muted-foreground">
            {t.inventory.form.description}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.inventory.form.partInformation}</CardTitle>
          <CardDescription>
            {t.inventory.form.partInformationDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PartFormFields
            formData={formData}
            onChange={setFormData}
            suppliers={suppliers}
            categories={PART_CATEGORIES}
            saving={saving}
            onSubmit={handleCreatePart}
            t={t}
          />
        </CardContent>
      </Card>
    </div>
  );
}
