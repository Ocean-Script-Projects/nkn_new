'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { useTranslations, useLocale } from '@/lib/i18n';
import { Instagram, Send } from 'lucide-react';

const footerNavItems = [
  { key: 'bespoke', href: '/bespoke' },
  { key: 'pieces', href: '/pieces' },
  { key: 'prints', href: '/prints' },
  { key: 'upcycling', href: '/upcycling' },
  { key: 'collaboration', href: '/collaboration' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];

const TELEGRAM_URL = 'https://t.me/NataliiaKhreshkova';
const INSTAGRAM_URL = 'https://instagram.com/';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  return (
    <footer className="py-12 px-6 md:px-12 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 md:gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white/50 text-sm">
            <div className="flex items-center gap-3">
              <Link href={`/${locale}`} className="block">
                <ImageWithFallback
                  src="/images/short_logo.png"
                  alt="NKN"
                  style={{ height: '1.75rem', width: 'auto' }}
                  className="object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
              <motion.div
                className="w-2 h-2 bg-[#DC2626] rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs tracking-widest">
              {footerNavItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className="hover:text-white transition-colors"
                >
                  {tNav(item.key)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-6 text-xs tracking-widest">
              <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
                {t('privacy')}
              </Link>
              <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">
                {t('terms')}
              </Link>
              <Link href={`/${locale}/agb`} className="hover:text-white transition-colors">
                {t('agb')}
              </Link>
              <span className="hidden sm:inline text-white/15" aria-hidden>
                |
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/55 transition-colors hover:border-white/30 hover:text-white"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/55 transition-colors hover:border-white/30 hover:text-white"
                >
                  <Send className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="text-center border-t border-white/5 pt-6">
            <p className="text-white/40 text-xs tracking-wider">
              {t('copyright')}
              <span className="mx-2 text-white/20">·</span>
              <a
                href="https://ocean-script.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                Created by Ocean Script
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
