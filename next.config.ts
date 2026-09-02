import type { NextConfig } from 'next';
import path from 'path';

/**
 * Serve from the domain root by default — that is what the custom domain and every
 * canonical URL assume. Sub-path hosting (GitHub Pages) must opt in explicitly by
 * setting `NEXT_PUBLIC_BASE_PATH=/nkn_new` at build time.
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

// Make basePath available to client-side code
process.env.NEXT_PUBLIC_BASE_PATH = basePath;

// Полный Next.js (API + SSR). Прод-админка: ENABLE_ADMIN_API=true + ADMIN_SECRET в runtime на сервере.

// Optional public catalog URLs:
// NEXT_PUBLIC_PIECES_URL / NEXT_PUBLIC_CATEGORIES_URL — full JSON URLs, or
// NEXT_PUBLIC_MEDIATHEK_BASE_URL — base URL; app loads …/catalog/pieces.json and …/catalog/categories.json

const nextConfig: NextConfig = {
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
