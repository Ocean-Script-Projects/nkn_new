'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Leaf, Scissors, Eye, Sparkles, ChevronDown, Check } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { ImageWithFallback } from '@/components/image-with-fallback';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PageHeader from '@/components/shared/PageHeader';

export default function UpcyclingPage() {
  const t = useTranslations('upcycling');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    garment: '',
    contact: '',
    message: ''
  });

  const process = [
    {
      number: '01',
      title: t('process.steps.01.title'),
      description: t('process.steps.01.description'),
      icon: Eye
    },
    {
      number: '02',
      title: t('process.steps.02.title'),
      description: t('process.steps.02.description'),
      icon: Scissors
    },
    {
      number: '03',
      title: t('process.steps.03.title'),
      description: t('process.steps.03.description'),
      icon: Sparkles
    },
    {
      number: '04',
      title: t('process.steps.04.title'),
      description: t('process.steps.04.description'),
      icon: Leaf
    }
  ];

  const categories = [
    {
      title: t('categories.01.title'),
      description: t('categories.01.description')
    },
    {
      title: t('categories.02.title'),
      description: t('categories.02.description')
    },
    {
      title: t('categories.03.title'),
      description: t('categories.03.description')
    },
    {
      title: t('categories.04.title'),
      description: t('categories.04.description')
    }
  ];

  const faqs = [
    {
      question: t('faq.01.question'),
      answer: t('faq.01.answer')
    },
    {
      question: t('faq.02.question'),
      answer: t('faq.02.answer')
    },
    {
      question: t('faq.03.question'),
      answer: t('faq.03.answer')
    },
    {
      question: t('faq.04.question'),
      answer: t('faq.04.answer')
    },
    {
      question: t('faq.05.question'),
      answer: t('faq.05.answer')
    }
  ];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Upcycling request submitted:', formData);
    setShowSuccessMessage(true);
    setFormData({ garment: '', contact: '', message: '' });
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navigation />
      
      <PageHeader
        label={String(t('label'))}
        title={String(t('title'))}
        titleItalic={String(t('titleItalic'))}
        titleEnd={String(t('titleEnd'))}
        subtitle={
          <>
            {t('subtitle1')}
            <br />
            {t('subtitle2')}
          </>
        }
        description={String(t('description'))}
        labelColor="#059669"
        hasBackgroundOrbs
      >
        <div className="relative">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1751121543103-f42ef3515e02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Upcycling transformation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute bottom-6 left-6 right-6"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2 text-[#059669] mb-1">
                  <Leaf className="w-4 h-4" />
                  <span className="text-xs tracking-wider uppercase font-medium">{t('badge')}</span>
                </div>
                <p className="text-xs text-[#8B8B8B]">{t('badgeDescription')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </PageHeader>

      {/* PHILOSOPHY BLOCK */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#C4A574]" />
                <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">{t('philosophy.label')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight" style={{ fontFamily: 'serif' }}>
                {t('philosophy.title')} <br />
                <span className="italic">{t('philosophy.titleItalic')}</span>
              </h2>

              <div className="space-y-6">
                {(t('philosophy.values') as string[]).map((item: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#059669] mt-2 flex-shrink-0" />
                      <p className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed">
                        {item}
                      </p>
                    </div>
                    {i < 3 && (
                      <div className="h-px bg-gradient-to-r from-[#059669]/20 to-transparent mt-6" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1753162660069-d4145d9a95f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Hands working with fabric"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#059669]/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER SLIDER */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-[#C4A574]" />
                <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                  {t('slider.label')}
                </span>
                <div className="h-px w-8 bg-[#C4A574]" />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight" style={{ fontFamily: 'serif' }}>
                {t('slider.title')}
              </h2>
            </div>

            <div
              className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize"
              onMouseMove={handleSliderMove}
              onTouchMove={handleSliderMove}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
            >
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1760533091973-1262bf57d244?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
                  alt="Before upcycling"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full">
                  <span className="text-white text-sm tracking-wider">{t('slider.before')}</span>
                </div>
              </div>

              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759229874810-26aa9a3dda92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
                  alt="After upcycling"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 right-6 px-4 py-2 bg-[#059669] backdrop-blur-sm rounded-full">
                  <span className="text-white text-sm tracking-wider">{t('slider.after')}</span>
                </div>
              </div>

              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center pointer-events-auto cursor-ew-resize">
                  <div className="flex gap-1">
                    <div className="w-0.5 h-4 bg-[#8B8B8B]" />
                    <div className="w-0.5 h-4 bg-[#8B8B8B]" />
                  </div>
                </div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center text-xl sm:text-2xl tracking-wide text-[#8B8B8B] italic"
              style={{ fontFamily: 'serif' }}
            >
              {t('slider.caption')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* PROCESS - 4 STEPS */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#059669]" />
              <span className="text-[#059669] text-xs sm:text-sm tracking-[0.4em] uppercase">{t('process.label')}</span>
              <div className="h-px w-8 bg-[#059669]" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight" style={{ fontFamily: 'serif' }}>
              {t('process.title')} <span className="italic">{t('process.titleItalic')}</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute left-0 right-0 top-16 h-px bg-gradient-to-r from-transparent via-[#059669]/30 to-transparent" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {process.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="relative"
                  >
                    <div className="text-center space-y-4">
                      <div className="relative inline-block">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center shadow-xl mx-auto relative z-10"
                        >
                          <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
                        </motion.div>
                      </div>

                      <div className="text-5xl font-light text-[#059669]/20" style={{ fontFamily: 'serif' }}>
                        {step.number}
                      </div>

                      <h3 className="text-xl sm:text-2xl tracking-tight" style={{ fontFamily: 'serif' }}>
                        {step.title}
                      </h3>

                      <p className="text-sm sm:text-base text-[#8B8B8B] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT CAN BE UPCYCLED - Cards */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6" style={{ fontFamily: 'serif' }}>
              {t('categories.title')} <span className="italic">{t('categories.titleItalic')}</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 border border-black/5 hover:border-[#059669]/30 transition-all duration-500 shadow-lg hover:shadow-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-[#059669]/10 flex items-center justify-center mb-6">
                  <Leaf className="w-6 h-6 text-[#059669]" />
                </div>

                <h3 className="text-xl sm:text-2xl mb-3 tracking-tight" style={{ fontFamily: 'serif' }}>
                  {cat.title}
                </h3>

                <p className="text-sm sm:text-base text-[#8B8B8B] leading-relaxed">
                  {cat.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center text-base sm:text-lg text-[#8B8B8B] mt-12 sm:mt-16 italic"
          >
            {t('categories.footer')}
          </motion.p>
        </div>
      </section>

      {/* EMOTIONAL BLOCK - Quote */}
      <section className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] text-[#FAF9F6] relative overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#059669]/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight" style={{ fontFamily: 'serif' }}>
              "{t('quote.text1')} <br className="hidden sm:block" />
              {t('quote.text2')}
              <br />
              <span className="italic text-[#059669]">
                {t('quote.text3')} <br className="hidden sm:block" />
                {t('quote.text4')}"
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <div className="h-px w-12 bg-[#059669]" />
              <span className="text-sm tracking-[0.3em] text-[#059669] uppercase">{t('quote.author')}</span>
              <div className="h-px w-12 bg-[#059669]" />
            </div>
          </motion.blockquote>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#059669]" />
              <span className="text-[#059669] text-xs sm:text-sm tracking-[0.4em] uppercase">{t('faq.label')}</span>
              <div className="h-px w-8 bg-[#059669]" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight" style={{ fontFamily: 'serif' }}>
              {t('faq.title')}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="border border-black/5 rounded-2xl overflow-hidden bg-[#FAF9F6]"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between gap-4 hover:bg-white/50 transition-colors"
                >
                  <span className="text-base sm:text-lg tracking-wide">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-[#059669] flex-shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-5 sm:pb-6 pt-2">
                        <p className="text-sm sm:text-base text-[#8B8B8B] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FORM */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-[#C4A574] to-[#8B7355] text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight tracking-tight" style={{ fontFamily: 'serif' }}>
              {t('cta.title')} <br className="sm:hidden" />
              <span className="italic">{t('cta.titleItalic')}</span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {t('cta.description')}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm tracking-wider mb-2 text-white/80">
                {t('form.garment')} *
              </label>
              <textarea
                required
                value={formData.garment}
                onChange={(e) => setFormData({ ...formData, garment: e.target.value })}
                rows={4}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:border-white focus:outline-none transition-colors text-white placeholder:text-white/40 resize-none backdrop-blur-sm"
                placeholder={String(t('form.garmentPlaceholder'))}
              />
            </div>

            <div>
              <label className="block text-sm tracking-wider mb-2 text-white/80">
                {t('form.contact')} *
              </label>
              <input
                type="text"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:border-white focus:outline-none transition-colors text-white placeholder:text-white/40 backdrop-blur-sm"
                placeholder={String(t('form.contactPlaceholder'))}
              />
            </div>

            <div>
              <label className="block text-sm tracking-wider mb-2 text-white/80">
                {t('form.message')}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:border-white focus:outline-none transition-colors text-white placeholder:text-white/40 resize-none backdrop-blur-sm"
                placeholder={String(t('form.messagePlaceholder'))}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-12 py-5 bg-white text-[#8B7355] rounded-full text-base sm:text-lg tracking-wider shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center gap-3 mx-auto font-medium"
            >
              {t('form.submit')}
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <p className="text-sm text-white/70 text-center pt-4">
              {t('form.footer')}
            </p>
          </motion.form>
        </div>
      </section>

      {/* SUCCESS MESSAGE */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-[#059669] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-sm sm:text-base tracking-wide">
                {t('success')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
