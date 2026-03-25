'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollWhenNeeded } from '@/lib/use-scroll-when-needed';
import { X, ArrowRight } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { useRequestModal } from '@/lib/request-modal-context';
import { ImageWithFallback } from '@/components/image-with-fallback';

interface PieceDetailModalProps {
  piece: {
    id: string;
    name: string;
    type: string;
    image: string;
    descriptionKey?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onRequest?: () => void;
}

export default function PieceDetailModal({ piece, isOpen, onClose }: PieceDetailModalProps) {
  const { openRequestModal } = useRequestModal();
  const t = useTranslations('pieces');
  const { ref: scrollRef, needsScroll } = useScrollWhenNeeded(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!piece) return null;

  const descKey = piece.descriptionKey?.replace('pieces.', '') || '';
  const description = descKey ? t(`pieces.${descKey}`) : '';

  const statusKey = piece.type === 'one-of-one' ? 'oneOfOne' : 'limited';
  const buttonKey = piece.type === 'one-of-one' ? 'book' : 'order';
  const statusText = t(`productStatus.${statusKey}`);
  const buttonText = t(`productButton.${buttonKey}`);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div
            ref={scrollRef}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 py-16 overflow-x-hidden ${needsScroll ? 'overflow-y-auto' : 'overflow-y-hidden'}`}
            onClick={onClose}
          >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative bg-white rounded-[2.5rem] max-w-2xl w-full shadow-2xl my-8 flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <div className="relative aspect-[4/5] sm:aspect-[4/3] flex-shrink-0">
                <ImageWithFallback
                  src={piece.image}
                  alt={piece.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="p-6 sm:p-8">
                <span className="text-brand-mustard text-xs sm:text-sm tracking-[0.4em] uppercase">
                  {statusText}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl mt-2 mb-4 tracking-tight" style={{ fontFamily: 'serif' }}>
                  {piece.name}
                </h2>
                {description && (
                  <p className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed mb-6">
                    {String(description)}
                  </p>
                )}

                <motion.button
                  onClick={() => {
                    onClose();
                    openRequestModal({
                      source: 'piece',
                      pieceName: piece.name,
                      pieceType: piece.type,
                    });
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-mustard text-brand-mustard-foreground rounded-full text-base tracking-wider shadow-lg hover:shadow-xl hover:bg-brand-mustard-hover transition-colors flex items-center justify-center gap-3"
                >
                  {buttonText}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
