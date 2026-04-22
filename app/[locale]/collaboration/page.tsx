'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PageHeader from '@/components/shared/PageHeader';
import { useTranslations } from '@/lib/i18n';
import { useRequestModal } from '@/lib/request-modal-context';
import { ImageWithFallback } from '@/components/image-with-fallback';

/** Та же фотография, что на главной: `public/images/hero.jpg` */
const COLLAB_HERO_SRC = '/images/hero.jpg';

function CollaborationHeroImage() {
  return (
    <div className="relative h-full w-full min-h-full overflow-hidden lg:aspect-[4/5] lg:rounded-3xl lg:shadow-2xl">
      <ImageWithFallback
        src={COLLAB_HERO_SRC}
        alt="Collaboration"
        className="h-full w-full object-cover lg:rounded-3xl"
      />
    </div>
  );
}

export default function CollaborationPage() {
  const t = useTranslations('collaborationPage');
  const tAbout = useTranslations('aboutPage');
  const { openRequestModal } = useRequestModal();

  return (
    <div className="min-h-screen bg-[#FAF9F6] overflow-x-hidden">
      <Navigation />
      <div>
        <PageHeader
          mobileLayout="editorial"
          label={String(t('hero.label'))}
          title={String(t('hero.title'))}
          titleItalic={String(t('hero.titleItalic'))}
          description={String(t('hero.description'))}
          labelColor="#C9973C"
        >
          <CollaborationHeroImage />
          <CollaborationHeroImage />
        </PageHeader>

        <section className="py-12 sm:py-16 md:py-28 px-4 sm:px-6 md:px-12 bg-white">
          <div className="max-w-3xl mx-auto text-center px-1">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-tight text-[#1a1a1a] leading-snug"
              style={{ fontFamily: 'serif' }}
            >
              {t('hero.tagline')}
            </motion.p>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-28 px-4 sm:px-6 md:px-12 bg-[#FAF9F6]">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-base sm:text-lg text-[#8B8B8B] mb-10">{t('cta.description')}</p>
            <motion.button
              onClick={() => openRequestModal()}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-transparent border-2 border-black text-black rounded-full text-base sm:text-lg tracking-wider font-medium hover:bg-black hover:text-white transition-colors"
            >
              {t('cta.title')}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#2a2a2a] px-4 py-16 text-[#FAF9F6] sm:px-6 sm:py-20 md:px-12 md:py-32">
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          <div className="relative z-10 mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12 text-center sm:mb-16"
            >
              <div className="mb-6 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-[#C4A574]" />
                <span className="text-xs uppercase tracking-[0.4em] text-[#C4A574] sm:text-sm">
                  {tAbout('b2b.label')}
                </span>
                <div className="h-px w-8 bg-[#C4A574]" />
              </div>

              <h2
                className="mb-8 text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ fontFamily: 'serif' }}
              >
                {tAbout('b2b.title')} <br className="sm:hidden" />
                <span className="italic">{tAbout('b2b.titleItalic')}</span>
              </h2>

              <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#FAF9F6]/80 sm:text-lg md:text-xl">
                {tAbout('b2b.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12 space-y-6"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex items-start gap-4 border-l-2 border-[#C4A574] pl-6"
                >
                  <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#C4A574]" />
                  <p className="text-base leading-relaxed text-[#FAF9F6]/90 sm:text-lg">
                    {tAbout(`b2b.items.${i}`)}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center"
            >
              <motion.button
                onClick={() => openRequestModal()}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 rounded-full bg-[#C4A574] px-10 py-5 text-base font-medium tracking-wider text-white shadow-2xl transition-shadow hover:shadow-[#C4A574]/30 sm:text-lg"
              >
                {tAbout('b2b.cta')}
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
