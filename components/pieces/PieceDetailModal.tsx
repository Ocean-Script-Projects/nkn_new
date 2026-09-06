'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollWhenNeeded } from '@/lib/use-scroll-when-needed';
import { X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from '@/lib/i18n';
import { useRequestModal } from '@/lib/request-modal-context';
import { ImageWithFallback } from '@/components/image-with-fallback';
import type { CatalogPiece } from '@/lib/catalog-types';
import {
  formatPriceEUR,
  pieceImageUrls,
  resolvePieceDescriptionText,
  resolvePieceName,
} from '@/lib/piece-display';
import { Button } from '@/components/ui/button';

interface PieceDetailModalProps {
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
  > | null;
  isOpen: boolean;
  onClose: () => void;
  onRequest?: () => void;
}

export default function PieceDetailModal({ piece, isOpen, onClose }: PieceDetailModalProps) {
  const { openRequestModal } = useRequestModal();
  const t = useTranslations('pieces');
  const locale = useLocale();
  const { ref: scrollRef, needsScroll } = useScrollWhenNeeded(isOpen);
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeRef = useRef<{ x: number; id: number } | null>(null);

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

  useEffect(() => {
    setActiveIndex(0);
  }, [piece?.id, isOpen]);

  useEffect(() => {
    if (!isOpen || !piece) return;
    const list = pieceImageUrls(piece);
    if (list.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((i) => (list.length ? (i - 1 + list.length) % list.length : 0));
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((i) => (list.length ? (i + 1) % list.length : 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, piece]);

  if (!piece) return null;

  const urls = pieceImageUrls(piece);
  const activeSrc = urls[activeIndex] ?? urls[0] ?? '';

  const title = resolvePieceName(piece, locale);
  const description = resolvePieceDescriptionText(piece, locale, t);
  const priceLabel = formatPriceEUR(piece.priceEUR, locale);

  const statusKey = piece.type === 'one-of-one' ? 'oneOfOne' : 'limited';
  const buttonKey = piece.type === 'one-of-one' ? 'book' : 'order';
  const statusText = t(`productStatus.${statusKey}`);
  const buttonText = t(`productButton.${buttonKey}`);

  const goPrev = () =>
    setActiveIndex((i) => (urls.length ? (i - 1 + urls.length) % urls.length : 0));
  const goNext = () =>
    setActiveIndex((i) => (urls.length ? (i + 1) % urls.length : 0));

  const gallery = urls.length > 1;

  const onSwipePointerDown = (e: React.PointerEvent) => {
    if (!gallery) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    swipeRef.current = { x: e.clientX, id: e.pointerId };
  };

  const onSwipePointerUp = (e: React.PointerEvent) => {
    if (!gallery || !swipeRef.current || swipeRef.current.id !== e.pointerId) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const dx = e.clientX - swipeRef.current.x;
    const threshold = 40;
    if (dx < -threshold) goNext();
    else if (dx > threshold) goPrev();
    swipeRef.current = null;
  };

  const onSwipePointerCancel = (e: React.PointerEvent) => {
    swipeRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

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
            className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 py-8 sm:py-10 overflow-x-hidden ${needsScroll ? 'overflow-y-auto' : 'overflow-y-hidden'}`}
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-h-[min(94vh,800px)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-[2rem] md:max-h-[min(92vh,760px)] md:max-w-5xl md:grid md:grid-cols-[minmax(0,1.65fr)_minmax(14rem,1fr)] md:rounded-[2rem] min-w-0"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg transition-colors hover:bg-white sm:top-4 sm:right-4 sm:h-11 sm:w-11"
                aria-label="Close"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.button>

              {/* Gallery: vertical thumbnails left on md; swipe + arrows on main */}
              <div className="relative flex w-full shrink-0 flex-col border-b border-black/[0.06] bg-black/[0.03] md:min-h-0 md:flex-row md:items-stretch md:border-b-0 md:border-r md:border-black/[0.06]">
                {gallery ? (
                  <div
                    className="order-2 flex max-h-[7.5rem] shrink-0 flex-row gap-2 overflow-x-auto overflow-y-hidden border-t border-black/[0.06] bg-white/95 px-2 py-2 [scrollbar-width:thin] md:order-1 md:max-h-none md:w-[5.25rem] md:flex-col md:gap-2 md:overflow-y-auto md:overflow-x-hidden md:border-t-0 md:border-r md:bg-black/[0.04] md:px-2 md:py-3"
                    role="tablist"
                    aria-label="Photos"
                  >
                    {urls.map((u, i) => (
                      <button
                        key={`${u}-${i}`}
                        type="button"
                        role="tab"
                        aria-selected={i === activeIndex}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex(i);
                        }}
                        className={`relative aspect-[3/4] w-[3.75rem] shrink-0 overflow-hidden rounded-lg md:aspect-[3/4] md:h-[4.5rem] md:w-full md:max-w-none ${
                          i === activeIndex
                            ? 'ring-2 ring-brand-mustard ring-offset-2 ring-offset-white'
                            : 'opacity-85 ring-1 ring-black/10 hover:opacity-100'
                        } transition`}
                      >
                        <ImageWithFallback
                          src={u}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
                <div
                  role={gallery ? 'region' : undefined}
                  aria-label={gallery ? 'Main photo' : undefined}
                  onPointerDown={onSwipePointerDown}
                  onPointerUp={onSwipePointerUp}
                  onPointerCancel={onSwipePointerCancel}
                  className={`relative order-1 aspect-[3/4] w-full max-h-[min(52vh,420px)] min-h-[200px] min-w-0 shrink-0 overflow-hidden sm:max-h-[min(48vh,440px)] md:order-2 md:aspect-auto md:h-[min(88vh,680px)] md:max-h-[680px] md:min-h-[360px] md:flex-1 ${
                    gallery ? 'cursor-grab active:cursor-grabbing' : ''
                  }`}
                >
                  <AnimatePresence initial={false} mode="wait">
                    {activeSrc ? (
                      <motion.div
                        key={`${piece.id}-${activeIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="absolute inset-0"
                      >
                        <ImageWithFallback
                          src={activeSrc}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </motion.div>
                    ) : (
                      <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-gradient-to-br from-black/[0.04] to-black/[0.08] text-black/25">
                        —
                      </div>
                    )}
                  </AnimatePresence>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />
                  {gallery ? (
                    <>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          goPrev();
                        }}
                        className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black/80 shadow-md transition hover:bg-white md:h-10 md:w-10"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          goNext();
                        }}
                        className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black/80 shadow-md transition hover:bg-white md:h-10 md:w-10"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/35 px-2.5 py-1.5 text-[10px] font-medium tabular-nums text-white backdrop-blur-sm">
                        <span className="flex gap-1.5">
                          {urls.map((_, i) => (
                            <span
                              key={i}
                              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                i === activeIndex ? 'bg-white' : 'bg-white/40'
                              }`}
                            />
                          ))}
                        </span>
                        <span className="opacity-90">
                          {activeIndex + 1}/{urls.length}
                        </span>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="flex min-h-0 min-w-0 flex-1 flex-col px-5 pb-6 pt-6 sm:px-6 sm:pb-6 md:px-7 md:pb-8 md:pt-14 lg:px-8 lg:pt-16">
                <header className="shrink-0 space-y-3 border-b border-black/[0.07] pb-5">
                  <p className="text-brand-mustard text-[10px] sm:text-[11px] tracking-[0.32em] uppercase leading-snug">
                    {statusText}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
                    <h2
                      className="text-[1.35rem] sm:text-2xl md:text-[1.65rem] leading-[1.15] tracking-tight [overflow-wrap:anywhere] break-words md:leading-tight"
                      style={{ fontFamily: 'serif' }}
                    >
                      {title}
                    </h2>
                    {priceLabel ? (
                      <p className="shrink-0 text-lg font-medium tabular-nums tracking-tight text-black/90 sm:text-right md:text-xl md:pb-0.5">
                        {priceLabel}
                      </p>
                    ) : null}
                  </div>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-5">
                  {description ? (
                    <p className="text-sm leading-[1.65] text-[#6B6B6B] sm:text-[15px] [overflow-wrap:anywhere] break-words">
                      {description}
                    </p>
                  ) : null}
                </div>

                <footer className="mt-auto shrink-0 border-t border-black/[0.07] pt-5">
                  <Button
                    type="button"
                    variant="mustard"
                    size="default"
                    onClick={() => {
                      onClose();
                      openRequestModal({
                        source: 'piece',
                        pieceName: title,
                        pieceType: piece.type,
                      });
                    }}
                    className="w-full py-3.5 text-sm font-medium sm:py-4 sm:text-base"
                  >
                    {buttonText}
                    <ArrowRight className="h-5 w-5 shrink-0" />
                  </Button>
                </footer>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
