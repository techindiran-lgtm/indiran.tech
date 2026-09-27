import { Phone, MessageCircle, MapPin, Clock, Mail } from 'lucide-react';
import type { Settings as SettingsType } from '@/lib/types';
import { SERVICES } from '@/lib/constants';
import { ServiceIcon } from '@/components/shared/ServiceIcon';

interface FooterProps {
  settings: SettingsType | null;
  onNavigate: (page: string, serviceKey?: string) => void;
}

export function Footer({ settings, onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-900/20 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-primary">
                  <span className="text-white font-extrabold text-xl">A</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent-500 border-2 border-slate-950" />
              </div>
              <div>
                <p className="font-extrabold text-white text-base">{settings?.business_name ?? 'AAR'}</p>
                <p className="text-xs text-slate-400 font-tamil">
                  {settings?.tamil_name ?? 'AAR பத்திரம் எழுதும் அலுவலகம்'}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              {settings?.about ?? 'Trusted document registration office in Panagudi offering comprehensive document and certificate services.'}
            </p>
            {/* Social/contact pills */}
            <div className="flex gap-2">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-accent-400 hover:border-accent-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Our Services</h3>
            <ul className="space-y-2.5">
              {SERVICES.map((service) => (
                <li key={service.key}>
                  <button
                    onClick={() => onNavigate('service', service.key)}
                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <ServiceIcon name={service.icon} className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', page: 'home' },
                { label: 'All Services', page: 'services' },
                { label: 'Book Appointment', page: 'appointment' },
                { label: 'About Us', page: 'about' },
                { label: 'Contact', page: 'contact' },
              ].map((link) => (
                <li key={link.page}>
                  <button onClick={() => onNavigate(link.page)} className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-400" />
                <span>{settings?.address ?? 'பனகுடி - 627109'}</span>
              </li>
              {settings?.phone && (
                <li>
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-primary-400 transition-colors">
                    <Phone className="w-4 h-4 flex-shrink-0 text-primary-400" />
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.whatsapp && (
                <li>
                  <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-accent-400 transition-colors">
                    <MessageCircle className="w-4 h-4 flex-shrink-0 text-accent-400" />
                    WhatsApp
                  </a>
                </li>
              )}
              {settings?.office_hours && (
                <li className="flex items-start gap-2.5 text-sm text-slate-400">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-400" />
                  <span>{settings.office_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {settings?.business_name ?? 'AAR'} — {settings?.tamil_name ?? 'AAR பத்திரம் எழுதும் அலுவலகம்'}. All rights reserved.
          </p>
          <button
            onClick={() => onNavigate('admin')}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Admin Panel
          </button>
        </div>
      </div>
    </footer>
  );
}
