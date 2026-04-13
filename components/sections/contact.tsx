'use client';

import { motion } from 'motion/react';
import { ArrowRight, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { useRequestModal } from '@/lib/request-modal-context';
import DecorativeLogo from '@/components/shared/DecorativeLogo';

export default function ContactSection() {
  const t = useTranslations('contact');
  const { openRequestModal } = useRequestModal();

  const contacts = [
    {
      icon: Mail,
      title: t('email.title'),
      value: t('email.value'),
      link: `mailto:${t('email.value')}`,
    },
    {
      icon: Phone,
      title: t('phone.title'),
      value: t('phone.value'),
      link: `tel:${String(t('phone.value')).replace(/\s/g, '')}`,
    },
    {
      icon: MapPin,
      title: t('address.title'),
      value: t('address.value'),
      link: '#',
    },
  ];

  return (
    <section
      id="contact"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-black text-white relative overflow-hidden bg-fabric-grain-dark"
    >
      <DecorativeLogo variant="short" position="top-left" light className="hidden md:block" />
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          backgroundImage: 'radial-gradient(circle, var(--brand-mustard) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 mb-6 sm:mb-8">
            <div className="h-px w-8 bg-brand-mustard" />
            <span className="text-brand-mustard text-sm tracking-[0.4em] uppercase">{t('label')}</span>
            <div className="h-px w-8 bg-brand-mustard" />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 sm:mb-8 leading-tight px-1"
            style={{ fontFamily: 'serif' }}
          >
            {t('title')} <br />
            <span className="italic text-brand-mustard">{t('titleItalic')}</span> {t('titleEnd')}
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-2">
            {t('description')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          {contacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <a
                key={String(contact.title)}
                href={contact.link}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-white/10 hover:border-brand-mustard/50 transition-all group block hover:-translate-y-1"
              >
                <Icon className="w-8 h-8 text-brand-mustard mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-sm text-white/50 mb-2 tracking-wider">{contact.title}</div>
                <div className="text-lg tracking-wide">{contact.value}</div>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <motion.button
            type="button"
            onClick={() => openRequestModal()}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-brand-mustard px-8 py-4 text-base tracking-wider text-brand-mustard-foreground shadow-lg transition-colors duration-300 hover:bg-white hover:text-neutral-950 sm:px-12 sm:py-6 sm:text-lg w-full max-w-sm sm:w-auto sm:max-w-none"
          >
            {t('startProject')}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
          </motion.button>

          <div className="flex items-center justify-center gap-6 mt-10 sm:mt-12">
            {[Instagram, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-brand-mustard hover:bg-brand-mustard/10 hover:scale-110 transition-all"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
