import type { NextConfig } from 'next';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/nkn_new' : '';

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
