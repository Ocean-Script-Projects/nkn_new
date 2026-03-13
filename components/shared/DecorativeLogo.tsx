'use client';

import { ImageWithFallback } from '@/components/image-with-fallback';

type LogoVariant = 'big' | 'short';
type Position =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'mid-left'
  | 'mid-right';

const positionClasses: Record<Position, string> = {
  'top-left': 'top-6 left-6 md:top-10 md:left-10',
  'top-right': 'top-6 right-6 md:top-10 md:right-10',
  'bottom-left': 'bottom-6 left-6 md:bottom-10 md:left-10',
  'bottom-right': 'bottom-6 right-6 md:bottom-10 md:right-10',
  'mid-left': 'top-1/2 left-4 md:left-8 -translate-y-1/2',
  'mid-right': 'top-1/2 right-4 md:right-8 -translate-y-1/2',
};

interface DecorativeLogoProps {
  variant: LogoVariant;
  position: Position;
  className?: string;
  /** для тёмного фона (контакт) — лого светлым */
  light?: boolean;
  /** ещё тише на фоне (внутренние страницы) */
  subtle?: boolean;
}

export default function DecorativeLogo({
  variant,
  position,
  className = '',
  light = false,
  subtle = false,
}: DecorativeLogoProps) {
  const src = variant === 'big' ? '/images/big_logo.png' : '/images/short_logo.png';
  const heightClass = variant === 'big' ? 'h-16 md:h-20 lg:h-24' : 'h-11 md:h-14 lg:h-16';
  const opacity = subtle
    ? 'opacity-[0.035] md:opacity-[0.05]'
    : 'opacity-[0.06] md:opacity-[0.08]';

  return (
    <div
      aria-hidden
      className={`absolute pointer-events-none select-none ${opacity} ${positionClasses[position]} ${className}`}
    >
      <div className={light ? 'invert opacity-90' : ''}>
        <ImageWithFallback
          src={src}
          alt=""
          className={`w-auto ${heightClass} object-contain object-center`}
        />
      </div>
    </div>
  );
}
