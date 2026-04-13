import type { Metadata } from 'next';

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

export async function buildPageMetadata(
  locale: string,
  page: PageSeoId,
): Promise<Metadata> {
  const messages = await loadMessages(locale);
  const seo = getNested(messages, SEO_PATHS[page]) as
    | { title?: string; description?: string }
    | undefined;

  const title = seo?.title ?? 'NKN Atelier';
  const description = seo?.description;

  const openGraph: Metadata['openGraph'] = {
    title,
    description,
    siteName: 'NKN Atelier',
  };

  if (page === 'home') {
    return {
      title: { absolute: title },
      description,
      openGraph,
    };
  }

  return {
    title,
    description,
    openGraph,
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
