import { MapPin, Phone, Clock, ShieldCheck, Users, Award, FileCheck, HeartHandshake } from 'lucide-react';
import type { Settings as SettingsType } from '@/lib/types';

interface AboutSectionProps {
  settings: SettingsType | null;
}

export function AboutSection({ settings }: AboutSectionProps) {
  const features = [
    { icon: ShieldCheck, title: 'Trusted Service', desc: 'Reliable and secure document handling', color: 'primary' },
    { icon: Users, title: 'Customer First', desc: 'Dedicated to your needs', color: 'accent' },
    { icon: Award, title: 'Professional', desc: 'Experienced and knowledgeable', color: 'secondary' },
    { icon: Clock, title: 'Efficient', desc: 'Quick and timely service', color: 'slate' },
  ];

  const colorMap: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700',
    accent: 'bg-accent-50 text-accent-700',
    secondary: 'bg-secondary-50 text-secondary-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <section id="about" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary-50/50 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="section-eyebrow">About Us</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mt-4 mb-5 text-balance">
              Your Trusted Document Office in {settings?.location ?? 'Panagudi'}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-5 text-lg">
              {settings?.about ?? 'AAR பத்திரம் எழுதும் அலுவலகம் is a trusted document registration office providing comprehensive services to the community. We handle document registration, marriage registration, encumbrance certificates, document copies, birth/death certificates, and patta/chitta services with professionalism and care.'}
            </p>
            <p className="text-slate-600 leading-relaxed mb-8 font-tamil text-base">
              பனகுடி சார்பதிவாளர் அலுவலகத்தில் உங்கள் அனைத்து ஆவணப் பணிகளும் நம்பகமான முறையில் செய்யப்படுகின்றன.
            </p>

            {/* Contact info cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-700" />
                </div>
                <span className="text-sm text-slate-700">{settings?.address}</span>
              </div>
              {settings?.phone && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary-700" />
                  </div>
                  <span className="text-sm text-slate-700">{settings.phone}</span>
                </div>
              )}
              {settings?.office_hours && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary-700" />
                  </div>
                  <span className="text-sm text-slate-700">{settings.office_hours}</span>
                </div>
              )}
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className={`group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 ${i % 2 === 1 ? 'mt-6' : ''}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${colorMap[f.color]} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 lg:mt-20 p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: FileCheck, value: '6', label: 'Services Offered' },
              { icon: HeartHandshake, value: '100%', label: 'Customer Focus' },
              { icon: ShieldCheck, value: 'Trusted', label: 'Document Handling' },
              { icon: Clock, value: 'Quick', label: 'Turnaround Time' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Icon className="w-6 h-6 text-primary-300 mb-1" />
                  <p className="text-2xl lg:text-3xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-sm text-primary-200">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
