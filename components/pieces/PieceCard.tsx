'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from '@/lib/i18n';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CatalogPiece } from '@/lib/catalog-types';
import {
  formatPriceEUR,
  pieceImageUrls,
  resolvePieceDescriptionText,
  resolvePieceName,
} from '@/lib/piece-display';

interface PieceCardProps {
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
  onRequest: () => void;
  onClick?: () => void;
  index: number;
}

export default function PieceCard({ piece, onRequest, onClick, index }: PieceCardProps) {
  const t = useTranslations('pieces');
  const locale = useLocale();
  const title = resolvePieceName(piece, locale);
  const description = resolvePieceDescriptionText(piece, locale, t);
  const priceLabel = formatPriceEUR(piece.priceEUR, locale);
  const coverSrc = pieceImageUrls(piece)[0] ?? '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group h-full min-w-0"
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:shadow-2xl sm:rounded-3xl sm:shadow-lg cursor-pointer"
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      >
        <div className="relative aspect-[4/5] shrink-0 overflow-hidden sm:aspect-[5/6]">
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
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRequest();
            }}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              buttonVariants({ variant: 'cardOverlay', size: 'plain' }),
              'absolute inset-x-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:inset-x-6 sm:bottom-6'
            )}
          >
            {t('request')}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-3.5 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <h3
              className="min-w-0 flex-1 line-clamp-2 text-[1.05rem] tracking-tight sm:text-xl"
              style={{ fontFamily: 'serif' }}
            >
              {title}
            </h3>
            {priceLabel ? (
              <span className="max-w-[40%] shrink-0 pt-0.5 text-right text-xs font-medium tabular-nums text-black/80 sm:text-sm">
                {priceLabel}
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-[11px] tracking-[0.14em] text-brand-mustard truncate sm:mt-1.5 sm:text-sm sm:tracking-widest">
            {piece.type}
          </div>
          <div className="mt-1.5 min-h-[3.5rem] flex-1 sm:mt-2 sm:min-h-[4.5rem]">
            {description ? (
              <p className="line-clamp-3 text-[12px] leading-relaxed text-[#8B8B8B] [overflow-wrap:anywhere] sm:text-sm">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
