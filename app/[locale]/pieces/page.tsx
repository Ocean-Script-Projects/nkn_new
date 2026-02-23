'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations, useLocale } from '@/lib/i18n';
import { ImageWithFallback } from '@/components/image-with-fallback';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import PieceCard from '@/components/pieces/PieceCard';
import CategoryFilter, { Category } from '@/components/pieces/CategoryFilter';
import PieceDetailModal from '@/components/pieces/PieceDetailModal';
import PageHeader from '@/components/shared/PageHeader';
import CTASection from '@/components/shared/CTASection';
import Link from 'next/link';
import piecesData from '@/data/pieces.json';

interface Piece {
  id: string;
  name: string;
  category: Category;
  type: 'atelier made' | 'one-of-one' | 'limited';
  image: string;
  descriptionKey: string;
}

export default function PiecesPage() {
  const t = useTranslations('pieces');
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedPieceForDetail, setSelectedPieceForDetail] = useState<Piece | null>(null);

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: String(t('categories.all')) },
    { id: 'belts', label: String(t('categories.belts')) },
    { id: 'corsets', label: String(t('categories.corsets')) },
    { id: 'scarves', label: String(t('categories.scarves')) },
    { id: 'dresses', label: String(t('categories.dresses')) },
    { id: 'mini-series', label: String(t('categories.miniSeries')) },
    { id: 'one-of-one', label: String(t('categories.oneOfOne')) },
  ];

  const pieces: Piece[] = useMemo(() => {
    return piecesData.map(p => ({
      ...p,
      category: p.category as Category,
      type: p.type as Piece['type'],
    }));
  }, []);

  const filteredPieces = useMemo(() => {
    if (selectedCategory === 'all') return pieces;
    return pieces.filter(p => p.category === selectedCategory || p.type === selectedCategory);
  }, [pieces, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navigation />
      
      <PageHeader
        label={String(t('label'))}
        title={String(t('title'))}
        titleItalic={String(t('titleItalic'))}
        subtitle={String(t('subtitle'))}
        description={String(t('description'))}
        labelColor="#C4A574"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative"
        >
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1684259499086-93cb3e555803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Atelier process"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </motion.div>
      </PageHeader>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPieces.map((piece, i) => (
                <PieceCard
                  key={piece.id}
                  piece={piece}
                  onRequest={() => setSelectedPieceForDetail(piece)}
                  onClick={() => setSelectedPieceForDetail(piece)}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* STORYTELLING BLOCK */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1684259499086-93cb3e555803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Atelier process"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#C4A574]" />
                <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">{t('process.label')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight" style={{ fontFamily: 'serif' }}>
                {t('process.title')} <span className="italic">{t('process.titleItalic')}</span>
              </h2>

              <p className="text-lg sm:text-xl text-[#8B8B8B] leading-relaxed">
                {t('process.description')}
              </p>

              <div className="flex items-center gap-2 pt-4">
                <motion.div
                  className="w-5 h-5 text-[#C4A574]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  ✨
                </motion.div>
                <span className="text-sm tracking-wider text-[#8B8B8B]">{t('process.experience')}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* UPCYCLING CROSS-LINK */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-br from-[#059669]/5 to-transparent rounded-[3rem] p-8 sm:p-12 md:p-16 overflow-hidden border border-[#059669]/10"
          >
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#059669]/10 to-transparent rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-[#059669]" />
                  <span className="text-[#059669] text-xs sm:text-sm tracking-[0.4em] uppercase">{t('upcycling.label')}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight" style={{ fontFamily: 'serif' }}>
                  {t('upcycling.title')} <span className="italic">{t('upcycling.titleItalic')}</span>
                </h2>

                <p className="text-base sm:text-lg text-[#8B8B8B] leading-relaxed">
                  {t('upcycling.description')}
                </p>

                <Link href={`/${locale}/upcycling`}>
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-full text-sm sm:text-base tracking-wider shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {t('upcycling.button')}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </Link>
              </div>

              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1622907782973-d29eaa246931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                  alt="Upcycling transformation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <CTASection
        title={String(t('cta.title'))}
        titleItalic={String(t('cta.titleItalic'))}
        description={String(t('cta.description'))}
        buttonText={String(t('cta.button'))}
        buttonHref={`/${locale}/contact`}
        openModal
      />

      <PieceDetailModal
        piece={selectedPieceForDetail}
        isOpen={!!selectedPieceForDetail}
        onClose={() => setSelectedPieceForDetail(null)}
      />

      <Footer />
    </div>
  );
}
