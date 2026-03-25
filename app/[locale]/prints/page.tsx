'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PageHeader from '@/components/shared/PageHeader';
import { useTranslations } from '@/lib/i18n';
import { useRequestModal } from '@/lib/request-modal-context';
import { ImageWithFallback } from '@/components/image-with-fallback';

export default function PrintsPage() {
  const t = useTranslations('printsPage');
  const { openRequestModal } = useRequestModal();

  const directionIds = ['01', '02', '03'] as const;

  return (
    <div className="min-h-screen bg-[#FAF9F6] overflow-x-hidden">
      <Navigation />
      <div>
        <PageHeader
          label={String(t('hero.label'))}
          title={String(t('hero.title'))}
          titleItalic={String(t('hero.titleItalic'))}
          subtitle={String(t('hero.subtitle'))}
          labelColor="var(--brand-mustard)"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative order-first lg:order-none"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1558769138-e5ac0c5c0de2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Prints"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>
        </PageHeader>

        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed mb-8"
            >
              {t('intro')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-xl sm:text-2xl text-[#1a1a1a] tracking-tight mb-16"
              style={{ fontFamily: 'serif' }}
            >
              {t('subheading')}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl tracking-tight mb-12"
              style={{ fontFamily: 'serif' }}
            >
              {t('directionsTitle')}
            </motion.h2>

            <div className="space-y-12 md:space-y-16">
              {directionIds.map((id, i) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="border-t border-black/10 pt-8 first:border-t-0 first:pt-0"
                >
                  <h3 className="text-xl sm:text-2xl mb-4 tracking-tight text-[#1a1a1a]" style={{ fontFamily: 'serif' }}>
                    {String(i + 1)}. {t(`directions.${id}.title`)}
                  </h3>
                  <p className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed">
                    {t(`directions.${id}.description`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery of author's prints */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-[#FAF9F6]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <span className="h-px w-8 sm:w-12 bg-brand-mustard/60" aria-hidden />
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.35em] uppercase text-brand-mustard">
                {t('gallery.label')}
              </span>
              <span className="h-px w-8 sm:w-12 bg-brand-mustard/60" aria-hidden />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-xl sm:text-2xl md:text-3xl text-neutral-900 leading-snug tracking-tight mb-8 text-center max-w-2xl mx-auto font-normal"
              style={{ fontFamily: 'serif' }}
            >
              {t('gallery.intro')}{' '}
              <span className="italic text-neutral-800">{t('gallery.introItalic')}</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="max-w-xl mx-auto mb-12 border-l-2 border-brand-mustard/50 pl-5 sm:pl-6 py-1"
            >
              <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed font-sans">
                {t('gallery.subtext')}
              </p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                'https://images.unsplash.com/photo-1558171813-4c088753af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                'https://images.unsplash.com/photo-1562157873-818bc0726f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                'https://images.unsplash.com/photo-1558171813-1e6a229e35f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group aspect-square rounded-2xl overflow-hidden bg-neutral-200/80 shadow-md ring-1 ring-black/5"
                >
                  <ImageWithFallback
                    src={src}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                style={{ background: 'radial-gradient(circle, var(--brand-mustard) 0%, transparent 70%)' }}
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
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-mustard">
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
                <p className="mt-8 text-xs tracking-wide text-neutral-400 whitespace-pre-line">{t('ctaNote')}</p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
