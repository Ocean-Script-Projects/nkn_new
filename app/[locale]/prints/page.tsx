'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PageHeader from '@/components/shared/PageHeader';
import { useTranslations } from '@/lib/i18n';
import { useRequestModal } from '@/lib/request-modal-context';
import { ImageWithFallback } from '@/components/image-with-fallback';
import SeoIntro from '@/components/seo/SeoIntro';

/** Временно та же фотография, что и в hero upcycling */
const PRINTS_HERO_SRC = '/images/models/model5.webp';

function PrintsHeroImage() {
  return (
    <div className="relative h-full w-full min-h-full overflow-hidden lg:aspect-[4/5] lg:rounded-3xl lg:shadow-2xl">
      <ImageWithFallback
        src={PRINTS_HERO_SRC}
        alt="Prints"
        className="h-full w-full object-cover lg:rounded-3xl"
      />
    </div>
  );
}

export default function PrintsPage() {
  const t = useTranslations('printsPage');
  const { openRequestModal } = useRequestModal();

  const directionIds = ['01', '02', '03'] as const;

  return (
    <div className="min-h-screen bg-[#FAF9F6] overflow-x-hidden">
      <Navigation />
      <div>
        <PageHeader
          mobileLayout="editorial"
          label={String(t('hero.label'))}
          title={String(t('hero.title'))}
          titleItalic={String(t('hero.titleItalic'))}
          subtitle={String(t('hero.subtitle'))}
          labelColor="#C9973C"
        >
          <PrintsHeroImage />
          <PrintsHeroImage />
        </PageHeader>

        <section className="bg-white px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10 md:px-12 md:pb-20 md:pt-12">
          <div className="max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-6 sm:mb-8"
            >
              {t('intro')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-10 text-lg leading-snug tracking-tight text-[#1a1a1a] sm:mb-12 sm:text-xl md:mb-14 md:text-2xl"
              style={{ fontFamily: 'serif' }}
            >
              {t('subheading')}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight mb-8 sm:mb-12"
              style={{ fontFamily: 'serif' }}
            >
              {t('directionsTitle')}
            </motion.h2>

            <div className="grid gap-4 sm:gap-5 md:gap-6">
              {directionIds.map((id, i) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-[#FAF9F6] p-5 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.2)] sm:p-6 md:p-7"
                >
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-[0.08]"
                    style={{ background: 'radial-gradient(circle, #C9973C 0%, transparent 72%)' }}
                    aria-hidden
                  />
                  <div className="relative z-10">
                    <div className="absolute -right-2 -top-2 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-[#C9973C]/30 bg-[#FAF9F6] px-3 text-[11px] font-semibold tracking-[0.18em] text-[#8B6A2A] shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="mb-2 pr-14 text-xl tracking-tight text-[#1a1a1a] sm:text-2xl" style={{ fontFamily: 'serif' }}>
                      {t(`directions.${id}.title`)}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[#7a7a7a] sm:text-base">
                    {t(`directions.${id}.description`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <SeoIntro text={String(t('seoText'))} />

        <section className="border-t border-black/[0.06] bg-[#F5F2EC] px-4 py-12 sm:px-6 sm:py-14 md:px-12 md:py-16">
          <div className="mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white px-8 py-10 text-center shadow-[0_12px_48px_-20px_rgba(0,0,0,0.12)] sm:px-12 sm:py-12"
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.07]"
                style={{ background: 'radial-gradient(circle, #C9973C 0%, transparent 70%)' }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
                aria-hidden
              />
              <div className="relative z-10">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#C9973C]">
                  {t('hero.label')}
                </p>
                <h2
                  className="mx-auto mb-4 max-w-lg font-serif text-2xl font-normal leading-snug tracking-tight text-neutral-900 sm:text-3xl"
                  style={{ fontFamily: 'serif' }}
                >
                  {t('ctaTitle')}
                </h2>
                <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-[#6b6b6b] sm:text-base">
                  {t('ctaDescription')}
                </p>
                <motion.button
                  type="button"
                  onClick={() => openRequestModal()}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 rounded-full bg-neutral-950 px-8 py-4 text-sm font-medium tracking-wide text-white shadow-lg shadow-black/15 ring-1 ring-black/10 transition hover:bg-black hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 sm:px-10 sm:py-4 sm:text-base"
                >
                  {t('ctaButton')}
                  <ArrowRight className="h-5 w-5 shrink-0" />
                </motion.button>
                <p className="mt-8 text-xs tracking-wide text-neutral-400">{t('ctaNote')}</p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
