'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Store, Monitor, MessageCircle, Users, Ruler, Package, Video, Send } from 'lucide-react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PageHeader from '@/components/shared/PageHeader';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { useTranslations } from '@/lib/i18n';
import { useRequestModal } from '@/lib/request-modal-context';

const offlineIcons = [MessageCircle, Users, Ruler, Package];
const onlineIcons = [MessageCircle, Video, Ruler, Send, Package];

const BESPOKE_HERO_SRC = '/images/models/model4.png';

function BespokeHeroImage() {
  return (
    <div className="relative h-full w-full min-h-full overflow-hidden lg:aspect-[4/5] lg:rounded-3xl lg:shadow-2xl">
      <ImageWithFallback
        src={BESPOKE_HERO_SRC}
        alt="Bespoke tailoring"
        className="h-full w-full object-cover lg:rounded-3xl"
      />
    </div>
  );
}

export default function BespokePage() {
  const t = useTranslations('bespokePage');
  const { openRequestModal } = useRequestModal();
  const [activeMode, setActiveMode] = useState<'offline' | 'online'>('offline');

  const offlineSteps = ['01', '02', '03', '04'] as const;
  const onlineSteps = ['01', '02', '03', '04', '05'] as const;

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
          labelColor="#C4A574"
        >
          <BespokeHeroImage />
          <BespokeHeroImage />
        </PageHeader>

        {/* INTRO */}
        <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-white">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-lg sm:text-xl text-[#1a1a1a] leading-relaxed"
            >
              {t('intro.p1')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed"
            >
              {t('intro.p2')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base text-[#8B8B8B]"
            >
              {t('intro.p3')}
            </motion.p>
          </div>
        </section>

        {/* OFFLINE / ONLINE — creative two-column toggle */}
        <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            {/* Mode toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-14 sm:mb-16"
            >
              <button
                type="button"
                onClick={() => setActiveMode('offline')}
                className={`flex items-center justify-center gap-3 rounded-2xl px-8 py-4 border-2 transition-all duration-300 ${
                  activeMode === 'offline'
                    ? 'border-[#C4A574] bg-[#C4A574]/10 text-black'
                    : 'border-black/10 bg-white text-[#8B8B8B] hover:border-black/20 hover:text-black'
                }`}
              >
                <Store className="w-5 h-5" />
                <span className="text-lg font-medium tracking-wide">{t('offline.title')}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('online')}
                className={`flex items-center justify-center gap-3 rounded-2xl px-8 py-4 border-2 transition-all duration-300 ${
                  activeMode === 'online'
                    ? 'border-[#1a1a1a] bg-black/5 text-black'
                    : 'border-black/10 bg-white text-[#8B8B8B] hover:border-black/20 hover:text-black'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span className="text-lg font-medium tracking-wide">{t('online.title')}</span>
              </button>
            </motion.div>

            {/* Offline content */}
            <AnimatePresence mode="wait">
              {activeMode === 'offline' && (
                <motion.div
                  key="offline"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="relative rounded-[2rem] overflow-hidden border border-[#C4A574]/25 bg-gradient-to-br from-[#FAF9F6] to-[#F5F0E8] shadow-xl shadow-black/5"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#C4A574] to-[#8B7355]" />
                  <div className="pl-8 pr-6 py-10 sm:py-12 md:pl-12 md:pr-10">
                    <p className="text-sm text-[#C4A574] tracking-widest uppercase mb-8">
                      {t('offline.subtitle')}
                    </p>
                    <div className="relative">
                      {offlineSteps.map((stepId, i) => {
                        const Icon = offlineIcons[i];
                        const isLast = i === offlineSteps.length - 1;
                        return (
                          <motion.div
                            key={stepId}
                            initial={{ opacity: 0, x: -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative flex gap-6 sm:gap-8"
                          >
                            {!isLast && (
                              <div className="absolute left-5 top-14 bottom-0 w-px bg-[#C4A574]/30" />
                            )}
                            <div className="relative z-10 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#C4A574]/20 flex items-center justify-center border-2 border-[#C4A574]/40">
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B7355]" />
                            </div>
                            <div className="pb-10 sm:pb-12">
                              <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-black mb-2">
                                {t(`offline.steps.${stepId}.title`)}
                              </h3>
                              <p className="text-[#5a5a5a] leading-relaxed max-w-xl">
                                {t(`offline.steps.${stepId}.description`)}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMode === 'online' && (
                <motion.div
                  key="online"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="relative rounded-[2rem] overflow-hidden border border-black/10 bg-white shadow-xl shadow-black/5"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-black/20 to-black/5" />
                  <div className="pl-8 pr-6 py-10 sm:py-12 md:pl-12 md:pr-10">
                    <p className="text-sm text-black/60 tracking-widest uppercase mb-8">
                      {t('online.subtitle')}
                    </p>
                    <div className="relative">
                      {onlineSteps.map((stepId, i) => {
                        const Icon = onlineIcons[i];
                        const isLast = i === onlineSteps.length - 1;
                        return (
                          <motion.div
                            key={stepId}
                            initial={{ opacity: 0, x: -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="relative flex gap-6 sm:gap-8"
                          >
                            {!isLast && (
                              <div className="absolute left-5 top-14 bottom-0 w-px bg-black/10" />
                            )}
                            <div className="relative z-10 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/5 flex items-center justify-center border border-black/10">
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-black/70" />
                            </div>
                            <div className="pb-10 sm:pb-12">
                              <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-black mb-2">
                                {t(`online.steps.${stepId}.title`)}
                              </h3>
                              <p className="text-[#5a5a5a] leading-relaxed max-w-xl">
                                {t(`online.steps.${stepId}.description`)}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-[#FAF9F6]">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-base sm:text-lg text-[#8B8B8B] mb-8">
              {t('cta.description')}
            </p>
            <motion.button
              onClick={() => openRequestModal()}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-full text-base sm:text-lg tracking-wider shadow-xl font-medium"
            >
              {t('cta.button')}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
