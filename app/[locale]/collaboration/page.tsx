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

        {/* Направления сотрудничества */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-[#FAF9F6]">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="h-px w-8 sm:w-12 bg-[#8B7355]/70" aria-hidden />
                <span className="text-xs sm:text-sm font-medium tracking-[0.25em] uppercase text-[#8B7355]">
                  {t('directions.label')}
                </span>
                <span className="h-px w-8 sm:w-12 bg-[#8B7355]/70" aria-hidden />
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#1a1a1a]"
                style={{ fontFamily: 'serif' }}
              >
                {t('directions.title')}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="border-l-2 border-[#C4A574] pl-6 sm:pl-8 py-2 mb-10"
            >
              <ul className="space-y-5 sm:space-y-6">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-start gap-4 text-lg sm:text-xl text-[#1a1a1a] leading-[1.6]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C4A574] mt-2 shrink-0" aria-hidden />
                    <span>{t(`directions.items.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-center pt-6 border-t border-[#C4A574]/30"
            >
              <p className="text-base sm:text-lg text-[#2a2a2a] leading-relaxed italic max-w-xl mx-auto" style={{ fontFamily: 'serif' }}>
                {t('directions.footer')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* B2B block */}
        <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#2a2a2a] text-[#FAF9F6] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
            aria-hidden
          />
          <div className="max-w-3xl mx-auto relative z-10">
            {/* Заголовок и подзаголовок — центр */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10 sm:mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-8 bg-[#C4A574]" />
                <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                  {t('b2b.label')}
                </span>
                <div className="h-px w-8 bg-[#C4A574]" />
              </div>
              <h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-5 sm:mb-6 tracking-tight"
                style={{ fontFamily: 'serif' }}
              >
                {t('b2b.title')} <br className="sm:hidden" />
                <span className="italic">{t('b2b.titleItalic')}</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[#FAF9F6]/85 max-w-2xl mx-auto leading-relaxed">
                {t('b2b.support')}
              </p>
            </motion.div>

            {/* Текстовый блок — левое выравнивание, акцентная полоса */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="border-l-2 border-[#C4A574]/70 pl-6 sm:pl-8 py-1 mb-12 sm:mb-14"
            >
              <p className="text-base sm:text-lg text-[#FAF9F6]/90 leading-relaxed mb-5">
                {t('b2b.description1')}
              </p>
              <p className="text-base sm:text-lg text-[#FAF9F6]/90 leading-relaxed">
                {t('b2b.description2')}
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-center"
            >
              <motion.button
                type="button"
                onClick={() => openRequestModal()}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#C4A574] text-white rounded-full text-base sm:text-lg tracking-wider shadow-2xl hover:shadow-[#C4A574]/30 transition-shadow font-medium"
              >
                {t('b2b.cta')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
