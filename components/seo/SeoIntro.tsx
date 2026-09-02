'use client';

import { useLocale } from '@/lib/i18n';

const HEADINGS = {
  de: { eyebrow: 'Atelier', title: 'Über das NKN Atelier' },
  en: { eyebrow: 'Atelier', title: 'About the NKN Atelier' },
  ru: { eyebrow: 'Ателье', title: 'Об ателье NKN' },
} as const;

/**
 * Closing editorial block.
 *
 * This is the only long-form prose on most pages, so it stays visible: text
 * collapsed inside a <details> is indexed, but Google weights hidden content
 * lower and users never read it.
 */
export default function SeoIntro({ text }: { text: string }) {
  const locale = useLocale();

  if (!text?.trim()) return null;

  const ui = HEADINGS[locale] ?? HEADINGS.de;
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="px-4 pb-16 pt-12 sm:px-6 sm:pb-20 md:px-12 md:pt-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 h-px w-full bg-black/10" />

        <div className="mb-5 flex items-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-brand-mustard to-transparent sm:w-12" />
          <span className="text-[10px] uppercase tracking-[0.28em] text-brand-sage sm:text-[11px]">
            {ui.eyebrow}
          </span>
        </div>

        <h2
          className="mb-5 text-2xl tracking-tight text-neutral-900 sm:text-3xl"
          style={{ fontFamily: 'serif' }}
        >
          {ui.title}
        </h2>

        <div className="space-y-4">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-[0.9375rem] leading-[1.75] text-neutral-600 sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
