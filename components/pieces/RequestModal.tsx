'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

interface RequestModalProps {
  piece: {
    name: string;
    type: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    interest: string;
    name: string;
    contact: string;
    message: string;
  }) => void;
}

export default function RequestModal({ piece, isOpen, onClose, onSubmit }: RequestModalProps) {
  const t = useTranslations('pieces');
  const [formData, setFormData] = React.useState({
    interest: '',
    name: '',
    contact: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ interest: '', name: '', contact: '', message: '' });
    onClose();
  };

  if (!piece) return null;

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

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 sm:inset-8 md:inset-16 lg:inset-24 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 md:p-12 max-w-2xl w-full max-h-full overflow-y-auto relative shadow-2xl">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-[#C4A574]" />
                  <span className="text-[#C4A574] text-xs sm:text-sm tracking-[0.4em] uppercase">{t('modal.label')}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 tracking-tight" style={{ fontFamily: 'serif' }}>
                  {t('modal.title')}
                </h2>

                <p className="text-base sm:text-lg text-[#8B8B8B]">
                  {piece.name} — {piece.type}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">
                    {t('modal.interest')} *
                  </label>
                  <select
                    required
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23C4A574' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1.5rem center',
                      backgroundSize: '1.25rem'
                    }}
                  >
                    <option value="">{t('modal.selectOption')}</option>
                    <option value="similar">{t('modal.similar')}</option>
                    <option value="custom">{t('modal.custom')}</option>
                    <option value="fitting">{t('modal.fitting')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">{t('modal.name')} *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors"
                    placeholder={String(t('modal.namePlaceholder'))}
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">
                    {t('modal.contact')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors"
                    placeholder={String(t('modal.contactPlaceholder'))}
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">{t('modal.message')}</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-6 py-4 bg-white border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors resize-none"
                    placeholder={String(t('modal.messagePlaceholder'))}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-8 py-5 bg-gradient-to-r from-[#C4A574] to-[#8B7355] text-white rounded-full text-base sm:text-lg tracking-wider shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-3"
                  >
                    {t('modal.submit')}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-5 border-2 border-black/10 rounded-full text-base sm:text-lg tracking-wider hover:bg-black/5 transition-colors"
                  >
                    {t('cancel')}
                  </motion.button>
                </div>
              </form>

              <p className="text-xs text-[#8B8B8B] text-center mt-6">
                {t('footer')}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
