'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
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
    <section className="relative overflow-hidden pb-14 pt-24 sm:pb-16 sm:pt-28 md:pt-32 lg:pb-24 lg:pt-32 xl:pb-28 xl:pt-36">
      <div className="absolute inset-0 bg-brand-sage-subtle bg-fabric-grain" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_88%_12%,rgb(119_123_86_/0.07),transparent_58%),radial-gradient(ellipse_55%_45%_at_12%_88%,rgb(119_123_86_/0.05),transparent_52%),linear-gradient(180deg,#fbfaf8_0%,#f4f3ec_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.025) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-sage/35 to-transparent"
        aria-hidden
      />

      <DecorativeLogo
        variant="big"
        position="bottom-left"
        subtle
        className="hidden md:block !bottom-6 !left-2 rotate-0 md:!bottom-10 md:!left-6 md:scale-110 lg:scale-125"
      />
      <DecorativeLogo
        variant="short"
        position="top-right"
        subtle
        className="hidden md:block !top-20 !right-0 opacity-[0.03] md:opacity-[0.045] md:!top-24 md:!right-8"
      />

      {/* ——— Mobile / tablet: image-led hero ——— */}
      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:hidden">
        <div className="mb-5 flex flex-col gap-2 border-b border-[#C4A574]/20 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#7a6238] sm:text-[11px]">
            {t('location')}
          </p>
          <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-400 sm:max-w-[55%] sm:text-right sm:text-[10px] sm:leading-relaxed">
            {t('experience')}
            <span className="mx-1.5 inline-block h-1 w-1 rounded-full bg-[#C4A574]/50 align-middle" />
            {t('individual')}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl bg-[#E8E2D9] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.06] sm:rounded-3xl"
        >
          <div className="relative aspect-[3/4] w-full max-h-[min(52svh,440px)] sm:max-h-[min(50svh,480px)]">
            <img
              src={src}
              alt={String(t('nameFull'))}
              className="absolute inset-0 h-full w-full object-cover object-top"
              loading="eager"
              decoding="async"
              onError={onImgError}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1510]/90 via-[#1a1510]/25 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 px-4 pb-5 pt-20 sm:px-6 sm:pb-6">
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/85 sm:text-[10px]">
                {t('nameFull')}
              </p>
              <p className="mt-1 text-sm font-normal tracking-wide text-white/95 sm:text-base">{t('role')}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 space-y-5 sm:mt-8"
        >
          <h1
            className="font-serif text-[1.75rem] font-normal leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2rem]"
            style={{ fontFamily: 'serif' }}
          >
            <span className="block">{t('title')}</span>
            <span className="mt-1.5 block text-neutral-800 italic sm:mt-2">{t('titleItalic')}</span>
            {String(t('titleEnd')).trim() ? (
              <span className="mt-2 block text-[0.95em] font-normal tracking-normal text-neutral-700">
                {t('titleEnd')}
              </span>
            ) : null}
          </h1>

          <p className="text-sm font-light leading-[1.65] tracking-wide text-neutral-600 sm:text-[0.9375rem] sm:leading-[1.7]">
            {t('description')}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
            <button
              type="button"
              onClick={() => openRequestModal()}
              className="group relative inline-flex min-h-[48px] w-full flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-neutral-950 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.3)] ring-1 ring-black/10 transition-all duration-300 active:scale-[0.99] sm:min-h-[44px] sm:flex-initial sm:px-8"
            >
              <span className="relative z-10">{t('orderButton')}</span>
              <ArrowRight className="relative z-10 h-4 w-4 shrink-0" aria-hidden />
            </button>
            <Link
              href={`/${locale}/pieces`}
              className="inline-flex min-h-[48px] w-full flex-1 items-center justify-center rounded-full border border-neutral-900/15 bg-white/95 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-800 shadow-sm backdrop-blur-sm transition-all duration-300 active:scale-[0.99] sm:min-h-[44px] sm:flex-initial sm:px-8"
            >
              {t('portfolioButton')}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ——— Desktop ——— */}
      <div className="relative z-10 mx-auto hidden w-full max-w-[1360px] px-5 sm:px-8 lg:grid lg:px-10 xl:px-14 lg:grid-cols-[1fr_minmax(300px,420px)] lg:grid-rows-[auto_auto] lg:items-stretch lg:gap-x-14 lg:gap-y-12 xl:grid-cols-[1fr_minmax(300px,440px)] xl:gap-x-20 xl:gap-y-14">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-brand-sage/20 pb-5 lg:col-span-2 lg:row-start-1">
          <div className="flex items-center gap-4">
            <span className="hidden h-px w-10 bg-gradient-to-r from-brand-sage to-transparent sm:block" aria-hidden />
            <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-brand-sage-muted sm:text-[11px]">
              {t('location')}
            </p>
          </div>
          <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-neutral-400 sm:text-[10px]">
            {t('experience')}{' '}
            <span className="mx-1.5 inline-block h-1 w-1 rounded-full bg-brand-mustard/50 align-middle" />{' '}
            {t('individual')}
          </p>
        </div>

        <div className="mt-8 flex w-full max-w-lg flex-col gap-10 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:max-w-none lg:justify-center lg:gap-10 lg:pr-4 xl:gap-12 xl:pr-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-0 sm:pl-5 lg:pl-6"
          >
            <div
              className="absolute left-0 top-2 hidden h-[min(12rem,55%)] w-px bg-gradient-to-b from-brand-mustard via-brand-mustard/40 to-transparent sm:block"
              aria-hidden
            />
            <h1
              className="max-w-[22ch] font-serif text-[clamp(2.15rem,6.2vw,4.35rem)] font-normal leading-[1.05] tracking-[-0.025em] text-neutral-950 sm:max-w-[24ch] lg:max-w-[26ch] lg:text-[clamp(2.35rem,5.4vw,4.15rem)] xl:max-w-[28ch] xl:text-[clamp(2.6rem,4.8vw,4.85rem)] 2xl:text-[clamp(2.75rem,4.2vw,5.25rem)]"
              style={{ fontFamily: 'serif' }}
            >
              <span className="block">{t('title')}</span>
              <span className="mt-2 block text-neutral-800 italic xl:mt-3">{t('titleItalic')}</span>
              {String(t('titleEnd')).trim() ? (
                <span className="mt-2 block text-[0.92em] font-normal tracking-normal text-neutral-700">
                  {t('titleEnd')}
                </span>
              ) : null}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg border-t border-black/[0.06] pt-8 lg:max-w-md xl:max-w-lg"
          >
            <p className="text-[0.9375rem] font-light leading-[1.75] tracking-wide text-neutral-600 sm:text-base xl:text-[1.0625rem]">
              {t('description')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => openRequestModal()}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-neutral-950 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)] ring-1 ring-black/10 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.4)] hover:ring-brand-mustard/35 active:translate-y-0 sm:px-8 sm:py-4 sm:text-xs"
              >
                <span className="relative z-10">{t('orderButton')}</span>
                <ArrowRight
                  className="relative z-10 h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 35%, rgba(222,147,42,0.18) 50%, transparent 65%)',
                  }}
                  aria-hidden
                />
              </button>
              <Link
                href={`/${locale}/pieces`}
                className="inline-flex items-center rounded-full border border-neutral-900/15 bg-white/90 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-mustard/45 hover:bg-white hover:shadow-md hover:shadow-brand-mustard/10 sm:px-8 sm:py-4 sm:text-xs"
              >
                {t('portfolioButton')}
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 w-full lg:col-start-2 lg:row-start-2 lg:mt-0 lg:self-center"
        >
          <div className="relative mx-auto max-w-[340px] lg:mx-0 lg:max-w-[320px] xl:max-w-[420px] min-[1536px]:max-w-none">
            <div
              className="absolute -inset-3 rounded-[1.35rem] bg-brand-sage/15 opacity-80 blur-xl sm:-inset-4 sm:rounded-[1.5rem]"
              aria-hidden
            />
            <div className="group/image relative cursor-default rounded-2xl bg-[#EDEAE2] p-[3px] shadow-[0_24px_56px_-20px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.04)_inset] ring-1 ring-brand-sage/25 transition-[box-shadow,transform] duration-500 ease-out hover:shadow-[0_32px_64px_-24px_rgba(0,0,0,0.28)] hover:ring-brand-mustard/35 xl:rounded-3xl xl:p-1">
              <div className="overflow-hidden rounded-[1.15rem] ring-1 ring-white/90 xl:rounded-[1.35rem]">
                <div className="relative aspect-[3/4] w-full max-h-[min(44vh,380px)] bg-neutral-200/80 sm:max-h-[min(46vh,400px)] lg:aspect-auto lg:h-[min(48vh,460px)] lg:max-h-[460px] lg:w-[300px] xl:aspect-[3/4] xl:h-auto xl:max-h-[min(46vh,480px)] xl:min-h-[380px] xl:w-full min-[1536px]:min-h-[420px] min-[1536px]:max-h-[min(52vh,540px)]">
                  <img
                    src={src}
                    alt={String(t('nameFull'))}
                    className="absolute inset-0 h-full w-full object-cover object-top transition-[transform,filter] duration-700 ease-out group-hover/image:scale-[1.04] group-hover/image:brightness-[1.04]"
                    loading="eager"
                    decoding="async"
                    onError={onImgError}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#1a1510]/0 via-transparent to-white/[0.03] opacity-0 transition-opacity duration-500 group-hover/image:opacity-100"
                    aria-hidden
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/[0.82] via-black/30 to-transparent px-5 pb-4 pt-16">
                    <div className="origin-bottom transition-transform duration-500 ease-out group-hover/image:-translate-y-1.5">
                      <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/90">
                        {t('nameFull')}
                      </p>
                      <p className="mt-1.5 text-sm font-normal tracking-wide text-white/95">{t('role')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
