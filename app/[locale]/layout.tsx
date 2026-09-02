import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { I18nProvider } from '@/lib/i18n';
import { locales, type Locale } from '@/lib/i18n-config';
import { getSiteMessages } from '@/lib/messages-store';
import RequestModalProviderWrapper from '@/components/providers/RequestModalProviderWrapper';
import LocaleHtmlLang from '@/components/shared/LocaleHtmlLang';
import SiteJsonLd from '@/components/seo/SiteJsonLd';
import { getPublicSiteRoot } from '@/lib/site-url';
import { BRAND } from '@/lib/site-config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(_props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    metadataBase: new URL(`${getPublicSiteRoot()}/`),
    title: {
      default: BRAND.name,
      template: `%s · ${BRAND.name}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  // Loaded server-side and passed down so the text is in the initial HTML and the
  // client provider hydrates from the exact same object.
  const messages = await getSiteMessages(locale);

  return (
    <I18nProvider locale={locale} messages={messages}>
      <SiteJsonLd locale={locale as Locale} />
      <LocaleHtmlLang locale={locale} />
      <RequestModalProviderWrapper>
        {children}
      </RequestModalProviderWrapper>
    </I18nProvider>
  );
}
