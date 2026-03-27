interface PortalHeaderProps {
  shopName: string;
  shopLogoUrl: string | null;
  customerName: string;
}

export function PortalHeader({ shopName, shopLogoUrl, customerName }: PortalHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{shopName}</h1>
            <p className="text-blue-100">ลูกค้า: {customerName}</p>
          </div>
          {shopLogoUrl && (
            <img src={shopLogoUrl} alt={shopName} className="h-12 w-12 rounded-lg object-contain bg-white" />
          )}
        </div>
      </div>
    </header>
  );
}
