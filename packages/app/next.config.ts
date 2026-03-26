import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@garageos/ui'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
