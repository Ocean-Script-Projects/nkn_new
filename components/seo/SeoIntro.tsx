'use client';

import { useTranslations } from '@/lib/i18n';

/**
 * Closing editorial block.
 *
 * This is the only long-form prose on most pages, so it stays visible: text
 * collapsed inside a <details> is indexed, but Google weights hidden content
 * lower and users never read it.
 */
export default function SeoIntro({ text }: { text: string }) {
  // Headings live in the message files so they are translatable and editable
  // from the admin like the rest of the copy.
  const t = useTranslations('seoIntro');

  if (!text?.trim()) return null;

  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="px-4 pb-16 pt-12 sm:px-6 sm:pb-20 md:px-12 md:pt-16">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 h-px w-full bg-black/10" />

        <div className="mb-5 flex items-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-brand-mustard to-transparent sm:w-12" />
          <span className="text-[10px] uppercase tracking-[0.28em] text-brand-sage sm:text-[11px]">
            {String(t('eyebrow'))}
          </span>
        </div>

        <h2
          className="mb-5 text-2xl tracking-tight text-neutral-900 sm:text-3xl"
          style={{ fontFamily: 'serif' }}
        >
          {String(t('title'))}
        </h2>

        <div className="space-y-4">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="max-w-full text-[0.9375rem] leading-[1.75] text-neutral-600 [overflow-wrap:anywhere] sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
