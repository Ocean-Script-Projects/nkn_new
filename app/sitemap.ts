import type { MetadataRoute } from 'next';
import { defaultLocale, locales } from '@/lib/i18n-config';
import { absolutePublicUrl } from '@/lib/site-url';

const SEGMENTS = [
  'about',
  'bespoke',
  'collaboration',
  'contact',
  'events',
  'pieces',
  'prints',
  'services',
  'upcycling',
  'privacy',
  'terms',
  'agb',
] as const;

function alternatesForPath(pathSuffix: string) {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    const path = pathSuffix === '/' ? `/${loc}/` : `/${loc}${pathSuffix}`;
    languages[loc] = absolutePublicUrl(path);
  }
  languages['x-default'] = absolutePublicUrl(
    pathSuffix === '/' ? `/${defaultLocale}/` : `/${defaultLocale}${pathSuffix}`,
  );
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: absolutePublicUrl(`/${locale}/`),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: alternatesForPath('/'),
    });
  }

  for (const seg of SEGMENTS) {
    const suffix = `/${seg}/`;
    const alt = alternatesForPath(suffix);
    for (const locale of locales) {
      entries.push({
        url: absolutePublicUrl(`/${locale}${suffix}`),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: alt,
      });
    }
  }

  return entries;
}
