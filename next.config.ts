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

// По умолчанию — полный Next (API работают). Статика только если STATIC_EXPORT=true (GitHub Pages и т.п.).
// Прод-админка: ENABLE_ADMIN_API=true + ADMIN_SECRET на сервере.

// Optional public catalog URLs:
// NEXT_PUBLIC_PIECES_URL / NEXT_PUBLIC_CATEGORIES_URL — full JSON URLs, or
// NEXT_PUBLIC_MEDIATHEK_BASE_URL — base URL; app loads …/catalog/pieces.json and …/catalog/categories.json

const staticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  ...(staticExport ? { output: 'export' as const } : {}),
  env: {
    NEXT_PUBLIC_STATIC_EXPORT:
      staticExport && isProduction ? '1' : '0',
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
