'use client';

import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from '@/lib/i18n';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { formatDate, formatDateRange } from '@/lib/format-date';

interface EventPreviewCardProps {
  event: {
    id: string;
    date: string;
    dateEnd?: string;
    location: string;
    image: string;
    type: string;
  };
  onClick: () => void;
  index: number;
}

export default function EventPreviewCard({ event, onClick, index }: EventPreviewCardProps) {
  const t = useTranslations('events');
  const locale = useLocale();

  const typeKey = event.type as 'exhibition' | 'workshop' | 'trunk-show' | 'open-studio';
  const typeLabel = t(`types.${typeKey}`);

  const dateDisplay = event.dateEnd
    ? formatDateRange(event.date, event.dateEnd, locale as 'en' | 'de' | 'ru')
    : formatDate(event.date, locale as 'en' | 'de' | 'ru');

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
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <ImageWithFallback
                src={event.image}
                alt={String(t(`items.${event.id}.title`))}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div
              className="absolute inset-x-4 bottom-4 px-4 py-2.5 bg-white text-black rounded-full text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
            >
              <span>{t('featured.viewItem')}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs tracking-widest text-brand-mustard font-medium">
                {typeLabel}
              </span>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <h3
              className="text-lg sm:text-xl mb-1.5 tracking-tight"
              style={{ fontFamily: 'serif' }}
            >
              {t(`items.${event.id}.title`)}
            </h3>
            <div className="flex flex-col gap-1.5 text-xs sm:text-sm text-[#8B8B8B]">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand-mustard flex-shrink-0" />
                <span>{dateDisplay}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-mustard flex-shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
