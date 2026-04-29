'use client';

import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import { motion } from 'motion/react';
import DecorativeLogo from '@/components/shared/DecorativeLogo';

/** Second instance when only one child is passed (safe for leaf nodes like a single image). */
function duplicateChild(node: ReactNode, key: string): ReactNode {
  if (isValidElement(node)) {
    return cloneElement(node, { key } as Record<string, unknown>);
  }
  return node;
}

export type PageHeaderMobileLayout = 'default' | 'editorial';

interface PageHeaderProps {
  label: string;
  title: string;
  titleItalic?: string;
  /** Optional third title line (e.g. Upcycling) */
  titleEnd?: string;
  subtitle?: React.ReactNode;
  description?: string;
  /** Badges shown as "badge1 • badge2 • badge3" */
  badges?: string[];
  labelColor?: string;
  /** Optional gradient orbs in background (e.g. Upcycling) */
  hasBackgroundOrbs?: boolean;
  /**
   * `editorial`: on small screens, full-bleed image with title on a bottom gradient and description below (e.g. Pieces).
   * Desktop (lg+) always uses the standard two-column layout when `children` is set.
   */
  mobileLayout?: PageHeaderMobileLayout;
  children?: React.ReactNode;
}

export default function PageHeader({
  label,
  title,
  titleItalic,
  titleEnd,
  subtitle,
  description,
  badges,
  labelColor = '#C4A574',
  hasBackgroundOrbs = false,
  mobileLayout = 'default',
  children,
}: PageHeaderProps) {
  const isEditorial = mobileLayout === 'editorial' && !!children;
  const childList = children != null ? Children.toArray(children) : [];
  const mobileImageSlot = isEditorial
    ? childList[0] ?? children
    : children;
  const desktopImageSlot = isEditorial
    ? childList[1] ?? duplicateChild(childList[0], 'pageheader-editorial-desktop')
    : children;

  const textColumn = (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-w-0 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex items-center gap-3"
      >
        <div
          className="h-px w-8 bg-gradient-to-r sm:w-12"
          style={{ background: `linear-gradient(to right, ${labelColor}, transparent)` }}
        />
        <span
          className="text-[10px] tracking-[0.26em] uppercase sm:text-[11px] sm:tracking-[0.28em] md:text-xs md:tracking-[0.4em]"
          style={{ color: labelColor }}
        >
          {label}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex min-w-0 max-w-full flex-col items-start gap-0 break-words text-2xl leading-[1.12] tracking-tight sm:text-3xl sm:leading-[1.1] md:text-4xl md:leading-[1.08] lg:text-[clamp(2.25rem,3.8vw,3.75rem)] lg:leading-[1.08] xl:text-6xl 2xl:text-7xl"
        style={{ fontFamily: 'serif' }}
      >
        <span className="block w-full">{title}</span>
        {titleItalic && <span className="block w-full italic">{titleItalic}</span>}
        {titleEnd && <span className="block w-full">{titleEnd}</span>}
      </motion.h1>

      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base leading-relaxed tracking-wide text-neutral-600 md:text-lg"
        >
          {subtitle}
        </motion.div>
      )}

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg lg:text-xl"
        >
          {description}
        </motion.p>
      )}

      {badges && badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="pt-1 sm:pt-4"
        >
          <div className="flex max-lg:justify-center flex-wrap items-center gap-2 text-xs text-neutral-600 tracking-wider sm:gap-3 sm:text-sm lg:justify-start">
            {badges.map((badge, i) => (
              <span key={i} className="flex items-center gap-2 sm:gap-3">
                {badge}
                {i < badges.length - 1 && (
                  <span
                    className="h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: labelColor }}
                  />
                )}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const imageColumn = children && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
      className={
        isEditorial
          ? 'relative hidden w-full lg:block lg:max-w-[400px] lg:overflow-visible xl:max-w-[440px] min-[1600px]:w-full min-[1600px]:max-w-none'
          : 'relative order-first w-full max-lg:max-h-[min(52svh,440px)] max-lg:overflow-hidden max-lg:rounded-2xl lg:order-none lg:max-h-none lg:max-w-[400px] lg:overflow-visible xl:max-w-[440px] min-[1600px]:w-full min-[1600px]:max-w-none'
      }
    >
      {isEditorial ? desktopImageSlot : children}
    </motion.div>
  );

  return (
    <section
      className={
        isEditorial
          ? 'relative overflow-x-clip overflow-y-visible px-4 pb-2 pt-0 sm:px-6 sm:pb-3 sm:pt-0 md:px-12 md:pb-4 md:pt-0 lg:overflow-hidden lg:pb-24 lg:pt-28'
          : 'relative overflow-hidden px-4 pb-10 pt-16 sm:px-6 sm:pb-16 sm:pt-20 md:px-12 md:pb-24 md:pt-28'
      }
    >
      <DecorativeLogo
        variant="big"
        position="top-right"
        subtle
        className="hidden md:block !top-16 !right-4 md:!top-20 md:!right-8 scale-125 md:scale-135 origin-top-right rotate-[-6deg]"
      />

      {isEditorial && (
        <div className="relative z-10 lg:hidden">
          <div className="-mx-4 sm:-mx-6 md:-mx-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative min-h-[min(72svh,740px)] w-full overflow-hidden rounded-b-none sm:min-h-[min(78svh,820px)]"
            >
              <div className="absolute inset-0">{mobileImageSlot}</div>
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 via-40% to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 pb-8 sm:space-y-3.5 sm:p-6 sm:pb-9">
                <div className="flex items-center gap-3">
                  <div
                    className="h-px w-8 bg-gradient-to-r sm:w-10"
                    style={{ background: `linear-gradient(to right, ${labelColor}, transparent)` }}
                  />
                  <span
                    className="text-[10px] tracking-[0.26em] uppercase sm:text-[11px] sm:tracking-[0.28em]"
                    style={{ color: labelColor }}
                  >
                    {label}
                  </span>
                </div>
                <h1
                  className="break-words text-4xl leading-[1.05] tracking-[-0.02em] text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.45)] sm:text-5xl sm:leading-[1.03] sm:tracking-tight md:text-6xl md:leading-[1.02]"
                  style={{ fontFamily: 'serif' }}
                >
                  <span className="block">{title}</span>
                  {titleItalic && <span className="block italic">{titleItalic}</span>}
                  {titleEnd && <span className="block">{titleEnd}</span>}
                </h1>
                {subtitle && (
                  <p className="max-w-xl text-[0.9375rem] leading-relaxed tracking-wide text-white/90 sm:text-base sm:text-white/95">
                    {subtitle}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          <div className="relative z-20 mx-auto max-w-7xl px-0">
            {description && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="pt-5 sm:pt-6"
              >
                <p className="max-w-prose text-base leading-[1.7] text-neutral-600/90 sm:leading-relaxed">
                  {description}
                </p>
              </motion.div>
            )}
            {badges && badges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="pt-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 tracking-wider sm:gap-3 sm:text-sm">
                  {badges.map((badge, i) => (
                    <span key={i} className="flex items-center gap-2 sm:gap-3">
                      {badge}
                      {i < badges.length - 1 && (
                        <span
                          className="h-1 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: labelColor }}
                        />
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl">
        <div
          className={
            isEditorial
              ? 'hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 min-[1600px]:grid-cols-2 min-[1600px]:gap-12'
              : 'flex flex-col gap-4 sm:gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 min-[1600px]:grid-cols-2 min-[1600px]:gap-12'
          }
        >
          {!isEditorial ? textColumn : <div className="hidden lg:contents">{textColumn}</div>}
          {imageColumn}
        </div>
      </div>

      {hasBackgroundOrbs && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full blur-3xl"
            style={{ background: `linear-gradient(to bottom right, ${labelColor}20, transparent)` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
      )}
    </section>
  );
}
