// Shared routes data for SEO injection script
// This mirrors src/lib/routes.ts but in JavaScript for Node.js compatibility

const SERVICE_SLUGS = [
  'document-registration',
  'marriage-registration',
  'encumbrance-certificate',
  'document-copy',
  'birth-death-certificate',
  'patta-chitta',
];

const PUBLIC_ROUTES = [
  '/',
  '/services',
  ...SERVICE_SLUGS.map(slug => `/services/${slug}`),
  '/about',
  '/contact',
  '/appointment',
];

module.exports = { SERVICE_SLUGS, PUBLIC_ROUTES };
