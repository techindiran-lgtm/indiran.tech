import { Helmet } from 'react-helmet-async';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

// LocalBusiness Schema
export function LocalBusinessJsonLd({ settings }: { settings: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: settings?.business_name || 'IDIRAN TECH',
    alternateName: settings?.tamil_name || 'IDIRAN TECH பத்திரம் எழுதும் அலுவலகம்',
    description: settings?.about || 'Document registration office in Gangaikondan, Tamil Nadu',
    url: 'https://indiran-tech.vercel.app',
    telephone: settings?.phone,
    email: settings?.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address,
      addressLocality: 'Gangaikondan',
      addressRegion: 'Tamil Nadu',
      postalCode: '627352',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 8.7,
      longitude: 77.5
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      opens: '09:00',
      closes: '18:00'
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Gangaikondan'
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Tirunelveli District'
      }
    ],
    image: 'https://indiran-tech.vercel.app/icon.png',
    priceRange: '$$'
  };

  return <JsonLd data={schema} />;
}

// Service Schema
export function ServiceJsonLd({ serviceName, description }: { serviceName: string; description: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    provider: {
      '@type': 'ProfessionalService',
      name: 'IDIRAN TECH',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Gangaikondan',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN'
      }
    },
    areaServed: {
      '@type': 'City',
      name: 'Gangaikondan'
    }
  };

  return <JsonLd data={schema} />;
}

// FAQ Schema
export function FAQJsonLd({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return <JsonLd data={schema} />;
}

// Breadcrumb Schema
export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return <JsonLd data={schema} />;
}
