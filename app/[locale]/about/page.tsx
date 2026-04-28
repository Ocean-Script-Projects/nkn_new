'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Scissors, Ruler, Sparkles, X } from 'lucide-react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PageHeader from '@/components/shared/PageHeader';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { useTranslations, useLocale } from '@/lib/i18n';
import { submitSiteRequest } from '@/lib/submit-site-request';

const ABOUT_HERO_SRC = '/images/natalia_img3.png';

function AboutHeroImage() {
  return (
    <div className="relative h-full w-full min-h-full overflow-hidden lg:aspect-[4/5] lg:rounded-3xl lg:shadow-2xl">
      <ImageWithFallback
        src={ABOUT_HERO_SRC}
        alt="Natalia Khreshkova portrait"
        className="h-full w-full object-cover lg:rounded-3xl"
      />
      <motion.div
        className="pointer-events-none absolute -bottom-8 -right-8 -z-10 hidden h-64 w-64 rounded-full bg-gradient-to-br from-[#C4A574]/20 to-transparent blur-3xl lg:block"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  );
}

export default function AboutPage() {
  const t = useTranslations('aboutPage');
  const locale = useLocale();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [modalFormError, setModalFormError] = useState<string | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    projectType: '',
    message: '',
  });

  const principles = [
    { titleKey: '01', icon: Ruler },
    { titleKey: '02', icon: Sparkles },
    { titleKey: '03', icon: Scissors },
  ];

  const processSteps = ['01', '02', '03', '04', '05'] as const;

  useEffect(() => {
    if (showContactModal) setModalFormError(null);
  }, [showContactModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalFormError(null);
    setModalSubmitting(true);

    const projectTypeLabel = formData.projectType
      ? String(
          t(
            `modal.projectTypes.${formData.projectType as 'bespoke' | 'upcycling' | 'prints' | 'collaboration' | 'other'}`
          )
        )
      : undefined;

    const result = await submitSiteRequest({
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      message: formData.message.trim(),
      source: 'about',
      locale,
      projectType: projectTypeLabel,
    });

    setModalSubmitting(false);

    if (!result.ok) {
      setModalFormError(result.error);
      return;
    }

    setShowContactModal(false);
    setShowSuccessMessage(true);
    setFormData({ name: '', contact: '', projectType: '', message: '' });

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

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
          badges={[String(t('hero.badge1')), String(t('hero.badge2')), String(t('hero.badge3'))]}
          labelColor="#C4A574"
        >
          <AboutHeroImage />
          <AboutHeroImage />
        </PageHeader>

        {/* PERSONAL STORY */}
        <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left - Text */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="space-y-6 sm:space-y-8"
              >
                <div className="space-y-6">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-lg sm:text-xl md:text-2xl text-[#1a1a1a] leading-relaxed"
                  >
                    {t('story.p1')}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed"
                  >
                    {t('story.p2')}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed"
                  >
                    {t('story.p3')}
                  </motion.p>

                  {String(t('story.p4')).trim() && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed"
                    >
                      {t('story.p4')}
                    </motion.p>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="pt-4"
                >
                  <div className="h-px w-16 bg-[#C4A574]" />
                  <p className="text-sm sm:text-base text-[#C4A574] tracking-wider mt-4">
                    {t('story.footer')}
                  </p>
                </motion.div>
              </motion.div>

              {/* Right - Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src="/images/natalia_img4.png"
                    alt="Natalia Khreshkova"
                    className="w-full h-full object-cover object-[50%_20%]"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* POSITION */}
        <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-[#FAF9F6]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#C4A574]" />
              <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                {t('position.label')}
              </span>
              <div className="h-px w-8 bg-[#C4A574]" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-tight mb-8" style={{ fontFamily: 'serif' }}>
              {t('position.title')}
            </h2>
            <p className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed mb-6">
              {t('position.text1')}
            </p>
            <p className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed">
              {t('position.text2')}
            </p>
          </div>
        </section>

        {/* PROFESSIONAL BASIS */}
        <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#C4A574]" />
              <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                {t('professional.label')}
              </span>
              <div className="h-px w-8 bg-[#C4A574]" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-tight mb-8" style={{ fontFamily: 'serif' }}>
              {t('professional.title')}
            </h2>
            <p className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed mb-6">
              {t('professional.text1')}
            </p>
            <p className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed">
              {t('professional.text2')}
            </p>
          </div>
        </section>

        {/* MY APPROACH */}
        <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-[#FAF9F6]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#C4A574]" />
                <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                  {t('philosophy.label')}
                </span>
                <div className="h-px w-8 bg-[#C4A574]" />
              </div>

              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight leading-tight"
                style={{ fontFamily: 'serif' }}
              >
                {t('philosophy.title')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {principles.map((principle, i) => {
                const Icon = principle.icon;
                const key = principle.titleKey;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="relative"
                  >
                    <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 border border-black/5 hover:border-[#C4A574]/30 transition-all duration-500 shadow-lg hover:shadow-2xl h-full">
                      <div className="mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C4A574] to-[#8B7355] flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                        </div>
                      </div>

                      <h3
                        className="text-2xl sm:text-3xl mb-3 tracking-tight"
                        style={{ fontFamily: 'serif' }}
                      >
                        {t(`principles.${key}.title`)}
                      </h3>

                      <div className="h-px bg-gradient-to-r from-[#C4A574] to-transparent mb-4" />

                      <p className="text-sm sm:text-base text-[#8B8B8B] mb-4 tracking-wide">
                        {t(`principles.${key}.description`)}
                      </p>

                      <p className="text-sm text-[#8B8B8B] leading-relaxed italic">
                        {t(`principles.${key}.detail`)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FULL CYCLE PRACTICE */}
        <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight mb-6 leading-tight"
                style={{ fontFamily: 'serif' }}
              >
                {t('process.title')} <span className="italic">{t('process.titleItalic')}</span>
              </h2>
              <p className="text-base sm:text-lg text-[#8B8B8B] max-w-2xl mx-auto">
                {t('process.subtitle')}
              </p>
            </motion.div>

            <div className="relative">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C4A574] to-transparent origin-left"
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:gap-6">
                {processSteps.map((id, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="relative pl-16 pr-1 py-2 text-left md:rounded-none md:border-0 md:bg-transparent md:p-0 md:text-center md:shadow-none"
                  >
                    {i < processSteps.length - 1 && (
                      <div className="pointer-events-none absolute bottom-[-12px] left-7 top-[52px] w-px bg-gradient-to-b from-[#C4A574]/45 to-[#C4A574]/10 md:hidden" />
                    )}

                    <div className="absolute left-0 top-1.5 md:relative md:mb-6 md:inline-block">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 + 0.3 }}
                        className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#C4A574] to-[#8B7355] shadow-md md:h-24 md:w-24 md:shadow-xl"
                      >
                        <span
                          className="text-[13px] tracking-wider text-white md:text-xl"
                          style={{ fontFamily: 'serif' }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </motion.div>

                      <motion.div
                        className="absolute inset-0 rounded-full bg-[#C4A574]"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.4,
                        }}
                      />
                    </div>

                    <h3 className="mb-0.5 text-[1.35rem] leading-tight tracking-tight sm:text-2xl" style={{ fontFamily: 'serif' }}>
                      {t(`process.steps.${id}.step`)}
                    </h3>

                    <p className="text-[13px] leading-relaxed text-[#8B8B8B] md:text-xs md:leading-relaxed lg:text-sm">
                      {t(`process.steps.${id}.detail`)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mt-12 sm:mt-16"
            >
              <p className="text-base sm:text-lg text-[#8B8B8B] italic">
                {t('process.footer')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ATELIER DETAILS */}
        <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-[#FAF9F6]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <span className="text-xs sm:text-sm text-[#C4A574] tracking-[0.4em] uppercase">
                {t('atelierDetails.label')}
              </span>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  src: 'https://images.unsplash.com/photo-1558769138-e5ac0c5c0de2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
                  alt: 'Fabric selection',
                },
                {
                  src: 'https://images.unsplash.com/photo-1562619227-85ff6b0b8c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
                  alt: 'Sewing details',
                },
                {
                  src: 'https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
                  alt: 'Pattern making',
                },
                {
                  src: 'https://images.unsplash.com/photo-1601924375624-2322555e6688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
                  alt: 'Mannequin',
                },
                {
                  src: 'https://images.unsplash.com/photo-1558769138-e5ac0c5c0de2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
                  alt: 'Workspace',
                },
                {
                  src: 'https://images.unsplash.com/photo-1610017309476-27ebe48baf67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
                  alt: 'Hand details',
                },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-lg"
                >
                  <ImageWithFallback
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12 bg-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <motion.blockquote
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <div
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-[#1a1a1a]"
                style={{ fontFamily: 'serif' }}
              >
                {t('quote.text')}
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <div className="h-px w-12 bg-[#C4A574]" />
                <span className="text-sm tracking-[0.3em] text-[#C4A574] uppercase">
                  {t('quote.author')}
                </span>
                <div className="h-px w-12 bg-[#C4A574]" />
              </div>
            </motion.blockquote>
          </div>
        </section>

        {/* PERSONAL CTA */}
        <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-[#C4A574] to-[#8B7355] text-white relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 sm:mb-8 leading-tight tracking-tight"
                style={{ fontFamily: 'serif' }}
              >
                {t('cta.title')} <span className="italic">{t('cta.titleItalic')}</span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                {t('cta.description')}
              </p>

              <motion.button
                onClick={() => setShowContactModal(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#8B7355] rounded-full text-base sm:text-lg tracking-wider shadow-2xl hover:shadow-white/30 transition-shadow font-medium"
              >
                {t('cta.button')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* SEO BLOCK */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl sm:text-3xl tracking-tight" style={{ fontFamily: 'serif' }}>
                {t('seo.title')}
              </h2>
              <p className="text-sm sm:text-base text-[#8B8B8B] leading-relaxed">
                {t('seo.description')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* CONTACT MODAL */}
        <AnimatePresence>
          {showContactModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowContactModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
              >
                <div className="relative max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="p-8 sm:p-12">
                    <div className="mb-8">
                      <h3
                        className="text-3xl sm:text-4xl md:text-5xl mb-4 tracking-tight"
                        style={{ fontFamily: 'serif' }}
                      >
                        {t('modal.title')} <span className="italic">{t('modal.titleItalic')}</span>
                      </h3>
                      <p className="text-base sm:text-lg text-[#8B8B8B]">
                        {t('modal.description')}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">
                          {t('modal.name')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-6 py-4 bg-[#FAF9F6] border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors"
                          placeholder="Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">
                          {t('modal.contact')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          className="w-full px-6 py-4 bg-[#FAF9F6] border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors"
                          placeholder={String(t('modal.contactPlaceholder'))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">
                          {t('modal.projectType')}
                        </label>
                        <select
                          value={formData.projectType}
                          onChange={(e) =>
                            setFormData({ ...formData, projectType: e.target.value })
                          }
                          className="w-full px-6 py-4 bg-[#FAF9F6] border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors"
                        >
                          <option value="">{t('modal.projectTypePlaceholder')}</option>
                          <option value="bespoke">{t('modal.projectTypes.bespoke')}</option>
                          <option value="upcycling">{t('modal.projectTypes.upcycling')}</option>
                          <option value="prints">{t('modal.projectTypes.prints')}</option>
                          <option value="collaboration">{t('modal.projectTypes.collaboration')}</option>
                          <option value="other">{t('modal.projectTypes.other')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">
                          {t('modal.message')} *
                        </label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          rows={4}
                          className="w-full px-6 py-4 bg-[#FAF9F6] border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors resize-none"
                          placeholder={String(t('modal.messagePlaceholder'))}
                        />
                      </div>

                      {modalFormError ? (
                        <p className="text-sm text-red-600" role="alert">
                          {modalFormError}
                        </p>
                      ) : null}

                      <motion.button
                        type="submit"
                        disabled={modalSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-8 py-5 bg-gradient-to-r from-[#C4A574] to-[#8B7355] text-white rounded-full text-base sm:text-lg tracking-wider shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center gap-3 font-medium disabled:opacity-60 disabled:pointer-events-none"
                      >
                        {modalSubmitting ? '…' : t('modal.submit')}
                        {!modalSubmitting && <ArrowRight className="w-5 h-5" />}
                      </motion.button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* SUCCESS MESSAGE */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[102]"
            >
              <div className="bg-[#C4A574] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base tracking-wide">
                  {t('success')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}

