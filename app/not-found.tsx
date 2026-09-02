import type { Metadata } from 'next';
import Link from 'next/link';

import { defaultLocale } from '@/lib/i18n-config';
import { BRAND } from '@/lib/site-config';

/**
 * Root 404. This is the boundary that actually runs: an unmatched URL never
 * enters a segment, and `notFound()` thrown from the `[locale]` layout escapes
 * that segment's own not-found.tsx too. Both end up here.
 *
 * It renders without the I18nProvider (no locale is known), so the copy is
 * inlined and leads with German — the default locale — plus a line in the two
 * other languages.
 */
export const metadata: Metadata = {
  title: { absolute: `404 — ${BRAND.name}` },
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: `/${defaultLocale}/`, label: 'Startseite' },
  { href: `/${defaultLocale}/bespoke/`, label: 'Maßschneiderei' },
  { href: `/${defaultLocale}/pieces/`, label: 'Unikate' },
  { href: `/${defaultLocale}/contact/`, label: 'Kontakt' },
];

const LANGUAGES = [
  { href: '/de/', label: 'DE' },
  { href: '/en/', label: 'EN' },
  { href: '/ru/', label: 'RU' },
];

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-6 py-24">
      <div className="w-full max-w-lg text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-sage">404</p>

        <h1
          className="mt-6 text-3xl tracking-tight text-neutral-900 sm:text-4xl"
          style={{ fontFamily: 'serif' }}
        >
          Seite nicht gefunden
        </h1>

        <p className="mt-4 text-base leading-relaxed text-neutral-600">
          Diese Seite existiert nicht mehr oder wurde verschoben.
          <span className="mt-1 block text-neutral-500">
            This page could not be found · Страница не найдена
          </span>
        </p>

        <nav className="mt-10 flex flex-wrap justify-center gap-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-black/10 bg-white/70 px-5 py-2.5 text-sm tracking-wide text-neutral-700 transition-colors hover:border-black/25 hover:text-neutral-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex justify-center gap-4 text-[11px] uppercase tracking-[0.24em] text-neutral-400">
          {LANGUAGES.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-neutral-800">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
