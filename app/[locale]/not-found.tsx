import type { Metadata } from 'next';
import Link from 'next/link';

import { defaultLocale } from '@/lib/i18n-config';
import { BRAND } from '@/lib/site-config';

// A 404 must never be indexed, and it is reached with an unknown locale, so the
// I18nProvider is not mounted here — the copy is inlined rather than translated.
export const metadata: Metadata = {
  title: `404 — ${BRAND.name}`,
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: `/${defaultLocale}/`, label: 'Startseite' },
  { href: `/${defaultLocale}/bespoke/`, label: 'Maßschneiderei' },
  { href: `/${defaultLocale}/pieces/`, label: 'Unikate' },
  { href: `/${defaultLocale}/contact/`, label: 'Kontakt' },
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
      </div>
    </main>
  );
}
