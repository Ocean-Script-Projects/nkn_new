import { createPageMetadataGenerator } from '@/lib/page-seo';

export const generateMetadata = createPageMetadataGenerator('agb');

export default function AgbSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
