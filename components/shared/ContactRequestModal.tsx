'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, ChevronDown } from 'lucide-react';
import { useTranslations, useLocale } from '@/lib/i18n';
import { submitSiteRequest } from '@/lib/submit-site-request';
import { Button } from '@/components/ui/button';
import type { RequestModalContext } from '@/lib/request-types';

interface ContactRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: RequestModalContext;
}

export default function ContactRequestModal({ isOpen, onClose, context }: ContactRequestModalProps) {
  const t = useTranslations('aboutPage');
  const locale = useLocale();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [projectTypeOpen, setProjectTypeOpen] = useState(false);
  const [contactMethodOpen, setContactMethodOpen] = useState(false);
  const projectTypeRef = useRef<HTMLDivElement>(null);
  const contactMethodRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactMethod: 'telegram' as 'telegram' | 'email' | 'whatsapp',
    contact: '',
    projectType: '',
    message: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setProjectTypeOpen(false);
      setContactMethodOpen(false);
      setSubmitError(null);
    }
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
      const target = e.target as Node;
      if (projectTypeRef.current && !projectTypeRef.current.contains(target)) setProjectTypeOpen(false);
      if (contactMethodRef.current && !contactMethodRef.current.contains(target)) setContactMethodOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const projectKeys = ['bespoke', 'upcycling', 'prints', 'collaboration', 'other'] as const;
    let projectTypeLabel: string | undefined;
    if (formData.projectType) {
      if ((projectKeys as readonly string[]).includes(formData.projectType)) {
        projectTypeLabel = String(
          t(`modal.projectTypes.${formData.projectType as (typeof projectKeys)[number]}`)
        );
      } else {
        projectTypeLabel = formData.projectType;
      }
    }

    const result = await submitSiteRequest({
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      message: formData.message.trim(),
      source: 'modal',
      locale,
      contactMethod: String(t(`modal.contactOptions.${formData.contactMethod}`)),
      projectType: projectTypeLabel,
      context: context || undefined,
    });

    if (!result.ok) {
      console.error('Submit error:', result.error);
      setSubmitError(result.error);
      setIsSubmitting(false);
      return;
    }

    setFormData({ name: '', contactMethod: 'telegram', contact: '', projectType: '', message: '' });
    onClose();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    setIsSubmitting(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
              onClick={onClose}
            >
              <div className="relative z-[1] flex max-h-full w-full min-h-0 items-center justify-center overflow-x-hidden overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 10 }}
                  transition={{ type: 'spring', duration: 0.45 }}
                  role="dialog"
                  aria-modal="true"
                  className="relative mx-auto w-full max-w-2xl flex-shrink-0 rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
                  onClick={(e) => e.stopPropagation()}
                >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white hover:bg-gray-50 shadow-lg flex items-center justify-center transition-colors"
              >
                  <X className="w-5 h-5" />
                </button>
                <div className="p-6 sm:p-8 lg:p-10 pt-14 sm:pt-16">
                  <div className="mb-5 sm:mb-6">
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl mb-2 tracking-tight leading-tight"
                      style={{ fontFamily: 'serif' }}
                    >
                      {String(t('modal.title'))} <span className="italic">{String(t('modal.titleItalic'))}</span>
                    </h3>
                    <p className="text-sm sm:text-base text-[#8B8B8B] leading-relaxed max-w-xl">
                      {String(t('modal.description'))}
                    </p>
                    {context?.pieceName && (
                      <p className="text-sm text-brand-mustard mt-2 font-medium truncate">
                        {context.pieceName}{context.pieceType ? ` — ${context.pieceType}` : ''}
                      </p>
                    )}
                    {context?.eventTitle && !context?.pieceName && (
                      <p className="text-sm text-brand-mustard mt-2 font-medium truncate">
                        {context.eventTitle}
                      </p>
                    )}
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-xs sm:text-sm tracking-wider mb-1.5 text-[#8B8B8B]">{String(t('modal.name'))} *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-black/10 rounded-xl focus:border-brand-mustard focus:outline-none transition-colors text-base"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div ref={contactMethodRef} className="relative min-w-0">
                        <label className="block text-xs sm:text-sm tracking-wider mb-1.5 text-[#8B8B8B]">{String(t('modal.contact'))} *</label>
                        <button
                          type="button"
                          onClick={() => setContactMethodOpen(!contactMethodOpen)}
                          className="w-full px-4 py-3 bg-[#FAF9F6] border border-black/10 rounded-xl focus:border-brand-mustard focus:outline-none transition-colors text-left flex items-center justify-between gap-2 text-sm sm:text-base"
                        >
                          <span className={formData.contactMethod ? '' : 'text-[#8B8B8B]'}>
                            {formData.contactMethod
                              ? String(t(`modal.contactOptions.${formData.contactMethod}`))
                              : String(t('modal.contactPlaceholder'))}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-[#8B8B8B] flex-shrink-0 transition-transform duration-200 ${
                              contactMethodOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {contactMethodOpen && (
                            <motion.ul
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 right-0 mt-2 py-2 bg-white border border-black/10 rounded-2xl shadow-lg z-20 overflow-hidden"
                            >
                              {(['telegram', 'whatsapp', 'email'] as const).map((method) => (
                                <li key={method}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, contactMethod: method });
                                      setContactMethodOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-base hover:bg-[#FAF9F6] transition-colors ${
                                      formData.contactMethod === method ? 'bg-[#FAF9F6] text-brand-mustard' : ''
                                    }`}
                                  >
                                    {String(t(`modal.contactOptions.${method}`))}
                                  </button>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="min-w-0">
                        <label className="block text-xs sm:text-sm tracking-wider mb-1.5 text-[#8B8B8B]">{String(t('modal.contactValue'))}</label>
                        <input
                          type="text"
                          required
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          className="w-full px-4 py-3 bg-[#FAF9F6] border border-black/10 rounded-xl focus:border-brand-mustard focus:outline-none transition-colors text-sm sm:text-base"
                          placeholder={
                            formData.contactMethod === 'email'
                              ? String(t('modal.contactValuePlaceholderEmail'))
                              : formData.contactMethod === 'telegram'
                              ? String(t('modal.contactValuePlaceholderTelegram'))
                              : String(t('modal.contactValuePlaceholderWhatsapp'))
                          }
                        />
                      </div>
                    </div>
                    <div ref={projectTypeRef} className="relative">
                      <label className="block text-xs sm:text-sm tracking-wider mb-1.5 text-[#8B8B8B]">{String(t('modal.projectType'))}</label>
                      <button
                        type="button"
                        onClick={() => setProjectTypeOpen(!projectTypeOpen)}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-black/10 rounded-xl focus:border-brand-mustard focus:outline-none transition-colors text-left flex items-center justify-between gap-2 text-sm sm:text-base"
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
                                className="w-full px-4 py-3 text-left text-base hover:bg-[#FAF9F6] transition-colors text-[#8B8B8B]"
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
                                  className={`w-full px-4 py-3 text-left text-base hover:bg-[#FAF9F6] transition-colors ${
                                    formData.projectType === key ? 'bg-[#FAF9F6] text-brand-mustard' : ''
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
                      <label className="block text-xs sm:text-sm tracking-wider mb-1.5 text-[#8B8B8B]">{String(t('modal.message'))} *</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={3}
                        className="w-full min-h-[5.5rem] px-4 py-3 bg-[#FAF9F6] border border-black/10 rounded-xl focus:border-brand-mustard focus:outline-none transition-colors resize-none text-base leading-snug"
                        placeholder={String(t('modal.messagePlaceholder'))}
                      />
                    </div>
                    {submitError ? (
                      <p className="text-sm text-red-600" role="alert">
                        {submitError}
                      </p>
                    ) : null}
                    <Button
                      type="submit"
                      variant="mustard"
                      size="cta"
                      disabled={isSubmitting}
                      className="w-full min-h-[3.25rem] text-base sm:text-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? '...' : String(t('modal.submit'))}
                      {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                    </Button>
                  </form>
                </div>
              </motion.div>
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
            <div className="bg-brand-mustard text-brand-mustard-foreground px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
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
