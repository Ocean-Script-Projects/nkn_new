'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

interface ContactRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactRequestModal({ isOpen, onClose }: ContactRequestModalProps) {
  const t = useTranslations('aboutPage');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    projectType: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact request submitted:', formData);
    setFormData({ name: '', contact: '', projectType: '', message: '' });
    onClose();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="fixed inset-4 max-h-[calc(100vh-2rem)] sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[90vh] bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col"
            >
              <div className="relative overflow-y-auto overscroll-contain min-h-0 flex-1">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="p-8 sm:p-12">
                  <div className="mb-8">
                    <h3
                      className="text-3xl sm:text-4xl md:text-5xl mb-4 tracking-tight"
                      style={{ fontFamily: 'serif' }}
                    >
                      {String(t('modal.title'))} <span className="italic">{String(t('modal.titleItalic'))}</span>
                    </h3>
                    <p className="text-base sm:text-lg text-[#8B8B8B]">{String(t('modal.description'))}</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">{String(t('modal.name'))} *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 bg-[#FAF9F6] border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">{String(t('modal.contact'))} *</label>
                      <input
                        type="text"
                        required
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className="w-full px-6 py-4 bg-[#FAF9F6] border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors"
                        placeholder={String(t('modal.contactPlaceholder'))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">{String(t('modal.projectType'))}</label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-6 py-4 bg-[#FAF9F6] border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors"
                      >
                        <option value="">{String(t('modal.projectTypePlaceholder'))}</option>
                        <option value="bespoke">{String(t('modal.projectTypes.bespoke'))}</option>
                        <option value="upcycling">{String(t('modal.projectTypes.upcycling'))}</option>
                        <option value="prints">{String(t('modal.projectTypes.prints'))}</option>
                        <option value="collaboration">{String(t('modal.projectTypes.collaboration'))}</option>
                        <option value="other">{String(t('modal.projectTypes.other'))}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">{String(t('modal.message'))} *</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full px-6 py-4 bg-[#FAF9F6] border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors resize-none"
                        placeholder={String(t('modal.messagePlaceholder'))}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-8 py-5 bg-gradient-to-r from-[#C4A574] to-[#8B7355] text-white rounded-full text-base sm:text-lg tracking-wider shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center gap-3 font-medium"
                    >
                      {String(t('modal.submit'))}
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[102]"
          >
            <div className="bg-[#C4A574] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm sm:text-base tracking-wide">{String(t('success'))}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
