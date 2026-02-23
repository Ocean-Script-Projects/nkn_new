'use client';

import { RequestModalProvider } from '@/lib/request-modal-context';

export default function RequestModalProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequestModalProvider>{children}</RequestModalProvider>;
}
