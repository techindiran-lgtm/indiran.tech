import type { ServiceType } from './types';

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
export const slugToServiceType: Record<ServiceSlug, ServiceType> = {
  'document-registration': 'document_registration',
  'marriage-registration': 'marriage_registration',
  'encumbrance-certificate': 'ec_request',
  'document-copy': 'document_copy',
  'birth-death-certificate': 'birth_death_certificate',
  'patta-chitta': 'patta_chitta',
};

export const serviceTypeToSlug: Record<ServiceType, ServiceSlug> = {
  document_registration: 'document-registration',
  marriage_registration: 'marriage-registration',
  ec_request: 'encumbrance-certificate',
  document_copy: 'document-copy',
  birth_death_certificate: 'birth-death-certificate',
  patta_chitta: 'patta-chitta',
};

/** Returns the canonical public slug for a service URL, including legacy underscore URLs. */
export function normalizeServiceSlug(slug: string): ServiceSlug | null {
  const hyphenatedSlug = slug.replace(/_/g, '-');

  if (SERVICE_SLUGS.includes(hyphenatedSlug as ServiceSlug)) {
    return hyphenatedSlug as ServiceSlug;
  }

  // Supports the internal EC identifier too, whose public URL has a descriptive name.
  return serviceTypeToSlug[slug as ServiceType] ?? null;
}

// Public routes for SEO injection (excludes admin and 404)
export const PUBLIC_ROUTES = [
  '/',
  '/services',
  ...SERVICE_SLUGS.map(slug => `/services/${slug}`),
  '/about',
  '/contact',
  '/appointment',
] as const;
