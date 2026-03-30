import type { NextConfig } from 'next';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
/** GitHub Pages default: `/nkn_new`. For App Platform / custom domain at root, set `NEXT_PUBLIC_BASE_PATH=` at build time. */
const basePath =
  typeof process.env.NEXT_PUBLIC_BASE_PATH === 'string'
    ? process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, '')
    : isProduction
      ? '/nkn_new'
      : '';

// Make basePath available to client-side code
process.env.NEXT_PUBLIC_BASE_PATH = basePath;

// Admin API: только в dev или на Node без static export при ENABLE_ADMIN_API=true + ADMIN_SECRET.
// С output: export маршруты /api в прод не попадают — админка каталога локально: npm run dev.

// Optional public catalog URLs:
// NEXT_PUBLIC_PIECES_URL / NEXT_PUBLIC_CATEGORIES_URL — full JSON URLs, or
// NEXT_PUBLIC_MEDIATHEK_BASE_URL — base URL; app loads …/catalog/pieces.json and …/catalog/categories.json

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    /** Клиент: прод-статика без серверных /api (см. страница /admin). */
    NEXT_PUBLIC_STATIC_EXPORT: isProduction ? '1' : '0',
  },
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
