'use client';

import { motion } from 'motion/react';

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
  children
}: PageHeaderProps) {
  return (
    <section className="relative pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
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
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95]"
              style={{ fontFamily: 'serif' }}
            >
              {title} {titleItalic && <><br /><span className="italic">{titleItalic}</span></>}
              {titleEnd && <><br />{titleEnd}</>}
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

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-base sm:text-lg md:text-xl text-[#8B8B8B] leading-relaxed max-w-xl"
              >
                {description}
              </motion.p>
            )}

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
              className="relative order-first lg:order-none"
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
