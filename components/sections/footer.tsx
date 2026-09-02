'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { useTranslations, useLocale } from '@/lib/i18n';
import { Instagram, Send, Facebook, Music2 } from 'lucide-react';
import { SOCIAL } from '@/lib/site-config';

const footerNavItems = [
  { key: 'bespoke', href: '/bespoke' },
  { key: 'services', href: '/services' },
  { key: 'pieces', href: '/pieces' },
  { key: 'prints', href: '/prints' },
  { key: 'upcycling', href: '/upcycling' },
  { key: 'collaboration', href: '/collaboration' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];

// Kept in lib/site-config.ts so the footer, the Impressum and the `sameAs`
// list in the structured data can never drift apart.
const [INSTAGRAM_URL, FACEBOOK_URL, TIKTOK_URL, TELEGRAM_URL] = SOCIAL;

export default function Footer() {
  const altT = useTranslations('alt');
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black px-4 py-10 sm:px-6 md:px-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(900px 220px at 20% 0%, rgba(196,165,116,0.22), transparent 60%), radial-gradient(700px 260px at 90% 40%, rgba(220,38,38,0.12), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-y-7">
            <div className="flex flex-col items-center gap-3 text-center lg:order-1 lg:flex-row lg:text-left">
              <Link
                href={`/${locale}/`}
                className="group inline-flex items-center gap-3"
              >
                <ImageWithFallback
                  src="/images/short_logo.png"
                  alt={String(altT('logo'))}
                  style={{ height: '1.6rem', width: 'auto' }}
                  className="object-contain opacity-95 transition-opacity group-hover:opacity-100"
                />
                <motion.div
                  className="h-2 w-2 rounded-full bg-[#DC2626]"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Link>

              <p className="hidden text-[10px] uppercase tracking-[0.32em] text-white/30 sm:block">
                Hamburg Atelier
              </p>
            </div>

            <nav className="flex flex-col items-center gap-4 text-center text-[11px] uppercase tracking-[0.24em] text-white/55 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3 lg:order-3 lg:flex lg:w-full lg:flex-row lg:flex-wrap lg:items-center lg:justify-center lg:gap-x-6 lg:gap-y-2 lg:text-center">
              {footerNavItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}/`}
                  className="transition-colors hover:text-white"
                >
                  {tNav(item.key)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-center gap-3 lg:order-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/60 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              >
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/60 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              >
                <Facebook className="h-4.5 w-4.5" />
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/60 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              >
                <Music2 className="h-4.5 w-4.5" />
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/60 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              >
                <Send className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

          <div className="flex flex-col items-center gap-4 text-center sm:gap-5 lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <p className="text-[11px] tracking-[0.08em] text-white/35">
              {t('copyright')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.16em] text-white/45">
              <Link href={`/${locale}/privacy/`} className="transition-colors hover:text-white">
                {t('privacy')}
              </Link>
              <Link href={`/${locale}/impressum/`} className="transition-colors hover:text-white">
                {t('impressum')}
              </Link>
            </div>

            <a
              href="https://ocean-script.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.08em] text-white/35 transition-colors hover:text-white/65"
            >
              Created by Ocean Script
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
