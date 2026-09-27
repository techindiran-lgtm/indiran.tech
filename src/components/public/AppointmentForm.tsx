import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import { SERVICES, SERVICE_MAP } from '@/lib/constants';
import { ServiceIcon } from '@/components/shared/ServiceIcon';
import { useToast } from '@/components/shared/Toast';
import { supabase } from '@/lib/supabase';
import type { ServiceType } from '@/lib/types';

interface AppointmentFormProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

export function AppointmentForm({ onBack, onNavigate }: AppointmentFormProps) {
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '' });
  const [serviceType, setServiceType] = useState<ServiceType>('document_registration');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { show } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name.trim() || !customer.phone.trim()) {
      show('Please enter your name and phone number', 'error');
      return;
    }
    if (!date || !time) {
      show('Please select a date and time', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { data: customerId, error: custError } = await supabase.rpc('find_or_create_customer', {
        p_name: customer.name.trim(),
        p_phone: customer.phone.trim(),
        p_email: customer.email.trim() || null,
        p_address: customer.address.trim() || null,
      });

      if (custError || !customerId) throw new Error('Failed to create customer record');

      const { error } = await supabase.from('appointments').insert({
        customer_id: customerId,
        service_type: serviceType,
        preferred_date: date,
        preferred_time: time,
        status: 'pending',
        notes: notes.trim(),
      });

      if (error) throw error;

      setSubmitted(true);
      show('Appointment booked successfully!');
    } catch {
      show('Failed to book appointment. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 lg:p-12 text-center animate-scale-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 to-accent-600" />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center mx-auto mb-6 shadow-glow-accent">
              <CheckCircle className="w-10 h-10 text-accent-700" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Appointment Booked!</h2>
            <p className="text-slate-600 mb-4">
              Your appointment for {SERVICE_MAP[serviceType].name} has been scheduled.
            </p>
            <div className="inline-flex flex-col gap-2 bg-slate-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Calendar className="w-4 h-4 text-primary-600" />
                <span className="font-medium">{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Clock className="w-4 h-4 text-primary-600" />
                <span className="font-medium">{time}</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              We will confirm your appointment via phone. Please keep your phone available.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => onNavigate('home')} className="btn-primary">Go Home</button>
              <button onClick={() => onNavigate('services')} className="btn-secondary">View Services</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="btn-ghost mb-6 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="card overflow-hidden animate-fade-in-up">
          <div className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 p-6 lg:p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-extrabold">Book an Appointment</h1>
                <p className="text-sm text-primary-200 font-tamil">சந்திப்பு பதிவு</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            {/* Customer info */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Your Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name <span className="text-error-600">*</span></label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Phone Number <span className="text-error-600">*</span></label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="Your phone number"
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Email (optional)</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="Your email"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Address (optional)</label>
                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="Your address"
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Service selection */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Select Service
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SERVICES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setServiceType(s.key)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      serviceType === s.key
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200 shadow-soft'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-soft'
                    }`}
                  >
                    <ServiceIcon name={s.icon} className={`w-5 h-5 mb-2 ${serviceType === s.key ? 'text-primary-700' : 'text-slate-500'}`} />
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{s.name}</p>
                    <p className="text-xs text-slate-400 font-tamil leading-tight">{s.tamilName}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and time */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Preferred Date & Time
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Date <span className="text-error-600">*</span></label>
                  <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={(e) => setDate(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Time <span className="text-error-600">*</span></label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Select time slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="label">Additional Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requirements or questions?"
                rows={3}
                className="input resize-none"
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Booking...' : 'Book Appointment'}
              {!submitting && <Calendar className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <a href="tel:+91" className="btn-secondary">
            <Phone className="w-4 h-4" /> Call Office
          </a>
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="btn-success">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
