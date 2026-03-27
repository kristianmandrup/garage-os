import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GarageOS - Smart Garage Management for Auto Repair Shops';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #3b82f6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            🔧
          </div>
          <span style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>
            GarageOS
          </span>
        </div>

        {/* Tagline */}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.1,
            margin: '0 0 16px 0',
          }}
        >
          &quot;Shopify for Auto Repair&quot;
        </h1>

        <p
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Mobile-first, AI-powered shop management for auto repair shops
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          {['AI Inspection', 'Digital Job Cards', 'Inventory', 'Analytics'].map((f) => (
            <div
              key={f}
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '999px',
                padding: '8px 20px',
                fontSize: '18px',
                color: 'white',
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
