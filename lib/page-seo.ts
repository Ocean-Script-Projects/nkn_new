import type { Metadata } from 'next';
import { absolutePublicUrl } from '@/lib/site-url';
import { locales, defaultLocale, type Locale } from '@/lib/i18n-config';

export type PageSeoId =
  | 'home'
  | 'pieces'
  | 'upcycling'
  | 'events'
  | 'bespoke'
  | 'services'
  | 'about'
  | 'contact'
  | 'collaboration'
  | 'prints'
  | 'privacy'
  | 'terms'
  | 'agb';

const SEO_PATHS: Record<PageSeoId, string[]> = {
  home: ['homePage', 'seo'],
  pieces: ['pieces', 'seo'],
  upcycling: ['upcycling', 'seo'],
  events: ['events', 'seo'],
  bespoke: ['bespokePage', 'seo'],
  services: ['servicesPage', 'seo'],
  about: ['aboutPage', 'seo'],
  contact: ['contactPage', 'seo'],
  collaboration: ['collaborationPage', 'seo'],
  prints: ['printsPage', 'seo'],
  privacy: ['privacyPage', 'seo'],
  terms: ['termsPage', 'seo'],
  agb: ['agbPage', 'seo'],
};

const PAGE_SEGMENTS: Record<PageSeoId, string | null> = {
  home: null,
  pieces: 'pieces',
  upcycling: 'upcycling',
  events: 'events',
  bespoke: 'bespoke',
  services: 'services',
  about: 'about',
  contact: 'contact',
  collaboration: 'collaboration',
  prints: 'prints',
  privacy: 'privacy',
  terms: 'terms',
  agb: 'agb',
};

function getNested(obj: unknown, path: string[]): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur && typeof cur === 'object' && key in cur) {
      cur = (cur as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return cur;
}

async function loadMessages(locale: string) {
  switch (locale) {
    case 'en':
      return (await import('@/messages/en.json')).default;
    case 'de':
      return (await import('@/messages/de.json')).default;
    default:
      return (await import('@/messages/ru.json')).default;
  }
}

function normalizeLocale(locale: string): Locale {
  return (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale;
}

function buildLocalizedPath(locale: Locale, page: PageSeoId): string {
  const seg = PAGE_SEGMENTS[page];
  return seg ? `/${locale}/${seg}/` : `/${locale}/`;
}

function mapOgLocale(locale: Locale): string {
  switch (locale) {
    case 'de':
      return 'de_DE';
    case 'en':
      return 'en_US';
    case 'ru':
    default:
      return 'ru_RU';
  }
}

export async function buildPageMetadata(
  locale: string,
  page: PageSeoId,
): Promise<Metadata> {
  const normalizedLocale = normalizeLocale(locale);
  const messages = await loadMessages(normalizedLocale);
  const seo = getNested(messages, SEO_PATHS[page]) as
    | { title?: string; description?: string }
    | undefined;

  const title = seo?.title ?? 'NKN Atelier';
  const description = seo?.description;

  const pathname = buildLocalizedPath(normalizedLocale, page);
  const canonical = absolutePublicUrl(pathname);
  const alternates: Metadata['alternates'] = {
    canonical,
    languages: Object.fromEntries(
      locales.map((l) => [l, absolutePublicUrl(buildLocalizedPath(l, page))]),
    ),
  };

  const openGraph: Metadata['openGraph'] = {
    title,
    description,
    siteName: 'NKN Atelier',
    url: canonical,
    locale: mapOgLocale(normalizedLocale),
  };

  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title,
    description,
  };

  if (page === 'home') {
    return {
      title: { absolute: title },
      description,
      other: {
        'content-language': normalizedLocale,
      },
      alternates,
      openGraph,
      twitter,
    };
  }

  return {
    title,
    description,
    other: {
      'content-language': normalizedLocale,
    },
    alternates,
    openGraph,
    twitter,
  };
}

export function createPageMetadataGenerator(page: PageSeoId) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    return buildPageMetadata(locale, page);
  };
}
