'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { ImageWithFallback } from '@/components/image-with-fallback';

export default function HeroSection() {
  const t = useTranslations('hero');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <motion.section
      style={{ opacity, scale }}
      className="relative min-h-screen flex items-center pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12"
    >
      <motion.div
        className="absolute left-8 sm:left-12 md:left-16 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      >
        <motion.div
          className="flex flex-col gap-0 font-light select-none"
          style={{ fontFamily: 'serif' }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          {['N', 'K', 'N'].map((letter, i) => (
            <motion.span
              key={i}
              className="text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] leading-[0.85]"
              style={{
                color: 'rgba(0, 0, 0, 0.04)',
                WebkitTextStroke: '1.5px rgba(196, 165, 116, 0.12)',
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-[#C4A574]/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-1/3 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-[#DC2626]/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 6 === 0 ? 'bg-[#DC2626]' : 'bg-[#C4A574]'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="space-y-6 sm:space-y-8 md:space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <motion.div
                className="h-px w-8 sm:w-12 bg-gradient-to-r from-[#C4A574] to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              />
              <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase">
                {t('location')}
              </span>
            </motion.div>

            <motion.div className="space-y-3 sm:space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.7 }}
                className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl tracking-tight leading-[0.95]"
                style={{ fontFamily: 'serif' }}
              >
                {t('title')} <br />
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.85 }}
                  className="italic"
                >
                  {t('titleItalic')}
                </motion.span>{' '}
                <br />
                {t('titleEnd')}
              </motion.h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-[#8B8B8B] text-base sm:text-lg md:text-xl leading-relaxed max-w-lg"
            >
              {t('description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 pt-4 sm:pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-black text-white rounded-full overflow-hidden text-sm sm:text-base"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#C4A574] to-[#8B7355]"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.4 }}
                />
                <span className="relative z-10 flex items-center justify-center gap-3 tracking-wider">
                  {t('orderButton')}
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-black rounded-full tracking-wider hover:bg-black hover:text-white transition-all duration-300 text-sm sm:text-base"
              >
                {t('portfolioButton')}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="flex flex-wrap items-center gap-4 sm:gap-8 pt-2 sm:pt-4 text-xs tracking-widest text-[#8B8B8B]"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1.5 h-1.5 bg-[#DC2626] rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>{t('experience')}</span>
              </div>
              <span className="opacity-40 hidden sm:inline">•</span>
              <span className="hidden sm:inline">{t('individual')}</span>
              <span className="opacity-40 hidden sm:inline">•</span>
              <span>Hamburg</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="relative mt-8 lg:mt-0 flex justify-center lg:justify-end"
          >
            <motion.div
              whileHover={{ y: -10, rotateY: 5 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-black/5 w-full max-w-md"
              style={{ perspective: '1000px' }}
            >
              <div className="relative aspect-[3/4]">
                <ImageWithFallback
                  src="/images/hero.jpg"
                  alt="Natalia Khreshkova"
                  className="w-full h-full object-cover"
                />

                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                  animate={{ opacity: [0.6, 0.8, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <motion.div
                  className="absolute top-5 right-5 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[#C4A574] to-[#8B7355] flex items-center justify-center shadow-xl"
                  animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-xl rounded-xl p-5 sm:p-6 border border-black/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-[10px] sm:text-xs tracking-[0.3em] text-[#8B8B8B] mb-1">
                        {t('nameFull')}
                      </div>
                      <div className="text-sm sm:text-base tracking-wide">{t('role')}</div>
                    </div>
                    <motion.div
                      className="w-3 h-3 bg-[#DC2626] rounded-full"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#8B8B8B]">
                    <motion.div className="flex items-center gap-1.5" whileHover={{ scale: 1.05 }}>
                      <div className="w-1.5 h-1.5 bg-[#C4A574] rounded-full" />
                      <span className="tracking-wider">{t('experience')}</span>
                    </motion.div>
                    <span className="opacity-40">•</span>
                    <span className="tracking-wider">{t('location')}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -z-10 -right-8 -top-8 w-48 sm:w-56 h-48 sm:h-56 bg-gradient-to-br from-[#C4A574]/20 to-transparent rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            <motion.div
              className="absolute -z-10 -left-8 -bottom-8 w-48 sm:w-56 h-48 sm:h-56 bg-gradient-to-br from-[#DC2626]/15 to-transparent rounded-full blur-3xl"
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 hidden sm:flex"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-[#8B8B8B]"
        >
          <span className="text-xs tracking-widest">{t('scroll')}</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#C4A574] to-transparent" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
