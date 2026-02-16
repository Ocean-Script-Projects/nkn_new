'use client';

import { motion } from 'motion/react';
import { ArrowRight, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export default function ContactSection() {
  const t = useTranslations('contact');

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
      className="py-32 px-6 md:px-12 bg-black text-white relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          backgroundImage: 'radial-gradient(circle, #C4A574 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="h-px w-8 bg-[#C4A574]" />
            <span className="text-[#C4A574] text-sm tracking-[0.4em] uppercase">{t('label')}</span>
            <div className="h-px w-8 bg-[#C4A574]" />
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight" style={{ fontFamily: 'serif' }}>
            {t('title')} <br />
            <span className="italic text-[#C4A574]">{t('titleItalic')}</span> {t('titleEnd')}
          </h2>

          <p className="text-xl text-white/70 max-w-2xl mx-auto">{t('description')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {contacts.map((contact, i) => {
            const Icon = contact.icon;
            return (
              <motion.a
                key={String(contact.title)}
                href={contact.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#C4A574]/50 transition-all group"
              >
                <Icon className="w-8 h-8 text-[#C4A574] mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-sm text-white/50 mb-2 tracking-wider">{contact.title}</div>
                <div className="text-lg tracking-wide">{contact.value}</div>
              </motion.a>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-12 py-6 bg-[#C4A574] text-black rounded-full overflow-hidden text-lg tracking-wider"
          >
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-3">
              {t('startProject')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </span>
          </motion.button>

          <div className="flex items-center justify-center gap-6 mt-12">
            {[Instagram, Facebook].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, y: -3 }}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#C4A574] hover:bg-[#C4A574]/10 transition-all"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
