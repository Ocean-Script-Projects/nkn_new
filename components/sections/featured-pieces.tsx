'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useTranslations, useLocale } from '@/lib/i18n';
import Link from 'next/link';
import PiecePreviewCard from '@/components/pieces/PiecePreviewCard';
import PieceDetailModal from '@/components/pieces/PieceDetailModal';
import { Button } from '@/components/ui/button';
import { usePiecesList } from '@/lib/use-pieces';
import type { CatalogPiece } from '@/lib/catalog-types';

/** Если ни одно изделие не отмечено «на главной», показываем первые N из каталога. */
const FEATURED_FALLBACK_COUNT = 6;

type FeaturedPieceCard = Pick<
  CatalogPiece,
  | 'id'
  | 'name'
  | 'names'
  | 'type'
  | 'image'
  | 'images'
  | 'descriptionKey'
  | 'descriptions'
  | 'priceEUR'
  | 'featuredOnHome'
>;

export default function FeaturedPiecesSection() {
  const t = useTranslations('featuredPieces');
  const tPieces = useTranslations('pieces');
  const locale = useLocale();
  const { pieces: allPieces, loading, error } = usePiecesList();
  const [selectedPiece, setSelectedPiece] = useState<FeaturedPieceCard | null>(null);
  const pieces = useMemo(() => {
    const marked = allPieces.filter((p) => p.featuredOnHome === true);
    const source =
      marked.length > 0 ? marked : allPieces.slice(0, FEATURED_FALLBACK_COUNT);
    return source.map((p) => ({
      id: p.id,
      name: p.name,
      names: p.names,
      type: p.type,
      image: p.image,
      images: p.images,
      descriptionKey: p.descriptionKey,
      descriptions: p.descriptions,
      priceEUR: p.priceEUR,
      featuredOnHome: p.featuredOnHome,
    }));
  }, [allPieces]);
  const piecesHref = `/${locale}/pieces`;

  return (
    <section
      id="pieces"
      className="py-14 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-12 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14 md:mb-16"
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

          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-5 md:mb-6"
            style={{ fontFamily: 'serif' }}
          >
            {t('title')} <span className="italic">{t('titleItalic')}</span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base md:text-lg text-[#8B8B8B] leading-relaxed max-w-2xl mx-auto px-1"
          >
            {t('description')}
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 mb-10 sm:mb-14">
          {error ? (
            <p className="col-span-full text-center text-red-700">{error}</p>
          ) : loading ? (
            <p className="col-span-full text-center text-[#8B8B8B] py-8">
              {String(tPieces('loading'))}
            </p>
          ) : (
            pieces.map((piece, i) => (
              <PiecePreviewCard
                key={piece.id}
                piece={piece}
                onClick={() => setSelectedPiece(piece)}
                index={i}
              />
            ))
          )}
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Button variant="dark" size="lg" asChild>
              <Link href={piecesHref} className="group">
                {t('viewAll')}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
