'use client';

import { Textarea } from '@garageos/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface JobCardDescriptionProps {
  description: string | null;
  editing: boolean;
  value: string;
  onChange: (value: string) => void;
}

export function JobCardDescription({
  description,
  editing,
  value,
  onChange,
}: JobCardDescriptionProps) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.jobCard.description}</CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t.jobCard.description}
            rows={4}
          />
        ) : (
          <p className="text-muted-foreground">
            {description || t.jobCard.noDescriptionProvided}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
