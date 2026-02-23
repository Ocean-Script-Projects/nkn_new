'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { ImageWithFallback } from '@/components/image-with-fallback';

interface PieceCardProps {
  piece: {
    id: string;
    name: string;
    type: string;
    image: string;
    descriptionKey?: string;
  };
  onRequest: () => void;
  onClick?: () => void;
  index: number;
}

export default function PieceCard({ piece, onRequest, onClick, index }: PieceCardProps) {
  const t = useTranslations('pieces');
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      >
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
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onRequest();
            }}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            className="absolute inset-x-6 bottom-6 px-6 py-3 bg-white text-black rounded-full text-sm sm:text-base tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
          >
            {t('request')}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="text-lg sm:text-xl mb-1.5 tracking-tight" style={{ fontFamily: 'serif' }}>
            {piece.name}
          </h3>
          <div className="text-xs sm:text-sm text-[#C4A574] tracking-widest">
            {piece.type}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
