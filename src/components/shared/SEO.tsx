import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  lang?: string;
}

export function SEO({ 
  title = 'Document Writer & Registration Services in Tamil Nadu | IDIRAN TECH',
  description = 'IDIRAN TECH provides document writing, property registration assistance, marriage registration, Encumbrance Certificate, document copies, birth and death certificate assistance, and Patta Chitta services in Tamil Nadu.',
  canonical = 'https://indiran-tech.vercel.app',
  ogImage = '/icon.png',
  noindex = false,
  lang = 'en'
}: SEOProps) {
  const googleAnalyticsId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const gscVerification = import.meta.env.VITE_GSC_VERIFICATION;
  const shouldLoadGA = typeof window !== 'undefined' && googleAnalyticsId;

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      meta={[
        {
          name: 'description',
          content: description,
        },
        {
          name: 'keywords',
          content: 'document writer in Tamil Nadu, document writer in Tirunelveli, document registration, property registration, encumbrance certificate, marriage registration, certified document copies, birth certificate, death certificate, Patta Chitta, Gangaikondan',
        },
        {
          name: 'robots',
          content: noindex ? 'noindex, nofollow' : 'index, follow',
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:url',
          content: canonical,
        },
        {
          property: 'og:image',
          content: ogImage,
        },
        {
          property: 'og:site_name',
          content: 'IDIRAN TECH',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: description,
        },
        {
          name: 'twitter:image',
          content: ogImage,
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'theme-color',
          content: '#3b76f6',
        },
        ...(gscVerification ? [{
          name: 'google-site-verification',
          content: gscVerification,
        }] : []),
      ]}
      link={[
        {
          rel: 'canonical',
          href: canonical,
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/icon.png',
        },
      ]}
      script={[
        ...(shouldLoadGA ? [{
          src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
          async: 'async',
        }] : []),
        ...(shouldLoadGA ? [{
          type: 'text/javascript',
          innerHTML: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${googleAnalyticsId}');`,
        }] : []),
      ]}
    />
  );
}

// Analytics tracking functions
export function trackEvent(eventName: string, eventParams?: Record<string, string | number>) {
  const googleAnalyticsId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (googleAnalyticsId && typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
}

// Guard GA script loading for SSR
export function shouldLoadGA() {
  return typeof window !== 'undefined' && import.meta.env.VITE_GA_MEASUREMENT_ID;
}

export function trackCallClick(phone: string) {
  trackEvent('call_click', { phone });
}

export function trackWhatsAppClick(phone: string) {
  trackEvent('whatsapp_click', { phone });
}

export function trackFormStart(serviceType: string) {
  trackEvent('form_start', { service_type: serviceType });
}

export function trackFormSubmit(serviceType: string) {
  trackEvent('form_submit', { service_type: serviceType });
}

export function trackAppointmentBooked() {
  trackEvent('appointment_booked');
}
