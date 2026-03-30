'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from '@/lib/i18n';
import { ImageWithFallback } from '@/components/image-with-fallback';
import type { CatalogPiece } from '@/lib/catalog-types';
import {
  formatPriceEUR,
  pieceImageUrls,
  resolvePieceDescriptionText,
  resolvePieceName,
} from '@/lib/piece-display';

interface PiecePreviewCardProps {
  piece: Pick<
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
  >;
  onClick: () => void;
  index: number;
}

export default function PiecePreviewCard({ piece, onClick, index }: PiecePreviewCardProps) {
  const t = useTranslations('featuredPieces');
  const tp = useTranslations('pieces');
  const locale = useLocale();
  const title = resolvePieceName(piece, locale);
  const description = resolvePieceDescriptionText(piece, locale, tp);
  const priceLabel = formatPriceEUR(piece.priceEUR, locale);
  const coverSrc = pieceImageUrls(piece)[0] ?? '';

  return (
    <div
      className="group block h-full cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="h-full"
      >
        <div className="relative flex h-full flex-col bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
          <div className="relative aspect-[5/6] shrink-0 overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <ImageWithFallback
                src={coverSrc}
                alt={title}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              className="absolute inset-x-6 bottom-6 px-6 py-3 bg-white text-black rounded-full text-sm sm:text-base tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
            >
              <span>{t('viewItem')}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
          <div className="flex flex-1 flex-col p-4 sm:p-5 min-h-0">
            <div className="flex items-start justify-between gap-3">
              <h3
                className="text-lg sm:text-xl tracking-tight line-clamp-2 min-w-0 flex-1"
                style={{ fontFamily: 'serif' }}
              >
                {title}
              </h3>
              {priceLabel ? (
                <span className="shrink-0 text-sm font-medium tabular-nums text-black/80 pt-0.5 text-right max-w-[40%]">
                  {priceLabel}
                </span>
              ) : null}
            </div>
            <div className="mt-1.5 text-xs sm:text-sm text-brand-mustard tracking-widest truncate">
              {piece.type}
            </div>
            <div className="mt-2 min-h-[4.125rem] sm:min-h-[4.5rem] flex-1">
              {description ? (
                <p className="text-xs sm:text-sm text-[#8B8B8B] leading-relaxed line-clamp-3 [overflow-wrap:anywhere]">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
