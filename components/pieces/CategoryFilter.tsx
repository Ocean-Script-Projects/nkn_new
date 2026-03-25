'use client';

import { motion } from 'motion/react';

export type Category = 'all' | 'belts' | 'corsets' | 'scarves' | 'dresses' | 'mini-series' | 'one-of-one';

interface CategoryFilterProps {
  categories: { id: Category; label: string }[];
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 border-y border-black/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6"
        >
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => onSelect(cat.id)}
              className={`relative px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base tracking-wider transition-colors ${
                selectedCategory === cat.id
                  ? 'text-brand-mustard'
                  : 'text-[#8B8B8B] hover:text-black'
              }`}
            >
              {cat.label}
              {selectedCategory === cat.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-mustard"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
