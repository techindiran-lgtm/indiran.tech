import { ShieldCheck, Award, Users, MapPin, Clock, Phone } from 'lucide-react';

interface TrustSectionProps {
  settings: any;
}

export function TrustSection({ settings }: TrustSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Why Trust IDIRAN TECH?</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary-700" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Professional Service</h3>
            <p className="text-slate-600 text-sm">Expert assistance with all document registration needs</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-accent-700" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Local Expertise</h3>
            <p className="text-slate-600 text-sm">Deep knowledge of Gangaikondan and Tirunelveli district procedures</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary-100 flex items-center justify-center">
              <Clock className="w-8 h-8 text-secondary-700" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Efficient Processing</h3>
            <p className="text-slate-600 text-sm">Quick turnaround with proper documentation</p>
          </div>
        </div>

        {/* Office Info */}
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
          <h3 className="font-bold text-slate-900 mb-6 text-center">Visit Our Office</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900">Address</p>
                <p className="text-slate-600 text-sm">{settings?.address || 'Contact us for address'}</p>
                <p className="text-slate-600 text-sm">{settings?.location || 'Gangaikondan, Tamil Nadu'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900">Office Hours</p>
                <p className="text-slate-600 text-sm">{settings?.office_hours || 'Contact us for office hours'}</p>
              </div>
            </div>
            
            {settings?.phone && (
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">Phone</p>
                  <a href={`tel:${settings.phone}`} className="text-slate-600 text-sm hover:text-primary-700">
                    {settings.phone}
                  </a>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-4">
              <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900">Years of Service</p>
                <p className="text-slate-600 text-sm">Serving the local community with dedication</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
