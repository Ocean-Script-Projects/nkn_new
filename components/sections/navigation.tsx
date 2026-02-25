'use client';

import { motion } from 'motion/react';
import { useTranslations, useLocale, locales } from '@/lib/i18n';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { useRequestModal } from '@/lib/request-modal-context';

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { openRequestModal } = useRequestModal();

  const menuItems = [
    { key: 'services', href: '/services' },
    { key: 'pieces', href: '/pieces' },
    { key: 'upcycling', href: '/upcycling' },
    { key: 'events', href: '/events' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.includes(href);
  };

  const handleLocaleChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/80 backdrop-blur-2xl border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`}>
            <motion.div
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <ImageWithFallback
                src="/images/big_logo.png"
                alt="NKN"
                style={{ height: '3rem', width: 'auto', maxWidth: 'none' }}
                className="object-contain"
              />
            </motion.div>
          </Link>

          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {menuItems.map((item, i) => {
              const active = isActive(item.href);
              return (
                <Link key={item.key} href={`/${locale}${item.href}`}>
                  <motion.div
                    className={`relative transition-colors text-sm xl:text-base tracking-wide group cursor-pointer ${
                      active ? 'text-black' : 'text-[#8B8B8B] hover:text-black'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 + 0.3 }}
                  >
                    {t(item.key)}
                    <motion.div
                      className={`absolute -bottom-0.5 left-0 h-px bg-black origin-left transition-transform duration-300 ${
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                      style={{ width: '100%' }}
                    />
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-black/5">
              {locales.map((loc) => (
                <motion.button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-xs tracking-widest px-2 py-0.5 rounded-full transition-all ${
                    locale === loc
                      ? 'bg-black text-white'
                      : 'text-[#8B8B8B] hover:text-black'
                  }`}
                >
                  {loc.toUpperCase()}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={() => openRequestModal()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-5 sm:px-7 py-2 sm:py-2.5 bg-black text-white rounded-full text-xs sm:text-sm tracking-wider overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#C4A574] to-[#8B7355]"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">{t('request')}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-black/5 flex items-center justify-center"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-black rounded-full" />
                <span className="w-full h-0.5 bg-black rounded-full" />
                <span className="w-full h-0.5 bg-black rounded-full" />
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
