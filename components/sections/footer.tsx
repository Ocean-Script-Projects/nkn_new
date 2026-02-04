'use client';

import { motion } from 'motion/react';
import { useTranslations } from '@/lib/i18n';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="py-12 px-6 md:px-12 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white/50 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl tracking-[0.35em] text-white">NKN</span>
            <motion.div
              className="w-2 h-2 bg-[#DC2626] rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <div className="text-center tracking-wider">{t('copyright')}</div>

          <div className="flex items-center gap-6 text-xs tracking-widest">
            <a href="#" className="hover:text-white transition-colors">
              {t('privacy')}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t('terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
