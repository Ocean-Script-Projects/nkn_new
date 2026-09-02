import {
  ADDRESS,
  AREA_SERVED,
  BRAND,
  CONTACT,
  GEO,
  LOGO,
  OG_IMAGE,
  OPENING_HOURS,
  SOCIAL,
} from '@/lib/site-config';
import { absolutePublicUrl, getPublicOrigin } from '@/lib/site-url';
import { locales, type Locale } from '@/lib/i18n-config';

/**
 * Site-wide structured data, rendered on every localized page.
 *
 * Uses a stable `@id` graph so every page reinforces the same three entities
 * (business, website, founder) instead of declaring competing copies. This is
 * what lets Google resolve the short brand token "NKN" to this site.
 */

const BUSINESS_DESCRIPTION: Record<Locale, string> = {
  de: 'NKN Atelier — Maßschneiderei und Design-Atelier von Nataliia Khreshkova für Hamburg und Umgebung: Maßanfertigung, Unikate, exklusive Stoffdrucke und Upcycling.',
  en: 'NKN Atelier — bespoke tailoring and design studio by Nataliia Khreshkova serving Hamburg and the surrounding region: made-to-measure garments, one-of-one pieces, author prints and upcycling.',
  ru: 'NKN Atelier — ателье индивидуального пошива Натальи Хрешковой для Гамбурга и окрестностей: пошив на заказ, изделия one-of-one, авторские принты и апсайклинг.',
};

const SERVICE_CATALOG: Record<Locale, { name: string; description: string; url: string }[]> = {
  de: [
    {
      name: 'Maßschneiderei in Hamburg',
      description:
        'Maßgeschneiderte Kleidung nach Ihren Maßen: Beratung, Schnittkonstruktion, Anproben und Fertigung im Atelier.',
      url: '/bespoke/',
    },
    {
      name: 'One-of-one Unikate',
      description:
        'Einzelstücke und limitierte Serien — Korsagen, Kleider, Schals und Gürtel mit individueller Anpassung.',
      url: '/pieces/',
    },
    {
      name: 'Upcycling und Umgestaltung',
      description:
        'Rekonstruktion vorhandener Kleidungsstücke: neue Silhouette, Umnähen und nachhaltige Verlängerung der Lebensdauer.',
      url: '/upcycling/',
    },
    {
      name: 'Exklusive Stoffdrucke und Stoffdesign',
      description:
        'Entwicklung exklusiver Stoffdrucke, abgestimmt auf die Konstruktion des Kleidungsstücks.',
      url: '/prints/',
    },
    {
      name: 'Markenkooperation und Schnittmusterbau',
      description:
        'Konstruktion, Schnittmuster, Größenraster und Musterteile für Designerinnen und junge Modemarken.',
      url: '/collaboration/',
    },
  ],
  en: [
    {
      name: 'Bespoke tailoring in Hamburg',
      description:
        'Made-to-measure garments: consultation, pattern construction, fittings and in-house production.',
      url: '/bespoke/',
    },
    {
      name: 'One-of-one pieces',
      description:
        'Single copies and limited runs — corsets, dresses, scarves and belts with individual adaptation.',
      url: '/pieces/',
    },
    {
      name: 'Upcycling and transformation',
      description:
        'Reconstruction of existing garments: new silhouette, recutting and a sustainable second life.',
      url: '/upcycling/',
    },
    {
      name: 'Author prints for fabrics',
      description:
        'Development of exclusive fabric prints aligned with the construction of the garment.',
      url: '/prints/',
    },
    {
      name: 'Brand collaboration and pattern making',
      description:
        'Construction, patterns, size ranges and samples for designers and emerging fashion brands.',
      url: '/collaboration/',
    },
  ],
  ru: [
    {
      name: 'Индивидуальный пошив одежды в Гамбурге',
      description:
        'Пошив по вашим меркам: консультация, построение лекал, примерки и производство в ателье.',
      url: '/bespoke/',
    },
    {
      name: 'Изделия one-of-one',
      description:
        'Единственные экземпляры и ограниченные серии — корсеты, платья, шарфы и пояса с индивидуальной адаптацией.',
      url: '/pieces/',
    },
    {
      name: 'Апсайклинг и трансформация',
      description:
        'Реконструкция вещей из вашего гардероба: новая форма, перекрой и вторая жизнь одежды.',
      url: '/upcycling/',
    },
    {
      name: 'Авторские принты для тканей',
      description:
        'Разработка эксклюзивных принтов в связке с конструкцией изделия.',
      url: '/prints/',
    },
    {
      name: 'Сопровождение брендов и лекала',
      description:
        'Конструкция, лекала, размерная сетка и образцы для дизайнеров и молодых марок.',
      url: '/collaboration/',
    },
  ],
};

