'use client';

import React, { useState, useMemo } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

/** Синхронно с `next.config.ts` / `NEXT_PUBLIC_BASE_PATH` (не только по pathname — иначе ломаются `/images/*` при basePath). */
const getConfiguredBasePath = (): string =>
  String(process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

// Helper function to add basePath to absolute paths
const addBasePath = (src: string | Blob | undefined, basePath: string): string | Blob | undefined => {
  if (!src || typeof src !== 'string') return src;
  // Only add basePath to absolute paths starting with /
  if (src.startsWith('/') && !src.startsWith('//') && !src.startsWith('http')) {
    return basePath + src;
  }
  return src;
};

type ImageWithFallbackProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** If primary src fails, load this URL once before showing placeholder */
  fallbackSrc?: string;
};

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const configuredBasePath = useMemo(() => getConfiguredBasePath(), []);

  const { src, alt, style, className, fallbackSrc, ...rest } = props;
  const primarySrc = useMemo(
    () => addBasePath(src, configuredBasePath),
    [src, configuredBasePath]
  );
  const displaySrc = usingFallback && fallbackSrc ? fallbackSrc : primarySrc;
  const safeSrc =
    typeof displaySrc === 'string' && displaySrc.trim().length > 0 ? displaySrc.trim() : null;

  const handleError = () => {
    if (fallbackSrc && !usingFallback) {
      setUsingFallback(true);
      return;
    }
    setDidError(true);
  };

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={String(primarySrc)} />
        </div>
      </div>
    );
  }

  if (!safeSrc) {
    const label = typeof alt === 'string' && alt.length > 0 ? alt : undefined;
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
        role={label ? 'img' : undefined}
        aria-label={label}
      >
        <div className="flex min-h-[3rem] w-full items-center justify-center" />
      </div>
    );
  }

  return (
    <img
      key={usingFallback ? 'fb' : 'main'}
      src={safeSrc}
      alt={alt ?? ''}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
}
