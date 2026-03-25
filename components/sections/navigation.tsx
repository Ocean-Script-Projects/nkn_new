'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { ChevronDown, Menu } from 'lucide-react';
import { useTranslations, useLocale, locales } from '@/lib/i18n';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { useRequestModal } from '@/lib/request-modal-context';

const dropdownItems = [
  { key: 'bespoke', href: '/bespoke' },
  { key: 'pieces', href: '/pieces' },
  { key: 'prints', href: '/prints' },
  { key: 'upcycling', href: '/upcycling' },
  { key: 'collaboration', href: '/collaboration' },
];

const mainMenuItems = [
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { openRequestModal } = useRequestModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDownAccum = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (current) => {
    setScrolled(current > 60);
    const last = lastScrollY.current;
    const delta = current - last;
    lastScrollY.current = current;

    // резкий скачок — смена маршрута / ресайз / восстановление скролла
    if (Math.abs(delta) > 100) {
      scrollDownAccum.current = 0;
      if (current < 80) setHeaderVisible(true);
      return;
    }

    const nearTop = current < 72;
    if (nearTop) {
      scrollDownAccum.current = 0;
      setHeaderVisible(true);
      return;
    }

    if (delta > 1.5) {
      scrollDownAccum.current += delta;
      const hideAfter = 56;
      if (scrollDownAccum.current >= hideAfter && current > 88) {
        setHeaderVisible(false);
        setDropdownOpen(false);
      }
    } else if (delta < -1.5) {
      scrollDownAccum.current = 0;
      setHeaderVisible(true);
    }
  });

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.includes(href);
  };

  const isDropdownActive = dropdownItems.some((item) => isActive(item.href));

  // Отдельные эффекты с постоянной длиной deps — иначе React ругается при смене [] ↔ [pathname] (HMR).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    lastScrollY.current = window.scrollY;
    scrollDownAccum.current = 0;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    lastScrollY.current = window.scrollY;
    scrollDownAccum.current = 0;
    setHeaderVisible(true);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <motion.nav
      initial={false}
      animate={{
        y: headerVisible ? 0 : '-100%',
        backgroundColor: scrolled ? 'rgba(250,249,246,0.92)' : 'rgba(250,249,246,0)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.08)' : 'none',
      }}
      transition={{
        y: { type: 'tween', duration: 0.42, ease: [0.25, 0.08, 0.25, 1] },
        backgroundColor: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
        boxShadow: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-black/[0.06] will-change-transform"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="relative z-10 flex-shrink-0">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <ImageWithFallback
                src="/images/big_logo.png"
                alt="NKN"
                style={{ height: '3.25rem', width: 'auto' }}
                className="object-contain sm:h-[3.75rem] md:h-[4rem]"
              />
            </motion.div>
          </Link>

          {/* Center nav — desktop */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center">
            <div
              className="relative flex items-center gap-1 rounded-2xl bg-black/[0.03] px-2 py-1.5 border border-black/[0.06]"
              ref={dropdownRef}
            >
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-medium tracking-wide transition-all duration-200 ${
                  isDropdownActive
                    ? 'bg-black text-white'
                    : 'text-[#1a1a1a]/80 hover:bg-black/5 hover:text-black'
                }`}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>{t('services')}</span>
                <motion.span
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-2 top-full mt-1.5 py-2 min-w-[220px] rounded-2xl bg-[#FAF9F6] border border-black/8 shadow-2xl shadow-black/10"
                  >
                    {dropdownItems.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.key}
                          href={`/${locale}${item.href}`}
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-center px-4 py-3 text-[13px] font-medium tracking-wide transition-colors border-l-2 border-transparent ${
                            active
                              ? 'bg-brand-mustard/10 text-black border-brand-mustard'
                              : 'text-[#1a1a1a]/70 hover:bg-black/5 hover:text-black hover:border-black/20'
                          }`}
                        >
                          {t(item.key)}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
              {mainMenuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.key} href={`/${locale}${item.href}`}>
                    <span
                      className={`block rounded-xl px-4 py-2.5 text-[13px] font-medium tracking-wide transition-all duration-200 ${
                        active
                          ? 'bg-black text-white'
                          : 'text-[#1a1a1a]/80 hover:bg-black/5 hover:text-black'
                      }`}
                    >
                      {t(item.key)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: lang + CTA */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="hidden md:flex items-center gap-0.5 text-[12px] font-medium tracking-widest text-[#1a1a1a]/70">
              {locales.map((loc, i) => (
                <span key={loc} className="flex items-center gap-0.5">
                  {i > 0 && <span className="text-black/20">·</span>}
                  <motion.button
                    onClick={() => handleLocaleChange(loc)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-1.5 py-0.5 transition-colors ${
                      locale === loc ? 'text-black font-semibold' : 'hover:text-black'
                    }`}
                  >
                    {loc.toUpperCase()}
                  </motion.button>
                </span>
              ))}
            </div>
            <motion.button
              onClick={() => openRequestModal()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-black px-5 sm:px-6 py-2.5 text-[12px] sm:text-[13px] font-semibold tracking-widest text-white uppercase overflow-hidden relative group"
            >
              <motion.div
                className="absolute inset-0 bg-brand-mustard"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.35 }}
              />
              <span className="relative z-10 group-hover:text-brand-mustard-foreground">{t('request')}</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="lg:hidden w-10 h-10 rounded-full bg-black/[0.05] border border-black/[0.08] flex items-center justify-center"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-black" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
