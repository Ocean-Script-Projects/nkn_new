'use client';

import { motion } from 'motion/react';
import { useTranslations } from '@/lib/i18n';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';

export default function EventsPage() {
  const t = useTranslations('events');

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navigation />
      
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl md:text-7xl mb-6"
            style={{ fontFamily: 'serif' }}
          >
            {t('title')}
          </motion.h1>
          <p className="text-[#8B8B8B] text-lg">{t('comingSoon')}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
