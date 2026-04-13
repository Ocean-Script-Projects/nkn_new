'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useTranslations, useLocale, locales } from '@/lib/i18n';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { useRequestModal } from '@/lib/request-modal-context';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const servicesDropdownItems = [
  { key: 'bespoke', href: '/bespoke' },
  { key: 'prints', href: '/prints' },
  { key: 'upcycling', href: '/upcycling' },
];

const mainMenuItems = [
  { key: 'pieces', href: '/pieces' },
  { key: 'about', href: '/about' },
  { key: 'collaboration', href: '/collaboration' },
  { key: 'contact', href: '/contact' },
];

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { openRequestModal } = useRequestModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
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

  const isDropdownActive = servicesDropdownItems.some((item) => isActive(item.href));

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Отдельные эффекты с постоянной длиной deps — иначе React ругается при смене [] ↔ [pathname] (HMR).
  useEffect(() => {
    setMounted(true);
  }, []);

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
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen, closeMobile]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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

  const mobileDrawer = mounted
    ? createPortal(
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.32, ease: [0.25, 0.08, 0.25, 1] }}
              className="fixed inset-y-0 right-0 z-[61] flex w-[min(100%,20rem)] flex-col bg-[#FAF9F6] shadow-2xl shadow-black/15 lg:hidden border-l border-black/[0.06]"
              aria-modal="true"
              aria-label={String(t('menu'))}
            >
              <div className="flex h-16 shrink-0 items-center justify-end border-b border-black/[0.06] px-3">
                <button
                  type="button"
                  onClick={closeMobile}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.05] border border-black/[0.08] text-black"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-5">
                <div className="border-b border-black/[0.06] pb-2">
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen((o) => !o)}
                    className="flex min-h-[44px] w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] font-medium text-[#1a1a1a]"
                    aria-expanded={mobileServicesOpen}
                  >
                    <span>{t('services')}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {mobileServicesOpen && (
                    <ul className="space-y-0.5 pb-2 pl-2">
                      {servicesDropdownItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                          <li key={item.key}>
                            <Link
                              href={`/${locale}${item.href}`}
                              onClick={closeMobile}
                              className={`flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-[14px] ${
                                active
                                  ? 'bg-[#C4A574]/15 font-medium text-black'
                                  : 'text-[#1a1a1a]/75'
                              }`}
                            >
                              {t(item.key)}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <ul className="mt-2 space-y-0.5">
                  {mainMenuItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.key}>
                        <Link
                          href={`/${locale}${item.href}`}
                          onClick={closeMobile}
                          className={`flex min-h-[48px] items-center rounded-xl px-3 text-[15px] font-medium ${
                            active ? 'bg-black text-white' : 'text-[#1a1a1a]'
                          }`}
                        >
                          {t(item.key)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="shrink-0 border-t border-black/[0.06] px-4 py-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]/45">
                  {t('language')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        handleLocaleChange(loc);
                        closeMobile();
                      }}
                      className={`min-h-[44px] min-w-[44px] rounded-full px-4 text-[12px] font-semibold tracking-widest transition-colors ${
                        locale === loc
                          ? 'bg-black text-white'
                          : 'bg-black/[0.05] text-[#1a1a1a]/80 border border-black/[0.08]'
                      }`}
                    >
                      {loc.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>,
      document.body
    )
    : null;

  return (
    <>
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
                    {servicesDropdownItems.map((item) => {
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
              type="button"
              onClick={() => openRequestModal()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(buttonVariants({ variant: 'darkNav' }))}
            >
              {t('request')}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-11 h-11 rounded-full bg-black/[0.05] border border-black/[0.08] flex items-center justify-center"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="w-5 h-5 text-black" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
    {mobileDrawer}
    </>
  );
}
