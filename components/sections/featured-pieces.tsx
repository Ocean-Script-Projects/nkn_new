'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslations, useLocale } from '@/lib/i18n';
import Link from 'next/link';
import PiecePreviewCard from '@/components/pieces/PiecePreviewCard';
import DecorativeLogo from '@/components/shared/DecorativeLogo';
import PieceDetailModal from '@/components/pieces/PieceDetailModal';
import piecesData from '@/data/pieces.json';

const FEATURED_COUNT = 6;

export default function FeaturedPiecesSection() {
  const t = useTranslations('featuredPieces');
  const locale = useLocale();
  const [selectedPiece, setSelectedPiece] = useState<{
    id: string;
    name: string;
    type: string;
    image: string;
    descriptionKey?: string;
  } | null>(null);
  const pieces = piecesData.slice(0, FEATURED_COUNT).map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    image: p.image,
    descriptionKey: p.descriptionKey,
  }));
  const piecesHref = `/${locale}/pieces`;

  return (
    <section
      id="pieces"
      className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6 sm:mb-8"
          >
            <div className="h-px w-6 sm:w-8 bg-brand-sage" />
            <span className="text-brand-sage text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase">
              {t('label')}
            </span>
            <div className="h-px w-6 sm:w-8 bg-brand-sage" />
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6" style={{ fontFamily: 'serif' }}>
            {t('title')} <span className="italic">{t('titleItalic')}</span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed max-w-2xl mx-auto"
          >
            {t('description')}
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-12 sm:mb-16">
          {pieces.map((piece, i) => (
            <PiecePreviewCard
              key={piece.id}
              piece={piece}
              onClick={() => setSelectedPiece(piece)}
              index={i}
            />
          ))}
        </div>

        <PieceDetailModal
          piece={selectedPiece}
          isOpen={!!selectedPiece}
          onClose={() => setSelectedPiece(null)}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href={piecesHref}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-black text-white rounded-full text-sm sm:text-base tracking-wider overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-brand-mustard"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.4 }}
              />
              <span className="relative z-10 group-hover:text-brand-mustard-foreground">{t('viewAll')}</span>
              <span className="relative z-10 group-hover:translate-x-1 group-hover:text-brand-mustard-foreground transition-transform">
                →
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