const FOUNDER_JOB_TITLE: Record<Locale, string> = {
  de: 'Modedesignerin und Schnittmacherin',
  en: 'Fashion designer and pattern maker',
  ru: 'Дизайнер одежды и конструктор',
};

const LANGUAGE_TAGS: Record<Locale, string> = {
  de: 'de-DE',
  en: 'en-US',
  ru: 'ru-RU',
};

export default function SiteJsonLd({ locale }: { locale: Locale }) {
  const origin = getPublicOrigin();
  const businessId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const founderId = `${origin}/#nataliia-khreshkova`;

  const graph = [
    {
      // Both types are LocalBusiness subtypes: a service provider that also sells finished pieces.
      '@type': ['ProfessionalService', 'ClothingStore'],
      '@id': businessId,
      name: BRAND.name,
      legalName: BRAND.legalName,
      alternateName: [...BRAND.alternateNames],
      description: BUSINESS_DESCRIPTION[locale],
      url: absolutePublicUrl(`/${locale}/`),
      logo: {
        '@type': 'ImageObject',
        url: `${origin}${LOGO.path}`,
        width: LOGO.width,
        height: LOGO.height,
      },
      image: `${origin}${OG_IMAGE.path}`,
      telephone: CONTACT.phone,
      email: CONTACT.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: ADDRESS.street,
        postalCode: ADDRESS.postalCode,
        addressLocality: ADDRESS.city,
        addressRegion: ADDRESS.region,
        addressCountry: ADDRESS.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: GEO.latitude,
        longitude: GEO.longitude,
      },
      areaServed: AREA_SERVED.map((name) => ({ '@type': 'City', name })),
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: GEO.latitude,
          longitude: GEO.longitude,
        },
        geoRadius: GEO.serviceRadius,
      },
      openingHoursSpecification: OPENING_HOURS.map((slot) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...slot.days],
        opens: slot.opens,
        closes: slot.closes,
      })),
      priceRange: '€€€',
      currenciesAccepted: 'EUR',
      knowsLanguage: [...locales],
      founder: { '@id': founderId },
      employee: { '@id': founderId },
      sameAs: [...SOCIAL],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: BRAND.name,
        itemListElement: SERVICE_CATALOG[locale].map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description,
            url: absolutePublicUrl(`/${locale}${service.url}`),
            provider: { '@id': businessId },
            areaServed: AREA_SERVED.map((name) => ({ '@type': 'City', name })),
          },
        })),
      },
    },
    {
      '@type': 'Person',
      '@id': founderId,
      name: BRAND.founder,
      alternateName: [BRAND.founderRu, 'Nataliia Khreshkova', 'Natalina'],
      jobTitle: FOUNDER_JOB_TITLE[locale],
      description: BUSINESS_DESCRIPTION[locale],
      image: `${origin}${OG_IMAGE.path}`,
      url: absolutePublicUrl(`/${locale}/about/`),
      worksFor: { '@id': businessId },
      knowsLanguage: [...locales],
      sameAs: [...SOCIAL],
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${origin}/`,
      name: BRAND.name,
      alternateName: [...BRAND.alternateNames],
      description: BUSINESS_DESCRIPTION[locale],
      inLanguage: LANGUAGE_TAGS[locale],
      publisher: { '@id': businessId },
    },
  ];

  return (
    <script
      type="application/ld+json"
      // JSON-LD must be embedded as a raw JSON string.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
