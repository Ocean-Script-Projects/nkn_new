'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mustard/35 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        /** Mustard fill — основной CTA на тёмном фоне */
        mustard:
          'rounded-full bg-brand-mustard text-brand-mustard-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-mustard-hover hover:shadow-xl hover:shadow-black/15 active:translate-y-0 active:shadow-md',
        /** Чёрная капсула → горчица при hover (шапка, «смотреть все») */
        dark:
          'rounded-full bg-black text-white shadow-md hover:bg-brand-mustard hover:text-brand-mustard-foreground',
        /** Компактная чёрная кнопка в навигации */
        darkNav:
          'rounded-full bg-black px-5 py-2.5 text-[12px] font-semibold uppercase tracking-widest text-white shadow-sm sm:px-6 sm:text-[13px] hover:bg-brand-mustard hover:text-brand-mustard-foreground',
        /** Белая кнопка поверх карточки товара */
        cardOverlay:
          'rounded-full bg-white px-6 py-3 text-sm text-black shadow-sm hover:bg-neutral-100 sm:text-base',
        /** Контур / вторичная */
        outline:
          'rounded-full border border-neutral-900/15 bg-white/90 text-neutral-800 shadow-sm backdrop-blur-sm hover:border-brand-mustard/45 hover:bg-white hover:shadow-md',
      },
      size: {
        default: 'px-8 py-4 text-sm sm:text-base tracking-wider',
        sm: 'px-5 py-2.5 text-xs tracking-wide',
        lg: 'px-8 py-4 text-sm tracking-wider sm:px-10 sm:py-5 sm:text-base',
        cta: 'px-10 py-5 text-base tracking-wider sm:px-12 sm:py-6 sm:text-lg',
        /** без отступов — только вариант задаёт padding (cardOverlay) */
        plain: '',
      },
    },
    compoundVariants: [
      {
        variant: 'mustard',
        size: 'cta',
        class: 'shadow-xl hover:shadow-2xl hover:shadow-black/20',
      },
    ],
    defaultVariants: {
      variant: 'mustard',
      size: 'default',
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
