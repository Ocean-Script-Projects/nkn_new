'use client';

import { motion } from 'motion/react';
import DecorativeLogo from '@/components/shared/DecorativeLogo';

interface PageHeaderProps {
  label: string;
  title: string;
  titleItalic?: string;
  /** Optional third title line (e.g. Upcycling) */
  titleEnd?: string;
  subtitle?: React.ReactNode;
  description?: string;
  /** If set, render as multiple paragraphs instead of single description */
  descriptionParagraphs?: string[];
  /** 'bio' = lead paragraph + hierarchy (serif, spacing, accent) for about/bio blocks */
  descriptionVariant?: 'default' | 'bio';
  /** Badges shown as "badge1 • badge2 • badge3" */
  badges?: string[];
  labelColor?: string;
  /** Optional gradient orbs in background (e.g. Upcycling) */
  hasBackgroundOrbs?: boolean;
  children?: React.ReactNode;
}

export default function PageHeader({
  label,
  title,
  titleItalic,
  titleEnd,
  subtitle,
  description,
  descriptionParagraphs,
  descriptionVariant = 'default',
  badges,
  labelColor = '#C4A574',
  hasBackgroundOrbs = false,
  children
}: PageHeaderProps) {
  return (
    <section className="relative pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden">
      <DecorativeLogo variant="big" position="top-right" subtle className="!top-16 !right-4 md:!top-20 md:!right-8 scale-125 md:scale-135 origin-top-right rotate-[-6deg]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid gap-8 lg:gap-10 min-[1600px]:gap-12 lg:grid-cols-[minmax(0,1fr)_auto] min-[1600px]:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="min-w-0 space-y-6 sm:space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r" style={{ background: `linear-gradient(to right, ${labelColor}, transparent)` }} />
              <span className="text-xs sm:text-sm tracking-[0.4em] uppercase" style={{ color: labelColor }}>
                {label}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex min-w-0 max-w-full flex-col items-start gap-0 text-[clamp(1.65rem,4.2vw,4.5rem)] sm:text-5xl md:text-6xl lg:text-[clamp(2.25rem,3.8vw,3.75rem)] xl:text-6xl 2xl:text-7xl tracking-tight leading-[1.08] break-words"
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
                className="text-base sm:text-lg text-[#8B8B8B] tracking-wide"
              >
                {subtitle}
              </motion.div>
            )}

            {descriptionParagraphs && descriptionParagraphs.length > 0 ? (
              <div
                className={
                  descriptionVariant === 'bio'
                    ? 'space-y-6 sm:space-y-8 max-w-2xl'
                    : 'space-y-4 max-w-xl'
                }
              >
                {descriptionVariant === 'bio' && (
                  <div
                    className="h-px w-12 sm:w-16 bg-gradient-to-r opacity-60"
                    style={{ background: `linear-gradient(to right, ${labelColor}, transparent)` }}
                    aria-hidden
                  />
                )}
                {descriptionParagraphs.map((paragraph, i) => {
                  const isLead = descriptionVariant === 'bio' && i === 0;
                  const isMid = descriptionVariant === 'bio' && i >= 1 && i <= 2;
                  return (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }}
                      className={
                        isLead
                          ? 'text-lg sm:text-xl md:text-2xl text-[#1a1a1a] leading-relaxed tracking-tight'
                          : isMid
                            ? 'text-base sm:text-lg text-[#4a4a4a] leading-relaxed'
                            : descriptionVariant === 'bio'
                              ? 'text-base sm:text-lg text-[#6B6B6B] leading-relaxed'
                              : 'text-base sm:text-lg md:text-xl text-[#8B8B8B] leading-relaxed'
                      }
                      style={isLead ? { fontFamily: 'serif' } : undefined}
                    >
                      {paragraph}
                    </motion.p>
                  );
                })}
              </div>
            ) : description ? (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-base sm:text-lg md:text-xl text-[#8B8B8B] leading-relaxed max-w-xl"
              >
                {description}
              </motion.p>
            ) : null}

            {badges && badges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="pt-4"
              >
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#8B8B8B] tracking-wider flex-wrap">
                  {badges.map((badge, i) => (
                    <span key={i} className="flex items-center gap-3">
                      {badge}
                      {i < badges.length - 1 && (
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: labelColor }} />
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {children && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative order-first lg:order-none w-full max-w-[min(100%,380px)] sm:max-w-[400px] xl:max-w-[440px] min-[1600px]:max-w-none min-[1600px]:w-full"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
      {hasBackgroundOrbs && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: `linear-gradient(to bottom right, ${labelColor}20, transparent)` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
      )}
    </section>
  );
}
