'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { ImageWithFallback } from '@/components/image-with-fallback';

interface PiecePreviewCardProps {
  piece: {
    id: string;
    name: string;
    type: string;
    image: string;
    descriptionKey?: string;
  };
  onClick: () => void;
  index: number;
}

export default function PiecePreviewCard({ piece, onClick, index }: PiecePreviewCardProps) {
  const t = useTranslations('featuredPieces');
  return (
    <div
      className="group block cursor-pointer"
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
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
          <div className="relative aspect-[5/6] overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <ImageWithFallback
                src={piece.image}
                alt={piece.name}
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
          <div className="p-4 sm:p-5">
            <h3 className="text-lg sm:text-xl mb-1.5 tracking-tight" style={{ fontFamily: 'serif' }}>
              {piece.name}
            </h3>
            <div className="text-xs sm:text-sm text-[#C4A574] tracking-widest">{piece.type}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
