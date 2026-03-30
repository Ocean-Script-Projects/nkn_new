import type { NextConfig } from 'next';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/nkn_new' : '';

// Make basePath available to client-side code
process.env.NEXT_PUBLIC_BASE_PATH = basePath;

// Optional public catalog URLs (e.g. JSON hosted on DigitalOcean Spaces):
// NEXT_PUBLIC_PIECES_URL, NEXT_PUBLIC_CATEGORIES_URL

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(basePath && { basePath }),
  ...(basePath && { assetPrefix: basePath }),
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
