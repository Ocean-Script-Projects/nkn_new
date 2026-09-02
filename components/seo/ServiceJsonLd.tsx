'use client';

import { AREA_SERVED } from '@/lib/site-config';
import { getPublicOrigin } from '@/lib/site-url';

/**
 * Per-page Service node.
 *
 * Deliberately does NOT redeclare the business: it points at the single
 * `#organization` entity from SiteJsonLd via `@id`. Repeating the business on
 * every page with a different `@id` would split the entity Google builds for
 * the brand across several competing copies.
 */
export default function ServiceJsonLd({
  name,
  description,
  url,
  serviceType,
}: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}) {
  const origin = getPublicOrigin();

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    serviceType,
    provider: { '@id': `${origin}/#organization` },
    areaServed: AREA_SERVED.map((city) => ({ '@type': 'City', name: city })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
      availableLanguage: ['de', 'en', 'ru'],
    },
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD must be embedded as a raw JSON string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
