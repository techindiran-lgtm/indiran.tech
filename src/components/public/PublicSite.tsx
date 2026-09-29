import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Hero } from '@/components/public/Hero';
import { ServicesSection } from '@/components/public/ServicesSection';
import { AboutSection } from '@/components/public/AboutSection';
import { ContactSection } from '@/components/public/ContactSection';
import { ServiceForm } from '@/components/public/ServiceForm';
import { AppointmentForm } from '@/components/public/AppointmentForm';
import { MobileStickyBar } from '@/components/public/MobileStickyBar';
import { SEO } from '@/components/shared/SEO';
import { supabase } from '@/lib/supabase';
import type { Settings as SettingsType, ServiceType } from '@/lib/types';
import { slugToServiceType, serviceTypeToSlug, type ServiceSlug } from '@/lib/routes';

export function PublicSite() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [settings, setSettings] = useState<SettingsType | null>(null);

  useEffect(() => {
    // Guard for browser-only code
    if (typeof window === 'undefined') return;
    
    supabase.from('settings').select('*').maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  // Determine current page from URL
  const getPageFromPath = (pathname: string): string => {
    if (pathname === '/') return 'home';
    if (pathname === '/services') return 'services';
    if (pathname.startsWith('/services/')) return 'service';
    if (pathname === '/about') return 'about';
    if (pathname === '/contact') return 'contact';
    if (pathname === '/appointment') return 'appointment';
    return 'home';
  };

  const page = getPageFromPath(location.pathname);
  const activeService = page === 'service' && params.slug
    ? slugToServiceType[params.slug as ServiceSlug]
    : null;

  const handleNavigate = (target: string, serviceKey?: string) => {
    if (target === 'admin') {
      navigate('/admin');
      return;
    }
    if (target === 'service' && serviceKey) {
      const serviceSlug = serviceTypeToSlug[serviceKey as ServiceType];
      navigate(`/services/${serviceSlug ?? serviceKey}`);
      window.scrollTo(0, 0);
      return;
    }
    navigate(`/${target === 'home' ? '' : target}`);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    navigate('/services');
    window.scrollTo(0, 0);
  };

  // Get page-specific SEO data
  const getSEOData = () => {
    const baseUrl = 'https://indiran-tech.vercel.app';
    switch (page) {
      case 'services':
        return {
          title: 'Document Services in Gangaikondan | IDIRAN TECH',
          description: 'Complete document services: Registration, Marriage Registration, EC, Document Copy, Birth/Death Certificate, Patta/Chitta in Gangaikondan, Tamil Nadu.',
          canonical: `${baseUrl}/services`
        };
      case 'about':
        return {
          title: 'About IDIRAN TECH | Document Office Gangaikondan',
          description: 'Learn about IDIRAN TECH, your trusted document registration office in Gangaikondan, Tamil Nadu. Professional services with years of experience.',
          canonical: `${baseUrl}/about`
        };
      case 'contact':
        return {
          title: 'Contact IDIRAN TECH | Document Office Gangaikondan',
          description: 'Contact IDIRAN TECH document office in Gangaikondan for document registration, EC, certificates. Phone, WhatsApp, address, and office hours.',
          canonical: `${baseUrl}/contact`
        };
      case 'appointment':
        return {
          title: 'Book Appointment | IDIRAN TECH Document Office',
          description: 'Schedule an appointment with IDIRAN TECH document office in Gangaikondan. Quick booking for document registration, EC, and other services.',
          canonical: `${baseUrl}/appointment`
        };
      case 'service': {
        const serviceNames: Record<ServiceType, string> = {
          document_registration: 'Document Registration',
          marriage_registration: 'Marriage Registration',
          ec_request: 'Encumbrance Certificate (EC)',
          document_copy: 'Document Copy',
          birth_death_certificate: 'Birth/Death Certificate',
          patta_chitta: 'Patta/Chitta'
        };
        const serviceName = activeService ? serviceNames[activeService] : 'Document Service';
        return {
          title: `${serviceName} in Gangaikondan | IDIRAN TECH`,
          description: `Professional ${serviceName} services in Gangaikondan, Tamil Nadu. IDIRAN TECH provides expert assistance with ${serviceName}.`,
          canonical: `${baseUrl}/services/${activeService}`
        };
      }
      default:
        return {
          title: 'Document Registration & EC Services in Gangaikondan | IDIRAN TECH',
          description: 'IDIRAN TECH பத்திரம் எழுதும் அலுவலகம் - Document Registration, Marriage Registration, Encumbrance Certificate (EC), Document Copy, Birth/Death Certificate, Patta/Chitta services in Gangaikondan, Tamil Nadu.',
          canonical: baseUrl
        };
    }
  };

  const seoData = getSEOData();

  return (
    <div className="min-h-screen flex flex-col">
      <SEO {...seoData} />
      <Navbar settings={settings} onNavigate={handleNavigate} currentPage={page} />

      <main className="flex-1">
        {page === 'home' && (
          <>
            <Hero settings={settings} onNavigate={handleNavigate} />
            <ServicesSection onNavigate={handleNavigate} />
            <AboutSection settings={settings} />
            <ContactSection settings={settings} />
          </>
        )}

        {page === 'services' && (
          <div className="pt-16">
            <ServicesSection onNavigate={handleNavigate} />
          </div>
        )}

        {page === 'about' && (
          <div className="pt-16">
            <AboutSection settings={settings} />
            <ContactSection settings={settings} />
          </div>
        )}

        {page === 'contact' && (
          <div className="pt-16">
            <ContactSection settings={settings} />
          </div>
        )}

        {page === 'service' && activeService && (
          <ServiceForm serviceKey={activeService} onBack={handleBack} onNavigate={handleNavigate} settings={settings} />
        )}

        {page === 'appointment' && (
          <AppointmentForm onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />
        )}
      </main>

      <Footer settings={settings} onNavigate={handleNavigate} />
      
      <MobileStickyBar 
        phone={settings?.phone}
        whatsapp={settings?.whatsapp}
        onBookAppointment={() => handleNavigate('appointment')}
      />
    </div>
  );
}
