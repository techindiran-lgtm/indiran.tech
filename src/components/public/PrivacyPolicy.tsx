import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { SEO } from '@/components/shared/SEO';
import { supabase } from '@/lib/supabase';
import type { Settings as SettingsType } from '@/lib/types';

export function PrivacyPolicy() {
  const lastUpdated = 'January 2026';
  const [settings, setSettings] = useState<SettingsType | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    supabase.from('settings').select('*').maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      window.location.href = '/';
    } else if (page === 'services') {
      window.location.href = '/services';
    } else if (page === 'about') {
      window.location.href = '/about';
    } else if (page === 'contact') {
      window.location.href = '/contact';
    } else if (page === 'appointment') {
      window.location.href = '/appointment';
    }
  };

  return (
    <>
      <SEO
        title="Privacy Policy | IDIRAN TECH"
        description="Privacy Policy for IDIRAN TECH document writer services in Tamil Nadu. Learn how we collect, use, and protect your personal information."
        canonical="https://indiran-tech.vercel.app/privacy-policy"
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar settings={settings} onNavigate={handleNavigate} currentPage="privacy-policy" />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="bg-white rounded-2xl shadow-soft p-8 lg:p-12">
            {/* Header */}
            <div className="mb-10 pb-8 border-b border-slate-200">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-slate-600">
                Last updated: {lastUpdated}
              </p>
            </div>

            {/* Table of Contents */}
            <nav className="mb-12 p-6 bg-slate-50 rounded-xl">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                {[
                  { id: 'introduction', label: 'Introduction' },
                  { id: 'information-we-collect', label: 'Information We Collect' },
                  { id: 'how-we-use-information', label: 'How We Use Your Information' },
                  { id: 'document-uploads', label: 'Document Uploads and File Storage' },
                  { id: 'supabase', label: 'Supabase and Third-Party Service Providers' },
                  { id: 'data-sharing', label: 'Data Sharing and Disclosure' },
                  { id: 'data-security', label: 'Data Security' },
                  { id: 'data-retention', label: 'Data Retention and Deletion' },
                  { id: 'cookies', label: 'Cookies and Authentication Sessions' },
                  { id: 'user-rights', label: 'User Rights and Requests' },
                  { id: 'childrens-privacy', label: 'Children\'s Privacy' },
                  { id: 'external-links', label: 'External Links' },
                  { id: 'changes', label: 'Changes to This Privacy Policy' },
                  { id: 'contact', label: 'Contact Information' },
                ].map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Content Sections */}
            <div className="prose prose-slate max-w-none space-y-8">
              <section id="introduction">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  IDIRAN TECH ("we," "our," or "us") is a document writer and registration assistance service operating in Gangaikondan, Tamil Nadu. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and services.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  By using our website and submitting service requests, you agree to the collection and use of your information as described in this policy. If you do not agree with this policy, please do not use our website or submit your information.
                </p>
              </section>

              <section id="information-we-collect">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Personal Information Provided by Users</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  When you submit service requests, appointments, or contact forms through our website, we may collect the following personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                  <li><strong>Full Name</strong> – Your name as provided in service request forms</li>
                  <li><strong>Phone Number</strong> – Used to contact you regarding your requests</li>
                  <li><strong>Email Address</strong> – Optional, used for communication if provided</li>
                  <li><strong>Address</strong> – Optional, may be required for certain services</li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-900 mb-3">Document and Certificate Information</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Depending on the service you request, we may collect additional information such as:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                  <li><strong>Property Details</strong> – For document registration, EC requests, and Patta/Chitta services (district, taluk, village, survey number, subdivision number)</li>
                  <li><strong>Document Type</strong> – The specific service or document you are requesting</li>
                  <li><strong>Party Information</strong> – Names of parties involved in transactions (e.g., first party, second party)</li>
                  <li><strong>Document Value</strong> – Property or document value as provided</li>
                  <li><strong>EC Period</strong> – For Encumbrance Certificate requests (start and end dates)</li>
                  <li><strong>Appointment Details</strong> – Preferred date and time for in-person visits</li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-900 mb-3">Uploaded Documents</h3>
                <p className="text-slate-600 leading-relaxed">
                  When you upload supporting documents (such as ID proof, property documents, or certificates), we store these files in our secure storage system along with file metadata (file name, file type, file size, upload date).
                </p>
              </section>

              <section id="how-we-use-information">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We use the information you provide for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                  <li><strong>Service Processing</strong> – To process your document registration, certificate requests, and other service requests</li>
                  <li><strong>Communication</strong> – To contact you via phone or email regarding your requests, appointments, and service updates</li>
                  <li><strong>Appointment Management</strong> – To schedule and manage your in-person appointments</li>
                  <li><strong>Document Preparation</strong> – To prepare and submit documents on your behalf to relevant government authorities</li>
                  <li><strong>Record Keeping</strong> – To maintain records of your requests and our interactions for service continuity</li>
                  <li><strong>Administrative Purposes</strong> – To improve our services, troubleshoot issues, and ensure website functionality</li>
                </ul>
                <p className="text-slate-600 leading-relaxed">
                  We do not use your information for marketing purposes without your explicit consent.
                </p>
              </section>

              <section id="document-uploads">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Document Uploads and File Storage</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  When you upload documents through our website:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                  <li>Files are stored in Supabase Storage, a cloud-based storage service</li>
                  <li>The storage bucket is configured with access policies to control who can upload, view, and delete files</li>
                  <li>Uploaded files are accessible to authorized administrators for processing your requests</li>
                  <li>File metadata (name, type, size) is recorded in our database</li>
                </ul>
                <p className="text-slate-600 leading-relaxed">
                  You should ensure that any documents you upload do not contain sensitive information that you are not comfortable sharing with our staff and the service providers we use.
                </p>
              </section>

              <section id="supabase">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Supabase and Third-Party Service Providers</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Our website uses the following third-party services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                  <li><strong>Supabase</strong> – Provides database services, authentication, and cloud storage for our website. Your data is stored in Supabase's PostgreSQL database and Storage service.</li>
                  <li><strong>Vercel</strong> – Provides website hosting and deployment services.</li>
                  <li><strong>Google Analytics</strong> – May be used to analyze website traffic and usage patterns (if configured). Google Analytics collects anonymous usage data such as page views, browser type, and geographic location.</li>
                </ul>
                <p className="text-slate-600 leading-relaxed">
                  These service providers have access to your information only as necessary to perform their functions and are bound by confidentiality obligations. We do not sell your personal information to third parties.
                </p>
              </section>

              <section id="data-sharing">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Sharing and Disclosure</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                  <li><strong>With Government Authorities</strong> – When necessary to process your document registration, certificate requests, or other services with relevant government departments (e.g., Sub-Registrar offices, Revenue Department)</li>
                  <li><strong>With Service Providers</strong> – With third-party service providers who assist us in delivering our services (e.g., Supabase, Vercel) as described above</li>
                  <li><strong>For Legal Compliance</strong> – When required by law, court order, or government regulation</li>
                  <li><strong>To Protect Our Rights</strong> – To protect our rights, property, or safety, or that of our users or the public</li>
                </ul>
                <p className="text-slate-600 leading-relaxed">
                  We do not sell, rent, or trade your personal information with third parties for their marketing purposes.
                </p>
              </section>

              <section id="data-security">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We implement reasonable security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                  <li><strong>Row Level Security (RLS)</strong> – Our database uses Row Level Security policies to restrict data access based on user roles</li>
                  <li><strong>Authentication</strong> – Admin access to our system requires authentication via Supabase Auth</li>
                  <li><strong>Access Controls</strong> – Only authorized administrators can access customer data and uploaded documents</li>
                  <li><strong>Secure Transmission</strong> – Data is transmitted over HTTPS (SSL/TLS) when you interact with our website</li>
                </ul>
                <p className="text-slate-600 leading-relaxed">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section id="data-retention">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Retention and Deletion</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We retain your information for the following periods:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                  <li><strong>Service Records</strong> – Service requests, appointments, and related data are retained as long as necessary for service delivery, business operations, and legal compliance</li>
                  <li><strong>Uploaded Documents</strong> – Uploaded files are retained in storage until deleted by administrators or when no longer needed for service purposes</li>
                  <li><strong>Customer Records</strong> – Customer information is retained to maintain service history and facilitate future requests</li>
                </ul>
                <p className="text-slate-600 leading-relaxed mb-4">
                  If you wish to request deletion of your personal information, please contact us using the contact information provided below. We will review your request and delete your information to the extent permitted by law and business requirements.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Note:</strong> Certain records may need to be retained for legal, regulatory, or business purposes even after a deletion request.
                </p>
              </section>

              <section id="cookies">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies and Authentication Sessions</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Our website uses the following:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                  <li><strong>Authentication Cookies</strong> – Supabase Auth uses cookies to maintain admin login sessions. These cookies are essential for accessing the admin panel.</li>
                  <li><strong>Analytics Cookies</strong> – If Google Analytics is enabled, cookies may be used to collect anonymous usage data for website analytics.</li>
                </ul>
                <p className="text-slate-600 leading-relaxed">
                  You can manage cookie preferences through your browser settings. However, disabling cookies may affect the functionality of our website.
                </p>
              </section>

              <section id="user-rights">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">User Rights and Requests</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Under applicable data protection laws, including the Digital Personal Data Protection Act, 2023, you may have the following rights:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                  <li><strong>Right to Access</strong> – Request a copy of the personal information we hold about you</li>
                  <li><strong>Right to Correction</strong> – Request correction of inaccurate or incomplete information</li>
                  <li><strong>Right to Erasure</strong> – Request deletion of your personal information (subject to legal and business retention requirements)</li>
                  <li><strong>Right to Withdraw Consent</strong> – Withdraw consent for data processing where consent is the legal basis</li>
                  <li><strong>Right to Grievance Redressal</strong> – File a complaint with us or the relevant data protection authority</li>
                </ul>
                <p className="text-slate-600 leading-relaxed">
                  To exercise these rights, please contact us using the information provided in the Contact Information section below.
                </p>
              </section>

              <section id="childrens-privacy">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
                <p className="text-slate-600 leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will take steps to delete such information.
                </p>
              </section>

              <section id="external-links">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">External Links</h2>
                <p className="text-slate-600 leading-relaxed">
                  Our website may contain links to external websites, including government portals and third-party services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any external websites you visit.
                </p>
              </section>

              <section id="changes">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Privacy Policy</h2>
                <p className="text-slate-600 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, applicable laws, or for other operational reasons. We will notify users of significant changes by updating the "Last Updated" date at the top of this policy. Your continued use of our website after such changes constitutes your acceptance of the updated policy.
                </p>
              </section>

              <section id="contact">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-slate-50 rounded-lg p-6 space-y-3">
                  <p className="text-slate-700">
                    <strong>Business Name:</strong> IDIRAN TECH
                  </p>
                  <p className="text-slate-700">
                    <strong>Location:</strong> கங்கைகொண்டான் (Gangaikondan), Tamil Nadu
                  </p>
                  <p className="text-slate-700">
                    <strong>Email:</strong> Please refer to our contact page for current email information
                  </p>
                  <p className="text-slate-700">
                    <strong>Phone:</strong> Please refer to our contact page for current phone information
                  </p>
                </div>
                <p className="text-slate-600 leading-relaxed mt-4">
                  We will respond to your privacy-related inquiries within a reasonable time frame.
                </p>
              </section>
            </div>

            {/* Back to Home */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                ← Back to Homepage
              </Link>
            </div>
          </div>
        </main>

        <Footer settings={settings} onNavigate={handleNavigate} />
      </div>
    </>
  );
}
