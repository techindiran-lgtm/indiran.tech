/**
 * SEO Meta Tag Injection Script
 * 
 * This script runs after `vite build` to inject route-specific SEO meta tags
 * into static HTML files for each public route. This provides proper SEO without
 * requiring full SSR/prerendering.
 * 
 * NOTE: This is an interim solution. True prerendering (visible content in initial HTML)
 * can be revisited later via React Router v7's built-in SSG or a move to Astro for the
 * public pages, once there's bandwidth for that migration.
 */

const fs = require('fs');
const path = require('path');

// Import shared routes configuration (JavaScript version for Node.js)
const { PUBLIC_ROUTES, SERVICE_SLUGS } = require('./routes-data.cjs');

const DIST_DIR = path.join(__dirname, '../dist');
const SOURCE_HTML = path.join(DIST_DIR, 'index.html');
const BASE_URL = 'https://indiran-tech.vercel.app';

// SEO data for each route
const getSEOData = (route) => {
  const serviceNames = {
    'document-registration': 'Document Registration',
    'marriage-registration': 'Marriage Registration',
    'encumbrance-certificate': 'Encumbrance Certificate (EC)',
    'document-copy': 'Document Copy',
    'birth-death-certificate': 'Birth/Death Certificate',
    'patta-chitta': 'Patta/Chitta'
  };

  switch (route) {
    case '/':
      return {
        title: 'Document Registration & EC Services in Gangaikondan | IDIRAN TECH',
        description: 'IDIRAN TECH பத்திரம் எழுதும் அலுவலகம் - Document Registration, Marriage Registration, Encumbrance Certificate (EC), Document Copy, Birth/Death Certificate, Patta/Chitta services in Gangaikondan, Tamil Nadu.',
        canonical: BASE_URL,
        ogImage: `${BASE_URL}/icon.png`,
        lang: 'en',
      };
    case '/services':
      return {
        title: 'Document Services in Gangaikondan | IDIRAN TECH',
        description: 'Complete document services: Registration, Marriage Registration, EC, Document Copy, Birth/Death Certificate, Patta/Chitta in Gangaikondan, Tamil Nadu.',
        canonical: `${BASE_URL}/services`,
        ogImage: `${BASE_URL}/icon.png`,
        lang: 'en',
      };
    case '/about':
      return {
        title: 'About IDIRAN TECH | Document Office Gangaikondan',
        description: 'Learn about IDIRAN TECH, your trusted document registration office in Gangaikondan, Tamil Nadu. Professional services with years of experience.',
        canonical: `${BASE_URL}/about`,
        ogImage: `${BASE_URL}/icon.png`,
        lang: 'en',
      };
    case '/contact':
      return {
        title: 'Contact IDIRAN TECH | Document Office Gangaikondan',
        description: 'Contact IDIRAN TECH document office in Gangaikondan for document registration, EC, certificates. Phone, WhatsApp, address, and office hours.',
        canonical: `${BASE_URL}/contact`,
        ogImage: `${BASE_URL}/icon.png`,
        lang: 'en',
      };
    case '/appointment':
      return {
        title: 'Book Appointment | IDIRAN TECH Document Office',
        description: 'Schedule an appointment with IDIRAN TECH document office in Gangaikondan. Quick booking for document registration, EC, and other services.',
        canonical: `${BASE_URL}/appointment`,
        ogImage: `${BASE_URL}/icon.png`,
        lang: 'en',
      };
    default:
      // Service routes
      if (route.startsWith('/services/')) {
        const slug = route.replace('/services/', '');
        const serviceName = serviceNames[slug] || 'Document Service';
        return {
          title: `${serviceName} in Gangaikondan | IDIRAN TECH`,
          description: `Professional ${serviceName} services in Gangaikondan, Tamil Nadu. IDIRAN TECH provides expert assistance with ${serviceName}.`,
          canonical: `${BASE_URL}/services/${slug}`,
          ogImage: `${BASE_URL}/icon.png`,
          lang: 'en',
        };
      }
      return {
        title: 'Document Registration & EC Services in Gangaikondan | IDIRAN TECH',
        description: 'IDIRAN TECH பத்திரம் எழுதும் அலுவலகம் - Document Registration, Marriage Registration, Encumbrance Certificate (EC), Document Copy, Birth/Death Certificate, Patta/Chitta services in Gangaikondan, Tamil Nadu.',
        canonical: BASE_URL,
        ogImage: `${BASE_URL}/icon.png`,
        lang: 'en',
      };
  }
};

