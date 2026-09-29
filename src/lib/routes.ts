// Shared service slugs - used by router, SEO injection, sitemap, and JSON-LD
export const SERVICE_SLUGS = [
  'document-registration',
  'marriage-registration',
  'encumbrance-certificate',
  'document-copy',
  'birth-death-certificate',
  'patta-chitta',
] as const;

export type ServiceSlug = typeof SERVICE_SLUGS[number];

// Service slug to internal type mapping
export const slugToServiceType: Record<ServiceSlug, string> = {
  'document-registration': 'document_registration',
  'marriage-registration': 'marriage_registration',
  'encumbrance-certificate': 'ec_request',
  'document-copy': 'document_copy',
  'birth-death-certificate': 'birth_death_certificate',
  'patta-chitta': 'patta_chitta',
};

// Public routes for SEO injection (excludes admin and 404)
export const PUBLIC_ROUTES = [
  '/',
  '/services',
  ...SERVICE_SLUGS.map(slug => `/services/${slug}`),
  '/about',
  '/contact',
  '/appointment',
] as const;
