'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/components/image-with-fallback';

interface BeforeAfterSliderProps {
  /** Localized alt text — the parent page owns the translations. */
  beforeAlt?: string;
  afterAlt?: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  caption: string;
}

export default function BeforeAfterSlider({
  beforeAlt = '',
  afterAlt = '',
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  caption
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  return (
    <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-brand-sage" />
              <span className="text-brand-sage text-xs sm:text-sm tracking-[0.4em] uppercase">
                Transformation
              </span>
              <div className="h-px w-8 bg-brand-sage" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight" style={{ fontFamily: 'serif' }}>
              Before & After
            </h2>
          </div>

          <div
            className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize"
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
          >
            <div className="absolute inset-0">
              <ImageWithFallback
                src={beforeImage}
                alt={beforeAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute left-6 top-6 rounded-bl-md rounded-br-2xl rounded-tl-md rounded-tr-2xl border border-white/20 bg-black/70 px-4 py-2 backdrop-blur-sm">
                <span className="text-white text-sm tracking-wider">{beforeLabel}</span>
              </div>
            </div>

            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <ImageWithFallback
                src={afterImage}
                alt={afterAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute right-6 top-6 rounded-bl-2xl rounded-br-md rounded-tl-2xl rounded-tr-md border border-white/20 bg-brand-sage px-4 py-2 text-brand-sage-foreground backdrop-blur-sm">
                <span className="text-white text-sm tracking-wider">{afterLabel}</span>
              </div>
            </div>

            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center pointer-events-auto cursor-ew-resize">
                <div className="flex gap-1">
                  <div className="w-0.5 h-4 bg-[#8B8B8B]" />
                  <div className="w-0.5 h-4 bg-[#8B8B8B]" />
                </div>
              </div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center text-xl sm:text-2xl tracking-wide text-[#8B8B8B] italic"
            style={{ fontFamily: 'serif' }}
          >
            {caption}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
