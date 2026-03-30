import type { NextConfig } from 'next';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/nkn_new' : '';

// Make basePath available to client-side code
process.env.NEXT_PUBLIC_BASE_PATH = basePath;

// Optional public catalog URLs:
// NEXT_PUBLIC_PIECES_URL / NEXT_PUBLIC_CATEGORIES_URL — full JSON URLs, or
// NEXT_PUBLIC_MEDIATHEK_BASE_URL — base URL; app loads …/catalog/pieces.json and …/catalog/categories.json

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
