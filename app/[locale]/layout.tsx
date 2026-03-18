import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { I18nProvider } from '@/lib/i18n';
import { locales } from '@/lib/i18n-config';
import RequestModalProviderWrapper from '@/components/providers/RequestModalProviderWrapper';
import '../globals.css';

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/images/big_logo.png', sizes: 'any' },
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/images/big_logo.png', sizes: '180x180', type: 'image/png' },
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
};

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
    <html lang={locale} suppressHydrationWarning>
      <body>
        <I18nProvider locale={locale}>
          <RequestModalProviderWrapper>
            {children}
          </RequestModalProviderWrapper>
        </I18nProvider>
      </body>
    </html>
  );
}
