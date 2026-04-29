import type { MetadataRoute } from 'next';

import { locales } from '@/lib/i18n-config';
import { absolutePublicUrl } from '@/lib/site-url';

const SEGMENTS = [
  'about',
  'bespoke',
  'collaboration',
  'contact',
  'pieces',
  'prints',
  'services',
  'upcycling',
  'privacy',
  'terms',
  'agb',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Locale home pages (e.g. /en/, /de/)
  for (const locale of locales) {
    entries.push({
      url: absolutePublicUrl(`/${locale}/`),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    });
  }

  // Content pages (e.g. /en/about/, /de/agb/)
  for (const seg of SEGMENTS) {
    const suffix = `/${seg}/`;
    for (const locale of locales) {
      entries.push({
        url: absolutePublicUrl(`/${locale}${suffix}`),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
