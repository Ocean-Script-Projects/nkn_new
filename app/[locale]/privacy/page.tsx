'use client';

import { motion } from 'motion/react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { useTranslations } from '@/lib/i18n';

const SECTION_KEYS = ['data', 'storage', 'rights', 'contact'] as const;

export default function PrivacyPage() {
  const t = useTranslations('privacyPage');

  return (
    <div className="min-h-screen bg-[#FAF9F6] overflow-x-hidden">
      <Navigation />
      <div>
        <section className="relative pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-[#C4A574] to-transparent" />
                <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                  {t('title')}
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight"
                style={{ fontFamily: 'serif' }}
              >
                {t('title')}
              </h1>
              <p className="text-sm text-[#8B8B8B] tracking-wider mb-12">{t('lastUpdated')}</p>
              <p className="text-base sm:text-lg text-[#4A4A4A] leading-relaxed mb-16">
                {t('intro')}
              </p>

              <div className="space-y-12">
                {SECTION_KEYS.map((key, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-medium text-[#1a1a1a] mb-4 tracking-tight">
                      {t(`sections.${key}.title`)}
                    </h2>
                    <p className="text-base text-[#8B8B8B] leading-relaxed">
                      {t(`sections.${key}.content`)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
