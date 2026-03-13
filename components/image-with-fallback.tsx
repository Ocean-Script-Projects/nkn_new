'use client';

import React, { useState, useEffect, useMemo } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

// Get basePath from Next.js config (matches next.config.ts)
// For static export, we detect basePath from the current URL pathname
const getBasePath = (): string => {
  if (typeof window === 'undefined') return '';
  
  // Check if we're on GitHub Pages by looking at the pathname
  const pathname = window.location.pathname;
  if (pathname.startsWith('/nkn_new')) {
    return '/nkn_new';
  }
  return '';
};

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
  const [basePath, setBasePath] = useState('');

  useEffect(() => {
    setBasePath(getBasePath());
  }, []);

  const { src, alt, style, className, fallbackSrc, ...rest } = props;
  const primarySrc = useMemo(() => addBasePath(src, basePath), [src, basePath]);
  const displaySrc = usingFallback && fallbackSrc ? fallbackSrc : primarySrc;

  const handleError = () => {
    if (fallbackSrc && !usingFallback) {
      setUsingFallback(true);
      return;
    }
    setDidError(true);
  };

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={String(primarySrc)} />
      </div>
    </div>
  ) : (
    <img
      key={usingFallback ? 'fb' : 'main'}
      src={displaySrc as string}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
}
