'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollWhenNeeded } from '@/lib/use-scroll-when-needed';
import { X, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from '@/lib/i18n';
import { useRequestModal } from '@/lib/request-modal-context';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { formatDate, formatDateRange } from '@/lib/format-date';
import { Button } from '@/components/ui/button';

interface EventDetailModalProps {
  event: {
    id: string;
    date: string;
    dateEnd?: string;
    location: string;
    image: string;
    type: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  const t = useTranslations('events');
  const locale = useLocale();
  const { openRequestModal } = useRequestModal();
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

  if (!event) return null;

  const typeKey = event.type as 'exhibition' | 'workshop' | 'trunk-show' | 'open-studio';
  const typeLabel = t(`types.${typeKey}`);
  const dateDisplay = event.dateEnd
    ? formatDateRange(event.date, event.dateEnd, locale as 'en' | 'de' | 'ru')
    : formatDate(event.date, locale as 'en' | 'de' | 'ru');

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
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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

              <div className="relative aspect-[4/3] flex-shrink-0">
                <ImageWithFallback
                  src={event.image}
                  alt={String(t(`items.${event.id}.title`))}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs tracking-widest text-brand-mustard font-medium">
                    {typeLabel}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 tracking-tight" style={{ fontFamily: 'serif' }}>
                  {t(`items.${event.id}.title`)}
                </h2>
                <p className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed mb-6">
                  {t(`items.${event.id}.description`)}
                </p>

                <div className="flex flex-col gap-3 mb-8 text-[#8B8B8B]">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-brand-mustard flex-shrink-0" />
                    <span>{dateDisplay}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-brand-mustard flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="mustard"
                  size="default"
                  onClick={() => {
                    onClose();
                    openRequestModal({
                      source: 'event',
                      eventTitle: String(t(`items.${event.id}.title`)),
                      eventId: event.id,
                    });
                  }}
                  className="w-full sm:w-auto text-base"
                >
                  {t('cta.button')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
