import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Send, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { SERVICE_MAP } from '@/lib/constants';
import { ServiceIcon } from '@/components/shared/ServiceIcon';
import { useToast } from '@/components/shared/Toast';
import { LocalBusinessJsonLd } from '@/components/shared/JsonLd';
import { trackFormStart, trackFormSubmit } from '@/components/shared/SEO';
import { ServiceContent } from '@/components/public/ServiceContent';
import { FAQSection } from '@/components/public/FAQSection';
import { TrustSection } from '@/components/public/TrustSection';
import { supabase } from '@/lib/supabase';
import type { ServiceType, Settings } from '@/lib/types';

interface ServiceFormProps {
  serviceKey: ServiceType;
  onBack: () => void;
  onNavigate: (page: string, serviceKey?: string) => void;
  settings?: Settings | null;
}

export function ServiceForm({ serviceKey, onBack, onNavigate, settings }: ServiceFormProps) {
  const service = SERVICE_MAP[serviceKey];
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { show } = useToast();

  // Track form start when component mounts
  useEffect(() => {
    trackFormStart(serviceKey);
  }, [serviceKey]);

  if (!service) return null;

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (customerId: string, requestId: string) => {
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const fileName = `${customerId}/${requestId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from('documents').upload(fileName, file);
      if (error) {
        show(`Failed to upload ${file.name}`, 'error');
        continue;
      }
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName);
      await supabase.from('documents').insert({
        customer_id: customerId,
        service_request_id: requestId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: file.type,
        document_type: service.name,
        file_size: file.size,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name.trim() || !customer.phone.trim()) {
      show('Please enter your name and phone number', 'error');
      return;
    }

    // Validate required fields
    for (const field of service.fields) {
      if (field.required && !formData[field.name]?.trim()) {
        show(`Please fill in: ${field.label}`, 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      // Find or create customer
      const { data: customerId, error: custError } = await supabase.rpc('find_or_create_customer', {
        p_name: customer.name.trim(),
        p_phone: customer.phone.trim(),
        p_email: customer.email.trim() || null,
        p_address: customer.address.trim() || null,
      });

      if (custError || !customerId) throw new Error('Failed to create customer record');

      // Create service request
      const { data: request, error: reqError } = await supabase
        .from('service_requests')
        .insert({
          customer_id: customerId,
          service_type: serviceKey,
          status: 'pending',
          form_data: { ...formData },
        })
        .select()
        .single();

      if (reqError || !request) throw new Error('Failed to submit service request');

      // If EC request, create ec_requests record
      if (serviceKey === 'ec_request') {
        const { error: ecError } = await supabase.from('ec_requests').insert({
          service_request_id: request.id,
          district: formData.district || '',
          taluk: formData.taluk || '',
          village: formData.village || '',
          survey_number: formData.survey_number || '',
          subdivision_number: formData.subdivision_number || '',
          ec_period_from: formData.ec_period_from || '',
          ec_period_to: formData.ec_period_to || '',
          status: 'pending',
        });
        if (ecError) show('EC request created, but EC tracking record failed', 'error');
      }

      // Upload files if any
      if (files.length > 0) {
        await uploadFiles(customerId, request.id);
      }

      setSubmitted(true);
      trackFormSubmit(serviceKey);
      show('Your service request has been submitted successfully!');
    } catch {
      show('Failed to submit request. Please try again or call us.', 'error');
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
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Request Submitted!</h2>
            <p className="text-slate-600 mb-1">
              Your {service.name} request has been received.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Our team will contact you at {customer.phone} shortly. Please keep your phone available.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => onNavigate('services')} className="btn-primary">
                Browse More Services
              </button>
              <button onClick={() => onNavigate('appointment')} className="btn-secondary">
                Book an Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <LocalBusinessJsonLd settings={settings} />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="btn-ghost mb-6 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="card overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 p-6 lg:p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <ServiceIcon name={service.icon} className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-extrabold">{service.name}</h1>
                <p className="text-sm text-primary-200 font-tamil">{service.tamilName}</p>
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
                    placeholder="Your email address"
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

            {/* Service-specific fields */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Service Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.fields.map((field) => (
                  <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="label">
                      {field.label} {field.required && <span className="text-error-600">*</span>}
                    </label>
                    <p className="text-xs text-slate-400 mb-1 font-tamil">{field.tamilLabel}</p>
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className="input"
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        rows={3}
                        className="input resize-none"
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        className="input"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* File upload */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Upload Documents (optional)
              </h3>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">Click to upload supporting documents</p>
                <p className="text-xs text-slate-400 mb-3">PDF, JPG, PNG up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className="btn-secondary cursor-pointer">
                  Choose Files
                </label>
                {files.length > 0 && (
                  <div className="mt-4 space-y-2 text-left">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-accent-600" />
                        {file.name}
                        <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Submitting...' : 'Submit Request'}
                {!submitting && <Send className="w-4 h-4" />}
              </button>
              <p className="text-xs text-center text-slate-400 mt-3">
                By submitting, you agree to be contacted by our office regarding your request.
              </p>
            </div>
          </form>
        </div>

        {/* Service Content */}
        <ServiceContent serviceKey={serviceKey} />

        {/* FAQ Section */}
        <FAQSection />

        {/* Trust Section */}
        <TrustSection settings={settings} />

        {/* Quick contact */}
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
    </>
  );
}
