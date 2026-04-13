'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
  label: string;
  title: string;
}

export default function FAQAccordion({ faqs, label, title }: FAQAccordionProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-brand-sage" />
            <span className="text-brand-sage text-xs sm:text-sm tracking-[0.4em] uppercase">{label}</span>
            <div className="h-px w-8 bg-brand-sage" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight" style={{ fontFamily: 'serif' }}>
            {title}
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="border border-black/5 rounded-2xl overflow-hidden bg-[#FAF9F6]"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between gap-4 hover:bg-white/50 transition-colors"
              >
                <span className="text-base sm:text-lg tracking-wide">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-brand-sage flex-shrink-0" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-8 pb-5 sm:pb-6 pt-2">
                      <p className="text-sm sm:text-base text-[#8B8B8B] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
