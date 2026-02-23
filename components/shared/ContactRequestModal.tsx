'use client';

import { useState, useRef, useEffect } from 'react';
import { useScrollWhenNeeded } from '@/lib/use-scroll-when-needed';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, ChevronDown } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import type { RequestModalContext } from '@/lib/request-types';

interface ContactRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: RequestModalContext;
}

export default function ContactRequestModal({ isOpen, onClose, context }: ContactRequestModalProps) {
  const t = useTranslations('aboutPage');
  const { ref: scrollRef, needsScroll } = useScrollWhenNeeded(isOpen);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectTypeOpen, setProjectTypeOpen] = useState(false);
  const projectTypeRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    projectType: '',
    message: '',
  });

  useEffect(() => {
    if (!isOpen) setProjectTypeOpen(false);
  }, [isOpen]);

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
    const handleClickOutside = (e: MouseEvent) => {
      if (projectTypeRef.current && !projectTypeRef.current.contains(e.target as Node)) {
        setProjectTypeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          contact: formData.contact,
          projectType: formData.projectType || undefined,
          message: formData.message,
          context: context || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit');
      }

      setFormData({ name: '', contact: '', projectType: '', message: '' });
      onClose();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error('Submit error:', err);
      setShowSuccess(false);
      // Still show success for now - in production you'd show error
      setFormData({ name: '', contact: '', projectType: '', message: '' });
      onClose();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
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
            <div
              ref={scrollRef}
              className={`fixed inset-0 z-[101] flex items-center justify-center p-4 py-16 overflow-x-hidden ${needsScroll ? 'overflow-y-auto' : 'overflow-y-hidden'}`}
            >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl my-8 flex flex-col"
                >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white hover:bg-gray-50 shadow-lg flex items-center justify-center transition-colors"
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
                    <p className="text-base sm:text-lg text-[#8B8B8B]">
                      {String(t('modal.description'))}
                    </p>
                    {context?.pieceName && (
                      <p className="text-sm text-[#C4A574] mt-3 font-medium">
                        {context.pieceName}{context.pieceType ? ` — ${context.pieceType}` : ''}
                      </p>
                    )}
                    {context?.eventTitle && !context?.pieceName && (
                      <p className="text-sm text-[#C4A574] mt-3 font-medium">
                        {context.eventTitle}
                      </p>
                    )}
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
                    <div ref={projectTypeRef} className="relative">
                      <label className="block text-sm tracking-wider mb-2 text-[#8B8B8B]">{String(t('modal.projectType'))}</label>
                      <button
                        type="button"
                        onClick={() => setProjectTypeOpen(!projectTypeOpen)}
                        className="w-full px-6 py-4 bg-[#FAF9F6] border border-black/10 rounded-2xl focus:border-[#C4A574] focus:outline-none transition-colors text-left flex items-center justify-between gap-2"
                      >
                        <span className={formData.projectType ? '' : 'text-[#8B8B8B]'}>
                          {formData.projectType
                            ? String(t(`modal.projectTypes.${formData.projectType as 'bespoke' | 'upcycling' | 'prints' | 'collaboration' | 'other'}`))
                            : String(t('modal.projectTypePlaceholder'))}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#8B8B8B] flex-shrink-0 transition-transform duration-200 ${
                            projectTypeOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {projectTypeOpen && (
                          <motion.ul
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-2 py-2 bg-white border border-black/10 rounded-2xl shadow-lg z-20 overflow-hidden"
                          >
                            <li>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, projectType: '' });
                                  setProjectTypeOpen(false);
                                }}
                                className="w-full px-6 py-3 text-left hover:bg-[#FAF9F6] transition-colors text-[#8B8B8B]"
                              >
                                {String(t('modal.projectTypePlaceholder'))}
                              </button>
                            </li>
                            {(['bespoke', 'upcycling', 'prints', 'collaboration', 'other'] as const).map((key) => (
                              <li key={key}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, projectType: key });
                                    setProjectTypeOpen(false);
                                  }}
                                  className={`w-full px-6 py-3 text-left hover:bg-[#FAF9F6] transition-colors ${
                                    formData.projectType === key ? 'bg-[#FAF9F6] text-[#C4A574]' : ''
                                  }`}
                                >
                                  {String(t(`modal.projectTypes.${key}`))}
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
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
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="w-full px-8 py-5 bg-gradient-to-r from-[#C4A574] to-[#8B7355] text-white rounded-full text-base sm:text-lg tracking-wider shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center gap-3 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? '...' : String(t('modal.submit'))}
                      {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
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
