'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Scissors, Sparkles, Heart, Leaf } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export default function ServicesSection() {
  const t = useTranslations('services');
  const [activeService, setActiveService] = useState<number | null>(null);

  const serviceNumbers = ['01', '02', '03', '04', '05', '06', '07'];
  const icons = [Scissors, Sparkles, Heart, Leaf, Sparkles, Heart, Scissors];

  return (
    <section
      id="services"
      className="py-32 px-6 md:px-12 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
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

          <h2 className="text-5xl md:text-6xl mb-6" style={{ fontFamily: 'serif' }}>
            {t('title')} <span className="italic">{t('titleItalic')}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceNumbers.map((num, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setActiveService(i)}
                onHoverEnd={() => setActiveService(null)}
                className="relative group"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-3xl p-8 h-full border border-black/5 hover:border-[#C4A574]/30 transition-all duration-300 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#C4A574]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <span className="text-4xl text-[#C4A574]/20 font-light tracking-wider">
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

                    <h3 className="text-2xl mb-4 tracking-wide">
                      {t(`items.${num}.title`)}
                    </h3>
                    <p className="text-[#8B8B8B] leading-relaxed">
                      {t(`items.${num}.description`)}
                    </p>

                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeService === i ? 1 : 0 }}
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C4A574] to-[#8B7355] origin-left"
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
