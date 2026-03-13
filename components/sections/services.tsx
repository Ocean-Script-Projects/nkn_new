'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Scissors, Sparkles, Heart, Leaf } from 'lucide-react';
import { useTranslations, useLocale } from '@/lib/i18n';
import DecorativeLogo from '@/components/shared/DecorativeLogo';

const serviceItems = [
  { num: '01', icon: Scissors, href: '/bespoke' },
  { num: '02', icon: Sparkles, href: '/pieces' },
  { num: '03', icon: Heart, href: '/upcycling' },
  { num: '04', icon: Leaf, href: '/prints' },
];

export default function ServicesSection() {
  const t = useTranslations('services');
  const locale = useLocale();
  const [activeService, setActiveService] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="py-32 lg:py-16 xl:py-24 2xl:py-32 px-6 md:px-12 bg-[#FAF9F6] relative overflow-hidden"
    >
      <DecorativeLogo variant="big" position="bottom-left" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20 lg:mb-10 xl:mb-16 2xl:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-8 lg:mb-4 xl:mb-8"
          >
            <div className="h-px w-8 bg-[#C4A574]" />
            <span className="text-[#C4A574] text-sm tracking-[0.4em] uppercase">{t('label')}</span>
            <div className="h-px w-8 bg-[#C4A574]" />
          </motion.div>

          <h2
            className="text-5xl md:text-6xl lg:text-[clamp(1.75rem,3.8vw,2.5rem)] xl:text-5xl 2xl:text-6xl mb-3 lg:mb-1"
            style={{ fontFamily: 'serif' }}
          >
            {t('title')} <span className="italic">{t('titleItalic')}</span>
          </h2>
          <p className="text-lg lg:text-sm xl:text-base 2xl:text-lg text-[#8B8B8B]">{t('titleSub')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-4 xl:gap-6">
          {serviceItems.map(({ num, icon: Icon, href }, i) => (
            <Link key={num} href={`/${locale}${href}`}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setActiveService(i)}
                onHoverEnd={() => setActiveService(null)}
                className="relative group h-full"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-3xl p-8 lg:p-5 xl:p-7 2xl:p-8 h-full border border-black/5 hover:border-[#C4A574]/30 transition-all duration-300 relative overflow-hidden flex flex-col lg:rounded-2xl xl:rounded-3xl"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#C4A574]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div className="relative z-10 flex flex-col">
                    <div className="flex items-start justify-between mb-6 lg:mb-3 xl:mb-6">
                      <span className="text-4xl lg:text-3xl xl:text-4xl text-[#C4A574]/20 font-light tracking-wider">
                        {num}
                      </span>
                      <motion.div
                        animate={{
                          scale: activeService === i ? 1.2 : 1,
                          rotate: activeService === i ? 15 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Icon className="w-6 h-6 text-[#C4A574]" />
                      </motion.div>
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-lg xl:text-xl 2xl:text-2xl mb-4 lg:mb-2 xl:mb-4 tracking-wide">
                      {t(`items.${num}.title`)}
                    </h3>
                    <p className="text-[#8B8B8B] leading-relaxed text-sm sm:text-base lg:text-xs xl:text-sm 2xl:text-base lg:leading-snug">
                      {t(`items.${num}.description`)}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
