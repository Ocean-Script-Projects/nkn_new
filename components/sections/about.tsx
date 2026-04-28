'use client';

import { motion } from 'motion/react';
import { useTranslations } from '@/lib/i18n';
import DecorativeLogo from '@/components/shared/DecorativeLogo';
import { ImageWithFallback } from '@/components/image-with-fallback';

export default function AboutSection() {
  const t = useTranslations('about');

  return (
    <section
      id="about"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-brand-sage-subtle to-white relative overflow-hidden"
    >
      <DecorativeLogo variant="big" position="bottom-right" className="hidden md:block" />
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--brand-sage) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <div className="h-px w-8 bg-brand-sage" />
              <span className="text-brand-sage text-sm tracking-[0.4em] uppercase">
                {t('label')}
              </span>
            </motion.div>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8 leading-tight"
              style={{ fontFamily: 'serif' }}
            >
              {t('name')} <br />
              <span className="italic">{t('nameItalic')}</span>
            </h2>

            <div className="space-y-5 sm:space-y-6 text-[#8B8B8B] text-base sm:text-lg leading-relaxed">
              <p>{t('description1')}</p>
              <p>{t('description2')}</p>
              <p>{t('description3')}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center gap-5 sm:gap-6 mt-10 sm:mt-12"
            >
              <div className="text-center">
                <div className="text-4xl mb-2" style={{ fontFamily: 'serif' }}>
                  37+
                </div>
                <div className="text-sm text-[#8B8B8B] tracking-wider flex items-center justify-center gap-2">
                  <motion.div
                    className="w-1 h-1 bg-[#DC2626] rounded-full"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  {t('experience')}
                </div>
              </div>
              <div className="h-12 w-px bg-brand-sage/30" />
              <div className="text-center">
                <div className="text-4xl mb-2" style={{ fontFamily: 'serif' }}>
                  ∞
                </div>
                <div className="text-sm text-[#8B8B8B] tracking-wider">{t('unique')}</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -6 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl will-change-transform"
            >
              <div className="relative aspect-[3/4] bg-brand-sage/20">
                <ImageWithFallback
                  src="/images/models/natalia_img2.webp"
                  alt={String(t('name'))}
                  className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <motion.div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -right-2 sm:-bottom-8 sm:-right-8 max-w-[min(100%,280px)] sm:max-w-none bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-xl border border-black/5"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-sm text-[#8B8B8B] tracking-wider mb-2">{t('certification')}</div>
              <div className="text-xl tracking-wide">{t('roles')}</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
