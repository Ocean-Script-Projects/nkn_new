'use client';

import { motion } from 'motion/react';
import { useTranslations } from '@/lib/i18n';
import { ImageWithFallback } from '@/components/image-with-fallback';

export default function ProcessSection() {
  const t = useTranslations('process');

  const steps = [
    { num: '01', key: '01' },
    { num: '02', key: '02' },
    { num: '03', key: '03' },
    { num: '04', key: '04' },
  ];

  const galleryImages = [
    '/images/models/model1.webp',
    '/images/models/model2.webp',
    '/images/models/model3.webp',
  ];

  return (
    <section id="process" className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
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
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="h-px w-8 bg-brand-sage" />
            <span className="text-brand-sage text-sm tracking-[0.4em] uppercase">{t('label')}</span>
            <div className="h-px w-8 bg-brand-sage" />
          </motion.div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 px-2"
            style={{ fontFamily: 'serif' }}
          >
            {t('title')} <span className="italic">{t('titleItalic')}</span>
          </h2>
        </motion.div>

        <div className="mb-16 md:mb-24">
          <div className="hidden md:grid md:grid-cols-4 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.div whileHover={{ y: -5 }} className="text-center">
                  <div className="relative inline-block mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative z-10 w-20 h-20 rounded-full border-2 border-brand-mustard flex items-center justify-center"
                    >
                      <span className="text-2xl text-brand-mustard tracking-wider">{step.num}</span>
                    </motion.div>
                    {i < 3 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                        viewport={{ once: true }}
                        className="absolute top-1/2 left-[calc(100%+12px)] w-full h-px bg-gradient-to-r from-brand-mustard to-transparent origin-left -translate-y-1/2"
                      />
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl mb-3 tracking-wide">
                    {t(`steps.${step.key}.title`)}
                  </h3>
                  <p className="text-[#8B8B8B] text-sm leading-relaxed">
                    {t(`steps.${step.key}.description`)}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="md:hidden space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={`m-${step.num}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="flex gap-4 pb-8 last:pb-0"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-mustard bg-white text-sm font-medium text-brand-mustard">
                  {step.num}
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-base font-medium tracking-wide text-neutral-900 mb-2">
                    {t(`steps.${step.key}.title`)}
                  </h3>
                  <p className="text-[#8B8B8B] text-sm leading-relaxed">
                    {t(`steps.${step.key}.description`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group cursor-pointer"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-gray-100">
                <ImageWithFallback
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-8"
                >
                  <div className="text-white">
                    <div className="text-sm tracking-wider mb-1 opacity-80">
                      {t('gallery.project')} {i + 1}
                    </div>
                    <div className="text-xl tracking-wide">{t('gallery.item')}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
