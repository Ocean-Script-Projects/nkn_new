/**
 * Single source of truth for business identity (NAP), social profiles and brand names.
 *
 * Local SEO depends on Name/Address/Phone being byte-identical everywhere Google sees them:
 * this file, the Impressum page, Google Business Profile and every directory listing.
 * Never hardcode these values elsewhere — import from here.
 */

export const BRAND = {
  /** Short brand token users search for. */
  short: 'NKN',
  /** Primary public name used in titles and schema. */
  name: 'NKN Atelier',
  /** Legal name from the Impressum. */
  legalName: 'NKN Nataliia Khreshkova, NaKNem',
  /** Owner / designer. */
  founder: 'Nataliia Khreshkova',
  founderRu: 'Наталья Хрешкова',
  /** Alternate spellings people type when looking for the brand. */
  alternateNames: [
    'NKN',
    'NKN Atelier',
    'NKN Nataliia Khreshkova',
    'NaKNem',
    'Ателье NKN',
    'НКН Ателье',
  ],
} as const;

export const CONTACT = {
  phone: '+491774019818',
  phoneDisplay: '+49 177 4019818',
  whatsapp: '+380930385434',
  email: 'khreshkovanataliia@gmail.com',
  telegram: 'https://t.me/NataliiaKhreshkova',
} as const;

export const ADDRESS = {
  street: 'Flottmoorring 3',
  postalCode: '24568',
  city: 'Kaltenkirchen',
  region: 'Schleswig-Holstein',
  country: 'DE',
} as const;

/** Geo coordinates of Kaltenkirchen — helps Google associate the atelier with the Hamburg metro area. */
export const GEO = {
  latitude: 53.8339,
  longitude: 9.9599,
  /** Radius covering the Hamburg metropolitan region, in metres. */
  serviceRadius: 60000,
} as const;

/** `sameAs` profiles. Consistency here is what links the site to the brand's social identity. */
export const SOCIAL = [
  'https://www.instagram.com/nataliia_khreshkova_natalina/',
  'https://www.facebook.com/profile.php?id=100041099863380',
  'https://www.tiktok.com/@nataliia.khreshkov',
  'https://t.me/NataliiaKhreshkova',
] as const;

/** Cities and regions the atelier actively serves — drives "near me" and city-qualified queries. */
export const AREA_SERVED = [
  'Hamburg',
  'Kaltenkirchen',
  'Norderstedt',
  'Bad Segeberg',
  'Neumünster',
  'Quickborn',
  'Elmshorn',
  'Pinneberg',
  'Schleswig-Holstein',
] as const;

/** Default social sharing image (1600×1067 JPEG). */
export const OG_IMAGE = {
  path: '/images/hero.jpg',
  width: 1600,
  height: 1067,
} as const;

export const LOGO = {
  path: '/images/big_logo.png',
  width: 1878,
  height: 772,
} as const;

/** Opening hours in schema.org format — by appointment, so a generous window. */
export const OPENING_HOURS = [
  {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '10:00',
    closes: '19:00',
  },
  {
    days: ['Saturday'],
    opens: '11:00',
    closes: '17:00',
  },
] as const;
