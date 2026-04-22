'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
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

const HOME_SCROLL_SOLID = 72;
const NAV_SHOW_TOP = 56;
const SCROLL_DIR_EPS = 5;

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { openRequestModal } = useRequestModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const reduceMotion = useReducedMotion();

  /** Hero-режим доступен на всех страницах: сверху прозрачный, после порога — solid. */
  const solidNav = scrolled;
  const ghostHero = !scrolled;

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.includes(href);
  };

  const isDropdownActive = servicesDropdownItems.some((item) => isActive(item.href));

  // Синхронизация до отрисовки: режим шапки определяется только по scrollY на любой странице.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const y = window.scrollY ?? document.documentElement.scrollTop;
    lastScrollY.current = y;
    setScrolled(y > HOME_SCROLL_SOLID);
    setNavVisible(true);
  }, [pathname]);

  /** Скролл: solid hero + скрытие шапки вниз / показ вверх */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const readY = () => window.scrollY ?? document.documentElement.scrollTop ?? 0;
    const onScroll = () => {
      const y = readY();
      setScrolled(y > HOME_SCROLL_SOLID);

      const last = lastScrollY.current;
      const delta = y - last;
      lastScrollY.current = y;

      if (Math.abs(delta) > 100) {
        setNavVisible(true);
        return;
      }

      if (y < NAV_SHOW_TOP) {
        setNavVisible(true);
        return;
      }

      if (delta > SCROLL_DIR_EPS) setNavVisible(false);
      else if (delta < -SCROLL_DIR_EPS) setNavVisible(true);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!navVisible) setDropdownOpen(false);
  }, [navVisible]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

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

  const navEase = [0.22, 1, 0.36, 1] as const;
  const navRevealMs = reduceMotion ? 0 : 0.42;
  const navSlideMs = reduceMotion ? 0 : 0.32;

  return (
    <motion.nav
      initial={false}
      animate={{ y: navVisible ? 0 : '-100%' }}
      transition={{ duration: navSlideMs, ease: navEase }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 border-b border-transparent will-change-transform',
        '[&_a]:text-current [&_a]:no-underline [&_a]:[-webkit-tap-highlight-color:transparent]',
        !navVisible && 'pointer-events-none'
      )}
    >
      {/* Подложка выезжает сверху — контент шапки остаётся на месте */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{
          y: solidNav ? 0 : '-100%',
          opacity: solidNav ? 1 : 0,
        }}
        transition={{
          y: { duration: navRevealMs, ease: navEase },
          opacity: { duration: reduceMotion ? 0 : 0.24, ease: navEase },
        }}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full border-b border-black/[0.06] bg-[rgba(250,249,246,0.94)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl backdrop-saturate-150"
        style={{ WebkitBackdropFilter: 'blur(20px) saturate(1.2)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Mobile / tablet: симметрия как в macOS — отступ | лого | меню; «Связаться» в выезжающем меню */}
        <div className="relative grid h-16 grid-cols-[2.75rem_1fr_2.75rem] items-start gap-1 pt-0 sm:h-18 md:h-20 lg:hidden">
          <div className="min-w-[2.75rem]" aria-hidden />
          <div className="flex min-w-0 justify-center">
            <Link
              href={`/${locale}`}
              className="relative z-10 shrink-0 focus-visible:outline-none"
              onClick={() => setMobileOpen(false)}
            >
              <motion.div
                className={cn(
                  'flex items-center justify-center transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-mustard/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                  ghostHero
                    ? 'rounded-t-none rounded-b-[1.25rem] border border-neutral-200/90 bg-white px-2.5 py-1.5 shadow-[0_6px_24px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.06)] sm:rounded-b-[1.35rem]'
                    : 'rounded-t-none rounded-b-[1.25rem] px-2 py-1.5 sm:rounded-b-[1.35rem] sm:px-3 sm:py-2'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <ImageWithFallback
                  src="/images/big_logo.png"
                  alt="NKN"
                  style={{ width: 'auto' }}
                  className={cn(
                    'object-contain',
                    ghostHero
                      ? 'h-[2.65rem] sm:h-[2.85rem]'
                      : 'h-[3.2rem] sm:h-[3.45rem]'
                  )}
                />
              </motion.div>
            </Link>
          </div>
          <div className="flex min-w-0 justify-end pt-2.5 sm:pt-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(true)}
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300',
                ghostHero
                  ? 'border border-neutral-200 bg-white text-black shadow-sm'
                  : 'border border-black/[0.08] bg-black/[0.05] text-black'
              )}
              aria-expanded={mobileOpen}
              aria-label={String(t('menu'))}
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Desktop */}
        <div className="relative hidden h-16 items-center justify-between sm:h-18 md:h-20 lg:flex">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="relative z-10 flex-shrink-0"
          >
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
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
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

          {/* Right: lang + CTA — только desktop */}
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
              className={cn(
                buttonVariants({ variant: 'darkNav', size: 'plain' }),
                'hidden lg:inline-flex'
              )}
            >
              {t('request')}
            </motion.button>
          </div>
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen ? (
              <motion.div
                key="mobile-drawer"
                className="fixed inset-0 z-[100] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
              >
                <button
                  type="button"
                  aria-label="Close menu"
                  className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
                  onClick={() => setMobileOpen(false)}
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={String(t('menu'))}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{
                    type: 'tween',
                    duration: reduceMotion ? 0 : 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute bottom-0 right-0 top-0 flex w-full max-w-[min(100vw,20rem)] flex-col bg-[#FAF9F6] shadow-[-12px_0_48px_rgba(0,0,0,0.12)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-end border-b border-black/[0.06] px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMobileOpen(false)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] bg-black/[0.04] text-black"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-4 py-5">
                    <nav className="flex flex-col gap-0.5">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          openRequestModal();
                          setMobileOpen(false);
                        }}
                        className={cn(
                          buttonVariants({ variant: 'darkNav', size: 'plain' }),
                          'mb-4 w-full justify-center'
                        )}
                      >
                        {t('request')}
                      </motion.button>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                        {t('services')}
                      </p>
                      {servicesDropdownItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.key}
                            href={`/${locale}${item.href}`}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              'rounded-xl px-3 py-3 text-[14px] font-medium tracking-wide transition-colors',
                              active ? 'bg-black text-white' : 'text-[#1a1a1a]/85 hover:bg-black/[0.04]'
                            )}
                          >
                            {t(item.key)}
                          </Link>
                        );
                      })}
                      {mainMenuItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.key}
                            href={`/${locale}${item.href}`}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              'rounded-xl px-3 py-3 text-[14px] font-medium tracking-wide transition-colors',
                              active ? 'bg-black text-white' : 'text-[#1a1a1a]/85 hover:bg-black/[0.04]'
                            )}
                          >
                            {t(item.key)}
                          </Link>
                        );
                      })}
                    </nav>
                    <div className="flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-5">
                      <span className="w-full text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                        {t('language')}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {locales.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => {
                              handleLocaleChange(loc);
                              setMobileOpen(false);
                            }}
                            className={cn(
                              'rounded-full border px-3 py-1.5 text-[12px] font-medium tracking-widest transition-colors',
                              locale === loc
                                ? 'border-black bg-black text-white'
                                : 'border-black/[0.12] bg-white text-[#1a1a1a]/80 hover:border-black/25'
                            )}
                          >
                            {loc.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body
        )}
    </motion.nav>
  );
}
