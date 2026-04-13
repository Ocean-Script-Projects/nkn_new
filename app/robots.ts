import type { MetadataRoute } from 'next';
import { absolutePublicUrl, getBasePathSegment } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const bp = getBasePathSegment();
  const disallow: string[] = [
    bp ? `${bp}/admin/` : '/admin/',
    bp ? `${bp}/api/` : '/api/',
  ];

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow,
    },
    sitemap: absolutePublicUrl('/sitemap.xml'),
  };
}
