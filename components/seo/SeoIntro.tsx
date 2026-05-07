'use client';

import { useLocale } from '@/lib/i18n';

export default function SeoIntro({ text }: { text: string }) {
  if (!text) return null;

  const locale = useLocale();
  const ui =
    locale === 'de'
      ? {
          eyebrow: 'Details',
          title: 'Über diese Seite',
          show: 'Anzeigen',
          hide: 'Ausblenden',
        }
      : locale === 'en'
        ? {
            eyebrow: 'Details',
            title: 'About this page',
            show: 'Show',
            hide: 'Hide',
          }
        : {
            eyebrow: 'Детали',
            title: 'О странице',
            show: 'Показать',
            hide: 'Скрыть',
          };

  return (
    <section className="px-4 sm:px-6 md:px-12 pt-10 pb-10">
      <div className="max-w-5xl mx-auto">
        <div className="h-px w-full bg-black/10 mb-8" />

        <details className="group rounded-3xl border border-black/10 bg-white/60 backdrop-blur-sm px-6 py-5 sm:px-8 sm:py-6">
          <summary className="cursor-pointer list-none select-none">
            <div className="flex items-center justify-between gap-6">
              <div>
                <div className="text-[11px] tracking-[0.28em] uppercase text-black/45">
                  {ui.eyebrow}
                </div>
                <div
                  className="mt-1 text-base sm:text-lg tracking-tight text-black/85"
                  style={{ fontFamily: 'serif' }}
                >
                  {ui.title}
                </div>
              </div>

              <div className="shrink-0 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs tracking-wider text-black/60 transition-colors group-hover:bg-white">
                <span className="group-open:hidden">{ui.show}</span>
                <span className="hidden group-open:inline">{ui.hide}</span>
              </div>
            </div>
          </summary>

          <div className="mt-4 text-sm sm:text-base leading-relaxed text-black/65">
            {text}
          </div>
        </details>
      </div>
    </section>
  );
}

