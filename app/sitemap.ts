import type { MetadataRoute } from 'next';

import { locales, defaultLocale } from '@/lib/i18n-config';
import { absolutePublicUrl } from '@/lib/site-url';

/** Public content segments, ordered by how much they matter commercially. */
const SEGMENTS = [
  'bespoke',
  'services',
  'pieces',
  'upcycling',
  'prints',
  'collaboration',
  'about',
  'contact',
  'privacy',
  'impressum',
] as const;

/** Legal pages carry little search value but must stay indexable for compliance. */
const LOW_PRIORITY = new Set<string>(['privacy', 'impressum']);

function localizedPath(locale: string, segment?: string): string {
  return segment ? `/${locale}/${segment}/` : `/${locale}/`;
}

/**
 * Every URL declares the full set of language alternates, including x-default.
 * Google treats sitemap hreflang as authoritative, which matters here because the
 * three locales are otherwise near-identical pages competing with each other.
 */
function alternatesFor(segment?: string) {
  return {
    languages: {
      ...Object.fromEntries(
        locales.map((l) => [l, absolutePublicUrl(localizedPath(l, segment))]),
      ),
      'x-default': absolutePublicUrl(localizedPath(defaultLocale, segment)),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: absolutePublicUrl(localizedPath(locale)),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: alternatesFor(),
    });
  }

  for (const segment of SEGMENTS) {
    for (const locale of locales) {
      entries.push({
        url: absolutePublicUrl(localizedPath(locale, segment)),
        lastModified,
        changeFrequency: 'monthly',
        priority: LOW_PRIORITY.has(segment) ? 0.2 : 0.8,
        alternates: alternatesFor(segment),
      });
    }
  }

  return entries;
}
