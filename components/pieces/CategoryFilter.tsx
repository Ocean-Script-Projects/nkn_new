'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export type Category = 'all' | 'belts' | 'corsets' | 'scarves' | 'dresses' | 'mini-series' | 'one-of-one';

interface CategoryFilterProps {
  categories: { id: Category; label: string }[];
  selectedCategory: Category;
  onSelect: (category: Category) => void;
  className?: string;
}

export default function CategoryFilter({ categories, selectedCategory, onSelect, className }: CategoryFilterProps) {
  return (
    <section
      className={cn(
        'border-y border-black/5 py-6 sm:py-12 px-4 sm:px-6 md:px-12',
        className
      )}
    >
      <div className="mx-auto max-w-7xl min-w-0 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn(
            'flex min-w-0 max-w-full items-stretch',
            'flex-nowrap gap-x-7 overflow-x-auto scrollbar-hide pb-1 [-webkit-overflow-scrolling:touch]',
            'snap-x snap-mandatory',
            'lg:flex-wrap lg:justify-center lg:gap-x-8 lg:gap-y-2 lg:overflow-visible lg:pb-0 lg:snap-none'
          )}
        >
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => onSelect(cat.id)}
              type="button"
              className={cn(
                'relative inline-flex shrink-0 snap-start items-center justify-center break-words text-center text-sm tracking-wider transition-colors',
                'min-h-[44px] px-3 py-2.5',
                'lg:min-h-0 lg:px-6 lg:py-3 lg:text-base',
                selectedCategory === cat.id ? 'text-[#C4A574]' : 'text-[#8B8B8B] hover:text-black'
              )}
            >
              {cat.label}
              {selectedCategory === cat.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C4A574]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
