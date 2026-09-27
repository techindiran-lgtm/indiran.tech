import { ChevronRight, Check, ArrowUpRight } from 'lucide-react';
import { SERVICES } from '@/lib/constants';
import { ServiceIcon } from '@/components/shared/ServiceIcon';

interface ServicesSectionProps {
  onNavigate: (page: string, serviceKey?: string) => void;
}

export function ServicesSection({ onNavigate }: ServicesSectionProps) {
  return (
    <section id="services" className="py-20 lg:py-28 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-primary-50/40 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-eyebrow">
            Our Services
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mt-4 mb-3 text-balance">
            What We Offer
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Comprehensive document registration and certificate services to meet all your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => (
            <div
              key={service.key}
              className="group relative p-6 lg:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-primary-200 transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center group-hover:from-primary-100 group-hover:to-primary-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <ServiceIcon name={service.icon} className="w-8 h-8 text-primary-700" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-100 border-2 border-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-3 h-3 text-accent-700" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">{service.name}</h3>
              <p className="text-sm text-slate-500 font-tamil mb-3">{service.tamilName}</p>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">{service.description}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {service.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-4 h-4 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-accent-600" />
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigate('service', service.key)}
                className="group/btn inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
              >
                <span className="border-b border-primary-200 group-hover/btn:border-primary-700 transition-colors pb-0.5">
                  Request Service
                </span>
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
