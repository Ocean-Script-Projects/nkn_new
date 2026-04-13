import { notFound } from 'next/navigation';
import { I18nProvider } from '@/lib/i18n';
import { locales } from '@/lib/i18n-config';
import RequestModalProviderWrapper from '@/components/providers/RequestModalProviderWrapper';
import LocaleHtmlLang from '@/components/shared/LocaleHtmlLang';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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

  return (
    <I18nProvider locale={locale}>
      <LocaleHtmlLang locale={locale} />
      <RequestModalProviderWrapper>
        {children}
      </RequestModalProviderWrapper>
    </I18nProvider>
  );
}
