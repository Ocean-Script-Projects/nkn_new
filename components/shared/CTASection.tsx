'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRequestModal } from '@/lib/request-modal-context';

interface CTASectionProps {
  title: string;
  titleItalic: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  gradientFrom?: string;
  gradientTo?: string;
  /** When true, button opens request modal instead of linking */
  openModal?: boolean;
}

export default function CTASection({
  title,
  titleItalic,
  description,
  buttonText,
  buttonHref,
  gradientFrom = '#C4A574',
  gradientTo = '#8B7355',
  openModal = false,
}: CTASectionProps) {
  const { openRequestModal } = useRequestModal();
  return (
    <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-black text-white relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          backgroundImage: `radial-gradient(circle, ${gradientFrom} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight tracking-tight" style={{ fontFamily: 'serif' }}>
            {title} <br />
            <span className="italic" style={{ color: gradientFrom }}>{titleItalic}</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            {description}
          </p>

          {openModal ? (
            <motion.button
              onClick={() => openRequestModal()}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 sm:px-12 py-5 sm:py-6 rounded-full text-base sm:text-lg tracking-wider shadow-xl hover:shadow-2xl transition-shadow inline-flex items-center gap-3"
              style={{
                background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
              }}
            >
              {buttonText}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <Link href={buttonHref}>
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 sm:px-12 py-5 sm:py-6 rounded-full text-base sm:text-lg tracking-wider shadow-xl hover:shadow-2xl transition-shadow inline-flex items-center gap-3"
                style={{
                  background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
                }}
              >
                {buttonText}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
