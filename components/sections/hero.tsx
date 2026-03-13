'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from '@/lib/i18n';
import { useRequestModal } from '@/lib/request-modal-context';
import DecorativeLogo from '@/components/shared/DecorativeLogo';

const REMOTE =
  'https://images.unsplash.com/photo-1558769138-e5ac0c5c0de2?auto=format&fit=crop&w=1000&h=1250&q=85';
const REMOTE_FALLBACK =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&h=1250&q=85';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const { openRequestModal } = useRequestModal();
  const [src, setSrc] = useState(REMOTE);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const local = window.location.pathname.startsWith('/nkn_new')
      ? '/nkn_new/images/hero.jpg'
      : '/images/hero.jpg';
    const probe = new Image();
    probe.onload = () => setSrc(local);
    probe.onerror = () => {};
    probe.src = local;
  }, []);

  const onImgError = useCallback(() => {
    setSrc((s) => (s.includes('images/hero.jpg') ? REMOTE : s === REMOTE ? REMOTE_FALLBACK : REMOTE));
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] pb-14 pt-28 sm:pb-16 sm:pt-32 md:pt-36 lg:pb-20 lg:pt-32 xl:pb-24 xl:pt-36">
      <DecorativeLogo
        variant="big"
        position="bottom-left"
        subtle
        className="!bottom-6 !left-2 rotate-0 md:!bottom-10 md:!left-6 md:scale-110 lg:scale-125"
      />
      <DecorativeLogo
        variant="short"
        position="top-right"
        subtle
        className="!top-20 !right-0 opacity-[0.025] md:opacity-[0.04] md:!top-24 md:!right-6 rotate-12"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-10 xl:px-14 lg:grid lg:grid-cols-[1fr_minmax(300px,420px)] lg:grid-rows-[auto_auto] lg:items-stretch lg:gap-x-12 lg:gap-y-10 xl:grid-cols-[1fr_minmax(300px,440px)] xl:gap-x-16 xl:gap-y-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-black/[0.06] pb-4 lg:col-span-2 lg:row-start-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8f6d42] sm:text-xs">
            {t('location')}
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 sm:text-[11px]">
            {t('experience')} <span className="text-neutral-300">·</span> {t('individual')}
          </p>
        </div>

        {/* Левый блок: на lg+ по вертикали по центру относительно высоты фото */}
        <div className="mt-6 flex w-full max-w-lg flex-col gap-8 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:max-w-none lg:justify-center lg:gap-8 lg:pr-2 lg:pt-2 xl:gap-10 xl:pr-4">
          <h1
            className="max-w-[18ch] font-serif text-[clamp(1.7rem,4.2vw,3.35rem)] font-normal leading-[1.08] tracking-tight text-neutral-950 sm:max-w-[21ch] lg:max-w-[20ch] xl:max-w-[22ch] xl:text-[clamp(1.95rem,3.8vw,3.65rem)]"
            style={{ fontFamily: 'serif' }}
          >
            <span className="block">{t('title')}</span>
            <span className="mt-1 block italic text-neutral-800">{t('titleItalic')}</span>
            {String(t('titleEnd')).trim() ? <span className="mt-1 block">{t('titleEnd')}</span> : null}
          </h1>
          <div className="w-full max-w-lg lg:max-w-md xl:max-w-lg">
            <p className="text-sm leading-relaxed text-neutral-600 sm:text-base xl:text-[1.06rem]">
              {t('description')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openRequestModal()}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-neutral-950 px-6 py-3 text-xs font-medium text-white shadow-md shadow-black/15 ring-1 ring-black/10 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-black hover:shadow-lg hover:shadow-[#8f6d42]/20 hover:ring-[#C4A574]/30 active:translate-y-0 active:scale-[0.98] sm:text-sm"
              >
                <span className="relative z-10">{t('orderButton')}</span>
                <ArrowRight
                  className="relative z-10 h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 40%, rgba(196,165,116,0.12) 50%, transparent 60%)',
                  }}
                  aria-hidden
                />
              </button>
              <Link
                href={`/${locale}/pieces`}
                className="inline-flex items-center rounded-full border border-neutral-900/20 bg-white px-6 py-3 text-xs font-medium text-neutral-900 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#C4A574]/50 hover:bg-[#FDFCFA] hover:text-[#5c4a32] hover:shadow-md hover:shadow-[#C4A574]/10 active:translate-y-0 active:scale-[0.98] sm:text-sm"
              >
                {t('portfolioButton')}
              </Link>
            </div>
          </div>
        </div>

        {/* Правая колонка: фото задаёт высоту строки; левый блок визуально по центру */}
        <div className="mt-10 w-full lg:col-start-2 lg:row-start-2 lg:mt-0 lg:self-start">
          <div
            className="group/image mx-auto max-w-[340px] cursor-default overflow-hidden rounded-2xl shadow-[0_20px_48px_-16px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.07] transition-[box-shadow,transform] duration-500 ease-out hover:shadow-[0_28px_56px_-18px_rgba(0,0,0,0.22)] hover:ring-[#C4A574]/25 lg:mx-0 lg:max-w-[320px] xl:max-w-[420px] xl:rounded-3xl min-[1536px]:max-w-none"
          >
            {/* Ноутбук lg: выше по высоте (~460px / 48vh); xl+: пропорция 3/4 */}
            <div className="relative aspect-[3/4] w-full max-h-[min(44vh,380px)] bg-neutral-100 sm:max-h-[min(46vh,400px)] lg:aspect-auto lg:h-[min(48vh,460px)] lg:max-h-[460px] lg:w-[300px] xl:aspect-[3/4] xl:h-auto xl:max-h-[min(46vh,460px)] xl:min-h-[360px] xl:w-full min-[1536px]:min-h-[400px] min-[1536px]:max-h-[min(52vh,520px)]">
              <img
                src={src}
                alt={String(t('nameFull'))}
                className="absolute inset-0 h-full w-full object-cover object-top transition-[transform,filter] duration-700 ease-out group-hover/image:scale-[1.045] group-hover/image:brightness-[1.03]"
                loading="eager"
                decoding="async"
                onError={onImgError}
              />
              <div
                className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#8f6d42]/0 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/image:opacity-100 group-hover/image:from-[#8f6d42]/08"
                aria-hidden
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-3 pt-14 transition-opacity duration-300 group-hover/image:from-black/85">
                <p className="text-[9px] tracking-[0.22em] text-white/85">{t('nameFull')}</p>
                <p className="mt-0.5 text-sm font-medium text-white">{t('role')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
