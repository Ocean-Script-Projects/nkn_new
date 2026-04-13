import { createPageMetadataGenerator } from '@/lib/page-seo';

export const generateMetadata = createPageMetadataGenerator('about');

export default function AboutSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
