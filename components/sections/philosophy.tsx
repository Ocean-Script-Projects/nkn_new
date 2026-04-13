'use client';

import { motion } from 'motion/react';
import { Heart, Sparkles, Scissors } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import DecorativeLogo from '@/components/shared/DecorativeLogo';

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
      className="py-14 sm:py-20 md:py-24 lg:py-14 xl:py-24 2xl:py-32 px-4 sm:px-6 md:px-12 bg-white relative overflow-hidden"
    >
      <DecorativeLogo variant="short" position="top-right" className="hidden md:block" />
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
          className="text-center mb-10 sm:mb-14 md:mb-16 lg:mb-10 xl:mb-16 2xl:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6 sm:mb-8 lg:mb-4"
          >
            <div className="h-px w-6 sm:w-8 bg-brand-sage" />
            <span className="text-brand-sage text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase">
              {t('label')}
            </span>
            <div className="h-px w-6 sm:w-8 bg-brand-sage" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl mb-6 sm:mb-8 md:mb-10 lg:mb-5 xl:mb-10 leading-tight px-2 sm:px-4"
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
            className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl text-[#8B8B8B] leading-relaxed max-w-3xl mx-auto px-1 sm:px-4 lg:leading-snug"
          >
            {t('description')}
          </motion.p>
        </motion.div>

        <div className="flex flex-col gap-4 sm:gap-5 md:grid md:grid-cols-3 md:gap-10 lg:gap-6 lg:mt-10 xl:gap-10 xl:mt-16 2xl:gap-12 2xl:mt-24">
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
                className="group rounded-2xl border border-black/[0.06] border-l-[3px] border-l-[#C4A574]/55 bg-[#FAF9F6]/90 p-5 text-left shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] md:border-0 md:border-l-0 md:bg-transparent md:p-0 md:shadow-none md:text-center"
              >
                <div className="flex flex-row items-center gap-4 md:flex-col md:items-center">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="relative h-[3.75rem] w-[3.75rem] shrink-0 sm:h-24 sm:w-24 lg:h-[4.25rem] lg:w-[4.25rem] xl:h-24 xl:w-24 md:mx-auto md:mb-5 lg:mb-4"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-brand-sage/25 blur-xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.7, 0.4],
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    />

                    <div className="relative flex h-full w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/10 transition-shadow group-hover:shadow-2xl">
                      <div className="flex-1 bg-brand-mustard" aria-hidden />
                      <div className="flex-1 bg-brand-sage" aria-hidden />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ItemIcon
                          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-10 lg:w-10 xl:w-12 xl:h-12 text-white drop-shadow-[0_1px_2px_rgb(0_0_0_/0.35)]"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </motion.div>

                  <div className="min-w-0 flex-1 md:w-full">
                    <h3 className="mb-2 text-lg font-medium tracking-wide text-neutral-900 sm:mb-3 sm:text-xl md:mb-2 lg:text-lg xl:text-xl 2xl:text-2xl md:text-center group-hover:text-brand-mustard transition-colors">
                      {t(`values.${item.key}.title`)}
                    </h3>
                    <p className="text-[0.9375rem] leading-[1.65] text-neutral-600 sm:text-base md:text-sm lg:text-sm xl:text-base 2xl:text-base md:text-center md:leading-snug">
                      {t(`values.${item.key}.text`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
