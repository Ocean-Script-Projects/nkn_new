'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PageHeader from '@/components/shared/PageHeader';
import { useTranslations } from '@/lib/i18n';
import { useRequestModal } from '@/lib/request-modal-context';
import { ImageWithFallback } from '@/components/image-with-fallback';

export default function CollaborationPage() {
  const t = useTranslations('collaborationPage');
  const { openRequestModal } = useRequestModal();

  return (
    <div className="min-h-screen bg-[#FAF9F6] overflow-x-hidden">
      <Navigation />
      <div>
        <PageHeader
          label={String(t('hero.label'))}
          title={String(t('hero.title'))}
          titleItalic={String(t('hero.titleItalic'))}
          description={String(t('hero.description'))}
          labelColor="#C9973C"
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
                alt="Collaboration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>
        </PageHeader>

        <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#1a1a1a]"
              style={{ fontFamily: 'serif' }}
            >
              {t('hero.tagline')}
            </motion.p>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-[#FAF9F6]">
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
