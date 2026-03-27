import { User, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface CustomerInfoCardProps {
  name: string;
  phone: string | null;
  email: string | null;
}

export function CustomerInfoCard({ name, phone, email }: CustomerInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          ข้อมูลลูกค้า
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">ชื่อ</p>
            <p className="font-medium">{name}</p>
          </div>
          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{phone}</p>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
