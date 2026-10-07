import { Phone, MessageCircle, MapPin, Clock, Mail, Send } from 'lucide-react';
import { useState } from 'react';
import type { Settings as SettingsType } from '@/lib/types';
import { useToast } from '@/components/shared/Toast';
import { supabase } from '@/lib/supabase';

interface ContactSectionProps {
  settings: SettingsType | null;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { show } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      show('Please fill in all fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const { data: customerId } = await supabase.rpc('find_or_create_customer', {
        p_name: name.trim(),
        p_phone: phone.trim(),
      });

      if (!customerId) throw new Error('Failed to create customer');

      const { error } = await supabase.from('service_requests').insert({
        customer_id: customerId,
        service_type: 'document_registration',
        status: 'pending',
        form_data: { type: 'contact_message', name, phone, message },
      });

      if (error) throw error;

      show('Your message has been sent. We will contact you soon!');
      setName('');
      setPhone('');
      setMessage('');
    } catch {
      show('Failed to send message. Please call us directly.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-accent-50/40 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Get In Touch</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mt-4 mb-3 text-balance">Contact Us</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Have a question? Reach out to us by phone, WhatsApp, or send us a message
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="card p-6 group hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7 text-primary-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Our Address</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{settings?.address}</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-3 group-hover:bg-primary-100 group-hover:scale-110 transition-all">
                    <Phone className="w-5 h-5 text-primary-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Call Us</h3>
                  <p className="text-sm text-slate-600">{settings.phone}</p>
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center mb-3 group-hover:bg-accent-100 group-hover:scale-110 transition-all">
                    <MessageCircle className="w-5 h-5 text-accent-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">WhatsApp</h3>
                  <p className="text-sm text-slate-600">Chat with us</p>
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center mb-3 group-hover:bg-secondary-100 group-hover:scale-110 transition-all">
                    <Mail className="w-5 h-5 text-secondary-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Email</h3>
                  <p className="text-sm text-slate-600 truncate">{settings.email}</p>
                </a>
              )}
              <div className="card p-5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-slate-700" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Office Hours</h3>
                <p className="text-sm text-slate-600">{settings?.office_hours}</p>
              </div>
            </div>

            {/* Map */}
            <div className="card overflow-hidden h-52 relative group">
              <iframe
                title="Office Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.6%2C8.25%2C77.75%2C8.35&layer=mapnik&marker=8.3%2C77.65"
                className="w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-soft text-xs font-medium text-slate-700 flex items-center gap-1.5 pointer-events-none">
                <MapPin className="w-3.5 h-3.5 text-primary-600" /> கங்கைகொண்டான் (Gangaikondan)
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="card p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-700" />
            <h3 className="text-xl font-bold text-slate-900 mb-1">Send Us a Message</h3>
            <p className="text-sm text-slate-500 mb-6">We'll get back to you as soon as possible</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={5}
                  className="input resize-none"
                  required
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full text-base !py-3">
                {submitting ? 'Sending...' : 'Send Message'}
                {!submitting && <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
