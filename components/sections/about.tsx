'use client';

import { motion } from 'motion/react';
import { useTranslations } from '@/lib/i18n';

export default function AboutSection() {
  const t = useTranslations('about');

  return (
    <section
      id="about"
      className="py-32 px-6 md:px-12 bg-gradient-to-br from-[#FAF9F6] to-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #C4A574 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
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
              <div className="h-px w-8 bg-[#C4A574]" />
              <span className="text-[#C4A574] text-sm tracking-[0.4em] uppercase">
                {t('label')}
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl mb-8 leading-tight" style={{ fontFamily: 'serif' }}>
              {t('name')} <br />
              <span className="italic">{t('nameItalic')}</span>
            </h2>

            <div className="space-y-6 text-[#8B8B8B] text-lg leading-relaxed">
              <p>{t('description1')}</p>
              <p>{t('description2')}</p>
              <p>{t('description3')}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 mt-12"
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
              <div className="h-12 w-px bg-[#C4A574]/30" />
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
              whileHover={{ scale: 1.03, rotate: 2 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-[#C4A574]/20 to-[#8B7355]/20" />
              <motion.div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>

            <motion.div
              className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-8 shadow-xl border border-black/5"
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
