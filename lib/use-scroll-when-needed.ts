'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollWhenNeeded(isOpen: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const el = ref.current;
    const check = () => {
      setNeedsScroll(el.scrollHeight > el.clientHeight);
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  return { ref, needsScroll };
}
