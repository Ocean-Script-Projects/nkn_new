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
      </div>
      <Footer />
    </div>
  );
}
