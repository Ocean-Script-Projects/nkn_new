import { createPageMetadataGenerator } from '@/lib/page-seo';

export const generateMetadata = createPageMetadataGenerator('bespoke');

export default function BespokeSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
