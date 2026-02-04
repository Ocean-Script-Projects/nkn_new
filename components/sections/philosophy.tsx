'use client';

import { motion } from 'motion/react';
import { Heart, Sparkles, Scissors } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export default function PhilosophySection() {
  const t = useTranslations('philosophy');

  const values = [
    {
      key: 'depth',
      icon: Heart,
    },
    {
      key: 'meaning',
      icon: Sparkles,
    },
    {
      key: 'respect',
      icon: Scissors,
    },
  ];

  return (
    <section
      id="philosophy"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6 sm:mb-8"
          >
            <div className="h-px w-6 sm:w-8 bg-[#C4A574]" />
            <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase">
              {t('label')}
            </span>
            <div className="h-px w-6 sm:w-8 bg-[#C4A574]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 sm:mb-12 leading-tight px-4"
            style={{ fontFamily: 'serif' }}
          >
            {t('title')} <br />
            <span className="italic">{t('titleItalic')}</span> {t('titleEnd')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg md:text-xl text-[#8B8B8B] leading-relaxed max-w-3xl mx-auto px-4"
          >
            {t('description')}
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mt-16 sm:mt-20 md:mt-24">
          {values.map((item, i) => {
            const ItemIcon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="relative w-20 sm:w-24 h-20 sm:h-24 mx-auto mb-6 sm:mb-8"
                >
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C4A574]/30 to-[#8B7355]/30 blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  />

                  <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#C4A574] via-[#8B7355] to-[#C4A574] flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow">
                    <ItemIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />

                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-[#DC2626] rounded-full border-2 border-white shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  </div>
                </motion.div>

                <h3 className="text-xl sm:text-2xl mb-3 sm:mb-4 tracking-wide group-hover:text-[#C4A574] transition-colors">
                  {t(`values.${item.key}.title`)}
                </h3>
                <p className="text-[#8B8B8B] text-sm sm:text-base leading-relaxed">
                  {t(`values.${item.key}.text`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
