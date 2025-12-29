import type { NextConfig } from 'next';

// Allow local LAN access during development without cross-origin warnings.
const devOrigins = process.env.NEXT_PUBLIC_DEV_ORIGINS?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: devOrigins ?? [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    '192.168.1.*.*',
  ],
};

export default nextConfig;
