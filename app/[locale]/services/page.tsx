'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scissors,
  Sparkles,
  Heart,
  Leaf,
  Palette,
  Layers,
  Users,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PageHeader from '@/components/shared/PageHeader';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { useTranslations } from '@/lib/i18n';

const SERVICE_IDS = ['01', '02', '03', '04', '05', '06', '07'] as const;
const ICONS = [Scissors, Sparkles, Heart, Leaf, Palette, Layers, Users];
const COLORS = [
  'from-[#C4A574] to-[#B8985E]',
  'from-[#DC2626] to-[#B91C1C]',
  'from-[#8B7355] to-[#A8896A]',
  'from-[#B8985E] to-[#C4A574]',
  'from-[#A8896A] to-[#8B7355]',
  'from-[#C4A574] to-[#8B7355]',
  'from-[#8B7355] to-[#B8985E]',
];
const ACCENT_COLORS = ['#C4A574', '#DC2626', '#8B7355', '#B8985E', '#A8896A', '#C4A574', '#8B7355'];

export default function ServicesPage() {
  const t = useTranslations('servicesPage');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const services = useMemo(() => SERVICE_IDS.map((id, i) => {
    const features = t(`services.${id}.features`);
    return {
      number: id,
      title: t(`services.${id}.title`),
      subtitle: t(`services.${id}.subtitle`),
      shortDesc: t(`services.${id}.shortDesc`),
      fullDesc: t(`services.${id}.fullDesc`),
      features: Array.isArray(features) ? features : [features],
      icon: ICONS[i],
      color: COLORS[i],
      accentColor: ACCENT_COLORS[i],
    };
  }), [t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] overflow-x-hidden">
      <Navigation />
      <div>
        <PageHeader
          label={String(t('hero.label'))}
          title={String(t('hero.title'))}
          titleItalic={String(t('hero.titleItalic'))}
          subtitle={String(t('hero.subtitle'))}
          description={String(t('hero.description'))}
          badges={[String(t('hero.badge1')), String(t('hero.badge2')), String(t('hero.badge3'))]}
          labelColor="#C4A574"
        >
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1558769138-e5ac0c5c0de2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Atelier workspace"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-6 left-6 right-6"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-2 text-[#C4A574] mb-1">
                    <Scissors className="w-4 h-4" />
                    <span className="text-xs tracking-wider uppercase font-medium">{t('hero.badgeTitle')}</span>
                  </div>
                  <p className="text-xs text-[#8B8B8B]">{t('hero.badgeDesc')}</p>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="absolute -z-10 -right-8 -bottom-8 w-64 h-64 bg-gradient-to-br from-[#C4A574]/20 to-transparent rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </div>
        </PageHeader>

        {/* SERVICES GRID */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {services.map((service, i) => {
                const Icon = service.icon;

                return (
                  <motion.div
                    key={service.number}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    viewport={{ once: true, margin: '-40px' }}
                    className="relative group"
                  >
                    <motion.div
                      onClick={() => setSelectedService(i)}
                      whileHover={{ y: -6 }}
                      className="relative bg-white rounded-[1.75rem] p-6 sm:p-8 border border-black/5 hover:border-[#C4A574]/25 cursor-pointer overflow-hidden transition-all duration-400 h-full shadow-sm hover:shadow-xl"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`}
                      />

                      <div
                        className="absolute top-6 right-6 text-7xl sm:text-8xl font-light opacity-[0.06] pointer-events-none select-none"
                        style={{ fontFamily: 'serif' }}
                      >
                        {service.number}
                      </div>

                      <div className="relative z-10">
                        <div className="mb-5">
                          <div
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                          >
                            <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-white" strokeWidth={1.5} />
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3
                            className="text-xl sm:text-2xl lg:text-3xl mb-1.5 tracking-tight leading-tight"
                            style={{ fontFamily: 'serif' }}
                          >
                            {service.title}
                          </h3>
                          <div className="text-xs sm:text-sm text-[#C4A574] tracking-widest uppercase">
                            {service.subtitle}
                          </div>
                        </div>

                        <p className="text-[#8B8B8B] text-sm sm:text-base leading-relaxed mb-5">
                          {service.shortDesc}
                        </p>

                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(i);
                          }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className="group/btn flex items-center gap-3 text-sm sm:text-base tracking-wider text-black font-medium"
                        >
                          {t('moreButton')}
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center shadow-md group-hover/btn:scale-110 transition-transform`}
                          >
                            <ArrowRight className="w-4 h-4 text-white" />
                          </div>
                        </motion.button>
                      </div>

                      <div
                        className="absolute bottom-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at bottom right, ${service.accentColor}18, transparent 60%)`,
                        }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MODAL - Service Details */}
        <AnimatePresence>
          {selectedService !== null && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedService(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="fixed inset-4 sm:inset-8 md:inset-16 lg:inset-24 z-50 flex items-center justify-center"
              >
                <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 md:p-12 max-w-4xl w-full max-h-full overflow-y-auto relative shadow-2xl">
                  <motion.button
                    onClick={() => setSelectedService(null)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>

                  {(() => {
                    const service = services[selectedService];
                    const Icon = service.icon;

                    return (
                      <>
                        <div className="mb-8">
                          <div className="flex items-start gap-6 mb-6">
                            <div
                              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-xl flex-shrink-0`}
                            >
                              <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
                            </div>

                            <div>
                              <div className="text-[#C4A574] text-xs sm:text-sm tracking-[0.3em] mb-2 uppercase">
                                {service.subtitle}
                              </div>
                              <h2
                                className="text-3xl sm:text-4xl md:text-5xl tracking-tight"
                                style={{ fontFamily: 'serif' }}
                              >
                                {service.title}
                              </h2>
                            </div>
                          </div>

                          <p className="text-lg sm:text-xl text-[#4A4A4A] leading-relaxed">
                            {service.fullDesc}
                          </p>
                        </div>

                        <div className="mb-10">
                          <h3 className="text-lg font-medium tracking-wider mb-5 flex items-center gap-3">
                            <div className="h-px flex-1 bg-gradient-to-r from-[#C4A574] to-transparent" />
                            <span>{t('modal.whatIncluded')}</span>
                            <div className="h-px flex-1 bg-gradient-to-l from-[#C4A574] to-transparent" />
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {service.features.map((feature, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="flex items-center gap-3"
                              >
                                <div
                                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}
                                >
                                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                </div>
                                <span className="text-base text-[#4A4A4A]">{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <motion.button
                            onClick={() => {
                              setFormData({ ...formData, service: String(service.title) });
                              setSelectedService(null);
                              setTimeout(() => {
                                document
                                  .getElementById('request-form')
                                  ?.scrollIntoView({ behavior: 'smooth' });
                              }, 300);
                            }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex-1 px-8 py-5 bg-gradient-to-r ${service.color} text-white rounded-full text-base sm:text-lg tracking-wider shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-3`}
                          >
                            {t('modal.orderService')}
                            <ArrowRight className="w-5 h-5" />
                          </motion.button>

                          <motion.button
                            onClick={() => setSelectedService(null)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-5 border-2 border-black/10 rounded-full text-base sm:text-lg tracking-wider hover:bg-black/5 transition-colors"
                          >
                            {t('modal.close')}
                          </motion.button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* REQUEST FORM SECTION */}
        <section
          id="request-form"
          className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-black text-white relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              backgroundImage: 'radial-gradient(circle, #C4A574 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#C4A574]/20 to-transparent rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-[#DC2626]/10 to-transparent rounded-full blur-3xl"
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-4 mb-8"
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#C4A574] to-transparent" />
                <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                  {t('form.label')}
                </span>
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#C4A574] to-transparent" />
              </motion.div>

              <h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight tracking-tight"
                style={{ fontFamily: 'serif' }}
              >
                {t('form.title')} <br className="sm:hidden" />
                <span className="italic text-[#C4A574]">{t('form.titleItalic')}</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                {t('form.description')}
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm tracking-wider mb-2 text-white/70">
                    {t('form.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors text-white placeholder:text-white/30"
                    placeholder={String(t('form.namePlaceholder'))}
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-wider mb-2 text-white/70">{t('form.email')} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors text-white placeholder:text-white/30"
                    placeholder="anna@example.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm tracking-wider mb-2 text-white/70">{t('form.phone')}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors text-white placeholder:text-white/30"
                    placeholder="+49 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-wider mb-2 text-white/70">{t('form.service')} *</label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors text-white appearance-none cursor-pointer"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23C4A574' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1.5rem center',
                      backgroundSize: '1.25rem',
                    }}
                  >
                    <option value="">{String(t('form.servicePlaceholder'))}</option>
                    {services.map((s) => (
                      <option key={s.number} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm tracking-wider mb-2 text-white/70">{t('form.message')} *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors text-white placeholder:text-white/30 resize-none"
                  placeholder={String(t('form.messagePlaceholder'))}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-[#C4A574] to-[#8B7355] text-white rounded-full text-base sm:text-lg tracking-wider shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center gap-3 mx-auto"
              >
                {t('form.submit')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.form>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

