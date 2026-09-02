'use client';

import Breadcrumbs from '@/components/shared/Breadcrumbs';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { useLocale, useTranslations } from '@/lib/i18n';
import { absolutePublicUrl } from '@/lib/site-url';

/**
 * Visible breadcrumbs plus their structured data, kept in one place so the two
 * can never drift apart — Google drops the breadcrumb rich result when the
 * markup describes a trail the page does not actually show.
 */
export default function PageBreadcrumbs({
  segment,
  navKey,
}: {
  /** URL segment, e.g. "pieces". */
  segment: string;
  /** Key in the `nav` message namespace used as the label. */
  navKey: string;
}) {
  const locale = useLocale();
  const navT = useTranslations('nav');

  const home = String(navT('home'));
  const label = String(navT(navKey));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: home, item: absolutePublicUrl(`/${locale}/`) },
          { name: label, item: absolutePublicUrl(`/${locale}/${segment}/`) },
        ]}
      />
      <Breadcrumbs
        items={[
          { href: `/${locale}/`, label: home },
          { href: `/${locale}/${segment}/`, label },
        ]}
      />
    </>
  );
}
