import type { Metadata } from 'next';
import { absolutePublicUrl } from '@/lib/site-url';
import { locales, defaultLocale, type Locale } from '@/lib/i18n-config';
import { BRAND, OG_IMAGE } from '@/lib/site-config';
import { getSiteMessages } from '@/lib/messages-store';

export type PageSeoId =
  | 'home'
  | 'pieces'
  | 'upcycling'
  | 'bespoke'
  | 'services'
  | 'about'
  | 'contact'
  | 'collaboration'
  | 'prints'
  | 'privacy'
  | 'impressum';

const SEO_PATHS: Record<PageSeoId, string[]> = {
  home: ['homePage', 'seo'],
  pieces: ['pieces', 'seo'],
  upcycling: ['upcycling', 'seo'],
  bespoke: ['bespokePage', 'seo'],
  services: ['servicesPage', 'seo'],
  about: ['aboutPage', 'seo'],
  contact: ['contactPage', 'seo'],
  collaboration: ['collaborationPage', 'seo'],
  prints: ['printsPage', 'seo'],
  privacy: ['privacyPage', 'seo'],
  impressum: ['impressumPage', 'seo'],
};

const PAGE_SEGMENTS: Record<PageSeoId, string | null> = {
  home: null,
  pieces: 'pieces',
  upcycling: 'upcycling',
  bespoke: 'bespoke',
  services: 'services',
  about: 'about',
  contact: 'contact',
  collaboration: 'collaboration',
  prints: 'prints',
  privacy: 'privacy',
  impressum: 'impressum',
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
  // Merged base + admin overrides, so edited SEO titles/descriptions take effect.
  return getSiteMessages(locale);
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

  const title = seo?.title ?? BRAND.name;
  const description = seo?.description;

  const pathname = buildLocalizedPath(normalizedLocale, page);
  const canonical = absolutePublicUrl(pathname);

  const alternates: Metadata['alternates'] = {
    canonical,
    languages: {
      ...Object.fromEntries(
        locales.map((l) => [l, absolutePublicUrl(buildLocalizedPath(l, page))]),
      ),
      // Fallback for visitors whose language matches none of the three.
      'x-default': absolutePublicUrl(buildLocalizedPath(defaultLocale, page)),
    },
  };

  const ogImage = {
    url: OG_IMAGE.path,
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
    alt: title,
  };

  const openGraph: Metadata['openGraph'] = {
    type: 'website',
    title,
    description,
    siteName: BRAND.name,
    url: canonical,
    locale: mapOgLocale(normalizedLocale),
    alternateLocale: locales
      .filter((l) => l !== normalizedLocale)
      .map((l) => mapOgLocale(l)),
    images: [ogImage],
  };

  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title,
    description,
    images: [OG_IMAGE.path],
  };

  // Titles are authored per page and already carry the brand where it helps.
  // Using `absolute` prevents the layout template appending "· NKN Atelier" a second time.
  return {
    title: { absolute: title },
    description,
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