// Generate JSON-LD for LocalBusiness
const getLocalBusinessJsonLd = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'IDIRAN TECH',
    alternateName: 'IDIRAN TECH பத்திரம் எழுதும் அலுவலகம்',
    description: 'Document Registration Office in Gangaikondan, Tamil Nadu',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gangaikondan',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
      postalCode: '627352',
      streetAddress: 'கங்கைகொண்டான் சார்பதிவாளர் அலுவலகம் நேரில், திருநெல்வேலி - 627352',
    },
    areaServed: ['Gangaikondan', 'Tirunelveli district', 'Tamil Nadu'],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    url: BASE_URL,
    image: `${BASE_URL}/icon.png`,
    inLanguage: 'en-IN',
  };
};

// Generate JSON-LD for specific route
const getRouteJsonLd = (route) => {
  const jsonLd = [getLocalBusinessJsonLd()];
  
  // Add breadcrumb JSON-LD for non-home routes
  if (route !== '/') {
    const breadcrumbs = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    ];
    
    if (route.startsWith('/services/')) {
      breadcrumbs.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${BASE_URL}/services`,
      });
      const slug = route.replace('/services/', '');
      const serviceNames = {
        'document-registration': 'Document Registration',
        'marriage-registration': 'Marriage Registration',
        'encumbrance-certificate': 'Encumbrance Certificate (EC)',
        'document-copy': 'Document Copy',
        'birth-death-certificate': 'Birth/Death Certificate',
        'patta-chitta': 'Patta/Chitta'
      };
      breadcrumbs.push({
        '@type': 'ListItem',
        position: 3,
        name: serviceNames[slug] || 'Service',
        item: `${BASE_URL}/services/${slug}`,
      });
    } else {
      const routeNames = {
        '/services': 'Services',
        '/about': 'About',
        '/contact': 'Contact',
        '/appointment': 'Appointment',
      };
      breadcrumbs.push({
        '@type': 'ListItem',
        position: 2,
        name: routeNames[route] || route,
        item: `${BASE_URL}${route}`,
      });
    }
    
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs,
    });
  }
  
  return jsonLd;
};

// Generate head HTML with SEO tags
const generateHeadHTML = (seoData, route) => {
  const jsonLd = getRouteJsonLd(route);
  
  return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <title>${seoData.title}</title>
    <meta name="description" content="${seoData.description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${seoData.canonical}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${seoData.title}" />
    <meta property="og:description" content="${seoData.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${seoData.canonical}" />
    <meta property="og:image" content="${seoData.ogImage}" />
    <meta property="og:site_name" content="IDIRAN TECH" />
    <meta property="og:locale" content="en_IN" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seoData.title}" />
    <meta name="twitter:description" content="${seoData.description}" />
    <meta name="twitter:image" content="${seoData.ogImage}" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/icon.png" />
    
    <!-- JSON-LD -->
    ${jsonLd.map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join('\n    ')}
  `;
};

// Main injection function
const injectMetaTags = () => {
  console.log('🔧 Starting SEO meta tag injection...');
  
  // Read source HTML
  if (!fs.existsSync(SOURCE_HTML)) {
    console.error('❌ Source HTML not found. Run `npm run build` first.');
    process.exit(1);
  }
  
  const sourceHTML = fs.readFileSync(SOURCE_HTML, 'utf-8');
  console.log(`✅ Read source HTML from ${SOURCE_HTML}`);
  
  // Process each public route
  PUBLIC_ROUTES.forEach(route => {
    console.log(`\n📄 Processing route: ${route}`);
    
    // Determine output path
    let outputPath;
    if (route === '/') {
      outputPath = path.join(DIST_DIR, 'index.html');
    } else {
      outputPath = path.join(DIST_DIR, route.replace(/^\//, ''), 'index.html');
    }
    
    // Create directory if needed
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`  📁 Created directory: ${outputDir}`);
    }
    
    // Get SEO data for this route
    const seoData = getSEOData(route);
    console.log(`  🏷️  Title: ${seoData.title}`);
    
    // Replace head content
    const headHTML = generateHeadHTML(seoData, route);
    const modifiedHTML = sourceHTML.replace(
      /<head>[\s\S]*?<\/head>/,
      '<head>' + headHTML + '\n  </head>'
    );
    
    // Write modified HTML
    fs.writeFileSync(outputPath, modifiedHTML);
    console.log(`  ✅ Generated: ${outputPath}`);
  });
  
  console.log('\n✨ SEO meta tag injection complete!');
  console.log(`📊 Processed ${PUBLIC_ROUTES.length} routes`);
  console.log('⚠️  Note: Admin routes excluded (noindex, not in PUBLIC_ROUTES)');
};

// Run the injection
injectMetaTags();
