import { createPageMetadataGenerator } from '@/lib/page-seo';

export const generateMetadata = createPageMetadataGenerator('impressum');

export default function ImpressumSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

