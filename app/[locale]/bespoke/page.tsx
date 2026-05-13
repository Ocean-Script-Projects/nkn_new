'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown, Store, Monitor, MessageCircle, Users, Ruler, Package, Video, Send } from 'lucide-react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PageHeader from '@/components/shared/PageHeader';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { useTranslations, useLocale } from '@/lib/i18n';
import { useRequestModal } from '@/lib/request-modal-context';
import SeoIntro from '@/components/seo/SeoIntro';
import { getPublicOrigin } from '@/lib/site-url';

const offlineIcons = [MessageCircle, Users, Ruler, Package];
const onlineIcons = [MessageCircle, Video, Ruler, Send, Package];

const BESPOKE_HERO_SRC = '/images/models/model4.webp';

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

const SPECIALTY_IDS = ['01', '02', '03', '04', '05', '06'] as const;
const FAQ_IDS = ['01', '02', '03', '04', '05', '06'] as const;

export default function BespokePage() {
  const t = useTranslations('bespokePage');
  const locale = useLocale();
  const { openRequestModal } = useRequestModal();
  const [activeMode, setActiveMode] = useState<'offline' | 'online'>('offline');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const offlineSteps = ['01', '02', '03', '04'] as const;
  const onlineSteps = ['01', '02', '03', '04', '05'] as const;

  const siteUrl = getPublicOrigin();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${siteUrl}/#atelier`,
        name: 'NKN Atelier — Nataliia Khreshkova',
        alternateName: 'NKN Atelier',
        description: String(t('seo.description')),
        url: `${siteUrl}/${locale}/bespoke/`,
        image: `${siteUrl}/images/big_logo.png`,
        logo: `${siteUrl}/images/big_logo.png`,
        telephone: '+491774019818',
        email: 'hreshkovanat@gmail.com',
        founder: {
          '@type': 'Person',
          name: 'Nataliia Khreshkova',
        },
        areaServed: [
          { '@type': 'City', name: 'Hamburg' },
          { '@type': 'Country', name: 'Germany' },
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Hamburg',
          addressCountry: 'DE',
        },
        priceRange: '€€€',
        knowsLanguage: ['ru', 'de', 'en'],
        serviceType:
          'Bespoke tailoring / Maßschneiderei / Индивидуальный пошив одежды',
        sameAs: [
          'https://www.instagram.com/nataliia_khreshkova_natalina',
          'https://www.facebook.com/share/1V1AQqDcp5/',
          'https://www.tiktok.com/@nataliia.khreshkov',
          'https://t.me/NataliiaKhreshkova',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_IDS.map((id) => ({
          '@type': 'Question',
          name: String(t(`faq.items.${id}.question`)),
          acceptedAnswer: {
            '@type': 'Answer',
            text: String(t(`faq.items.${id}.answer`)),
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        {/* WHAT I MAKE */}
        <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#C4A574]" />
                <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                  {t('specialties.label')}
                </span>
                <div className="h-px w-8 bg-[#C4A574]" />
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-4"
                style={{ fontFamily: 'serif' }}
              >
                {t('specialties.title')} <span className="italic">{t('specialties.titleItalic')}</span>
              </h2>
              <p className="text-base sm:text-lg text-[#8B8B8B] max-w-2xl mx-auto leading-relaxed">
                {t('specialties.description')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {SPECIALTY_IDS.map((id, i) => (
                <motion.article
                  key={id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="rounded-3xl border border-black/[0.07] bg-[#FAF9F6] p-6 sm:p-7 hover:border-[#C4A574]/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="mb-4 h-10 w-10 rounded-2xl bg-gradient-to-br from-[#C4A574] to-[#8B7355] text-white flex items-center justify-center text-sm font-medium tracking-wider">
                    {id}
                  </div>
                  <h3
                    className="text-xl sm:text-2xl tracking-tight mb-3"
                    style={{ fontFamily: 'serif' }}
                  >
                    {t(`specialties.items.${id}.title`)}
                  </h3>
                  <p className="text-sm sm:text-base text-[#8B8B8B] leading-relaxed">
                    {t(`specialties.items.${id}.description`)}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#FAF9F6]">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10 sm:mb-14"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#C4A574]" />
                <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                  {t('faq.label')}
                </span>
                <div className="h-px w-8 bg-[#C4A574]" />
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight"
                style={{ fontFamily: 'serif' }}
              >
                {t('faq.title')} <span className="italic">{t('faq.titleItalic')}</span>
              </h2>
            </motion.div>

            <div className="space-y-3">
              {FAQ_IDS.map((id, i) => {
                const isOpen = expandedFaq === id;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="rounded-2xl border border-black/[0.07] bg-white overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : id)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left hover:bg-black/[0.02] transition-colors"
                    >
                      <span className="text-base sm:text-lg font-medium tracking-tight text-black/90">
                        {t(`faq.items.${id}.question`)}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#8B8B8B] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-[#5a5a5a] leading-relaxed">
                            {t(`faq.items.${id}.answer`)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <SeoIntro text={String(t('seoText'))} />

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
