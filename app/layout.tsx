import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import './globals.css';

import { defaultLocale, locales, type Locale } from '@/lib/i18n-config';
import { BRAND, OG_IMAGE } from '@/lib/site-config';
import { getPublicOrigin } from '@/lib/site-url';

/** Set by middleware.ts from the first path segment. */
const LOCALE_HEADER = 'x-locale';

export const metadata: Metadata = {
  metadataBase: new URL(`${getPublicOrigin()}/`),
  applicationName: BRAND.name,
  authors: [{ name: BRAND.founder }],
  creator: BRAND.founder,
  publisher: BRAND.legalName,
  // Without max-image-preview:large Google shows only a thumbnail — for a fashion
  // atelier the large image preview is a major click-through advantage.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the token from Search Console
  // ("HTML tag" method) to claim the property without touching the code.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
  openGraph: {
    type: 'website',
    siteName: BRAND.name,
    images: [
      {
        url: OG_IMAGE.path,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: `${BRAND.name} — ${BRAND.founder}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE.path],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#FAF9F6',
  colorScheme: 'light',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The lang attribute must be correct in the *initial* HTML: fixing it client-side
  // leaves crawlers and screen readers with the wrong language.
  const headerLocale = (await headers()).get(LOCALE_HEADER);
  const locale: Locale = locales.includes(headerLocale as Locale)
    ? (headerLocale as Locale)
    : defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
