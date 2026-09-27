import { useState, useEffect } from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Hero } from '@/components/public/Hero';
import { ServicesSection } from '@/components/public/ServicesSection';
import { AboutSection } from '@/components/public/AboutSection';
import { ContactSection } from '@/components/public/ContactSection';
import { ServiceForm } from '@/components/public/ServiceForm';
import { AppointmentForm } from '@/components/public/AppointmentForm';
import { supabase } from '@/lib/supabase';
import type { Settings as SettingsType, ServiceType } from '@/lib/types';

interface PublicSiteProps {
  onNavigate: (page: string) => void;
}

export function PublicSite({ onNavigate }: PublicSiteProps) {
  const [page, setPage] = useState('home');
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [settings, setSettings] = useState<SettingsType | null>(null);

  useEffect(() => {
    supabase.from('settings').select('*').maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  const handleNavigate = (target: string, serviceKey?: string) => {
    if (target === 'admin') {
      onNavigate('admin');
      return;
    }
    if (target === 'service' && serviceKey) {
      setActiveService(serviceKey as ServiceType);
      setPage('service');
      window.scrollTo(0, 0);
      return;
    }
    setPage(target);
    setActiveService(null);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setPage('services');
    setActiveService(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
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
          <ServiceForm serviceKey={activeService} onBack={handleBack} onNavigate={handleNavigate} />
        )}

        {page === 'appointment' && (
          <AppointmentForm onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />
        )}
      </main>

      <Footer settings={settings} onNavigate={handleNavigate} />
    </div>
  );
}
