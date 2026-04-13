import { createPageMetadataGenerator } from '@/lib/page-seo';

export const generateMetadata = createPageMetadataGenerator('prints');

export default function PrintsSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
