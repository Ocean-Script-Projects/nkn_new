import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Uncomment and set basePath when deploying to GitHub Pages project repository
  // basePath: '/repository-name',
};

export default nextConfig;
