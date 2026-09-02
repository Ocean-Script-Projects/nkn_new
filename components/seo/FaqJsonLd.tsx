'use client';

export type FaqEntry = { question: string; answer: string };

/**
 * FAQPage structured data — the cheapest way to occupy extra vertical space in
 * the results page. Only emit it for questions that are actually visible on the
 * page, otherwise Google treats it as a structured-data violation.
 */
export default function FaqJsonLd({ items }: { items: FaqEntry[] }) {
  const usable = items.filter((it) => it.question?.trim() && it.answer?.trim());
  if (usable.length === 0) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: usable.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
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
