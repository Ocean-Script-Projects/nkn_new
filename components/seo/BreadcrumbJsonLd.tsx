type BreadcrumbItem = {
  name: string;
  item: string;
};

export default function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD must be embedded as a raw JSON string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

