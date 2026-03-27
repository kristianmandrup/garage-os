'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { Textarea } from '@garageos/ui/textarea';
import { Button } from '@garageos/ui/button';

interface InvoiceNotesProps {
  notes: string;
  updating: boolean;
  placeholder: string;
  savingLabel: string;
  saveLabel: string;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
}

export function InvoiceNotes({
  notes,
  updating,
  placeholder,
  savingLabel,
  saveLabel,
  onNotesChange,
  onSave,
}: InvoiceNotesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={onSave}
          disabled={updating}
        >
          {updating ? savingLabel : saveLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
