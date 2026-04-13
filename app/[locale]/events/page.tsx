'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslations, useLocale } from '@/lib/i18n';
import { ImageWithFallback } from '@/components/image-with-fallback';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PageHeader from '@/components/shared/PageHeader';
import CTASection from '@/components/shared/CTASection';
import EventCard from '@/components/events/EventCard';
import EventDetailModal from '@/components/events/EventDetailModal';
import eventsData from '@/data/events.json';

export default function EventsPage() {
  const t = useTranslations('events');
  const locale = useLocale();
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    date: string;
    dateEnd?: string;
    location: string;
    image: string;
    type: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navigation />

      <PageHeader
        label={String(t('label'))}
        title={String(t('title'))}
        titleItalic={String(t('titleItalic'))}
        description={String(t('description'))}
        labelColor="#C4A574"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Creative event"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </motion.div>
      </PageHeader>

      <section className="py-12 sm:py-16 md:py-28 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#C4A574]" />
              <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">
                {t('sectionLabel')}
              </span>
              <div className="h-px w-8 bg-[#C4A574]" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight" style={{ fontFamily: 'serif' }}>
              {t('sectionTitle')}
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-1">
              {t('sectionDescription')}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {eventsData.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <CTASection
        title={String(t('cta.title'))}
        titleItalic={String(t('cta.titleItalic'))}
        description={String(t('cta.description'))}
        buttonText={String(t('cta.button'))}
        buttonHref={`/${locale}/contact`}
        openModal
      />

      <Footer />
    </div>
  );
}
