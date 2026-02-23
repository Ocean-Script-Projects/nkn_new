'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ContactRequestModal from '@/components/shared/ContactRequestModal';
import type { RequestModalContext } from '@/lib/request-types';

export type { RequestModalContext };

const RequestModalContext = createContext<{
  openRequestModal: (context?: RequestModalContext) => void;
  closeRequestModal: () => void;
} | null>(null);

export function RequestModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<RequestModalContext | undefined>();

  const openRequestModal = useCallback((ctx?: RequestModalContext) => {
    setContext(ctx);
    setIsOpen(true);
  }, []);

  const closeRequestModal = useCallback(() => {
    setIsOpen(false);
    setContext(undefined);
  }, []);

  return (
    <RequestModalContext.Provider value={{ openRequestModal, closeRequestModal }}>
      {children}
      <ContactRequestModal
        isOpen={isOpen}
        onClose={closeRequestModal}
        context={context}
      />
    </RequestModalContext.Provider>
  );
}

export function useRequestModal() {
  const ctx = useContext(RequestModalContext);
  if (!ctx) throw new Error('useRequestModal must be used within RequestModalProvider');
  return ctx;
}
