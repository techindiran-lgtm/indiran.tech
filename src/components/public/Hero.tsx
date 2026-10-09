import { Phone, MessageCircle, MapPin, ChevronRight, ShieldCheck, Clock, Users, Sparkles, Instagram } from 'lucide-react';
import type { Settings as SettingsType } from '@/lib/types';
import { SERVICES } from '@/lib/constants';
import { ServiceIcon } from '@/components/shared/ServiceIcon';
import { LocalBusinessJsonLd } from '@/components/shared/JsonLd';

interface HeroProps {
  settings: SettingsType | null;
  onNavigate: (page: string, serviceKey?: string) => void;
}

export function Hero({ settings, onNavigate }: HeroProps) {
  return (
    <>
      <LocalBusinessJsonLd settings={settings} />
      <section className="relative pt-20 lg:pt-24 overflow-hidden">
        {/* Background Image - positioned on right side */}
        <div className="absolute inset-0 lg:bg-right bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/background.png)' }} />
        {/* Gradient overlay - lighter on left, darker on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/40 lg:bg-gradient-to-r lg:from-white/80 lg:via-white/50 lg:to-white/20" />
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/20 via-white/10 to-slate-50/30" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-200/40 to-primary-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 animate-float" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-accent-200/30 to-accent-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-secondary-200/20 to-secondary-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left content */}
          <div className="animate-fade-in-up">
            {/* Logo */}
            <div className="mb-6">
              <img src="/icon.png" alt="IDIRAN TECH Logo" className="w-20 h-20 rounded-2xl shadow-lg object-cover" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary-100 text-primary-700 text-xs font-semibold mb-6 shadow-soft">
              <MapPin className="w-3.5 h-3.5" />
              {settings?.location ?? 'கங்கைகொண்டான்'}
              <span className="w-1 h-1 rounded-full bg-primary-300 mx-1" />
              <span className="text-slate-500">Document Registration Office</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-3 text-balance">
              {settings?.business_name ?? 'IDIRAN TECH'}
            </h1>
            <p className="text-2xl lg:text-3xl font-bold gradient-text font-tamil mb-5">
              {settings?.tamil_name ?? 'IDIRAN TECH பத்திரம் எழுதும் அலுவலகம்'}
            </p>
            <p className="text-base lg:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Your trusted document registration office in {settings?.location ?? 'Panagudi'}. We provide
              professional services for all your document, certificate, and land record needs with
              efficiency and care.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <button onClick={() => onNavigate('services')} className="btn-primary text-base !px-6 !py-3">
                View Services <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => onNavigate('appointment')} className="btn-secondary text-base !px-6 !py-3">
                Book Appointment
              </button>
            </div>

            {/* Quick contact */}
            <div className="flex flex-wrap gap-4">
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2.5 text-sm font-medium text-slate-700 hover:text-primary-700 transition-colors group"
                >
                  <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-soft group-hover:shadow-card-hover group-hover:border-primary-300 transition-all">
                    <Phone className="w-4 h-4 text-primary-700" />
                  </span>
                  {settings.phone}
                </a>
              )}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm font-medium text-slate-700 hover:text-accent-700 transition-colors group"
                >
                  <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-soft group-hover:shadow-glow-accent group-hover:border-accent-300 transition-all">
                    <MessageCircle className="w-4 h-4 text-accent-600" />
                  </span>
                  WhatsApp
                </a>
              )}
              <a
                href="https://www.instagram.com/indiran707"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm font-medium text-slate-700 hover:text-pink-600 transition-colors group"
              >
                <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-soft group-hover:shadow-card-hover group-hover:border-pink-300 transition-all">
                  <Instagram className="w-4 h-4 text-pink-600" />
                </span>
                Instagram
              </a>
            </div>
          </div>

          {/* Right - service cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            {SERVICES.map((service, idx) => (
              <button
                key={service.key}
                onClick={() => onNavigate('service', service.key)}
                className="group relative p-4 lg:p-5 text-left rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/60 hover:border-primary-300 hover:bg-white hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 group-hover:from-primary-50/50 group-hover:to-primary-100/30 transition-all duration-300" />

                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-3 group-hover:from-primary-100 group-hover:to-primary-200 group-hover:scale-110 transition-all duration-300">
                    <ServiceIcon name={service.icon} className="w-5 h-5 text-primary-700" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-tight mb-1">{service.name}</p>
                  <p className="text-xs text-slate-500 font-tamil leading-tight">{service.tamilName}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, title: 'Trusted & Reliable', desc: 'Professional document services', color: 'accent' },
            { icon: Clock, title: 'Quick Turnaround', desc: 'Efficient processing', color: 'primary' },
            { icon: Users, title: 'Customer Focused', desc: 'Personalized service', color: 'secondary' },
          ].map((item, i) => {
            const Icon = item.icon;
            const colorClass = item.color === 'accent' ? 'bg-accent-50 text-accent-700' : item.color === 'primary' ? 'bg-primary-50 text-primary-700' : 'bg-secondary-50 text-secondary-700';
            return (
              <div key={i} className="group relative p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/60 hover:bg-white hover:shadow-card transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    </>
  );
}
