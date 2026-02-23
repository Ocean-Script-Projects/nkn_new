'use client';

import { motion } from 'motion/react';
import { Calendar, MapPin } from 'lucide-react';
import { useTranslations, useLocale } from '@/lib/i18n';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { formatDate, formatDateRange } from '@/lib/format-date';

interface EventCardProps {
  event: {
    id: string;
    date: string;
    dateEnd?: string;
    location: string;
    image: string;
    type: string;
  };
  onClick?: () => void;
  index: number;
}

export default function EventCard({ event, onClick, index }: EventCardProps) {
  const t = useTranslations('events');
  const locale = useLocale();

  const typeKey = event.type as 'exhibition' | 'workshop' | 'trunk-show' | 'open-studio';
  const typeLabel = t(`types.${typeKey}`);

  const dateDisplay = event.dateEnd
    ? formatDateRange(event.date, event.dateEnd, locale as 'en' | 'de' | 'ru')
    : formatDate(event.date, locale as 'en' | 'de' | 'ru');

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full cursor-pointer"
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      >
        <div className="relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs tracking-widest text-[#C4A574] font-medium">
              {typeLabel}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-5 lg:p-6">
          <h3
            className="text-lg sm:text-xl mb-2 tracking-tight"
            style={{ fontFamily: 'serif' }}
          >
            {t(`items.${event.id}.title`)}
          </h3>
          <p className="text-sm text-[#8B8B8B] leading-relaxed mb-3">
            {t(`items.${event.id}.description`)}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-[#8B8B8B]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C4A574] flex-shrink-0" />
              <span>{dateDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C4A574] flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
