'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Send, Mail, MessageCircle, ChevronDown, Check } from 'lucide-react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PageHeader from '@/components/shared/PageHeader';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { useTranslations, useLocale } from '@/lib/i18n';
import { submitSiteRequest } from '@/lib/submit-site-request';
import SeoIntro from '@/components/seo/SeoIntro';
import PageBreadcrumbs from '@/components/seo/PageBreadcrumbs';
import FaqJsonLd from '@/components/seo/FaqJsonLd';
import { CONTACT } from '@/lib/site-config';

/** Та же фотография, что на главной: `public/images/hero.jpg` */
const CONTACT_HERO_SRC = '/images/models/natalia_img5.webp';

function ContactHeroImage() {
  const t = useTranslations('contactPage');
  return (
    <div className="relative h-full w-full min-h-full overflow-hidden lg:aspect-[4/5] lg:rounded-3xl lg:shadow-2xl">
      <ImageWithFallback
        src={CONTACT_HERO_SRC}
        alt={String(t('imageAlt'))}
        className="h-full w-full object-cover lg:rounded-3xl"
      />
    </div>
  );
}

export default function ContactPage() {
  const t = useTranslations('contactPage');
  const locale = useLocale();
  const [selectedService, setSelectedService] = useState<string[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactMethod: 'telegram',
    contactValue: '',
    message: '',
  });

  const [contactMethodOpen, setContactMethodOpen] = useState(false);
  const contactMethodRef = useRef<HTMLDivElement>(null);

  const servicesRaw = t('form.services');
  const services = Array.isArray(servicesRaw) ? servicesRaw : [servicesRaw];

  const faqIds = ['01', '02', '03'] as const;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contactMethodRef.current && !contactMethodRef.current.contains(e.target as Node)) {
        setContactMethodOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleService = (service: string) => {
    setSelectedService((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const contactMethodLabel =
      formData.contactMethod === 'telegram'
        ? String(t('form.contactTelegram'))
        : formData.contactMethod === 'email'
          ? String(t('form.contactEmail'))
          : String(t('form.contactWhatsapp'));

    const result = await submitSiteRequest({
      name: formData.name.trim(),
      contact: formData.contactValue.trim(),
      message: formData.message.trim(),
      source: 'contact',
      locale,
      contactMethod: contactMethodLabel,
      selectedServices: selectedService.length ? selectedService : undefined,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setShowSuccessMessage(true);
    setFormData({ name: '', contactMethod: 'telegram', contactValue: '', message: '' });
    setSelectedService([]);

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] overflow-x-hidden">
      <Navigation />
      <PageBreadcrumbs segment="contact" navKey="contact" />
      <FaqJsonLd
        items={faqIds.map((id) => ({
          question: String(t(`faq.${id}.question`)),
          answer: String(t(`faq.${id}.answer`)),
        }))}
      />
      <div>
        <PageHeader
          mobileLayout="editorial"
          label={String(t('hero.label'))}
          title={String(t('hero.title'))}
          titleItalic={String(t('hero.titleItalic'))}
          description={String(t('hero.description'))}
          labelColor="#C4A574"
        >
          <ContactHeroImage />
          <ContactHeroImage />
        </PageHeader>

        {/* CONTACT METHODS */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Telegram */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="relative bg-gradient-to-br from-[#C4A574] to-[#8B7355] text-white rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl overflow-hidden"
              >
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                    }}
                  />
                </div>

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                    <Send className="w-7 h-7" />
                  </div>

                  <h3
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 tracking-tight"
                    style={{ fontFamily: 'serif' }}
                  >
                    {t('telegram.title')}
                  </h3>

                  <p className="text-white/80 text-sm sm:text-base mb-8 leading-relaxed">
                    {t('telegram.description')}
                  </p>

                  <motion.a
                    href="https://t.me/NataliiaKhreshkova"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#8B7355] rounded-full text-sm sm:text-base tracking-wider shadow-lg hover:shadow-xl transition-shadow font-medium"
                  >
                    {t('telegram.button')}
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-[#FAF9F6] border border-black/10 rounded-3xl p-5 sm:p-8 md:p-10 shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#C4A574]/10 flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7 text-[#C4A574]" />
                </div>

                <h3
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 tracking-tight"
                  style={{ fontFamily: 'serif' }}
                >
                  {t('email.title')}
                </h3>

                <p className="text-[#8B8B8B] text-sm sm:text-base mb-8 leading-relaxed">
                  {t('email.description')}
                </p>

                <motion.a
                  href={`mailto:${CONTACT.email}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-black/10 rounded-full text-sm sm:text-base tracking-wider shadow hover:shadow-lg transition-shadow font-medium"
                >
                  {t('email.button')}
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* MAIN FORM — компактнее, чтобы влезало на экран */}
        <section className="py-10 sm:py-14 md:py-16 px-4 sm:px-6 md:px-12">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl border border-black/5">
                <div className="text-center mb-5 sm:mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="h-px w-6 bg-[#C4A574]" />
                    <span className="text-[#C4A574] text-[10px] sm:text-xs tracking-[0.35em] uppercase">
                      {t('form.label')}
                    </span>
                    <div className="h-px w-6 bg-[#C4A574]" />
                  </div>

                  <h2
                    className="text-xl sm:text-2xl md:text-3xl mb-2 tracking-tight leading-tight"
                    style={{ fontFamily: 'serif' }}
                  >
                    {t('form.title')} <span className="italic">{t('form.titleItalic')}</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#8B8B8B] leading-snug max-w-md mx-auto">
                    {t('form.description')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Services chips */}
                  <div>
                    <label className="block text-xs tracking-wider mb-2 text-[#8B8B8B]">
                      {t('form.servicesLabel')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {services.map((service) => (
                        <motion.button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm tracking-wide border transition-all ${
                            selectedService.includes(service)
                              ? 'bg-[#C4A574] text-white border-[#C4A574] shadow-lg'
                              : 'bg-[#FAF9F6] text-[#8B8B8B] border-black/10 hover:border-[#C4A574]/30'
                          }`}
                        >
                          {service}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs tracking-wider mb-1.5 text-[#8B8B8B]">
                      {t('form.name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-[#FAF9F6] border border-black/10 rounded-xl focus:border-[#C4A574] focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="Name"
                    />
                  </div>

                  {/* Preferred contact */}
                  <div>
                    <label className="block text-xs tracking-wider mb-1.5 text-[#8B8B8B]">
                      {t('form.contact')} *
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                      <div ref={contactMethodRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setContactMethodOpen(!contactMethodOpen)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-[#FAF9F6] border border-black/10 rounded-xl focus:border-[#C4A574] focus:outline-none transition-colors text-sm sm:text-base text-left flex items-center justify-between gap-2"
                        >
                          <span>
                            {formData.contactMethod === 'telegram'
                              ? String(t('form.contactTelegram'))
                              : formData.contactMethod === 'email'
                              ? String(t('form.contactEmail'))
                              : String(t('form.contactWhatsapp'))}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-[#8B8B8B] flex-shrink-0 transition-transform duration-200 ${
                              contactMethodOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {contactMethodOpen && (
                            <motion.ul
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 right-0 mt-2 py-2 bg-white border border-black/10 rounded-2xl shadow-lg z-20 overflow-hidden"
                            >
                              {(['telegram', 'whatsapp', 'email'] as const).map((method) => (
                                <li key={method}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, contactMethod: method });
                                      setContactMethodOpen(false);
                                    }}
                                    className={`w-full px-3 py-2 text-sm text-left hover:bg-[#FAF9F6] transition-colors ${
                                      formData.contactMethod === method ? 'bg-[#FAF9F6] text-[#C4A574]' : ''
                                    }`}
                                  >
                                    {method === 'telegram'
                                      ? String(t('form.contactTelegram'))
                                      : method === 'email'
                                      ? String(t('form.contactEmail'))
                                      : String(t('form.contactWhatsapp'))}
                                  </button>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>

                      <input
                        type="text"
                        required
                        value={formData.contactValue}
                        onChange={(e) =>
                          setFormData({ ...formData, contactValue: e.target.value })
                        }
                        className="px-3 py-2 sm:px-4 sm:py-2.5 bg-[#FAF9F6] border border-black/10 rounded-xl focus:border-[#C4A574] focus:outline-none transition-colors text-sm sm:text-base min-w-0"
                        placeholder={
                          formData.contactMethod === 'email'
                            ? 'your@email.com'
                            : formData.contactMethod === 'telegram'
                            ? '@username'
                            : '+49...'
                        }
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs tracking-wider mb-1.5 text-[#8B8B8B]">
                      {t('form.message')} *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full min-h-[5.5rem] px-3 py-2 sm:px-4 sm:py-2.5 bg-[#FAF9F6] border border-black/10 rounded-xl focus:border-[#C4A574] focus:outline-none transition-colors resize-y text-sm sm:text-base leading-relaxed"
                      placeholder={String(t('form.messagePlaceholder'))}
                    />
                  </div>

                  {formError ? (
                    <p className="text-sm text-red-600 text-center" role="alert">
                      {formError}
                    </p>
                  ) : null}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-5 py-2.5 sm:py-3 bg-gradient-to-r from-[#C4A574] to-[#8B7355] text-white rounded-full text-sm sm:text-base tracking-wider shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2 font-medium disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {isSubmitting ? '…' : t('form.submit')}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </motion.button>

                  <p className="text-[11px] sm:text-xs text-[#8B8B8B] text-center italic leading-snug">
                    {t('form.footer')}
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 bg-white">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10 sm:mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#C4A574]" />
                <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                  {t('faq.label')}
                </span>
                <div className="h-px w-8 bg-[#C4A574]" />
              </div>

              <h2
                className="text-2xl sm:text-3xl md:text-4xl tracking-tight"
                style={{ fontFamily: 'serif' }}
              >
                {t('faq.title')}
              </h2>
            </motion.div>

            <div className="space-y-4">
              {faqIds.map((id, i) => (
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
                    <span className="text-base sm:text-lg tracking-wide">{t(`faq.${id}.question`)}</span>
                    <motion.div
                      animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-[#C4A574] flex-shrink-0" />
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
                            {t(`faq.${id}.answer`)}
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

        {/* LOCATION / ATELIER */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-white to-[#FAF9F6]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#C4A574]" />
                <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                  {t('location.label')}
                </span>
                <div className="h-px w-8 bg-[#C4A574]" />
              </div>

              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 tracking-tight"
                style={{ fontFamily: 'serif' }}
              >
                {t('location.title')}
              </h2>

              <p className="text-base sm:text-lg text-[#8B8B8B] max-w-2xl mx-auto leading-relaxed">
                {t('location.description')}
              </p>
            </motion.div>
          </div>
        </section>
        <SeoIntro text={String(t('seoText'))} />

        {/* EMOTIONAL FOOTER QUOTE */}
        <section className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#2a2a2a] text-[#FAF9F6] relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <motion.blockquote
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <div
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight tracking-tight"
                style={{ fontFamily: 'serif' }}
              >
                {t('quote.text')}
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <div className="h-px w-12 bg-[#C4A574]" />
                <MessageCircle className="w-5 h-5 text-[#C4A574]" />
                <div className="h-px w-12 bg-[#C4A574]" />
              </div>
            </motion.blockquote>
          </div>
        </section>

        {/* SUCCESS TOAST */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-[#C4A574] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
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
      </div>
      <Footer />
    </div>
  );
}

